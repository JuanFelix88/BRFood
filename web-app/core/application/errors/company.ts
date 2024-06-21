import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

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
        [Lang.EN]: "It was not possible to add the user to the company's authorized users list",
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

  export class IsNotAuthorizedOwnerError extends AppError {
    constructor() {
      super("Company is not authorized owner", {
        [Lang.EN]: `You are not the owner of this company, operation not allowed`,
        [Lang.PT_BR]: `Você não é o usuário proprietário desta empresa, operação não permitida`,
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
        [Lang.EN]: "The email of the new responsible for the company was not informed",
        [Lang.PT_BR]: "O email do novo responsável pela empresa não foi informado",
      })
    }
  }

  export class HasIncorrectEmailsErrors extends AppError {
    constructor() {
      super("Has incorrect emails", {
        [Lang.EN]: "There are incorrect emails in the authorization list for the new company",
        [Lang.PT_BR]: "Há emails incorretos na lista de autorização para a nova empresa",
      })
    }
  }

  export class AuthorizedUsersListIsEmptyError extends AppError {
    constructor() {
      super("Authorized users list is empty", {
        [Lang.EN]: "The list of authorized users is empty, at least one new user is required",
        [Lang.PT_BR]:
          "A lista de usuários autorizados está vazia, é necessário ao menos um novo usuário",
      })
    }
  }

  export class HasAuthorizedUsersInListError extends AppError {
    constructor() {
      super("Has authorized users in list", {
        [Lang.EN]:
          "In this listing there are users who are already authorized, only users are allowed without permission",
        [Lang.PT_BR]:
          "Nesta listagem há usuários que já estão autorizados, é permitido somente o envio de usuários sem permissão",
      })
    }
  }
}
