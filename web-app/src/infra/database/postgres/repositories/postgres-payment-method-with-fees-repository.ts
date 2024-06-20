import { PaymentMethodWithFees } from "@/src/application/entities/PaymentMethod/PaymentMethodWithFees"
import { PaymentMethodWithFeesRepository } from "@/src/application/repositories/payment-method-with-fees-repository"
import { PostgresService } from "@/src/infra/services"
import { injectable } from "@/src/shared/utils"

@injectable("Postgres")
export class PostgresPaymentMethodWithFeesRepository implements PaymentMethodWithFeesRepository {
  public async get(id: number): Promise<PaymentMethodWithFees> {
    const { rows } = await PostgresService.query<{
      id: number
      name: string
      fees: {
        id: number
        fee: number
        created_at: Date
      }[]
      owner_company_id: number
      created_at: Date
      updated_at: Date
    }>(`--sql
      SELECT
      FROM public.payment_methods
    `)
  }
}
