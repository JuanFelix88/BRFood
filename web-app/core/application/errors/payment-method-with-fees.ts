import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl"

export namespace PaymentMethodWithFeesErrors {
  export class PaymentMethodWithFeesNotFoundError extends AppError {
    constructor() {
      super("Payment method with fees not found", {
        [Lang.EN]: "It was not possible to obtain the payment method with fees",
        [Lang.PT_BR]: "Não foi possível obter o método de pagamento com taxas",
      })
    }
  }

  export class PaymentMethodIdIsMissingError extends AppError {
    constructor() {
      super("Payment method id is missing", {
        [Lang.EN]: "The payment method ID was not informed",
        [Lang.PT_BR]: "O ID do método de pagamento não foi informado",
      })
    }
  }
}
