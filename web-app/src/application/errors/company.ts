import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace CompanyErrors {
  export class CompanyNotFoundError extends AppError {
    constructor() {
      super("Company not found", {
        [Lang.EN]: "It was not possible to find the company",
        [Lang.PT_BR]: "Não foi possível encontrar a empresa",
      })
    }
  }

  export class CompanyNotCreatedInDatabaseError extends AppError {
    constructor() {
      super("Company not created in database", {
        [Lang.EN]: "A company was not created in database",
        [Lang.PT_BR]: "A empresa não foi criada no banco de dados",
      })
    }
  }

  export class UserNotAddedToCompanyError extends AppError {
    constructor() {
      super("User not added to company", {
        [Lang.EN]:
          "It was not possible to add the user to the company's authorized users list",
        [Lang.PT_BR]:
          "Não foi possível adicionar o usuário à lista de usuários autorizados da empresa",
      })
    }
  }

  export class IdCompanyIsMissingError extends AppError {
    constructor() {
      super("Id company is missing", {
        [Lang.EN]: "The company ID was not informed",
        [Lang.PT_BR]: "O ID da empresa não foi informado",
      })
    }
  }

  export class IdCompanyIsInvalidError extends AppError {
    constructor() {
      super("Id company is Invalid Error", {
        [Lang.EN]: "Company ID is invalid",
        [Lang.PT_BR]: "O ID da empresa é inválido",
      })
    }
  }

  export class IsNotAuthorizedError extends AppError {
    constructor() {
      super("Company is not authorized", {
        [Lang.EN]: `You do not have permission for this company`,
        [Lang.PT_BR]: `Você não possui autorização para esta empresa`,
      })
    }
  }

  export class InvalidInputCompanyName extends AppError {
    constructor() {
      super("Invalid Input Company Name", {
        [Lang.EN]: "Invalid company name",
        [Lang.PT_BR]: "Nome da empresa inválido",
      })
    }
  }

  export class CompanyNotUpdatedInDatabaseError extends AppError {
    constructor() {
      super("Company not updated in database", {
        [Lang.EN]: "Company not updated in database",
        [Lang.PT_BR]: "A empresa não foi atualizada no banco de dados",
      })
    }
  }

  export class EmailOwnerTargetMissingError extends AppError {
    constructor() {
      super("Email owner target missing", {
        [Lang.EN]:
          "The email of the new responsible for the company was not informed",
        [Lang.PT_BR]:
          "O email do novo responsável pela empresa não foi informado",
      })
    }
  }
}
