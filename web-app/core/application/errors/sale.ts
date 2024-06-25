import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

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
        [Lang.EN]: "The list payment method contains a incorrect payment method id",
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

  export class MissingPageParametersError extends AppError {
    constructor() {
      super("Missing page parameters", {
        [Lang.EN]: "Paging information is missing",
        [Lang.PT_BR]: "Está faltando as informações da paginação",
      })
    }
  }

  export class ReachedLimitError extends AppError {
    constructor() {
      super("Reached limit sales", {
        [Lang.EN]: "Sales limit per page hit (> 100)",
        [Lang.PT_BR]: "Limite de vendas por página atingido (> 100)",
      })
    }
  }

  export class InvalidPageError extends AppError {
    constructor() {
      super("Invalid page", {
        [Lang.EN]: "Pagination values ​​are incorrect",
        [Lang.PT_BR]: "Os valores de paginação estão incorretos",
      })
    }
  }

  export class SaleNotCreatedError extends AppError {
    constructor() {
      super("Sale not created", {
        [Lang.EN]: "The sale has not been inserted in the system due to an error in the database.",
        [Lang.PT_BR]: "A venda não foi inserida no sistema devido a um erro na base de dados.",
      })
    }
  }

  export class SaleIdIsMissingError extends AppError {
    constructor() {
      super("Sale id is missing", {
        [Lang.EN]: "The sale ID has not been informed or is incorrect, check and try again.",
        [Lang.PT_BR]:
          "O id da venda não foi informado ou está incorreto, verifique e tente novamente.",
      })
    }
  }

  export class SaleNotFoundError extends AppError {
    constructor() {
      super("Sale not found", {
        [Lang.EN]: "Sale not found",
        [Lang.PT_BR]: "Venda não encontrada",
      })
    }
  }

  export class SaleAlreadyCancelledError extends AppError {
    constructor() {
      super("Sale already cancelled", {
        [Lang.EN]: "Sale already cancelled",
        [Lang.PT_BR]: "Venda já cancelada.",
      })
    }
  }

  export class UserCreditBalanceError extends AppError {
    constructor() {
      super("User credit balance", {
        [Lang.EN]: "The sale cannot be completed as there is a lack of balance for payment.",
        [Lang.PT_BR]: "A venda não pode ser concluída pois há falta de saldo para pagamento.",
      })
    }
  }

  export class BalanceDatabaseError extends AppError {
    constructor() {
      super("Balance database", {
        [Lang.EN]: "It was not possible to modify the customer's balance to the database.",
        [Lang.PT_BR]: "Não foi possível modificar o saldo do cliente na base de dados.",
      })
    }
  }

  export class CheckPaymentsPayloadError extends AppError {
    constructor() {
      super("Check payments payload", {
        [Lang.EN]: "It was not possible to map the payment data from the payments.",
        [Lang.PT_BR]: "Não foi possível mapear a entrada de dados dos pagamentos.",
      })
    }
  }

  export class NotAllowedCancelSaleTimeLimitExceedError extends AppError {
    constructor() {
      super("Not allowed cancel sale time limit exceed", {
        [Lang.EN]:
          "It is not possible to cancel this sale because the cancellation time limit has been exceeded.",
        [Lang.PT_BR]:
          "Não é possível cancelar essa venda pois o limite de tempo de cancelamento foi excedido.",
      })
    }
  }
}
