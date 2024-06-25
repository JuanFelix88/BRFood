import { Sale } from "@/core/application/entities/Sale/Sale"
import { ArrayCountAll } from "@/core/shared/entities/ArrayCountAll"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { UUID } from "@/core/shared/entities/UUID"

export namespace SaleRepository {
  export interface PaymentPaymentMethod {
    paymentMethodId: number
    paymentMethodFeeId: number
    paymentMethodValue: CurrencyValue
  }

  export interface PaymentPaymentMethodClient {
    paymentMethodId: number
    paymentMethodFeeId: number
    paymentMethodValue: CurrencyValue
    clientId: number
  }

  export interface PaymentClientCredit {
    paymentCreditValue: CurrencyValue
    companyClientId: number
  }

  export type PaymentPayload =
    | PaymentPaymentMethod
    | PaymentPaymentMethodClient
    | PaymentClientCredit

  export interface AddPayload {
    products: Omit<Sale["products"][0], "name" | "total">[]
    paymentPayloads: PaymentPayload[]
    total: CurrencyValue
    note?: string
    authorId: UUID
    ownerCompanyId: number
  }
}

export abstract class SaleRepository {
  public abstract add(payload: SaleRepository.AddPayload): Promise<Sale>
  public abstract get(id: number): Promise<Sale>
  public abstract listByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCountAll<Sale>>
  public abstract hasSalesByProductId(productId: number): Promise<boolean>
  public abstract cancel(saleId: number, authorId: UUID): Promise<void>
}
