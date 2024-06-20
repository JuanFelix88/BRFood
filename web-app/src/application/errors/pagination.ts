import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"
import { StatusCodes } from "http-status-codes"

export namespace PaginationErrors {
  export class ReachedLimitError extends AppError {
    constructor(limit: number) {
      super(`Reached limit ${limit}`, {
        [Lang.EN]: `Reached limit ${limit} pagination`,
        [Lang.PT_BR]: `Limite de paginação atingido ${limit}`,
      })
    }
  }

  export class InvalidPerPageError extends AppError {
    constructor() {
      super(`Invalid per_page error`, {
        [Lang.EN]: `Invalid per page error`,
        [Lang.PT_BR]: `Quantidade de itens por página inválido`,
      })
    }
  }

  export class InvalidPageError extends AppError {
    constructor() {
      super(`Invalid page number error`, {
        [Lang.EN]: `Invalid page number`,
        [Lang.PT_BR]: `Número da página inválido`,
      })
    }
  }

  export class NotPossibleToGenerateXCountTotalHeaderError extends AppError {
    constructor() {
      super(`Not possible to generate X count total header`, {
        [Lang.EN]: `It was not possible to count the total internally`,
        [Lang.PT_BR]: `Não foi possível contabilizar os totais internamente`,
      })

      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
