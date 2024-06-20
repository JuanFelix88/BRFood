import { Sale } from "@/src/application/entities/Sale/Sale"
import { SaleRepository } from "@/src/application/repositories/sale-repository"
import { PostgresService } from "@/src/infra/services/postgres"
import { SaleMapper } from "../mappers/sale-mapper"
import { GetMapperInputType } from "@/src/shared/utils/get-mapper-input-type"
import { SaleErrors } from "@/src/application/errors/sale"
import f from "pg-format"
import { UUID } from "@/src/shared/entities/UUID"
import { ArrayCountAll } from "@/src/shared/entities/ArrayCountAll"
import { injectable } from "@/src/shared/utils/dependency-injection"

@injectable("Postgres")
export class PostgresSaleRepository implements SaleRepository {
  private agregateData(
    rows: {
      id: number
      note?: string
      payment_method_name?: string
      payment_method_id?: number
      payment_method_value?: number
      payment_method_fee_id?: number
      product_name?: string
      product_amount?: number
      product_id?: number
      product_total?: number
      product_price_id?: number
      created_at: Date
      total: number
      author_id: string
      owner_company_id: number
      cancelled_at?: Date
    }[],
  ): GetMapperInputType<typeof SaleMapper>[] {
    const sales = rows.reduce((prev, item) => {
      if (!prev.has(item.id)) {
        prev.set(item.id, {
          id: item.id,
          note: item.note,
          payment_methods: [],
          created_at: item.created_at,
          products: [],
          total: item.total,
          author_id: item.author_id,
          owner_company_id: item.owner_company_id,
          cancelled_at: item.cancelled_at,
        })
      }

      const sale = prev.get(item.id)

      if (Number.isInteger(item.payment_method_id)) {
        sale?.payment_methods.push({
          name: item.payment_method_name!,
          payment_method_id: item.payment_method_id!,
          value: item.payment_method_value!,
          payment_method_fee_id: item.payment_method_fee_id!,
        })
      }

      if (Number.isInteger(item.product_id)) {
        sale?.products.push({
          name: item.product_name!,
          amount: item.product_amount!,
          product_id: item.product_id!,
          total: item.product_total!,
          product_price_id: item.product_price_id!,
        })
      }

      return prev
    }, new Map<number, GetMapperInputType<typeof SaleMapper>>())

    return [...sales.values()]
  }

  public async add({
    paymentMethods,
    products,
    total,
    note,
    authorId,
    ownerCompanyId,
  }: SaleRepository.AddPayload): Promise<Sale> {
    using client = await PostgresService.connect()
    try {
      client.query("BEGIN")

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

      const saleId = rowsSale[0].id

      const { rows: rowsPaymentMethods } = await client.query<{
        id: number
        payment_method_id: number
        payment_method_fee_id: number
        value: number
        payment_method_name: string
      }>(
        f(
          `--sql
          WITH inserted_payment_methods AS (
            INSERT INTO public.sales_payment_methods(sale_id, payment_method_id, payment_method_fee_id, value)
            VALUES %L  
            RETURNING 
              id, 
              payment_method_id, 
              payment_method_fee_id, 
              value
          )

          SELECT 
            ipm.id, 
            ipm.payment_method_id, 
            ipm.payment_method_fee_id, 
            ipm.value, 
            pm.name as payment_method_name
          FROM inserted_payment_methods ipm
            INNER JOIN public.payment_methods pm ON pm.id = ipm.payment_method_id
      `,
          paymentMethods.map(
            ({ paymentMethodId, value, paymentMethodFeeId }) => [
              saleId,
              paymentMethodId,
              paymentMethodFeeId,
              value.int,
            ],
          ),
        ),
      )

      if (rowsPaymentMethods.length === 0) {
        throw new SaleErrors.SaleNotCreatedError()
      }

      const { rows: rowsProducts } = await client.query<{
        id: number
        product_id: number
        amount: number
        total: number
        product_name: string
        product_price_id: number
      }>(
        f(
          `--sql
          WITH inserted_sales_products AS (
            INSERT INTO public.sales_products(sale_id, product_id, amount, total, product_price_id)
            VALUES %L  
            RETURNING id, product_id, amount, total
          )

          SELECT 
            isp.id,
            isp.product_id,
            isp.amount,
            isp.total,
            p.name as product_name
          FROM inserted_sales_products isp
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

      await client.query("COMMIT")

      return SaleMapper.toDomain({
        id: rowsSale[0].id,
        note: rowsSale[0].note,
        payment_methods: rowsPaymentMethods.map((pm) => ({
          name: pm.payment_method_name,
          paymentMethodId: pm.payment_method_id,
          value: pm.value,
          payment_method_id: pm.payment_method_id,
          payment_method_fee_id: pm.payment_method_fee_id,
        })),
        products: rowsProducts.map((p) => ({
          name: p.product_name,
          amount: p.amount,
          productId: p.product_id,
          total: p.total,
          product_id: p.product_id,
          product_price_id: p.product_price_id,
        })),
        total: rowsSale[0].total,
        created_at: rowsSale[0].created_at,
        author_id: rowsSale[0].author_id,
        owner_company_id: rowsSale[0].owner_company_id,
      })
    } catch (error) {
      client.query("ROLLBACK")
      throw error
    }
  }

  public async all(): Promise<Sale[]> {
    throw new Error("Not implemented")
  }

  public async get(id: number): Promise<Sale> {
    const { rows: rowsSales } = await PostgresService.query<{
      id: number
      note?: string
      payment_method_name?: string
      payment_method_id?: number
      payment_method_value?: number
      payment_method_fee_id?: number
      product_name?: string
      product_amount?: number
      product_id?: number
      product_total?: number
      product_price_id?: number
      created_at: Date
      total: number
      author_id: string
      owner_company_id: number
      cancelled_at?: Date
    }>(
      `--sql
        WITH sales as (SELECT 
          sales.id,
          sales.note,
          sales.created_at,
          sales.total,
          sales.author_id,
          sales.owner_company_id,
          sales.cancelled_at
        FROM public.sales sales
          INNER JOIN public.sales_payment_methods payment_methods
            ON payment_methods.sale_id = sales.id
          INNER JOIN public.sales_products products
            ON products.sale_id = sales.id
        WHERE sales.id = $1
      )

      SELECT 
        s.id,
        s.note,
        payment_methods.name as payment_method_name,
        sales_payment_methods.payment_method_id,
        sales_payment_methods.value as payment_method_value,
        sales_payment_methods.payment_method_fee_id,
        NULL as product_name,
        NULL as product_amount,
        NULL as product_id,
        NULL as product_total,
        NULL as product_price_id,
        s.created_at,
        s.total,
        s.author_id,
        s.owner_company_id,
        s.cancelled_at
      FROM public.sales_payment_methods sales_payment_methods
        INNER JOIN sales s ON s.id = sales_payment_methods.sale_id
        INNER JOIN public.payment_methods payment_methods 
          ON payment_methods.id = sales_payment_methods.payment_method_id

      UNION ALL

      SELECT 
        s.id,
        s.note,
        NULL as payment_method_name,
        NULL as payment_method_id,
        NULL as payment_method_value,
        NULL as payment_method_fee_id,
        products.name as product_name,
        sales_products.amount as product_amount,
        sales_products.product_id,
        sales_products.total as product_total,
        sales_products.product_price_id,
        s.created_at,
        s.total,
        s.author_id,
        s.owner_company_id,
        s.cancelled_at
      FROM public.sales_products sales_products
        INNER JOIN sales s ON s.id = sales_products.sale_id
        INNER JOIN public.products products ON products.id = sales_products.product_id
      `,
      [id],
    )

    const sales = this.agregateData(rowsSales)

    if (sales.length === 0) {
      throw new SaleErrors.SaleNotFoundError()
    }

    return SaleMapper.toDomain(sales[0])
  }

  public async getByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCountAll<Sale>> {
    const { rows: rowsSales } = await PostgresService.query<{
      id: number
      note?: string
      payment_method_name?: string
      payment_method_id?: number
      payment_method_value?: number
      payment_method_fee_id?: number
      product_name?: string
      product_amount?: number
      product_id?: number
      product_total?: number
      product_price_id?: number
      created_at: Date
      total: number
      author_id: string
      owner_company_id: number
      full_count: number
    }>(
      `--sql
        WITH sales as (SELECT 
          sales.id,
          sales.note,
          sales.created_at,
          sales.total,
          sales.author_id,
          sales.owner_company_id,
          count(*) OVER() AS full_count
        FROM public.sales sales
          INNER JOIN public.sales_payment_methods payment_methods
            ON payment_methods.sale_id = sales.id
          INNER JOIN public.sales_products products
            ON products.sale_id = sales.id
        WHERE sales.owner_company_id = $1 AND sales.cancelled_at IS NULL
        ORDER BY sales.created_at DESC
        LIMIT $2
        OFFSET $3
      )

      (SELECT 
        s.id,
        s.note,
        payment_methods.name as payment_method_name,
        sales_payment_methods.payment_method_id,
        sales_payment_methods.value as payment_method_value,
        sales_payment_methods.payment_method_fee_id,
        NULL as product_name,
        NULL as product_amount,
        NULL as product_id,
        NULL as product_total,
        NULL as product_price_id,
        s.created_at,
        s.total,
        s.author_id,
        s.owner_company_id,
        s.full_count
      FROM public.sales_payment_methods sales_payment_methods
        INNER JOIN sales s ON s.id = sales_payment_methods.sale_id
        INNER JOIN public.payment_methods payment_methods 
          ON payment_methods.id = sales_payment_methods.payment_method_id
      ORDER BY s.created_at DESC)

      UNION ALL

      (SELECT 
        s.id,
        s.note,
        NULL as payment_method_name,
        NULL as payment_method_id,
        NULL as payment_method_value,
        NULL as payment_method_fee_id,
        products.name as product_name,
        sales_products.amount as product_amount,
        sales_products.product_id,
        sales_products.total as product_total,
        sales_products.product_price_id,
        s.created_at,
        s.total,
        s.author_id,
        s.owner_company_id,
        s.full_count
      FROM public.sales_products sales_products
        INNER JOIN sales s ON s.id = sales_products.sale_id
        INNER JOIN public.products products ON products.id = sales_products.product_id
      ORDER BY s.created_at DESC)
      `,
      [companyId, limit, offset],
    )

    const sales = this.agregateData(rowsSales)
    const count = ArrayCountAll.countAll(rowsSales)

    return ArrayCountAll.fromArray(sales.map(SaleMapper.toDomain), count)
  }

  public async cancel(saleId: number, authorId: UUID): Promise<void> {
    const { rowCount } = await PostgresService.query(
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
  }

  public async save(sale: Sale): Promise<void> {
    throw new Error("Not implemented")
  }
}
