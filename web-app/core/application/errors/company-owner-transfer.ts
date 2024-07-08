import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl"
import { StatusCodes } from "http-status-codes"

export namespace CompanyOwnerTransferErrors {
  export class TransferNotRequestedDatabaseError extends AppError {
    constructor() {
      super("Transfer Not Requested Database Error", {
        [Lang.EN]: "It was not possible to request the transfer due to an error in the database",
        [Lang.PT_BR]:
          "Não foi possível solicitar a transferência devido a um erro na base de dados",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  export class TransferIdIsMissingError extends AppError {
    constructor() {
      super("Transfer Id Is Missing", {
        [Lang.EN]: "The transfer request ID was not informed",
        [Lang.PT_BR]: "O ID da solicitação de transferência não foi informado",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  export class TransferAcceptDatabaseError extends AppError {
    constructor() {
      super("Transfer Accept Database Error", {
        [Lang.EN]: "It was not possible to accept the transfer due to an error in the database",
        [Lang.PT_BR]: "Não foi possível aceitar a transferência devido a um erro na base de dados",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  export class UnauthorizedModifyRequestError extends AppError {
    constructor() {
      super("Unauthorized To User", {
        [Lang.EN]: "You are not allowed to modify the reception of this transfer",
        [Lang.PT_BR]: "Você não está autorizado a modificar a receptação desta transferência",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  export class CompanyOwnerTransferNotFoundError extends AppError {
    constructor() {
      super("Company Owner Transfer Not Found", {
        [Lang.EN]: "The company owner transfer was not found",
        [Lang.PT_BR]: "A solicitação de transferência da empresa não foi encontrada",
      })
      this.status(StatusCodes.NOT_FOUND)
    }
  }

  export class CompanyAlreadyInTransferenceError extends AppError {
    constructor() {
      super("Company Already In Transference", {
        [Lang.EN]: "The company already in transference",
        [Lang.PT_BR]: "A empresa já está em transferência",
      })
    }
  }

  export class DeleteTransferDatabaseError extends AppError {
    constructor() {
      super("Company Transfer Owner Delete Database Error", {
        [Lang.EN]: "It was not possible to delete the transfer due to an error in the database",
        [Lang.PT_BR]:
          "Não foi possível realizar a exclusão da transferência devido a um erro na base de dados",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
