import { PaymentMethodWithFees } from "@/src/application/entities/PaymentMethod/PaymentMethodWithFees"
import * as Errors from "@/src/application/errors"
import { PaymentMethodWithFeesRepository } from "@/src/application/repositories/payment-method-with-fees-repository"
import { PostgresService } from "@/src/infra/services"
import { injectable } from "@/src/shared/utils"
import { PaymentMethodWithFeesMapper } from "../mappers"

@injectable("Postgres")
export class PostgresPaymentMethodWithFeesRepository implements PaymentMethodWithFeesRepository {
  public async get(id: number): Promise<PaymentMethodWithFees> {
    const { rows } = await PostgresService.query<
      | {
          id: number
          name: string
          owner_company_id: number
          created_at: Date
          updated_at: Date
          author_id: string
          author_name: string
        }
      | {
          id: number
          name: string
          owner_company_id: number
          created_at: Date
          updated_at: Date
          author_id: string
          author_name: string

          fees_id: number
          fee: number
          fee_created_at: Date
        }
    >(
      `--sql
      SELECT
        payment_methods.id,
        payment_methods.name,
        payment_methods.owner_company_id,
        payment_methods.updated_at,
        payment_methods.created_at,
        payment_methods.author_id,
        payment_method_fees.id as fees_id,
        payment_method_fees.fee,
        payment_method_fees.created_at as fee_created_at,
        users.raw_user_meta_data->>'name' as author_name,
        users.id as author_id
      FROM public.payment_methods payment_methods
        LEFT JOIN public.payment_method_fees payment_method_fees
          ON payment_method_fees.payment_method_id = payment_methods.id
        INNER JOIN auth.users users ON users.id = payment_methods.author_id
      WHERE payment_methods.id = $1
      ORDER BY payment_method_fees.id DESC
    `,
      [id],
    )

    if (rows.length === 0) {
      throw new Errors.PaymentMethodWithFeesErrors.PaymentMethodWithFeesNotFoundError()
    }

    const prev = {
      id: rows[0].id,
      name: rows[0].name,
      owner_company_id: rows[0].owner_company_id,
      author_id: rows[0].author_id,
      author_name: rows[0].author_name,
      fees: [] as {
        id: number
        fee: number
        created_at: Date
      }[],
      updated_at: rows[0].updated_at,
      created_at: rows[0].created_at,
    }

    const dataAggregated = rows.reduce<typeof prev>((prev, item) => {
      if ("fees_id" in item) {
        prev.fees.push({
          id: item.fees_id,
          fee: item.fee,
          created_at: item.fee_created_at,
        })
      }

      return prev
    }, prev)

    return PaymentMethodWithFeesMapper.toDomain(dataAggregated)
  }
}
