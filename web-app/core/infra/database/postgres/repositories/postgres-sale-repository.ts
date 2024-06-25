import { Sale } from "@/core/application/entities/Sale/Sale"
import { SaleErrors } from "@/core/application/errors/sale"
import { SaleRepository } from "@/core/application/repositories/sale-repository"
import { PostgresService } from "@/core/infra/services/postgres"
import { ArrayCountAll } from "@/core/shared/entities/ArrayCountAll"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import f from "pg-format"
import { SaleMapper } from "../mappers/sale-mapper"

@injectable("Postgres")
export class PostgresSaleRepository implements SaleRepository {
  public async add({
    paymentPayloads,
    products,
    total,
    note,
    authorId,
    ownerCompanyId,
  }: SaleRepository.AddPayload): Promise<Sale> {
    using client = await PostgresService.connect()
    try {
      client.query("BEGIN")

      // --------------------------------
      // 1. create sale
      const { rows: rowsSale } = await client.query<{
        id: number
        total: number
        note?: string
        author_id: string
        owner_company_id: number
        created_at: Date
      }>(
        `--sql
        INSERT INTO public.sales(total, note, author_id, owner_company_id)  
        VALUES ($1, $2, $3, $4)
        RETURNING 
        id, 
        total, 
        note, 
        author_id, 
        owner_company_id, 
        created_at
        `,
        [total.int, note, authorId.toString(), ownerCompanyId],
      )

      if (rowsSale.length === 0) {
        throw new SaleErrors.SaleNotCreatedError()
      }

      const saleId = Number(rowsSale[0].id)

      // --------------------------------
      // 2. add payments
      const queryInsertPayments = f(
        `--sql
        INSERT INTO public.sale_payments(sale_id, company_client_id)
        VALUES %L
        RETURNING id
      `,
        paymentPayloads.map((p) => [saleId, "companyClientId" in p ? p.companyClientId : null]),
      )

      const { rows: salePayments } = await client.query<{ id: number }>(queryInsertPayments)

      const paymentPayloadsWithPaymentIds = paymentPayloads.map((p, index) => ({
        ...p,
        paymentId: salePayments[index].id,
      }))

      // --------------------------------
      // 3. add payment methods
      const paymentPaymentMethods = paymentPayloadsWithPaymentIds.filter(
        (p) => "paymentMethodId" in p,
      )
      const queryInsertPaymentMethods = f(
        `--sql
        INSERT INTO public.sale_payment_payment_methods(value, payment_method_id, payment_method_fee_id, sale_payment_id)
        VALUES %L
      `,
        paymentPaymentMethods.map((p) => [
          p.paymentMethodValue.int,
          p.paymentMethodId,
          p.paymentMethodFeeId,
          p.paymentId,
        ]),
      )

      if (paymentPaymentMethods.length) {
        await client.query(queryInsertPaymentMethods)
      }

      // --------------------------------
      // 4. add payment credits
      for (const {
        companyClientId,
        paymentCreditValue: disccountValue,
        paymentId,
      } of paymentPayloadsWithPaymentIds.filter((p) => "paymentCreditValue" in p)) {
        const { rows: newCredits } = await client.query<{
          id: number
          credit: number
          company_client_id: number
        }>(
          `--sql
          INSERT INTO public.company_client_credits(credit, company_client_id)
          (
            SELECT 
              company_client_credits.credit - $2 as credit,
              $1 as company_client_id
            FROM public.company_client_credits company_client_credits
            WHERE company_client_id = $1
            ORDER BY company_client_credits.id DESC
            LIMIT 1
          )
          RETURNING 
            id,
            credit,
            company_client_id
        `,
          [companyClientId, disccountValue.int],
        )

        if (newCredits.length === 0) {
          throw new SaleErrors.BalanceDatabaseError()
        }

        const queryInsertPaymentCredit = f(
          `--sql
          INSERT INTO public.sale_payment_company_client_credits(company_client_credit_id, value, sale_payment_id)
          VALUES %L
        `,
          newCredits.map((c) => [c.id, disccountValue.int, paymentId]),
        )

        await client.query(queryInsertPaymentCredit)
      }

      // --------------------------------
      // 5. add products
      await client.query(
        f(
          `--sql
          WITH inserted_sale_products AS (
            INSERT INTO public.sale_products(sale_id, product_id, amount, total, product_price_id)
            VALUES %L  
            RETURNING id, product_id, amount, total
          )

          SELECT 
            isp.id,
            isp.product_id,
            isp.amount,
            isp.total,
            p.name as product_name
          FROM inserted_sale_products isp
            INNER JOIN public.products p ON p.id = isp.product_id
      `,
          products.map(({ productId, amount, productPriceId }) => [
            saleId,
            productId,
            amount.int,
            total.int,
            productPriceId,
          ]),
        ),
      )

      const out = await this.get(saleId, client.query.bind(client))
      await client.query("COMMIT")

      return out
    } catch (error) {
      client.query("ROLLBACK")
      throw error
    }
  }

  public async get(id: number, query = PostgresService.query): Promise<Sale> {
    const { rows: sales } = await query<{
      id: number
      note?: string
      payments: {
        id: number
        client_id: number
        client_name: string
        client_credit_id: number
        credit_payment_value: number
        new_client_credit_value: number
        payment_method_id: number
        payment_method_name: number
        payment_method_value: number
        payment_method_fee_id: number
      }[]
      products: {
        product_id: number
        name: string
        amount: number
        product_price_id: number
        total: number
      }[]
      created_at: Date
      total: number
      author_id: string
      owner_company_id: number
      cancelled_at?: Date
    }>(
      `--sql
      SELECT
        sale.id,
        sale.note,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', payment.id,
            'client_id', payment.company_client_id,
            'client_name', user_client.raw_user_meta_data->>'name',
            'client_credit_id', sale_payment_credit.company_client_credit_id,
            'credit_payment_value', sale_payment_credit.value,
            'new_client_credit_value', client_credit.credit,
            'payment_method_id', sale_payment_method.payment_method_id,
            'payment_method_fee_id', sale_payment_method.payment_method_fee_id,
            'payment_method_name', payment_method.name,
            'payment_method_value', sale_payment_method.value
          )
        ) as payments,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', payment.id,
            'name', product.name,
            'amount', sale_product.amount,
            'product_price_id', sale_product.product_price_id,
            'total', sale_product.total
          )
        ) as products,
        sale.created_at,
        sale.total,
        sale.author_id,
        sale.owner_company_id,
        sale.cancelled_at
      FROM public.sales sale
        INNER JOIN public.sale_payments payment
          ON payment.sale_id = sale.id
        LEFT  JOIN public.sale_payment_payment_methods sale_payment_method
          ON sale_payment_method.sale_payment_id = payment.id
        LEFT  JOIN public.sale_payment_company_client_credits sale_payment_credit
          ON sale_payment_credit.sale_payment_id = payment.id
        LEFT  JOIN public.company_client_credits client_credit
          ON client_credit.id = sale_payment_credit.company_client_credit_id
        LEFT  JOIN public.payment_methods payment_method
          ON payment_method.id = sale_payment_method.payment_method_id
        INNER JOIN public.sale_products sale_product
          ON sale_product.sale_id = sale.id
        INNER JOIN public.products product
          ON product.id = sale_product.product_id
        LEFT  JOIN public.company_clients company_client
          ON company_client.id = payment.company_client_id
        LEFT  JOIN auth.users user_client ON user_client.id = company_client.user_id
      WHERE sale.id = $1
      GROUP BY sale.id, sale.note, sale.created_at, sale.total, sale.author_id, sale.owner_company_id, sale.cancelled_at
      `,
      [id],
    )

    return SaleMapper.toDomain(sales[0])
  }

  public async listByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCountAll<Sale>> {
    const { rows: sales } = await PostgresService.query<{
      id: number
      note?: string
      payments: {
        id: number
        client_id: number
        client_name: string
        client_credit_id: number
        credit_payment_value: number
        new_client_credit_value: number
        payment_method_id: number
        payment_method_name: number
        payment_method_value: number
        payment_method_fee_id: number
      }[]
      products: {
        product_id: number
        name: string
        amount: number
        product_price_id: number
        total: number
      }[]
      created_at: Date
      total: number
      author_id: string
      owner_company_id: number
      cancelled_at?: Date
      full_count: number
    }>(
      `--sql
      SELECT
        sale.id,
        sale.note,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', payment.id,
            'client_id', payment.company_client_id,
            'client_name', user_client.raw_user_meta_data->>'name',
            'client_credit_id', sale_payment_credit.company_client_credit_id,
            'credit_payment_value', sale_payment_credit.value,
            'new_client_credit_value', client_credit.credit,
            'payment_method_id', sale_payment_method.payment_method_id,
            'payment_method_fee_id', sale_payment_method.payment_method_fee_id,
            'payment_method_name', payment_method.name,
            'payment_method_value', sale_payment_method.value
          )
        ) as payments,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', payment.id,
            'name', product.name,
            'amount', sale_product.amount,
            'product_price_id', sale_product.product_price_id,
            'total', sale_product.total
          )
        ) as products,
        sale.created_at,
        sale.total,
        sale.author_id,
        sale.owner_company_id,
        sale.cancelled_at,
        count(*) OVER() AS full_count
      FROM public.sales sale
        INNER JOIN public.sale_payments payment
          ON payment.sale_id = sale.id
        LEFT  JOIN public.sale_payment_payment_methods sale_payment_method
          ON sale_payment_method.sale_payment_id = payment.id
        LEFT  JOIN public.sale_payment_company_client_credits sale_payment_credit
          ON sale_payment_credit.sale_payment_id = payment.id
        LEFT  JOIN public.company_client_credits client_credit
          ON client_credit.id = sale_payment_credit.company_client_credit_id
        LEFT  JOIN public.payment_methods payment_method
          ON payment_method.id = sale_payment_method.payment_method_id
        INNER JOIN public.sale_products sale_product
          ON sale_product.sale_id = sale.id
        INNER JOIN public.products product
          ON product.id = sale_product.product_id
        LEFT  JOIN public.company_clients company_client
          ON company_client.id = payment.company_client_id
        LEFT  JOIN auth.users user_client ON user_client.id = company_client.user_id
      WHERE sale.owner_company_id = $1 AND sale.cancelled_at IS NULL
      GROUP BY sale.id, sale.note, sale.created_at, sale.total, sale.author_id, sale.owner_company_id, sale.cancelled_at
      OFFSET $2
      LIMIT $3  
      `,
      [companyId, offset, limit],
    )

    const count = ArrayCountAll.countAll(sales)

    return ArrayCountAll.fromArray(sales.map(SaleMapper.toDomain), count)
  }

  public async cancel(saleId: number, authorId: UUID): Promise<void> {
    using client = await PostgresService.connect()
    try {
      client.query("BEGIN")

      const { rowCount } = await client.query(
        `--sql
        UPDATE public.sales SET
          cancelled_at = NOW(),
          cancel_author_id = $1
        WHERE id = $2
      `,
        [authorId.toString(), saleId],
      )

      if (rowCount === 0) {
        throw new SaleErrors.SaleNotFoundError()
      }

      const { rows: paymentClientCreditsToRevert } = await client.query<{
        id: number
        company_client_credit_id: number
        value: number
        sale_payment_id: number
        company_client_id: number
      }>(
        `--sql
        SELECT 
          payment_credit.id,
          payment_credit.company_client_credit_id,
          payment_credit.value,
          payment_credit.sale_payment_id,
          client_credit.company_client_id
        FROM public.sale_payment_company_client_credits payment_credit
          INNER JOIN public.sale_payments payment 
            ON payment.id = payment_credit.sale_payment_id 
              AND payment.sale_id = $1
          INNER JOIN public.company_client_credits client_credit
            ON client_credit.id = payment_credit.company_client_credit_id
      `,
        [saleId],
      )

      for (const {
        company_client_id: companyClientId,
        value: valueToAdd,
        sale_payment_id: salePaymentId,
      } of paymentClientCreditsToRevert) {
        const {
          rows: [{ id: newClientCreditId }],
        } = await client.query<{
          id: number
        }>(
          `--sql
          WITH last_client_credit as (
            SELECT client_credit.*
            FROM public.company_client_credits client_credit
            WHERE client_credit.company_client_id = $1
            ORDER BY client_credit.created_at DESC
            LIMIT 1
          )
  
          INSERT INTO public.company_client_credits(company_client_id, credit)
          (
            SELECT $1, client_credit.credit + $2
            FROM last_client_credit AS client_credit
          )
          RETURNING id
            
        `,
          [companyClientId, valueToAdd],
        )

        await client.query(
          `--sql
          UPDATE public.sale_payment_company_client_credits payment_credit SET
            cancelled_at = NOW(),
            cancelled_client_credit_id = $2
          WHERE payment_credit.sale_payment_id = $1
        `,
          [salePaymentId, newClientCreditId],
        )
      }

      client.query("COMMIT")
    } catch (error) {
      client.query("ROLLBACK")
      throw error
    }
  }

  public async hasSalesByProductId(productId: number): Promise<boolean> {
    const { rowCount } = await PostgresService.query(
      `--sql
        SELECT 1
        FROM public.sale_products
        WHERE product_id = $1
      `,
      [productId],
    )

    return (rowCount ?? 0) > 0
  }
}
