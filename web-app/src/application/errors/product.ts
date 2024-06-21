import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"
import { StatusCodes } from "http-status-codes"

export namespace ProductErrors {
  export class MissingInputName extends AppError {
    constructor() {
      super("Missing Input Name", {
        [Lang.EN]: "Missing product name",
        [Lang.PT_BR]: "Está faltando o nome do produto",
      })
    }
  }

  export class InvalidInputName extends AppError {
    constructor() {
      super("Invalid Input Name", {
        [Lang.EN]: "Invalid name",
        [Lang.PT_BR]: "Nome inválido",
      })
    }
  }

  export class ProductPriceIsNegative extends AppError {
    constructor(n: number) {
      super("Product price is negative", {
        [Lang.EN]: `The product price is negative: ${n}`,
        [Lang.PT_BR]: `O valor do produto não pode ser negativo: ${n.toFixed(2).replace(".", ",")}`,
      })
    }
  }

  export class ProductNotCreated extends AppError {
    constructor() {
      super("Product not created", {
        [Lang.EN]: `The product was not created in the database due to an error`,
        [Lang.PT_BR]: `O produto não foi criado na base de dados devido a um erro`,
      })
    }
  }

  export class InvalidInputProductsIds extends AppError {
    constructor() {
      super("Invalid Input Products Ids", {
        [Lang.EN]: `The data entry that make up the product ID list is invalid`,
        [Lang.PT_BR]: `A entrada de dados que compõem a lista de id de produtos é inválida`,
      })
    }
  }

  export class MissingOwnerCompanyId extends AppError {
    constructor() {
      super("Missing Owner Company Id", {
        [Lang.EN]: `The identification of the proprietary company is absent`,
        [Lang.PT_BR]: `Está ausente a identificação do companhia proprietária`,
      })
    }
  }

  export class IdProductIsMissingError extends AppError {
    constructor() {
      super("Id Product Is Missing", {
        [Lang.EN]: `The product ID is absent`,
        [Lang.PT_BR]: `O ID do produto está ausente`,
      })
    }
  }

  export class ProductNotFound extends AppError {
    constructor() {
      super("Product Not Found", {
        [Lang.EN]: `The product was not found`,
        [Lang.PT_BR]: `O produto não foi encontrado`,
      })
      this.status(StatusCodes.NOT_FOUND)
    }
  }

  export class ProductNotUpdated extends AppError {
    constructor() {
      super("Product Not Updated", {
        [Lang.EN]: `The product was not updated in the database due to an error`,
        [Lang.PT_BR]: `O produto não foi atualizado na base de dados devido a um erro`,
      })
      this.status(StatusCodes.NOT_FOUND)
    }
  }

  export class NotAllowedDeleteProductHasSalesError extends AppError {
    constructor() {
      super("Not Allowed Delete Product Has Sales", {
        [Lang.EN]: `It is not allowed to exclude because there are sales issued to this product`,
        [Lang.PT_BR]: `Não é permitido excluir pois há vendas emitidas para este produto`,
      })
      this.status(StatusCodes.NOT_FOUND)
    }
  }
}
