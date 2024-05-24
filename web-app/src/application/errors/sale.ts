import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace SaleErrors {
  export class PaymentMethodsAmountError extends AppError {
    constructor() {
      super("Payment methods amount error", {
        [Lang.EN]: "Payment methods amount error",
        [Lang.PT_BR]: "Erro de quantidade de métodos de pagamento informado",
      })
    }
  }

  export class ProductsAmountError extends AppError {
    constructor() {
      super("Products amount error", {
        [Lang.EN]: "Products amount error",
        [Lang.PT_BR]:
          "Erro de quantidade de produtos informado, é necessário conter ao menos um produto",
      })
    }
  }

  export class NoteLengthError extends AppError {
    constructor() {
      super("Note length error", {
        [Lang.EN]: "Note length error",
        [Lang.PT_BR]: "Tamanho máximo excedido na anotação",
      })
    }
  }

  export class TheListHastProductNotFound extends AppError {
    constructor() {
      super("The list hast product not found", {
        [Lang.EN]: "The list product contains a incorrect product id",
        [Lang.PT_BR]: "A lista de produtos contém um id incorreto",
      })
    }
  }

  export class TheListHastPaymentMethodNotFound extends AppError {
    constructor() {
      super("The list hast payment method not found", {
        [Lang.EN]:
          "The list payment method contains a incorrect payment method id",
        [Lang.PT_BR]: "A lista de metodos de pagamento contém um id incorreto",
      })
    }
  }

  export class PaymentMethodsValueError extends AppError {
    constructor() {
      super("Payment methods value error", {
        [Lang.EN]: "Payment methods value error",
        [Lang.PT_BR]:
          "Os valores dos métodos de pagamentos informados estão incorretos com base nos preços atuais dos produtos",
      })
    }
  }
}
