import { CurrencyValue } from "@/core/shared/entities"

export type PaymentData = { [key in keyof PaymentPayload]: PaymentPayload[key] }

export class PaymentPayload {
  public paymentMethodId?: number
  public paymentMethodValue?: CurrencyValue
  public clientId?: number
  public paymentCreditValue?: CurrencyValue

  public static getFrom(p: PaymentData): PaymentPayload {}

  private constructor(p: PaymentData) {
    this.clientId = p.clientId
    this.paymentCreditValue = p.paymentCreditValue
    this.paymentMethodId = p.paymentMethodId
    this.paymentMethodValue = p.paymentMethodValue
  }
}
