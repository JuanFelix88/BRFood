import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace AuthErrors {
  export class EmailCannotEmptyError extends AppError {
    constructor() {
      super("Email cannot be empty", {
        [Lang.EN]: "Email cannot be empty",
        [Lang.PT_BR]: "O email não pode estar vazio",
      })
    }
  }

  export class PasswordCannotEmptyError extends AppError {
    constructor() {
      super("Password cannot be empty", {
        [Lang.EN]: "Password cannot be empty",
        [Lang.PT_BR]: "A senha não pode estar vazia",
      })
    }
  }

  export class AuthorIdIsMissingError extends AppError {
    constructor() {
      super("Author Id is Missing", {
        [Lang.EN]: "Author id is missing in request",
        [Lang.PT_BR]: "O ID do autor não foi informado na requisição",
      })
    }
  }

  export class UserNotFoundError extends AppError {
    constructor() {
      super("User Note Found", {
        [Lang.EN]: "User not found based on the informed ID",
        [Lang.PT_BR]: "Usuário não encontrado com base no ID informado",
      })
    }
  }

  export class GetNextResponseAuthTokenError extends AppError {
    constructor() {
      super("Get Next Response Auth Token Error", {
        [Lang.EN]: "Get Next Response Auth Token Error",
        [Lang.PT_BR]: "Erro ao obter o token de autenticação do Next Response",
      })
    }
  }
}
