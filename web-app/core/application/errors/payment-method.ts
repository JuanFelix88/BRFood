import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

export namespace PaymentMethodErrors {
  export class IdPaymentMethodIsInvalidOrNotFoundError extends AppError {
    constructor() {
      super("Id payment method is invalid or not found", {
        [Lang.EN]: "It was not possible to identify the payment method ID",
        [Lang.PT_BR]: "Não foi possível identificar o ID do método de pagamento",
      })
    }
  }

  export class NameIsInvalidError extends AppError {
    constructor() {
      super("Name is Invalid Error", {
        [Lang.EN]: "The name of the payment method is invalid",
        [Lang.PT_BR]: "O nome do método de pagamento é inválido",
      })
    }
  }

  export class PaymentMethodNotCreated extends AppError {
    constructor() {
      super("Payment method not created", {
        [Lang.EN]: "Payment method not created",
        [Lang.PT_BR]: "Método de pagamento não foi criado",
      })
    }
  }

  export class FeeIsInvalidError extends AppError {
    constructor() {
      super("Fee is Invalid Error", {
        [Lang.EN]: "Payment method fee is invalid",
        [Lang.PT_BR]: "A taxa do método de pagamento é inválida",
      })
    }
  }

  export class PaymentMethodNotFoundError extends AppError {
    constructor() {
      super("Payment method not found", {
        [Lang.EN]: "Payment method not found",
        [Lang.PT_BR]: "Método de pagamento não encontrado",
      })
    }
  }
}
