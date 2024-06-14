import { PaymentMethod } from "@/src/application/entities/PaymentMethod/PaymentMethod"
import { PaymentMethodErrors } from "@/src/application/errors/payment-method"
import { PaymentMethodRepository } from "@/src/application/repositories/payment-method-repository"
import { PostgresService } from "@/src/infra/services/postgres"
import { PaymentMethodMapper } from "../mappers/payment-method-mapper"

export class PostgresPaymentMethodRepository
  implements PaymentMethodRepository
{
  public async add(
    payload: PaymentMethodRepository.AddPayload,
  ): Promise<PaymentMethod> {
    using client = await PostgresService.connect()
    try {
      await client.query("BEGIN")

      const { rows: rowsAddPaymentMethod } = await client.query<{
        id: number
        name: string
        author_id: string
        owner_company_id: number
        created_at: Date
        updated_at: Date
      }>(
        `--sql
        INSERT INTO public.payment_methods(name, author_id, owner_company_id)
        VALUES ($1, $2, $3)
        RETURNING 
          id,
          name,
          author_id,
          owner_company_id,
          created_at,
          updated_at
      `,
        [payload.name, payload.authorId.toString(), payload.ownerCompanyId],
      )

      if (rowsAddPaymentMethod.length === 0) {
        throw new PaymentMethodErrors.PaymentMethodNotCreated()
      }

      const { rows: rowsAddPaymentMethodFee } = await client.query<{
        payment_method_id: number
        fee: number
      }>(
        `--sql
        INSERT INTO public.payment_method_fees(payment_method_id, fee)  
        VALUES ($1, $2)
        RETURNING 
          payment_method_id, 
          fee
      `,
        [rowsAddPaymentMethod[0].id, payload.fee.int],
      )

      if (rowsAddPaymentMethodFee.length === 0) {
        throw new PaymentMethodErrors.PaymentMethodNotCreated()
      }

      await client.query("COMMIT")

      return PaymentMethodMapper.toDomain({
        id: rowsAddPaymentMethod[0].id,
        name: rowsAddPaymentMethod[0].name,
        fee: rowsAddPaymentMethodFee[0].fee,
        created_at: rowsAddPaymentMethod[0].created_at,
        updated_at: rowsAddPaymentMethod[0].updated_at,
        owner_company_id: rowsAddPaymentMethod[0].owner_company_id,
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }
  }

  public async get(paymentMethodId: number): Promise<PaymentMethod> {
    const { rows } = await PostgresService.query<{
      id: number
      name: string
      fee: number
      owner_company_id: number
      created_at: Date
      updated_at: Date
    }>(
      `--sql
      WITH payment_method_fees_with_row_number AS (
        SELECT
          fees.payment_method_id,
          fees.fee,
          ROW_NUMBER() OVER(PARTITION BY fees.payment_method_id ORDER BY fees.id DESC) as rn
        FROM public.payment_method_fees fees
        ORDER BY fees.created_at DESC
      )

      SELECT
        payment_methods.id,
        payment_methods.name,
        fees.fee,
        payment_methods.owner_company_id,
        payment_methods.created_at,
        payment_methods.updated_at
      FROM public.payment_methods payment_methods
        INNER JOIN payment_method_fees_with_row_number fees 
          ON fees.payment_method_id = payment_methods.id AND fees.rn = 1
      WHERE payment_methods.id = $1
    `,
      [paymentMethodId],
    )

    if (rows.length === 0) {
      throw new PaymentMethodErrors.PaymentMethodNotFoundError()
    }

    return PaymentMethodMapper.toDomain({
      id: rows[0].id,
      name: rows[0].name,
      fee: rows[0].fee,
      owner_company_id: rows[0].owner_company_id,
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at,
    })
  }

  public async update(
    paymentMethodId: number,
    { name, authorId, fee, ownerCompanyId }: PaymentMethodRepository.AddPayload,
  ): Promise<PaymentMethod> {
    using client = await PostgresService.connect()
    try {
      await client.query("BEGIN")

      const { rows: rowsLastPaymentMethodFees } = await client.query<{
        fee: number
        payment_method_id: number
      }>(
        `--sql
        SELECT 
          fees.fee,
          fees.payment_method_id
        FROM public.payment_method_fees fees
        WHERE fees.payment_method_id = $1
        ORDER BY fees.created_at DESC
        LIMIT 1
        `,
        [paymentMethodId],
      )

      if (rowsLastPaymentMethodFees.length === 0) {
        throw new PaymentMethodErrors.PaymentMethodNotFoundError()
      }

      const isFeeChanged = rowsLastPaymentMethodFees.some(
        (row) => !fee.isEqual(row.fee),
      )

      const queryChangeFee = isFeeChanged
        ? `--sql 
          INSERT INTO public.payment_method_fees(payment_method_id, fee) 
          VALUES($1, $2)
          RETURNING
            id,
            payment_method_id,
            fee`
        : `--sql 
          SELECT 
            id,
            payment_method_id,
            fee
          FROM public.payment_method_fees
          WHERE payment_method_id = $1    
        `

      const valuesChangeFee = isFeeChanged
        ? [paymentMethodId, fee.int]
        : [paymentMethodId]

      const { rows: rowsPaymentMethodFees } = await client.query<{
        id: number
        payment_method_id: number
        fee: number
      }>(queryChangeFee, valuesChangeFee)

      const { rows: rowsUpdatePaymentMethod } = await client.query<{
        id: number
        name: string
        author_id: string
        owner_company_id: number
        created_at: Date
        updated_at: Date
      }>(
        `--sql
        UPDATE public.payment_methods
        SET
          name = $1,
          author_id = $2,
          owner_company_id = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING 
          id,
          name,
          author_id,
          owner_company_id,
          created_at,
          updated_at
        `,
        [name, authorId.toString(), ownerCompanyId, paymentMethodId],
      )

      if (rowsUpdatePaymentMethod.length === 0) {
        throw new PaymentMethodErrors.PaymentMethodNotFoundError()
      }

      await client.query("COMMIT")

      return PaymentMethodMapper.toDomain({
        id: rowsUpdatePaymentMethod[0].id,
        name: rowsUpdatePaymentMethod[0].name,
        fee: rowsPaymentMethodFees[0].fee,
        created_at: rowsUpdatePaymentMethod[0].created_at,
        updated_at: rowsUpdatePaymentMethod[0].updated_at,
        owner_company_id: rowsUpdatePaymentMethod[0].owner_company_id,
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }
  }

  public async existsIds(ids: { paymentMethodId: number }[]): Promise<boolean> {
    const paymentMethodIds: string = ids
      .map(({ paymentMethodId }) => paymentMethodId)
      .join(", ")

    const { rowCount } = await PostgresService.query(
      `--sql
      SELECT 1
      FROM public.payment_methods
      WHERE id IN (${paymentMethodIds})
    `,
    )

    return rowCount === ids.length
  }

  public async getByCompanyId(companyId: number): Promise<PaymentMethod[]> {
    const { rows } = await PostgresService.query<{
      id: number
      name: string
      fee: number
      owner_company_id: number
      created_at: Date
      updated_at: Date
    }>(
      `--sql
      WITH payment_method_fees_with_row_number AS (
        SELECT
          fees.payment_method_id,
          fees.fee,
          ROW_NUMBER() OVER(PARTITION BY fees.payment_method_id ORDER BY fees.id DESC) as rn
        FROM public.payment_method_fees fees
        ORDER BY fees.created_at DESC
      )

      SELECT
        payment_methods.id,
        payment_methods.name,
        fees.fee,
        payment_methods.owner_company_id,
        payment_methods.created_at,
        payment_methods.updated_at
      FROM public.payment_methods payment_methods
        INNER JOIN payment_method_fees_with_row_number fees 
          ON fees.payment_method_id = payment_methods.id AND fees.rn = 1
      WHERE owner_company_id = $1
    `,
      [companyId],
    )

    return rows.map(PaymentMethodMapper.toDomain)
  }

  public async delete(paymentMethodId: number): Promise<void> {
    const { rowCount } = await PostgresService.query(
      `--sql
      DELETE FROM public.payment_methods
      WHERE id = $1
    `,
      [paymentMethodId],
    )

    if (rowCount === 0) {
      throw new PaymentMethodErrors.PaymentMethodNotFoundError()
    }
  }
}
