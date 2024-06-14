import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { UUID } from "@/src/shared/entities/UUID"

export namespace PaymentMethodRepository {
  export interface AddPayload {
    name: string
    fee: CurrencyValue
    ownerCompanyId: number
    authorId: UUID
  }
}

export abstract class PaymentMethodRepository {
  public abstract add(
    payload: PaymentMethodRepository.AddPayload,
  ): Promise<PaymentMethod>
  public abstract existsIds(id: { paymentMethodId: number }[]): Promise<boolean>

  public abstract get(paymentMethodId: number): Promise<PaymentMethod>

  public abstract getByCompanyId(companyId: number): Promise<PaymentMethod[]>

  public abstract update(
    paymentMethodId: number,
    payload: PaymentMethodRepository.AddPayload,
  ): Promise<PaymentMethod>

  public abstract delete(paymentMethodId: number): Promise<void>
}
