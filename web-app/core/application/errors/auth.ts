import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"
import { StatusCodes } from "http-status-codes"

export namespace AuthErrors {
  export class EmailCannotEmptyError extends AppError {
    constructor() {
      super("Email cannot be empty", {
        [Lang.EN]: "Email cannot be empty",
        [Lang.PT_BR]: "O email não pode estar vazio",
      })
      this.status(StatusCodes.UNAUTHORIZED)
    }
  }

  export class PasswordCannotEmptyError extends AppError {
    constructor() {
      super("Password cannot be empty", {
        [Lang.EN]: "Password cannot be empty",
        [Lang.PT_BR]: "A senha não pode estar vazia",
      })
      this.status(StatusCodes.UNAUTHORIZED)
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
        [Lang.EN]: "Error auth token is missing",
        [Lang.PT_BR]: "Token de autenticação inexistente",
      })
      this.status(StatusCodes.UNAUTHORIZED)
    }
  }

  export class InvalidAuthTokenError extends AppError {
    constructor() {
      super("Invalid Auth Token Error", {
        [Lang.EN]: "Invalid Auth Token Error",
        [Lang.PT_BR]: "O token de autenticação é inválido",
      })
    }
  }

  export class SignInFailedAuthError extends AppError {
    constructor(description: string) {
      super("Sign in failed auth error", {
        [Lang.EN]: `Failed sign in error: ${description}`,
        [Lang.PT_BR]: `Falha ao efetuar login: ${description}`,
      })
    }
  }

  export class SignUpFailedAuthError extends AppError {
    constructor(description: string) {
      super("Sign up failed auth error", {
        [Lang.EN]: `Failed sign up error: ${description}`,
        [Lang.PT_BR]: `Falha ao se cadastrar`,
      })
    }
  }

  export class MissingJwtSecretError extends AppError {
    constructor() {
      super("Missing JWT_SECRET Error", {
        [Lang.EN]: `Internal components of the authentication configuration is missing`,
        [Lang.PT_BR]: `Está faltando componentes internos da configuração de autenticação`,
      })
    }
  }

  export class ParsingJwtError extends AppError {
    constructor() {
      super("Parsing JWT Error", {
        [Lang.EN]: `The access token cannot be processed`,
        [Lang.PT_BR]: `O token de acesso não pode ser processado`,
      })
      this.status(StatusCodes.UNAUTHORIZED)
    }
  }

  export class UserAlreadyRegisteredByEmailError extends AppError {
    constructor() {
      super("User Already Registered By Email Error", {
        [Lang.EN]: `The email informed has already been registered`,
        [Lang.PT_BR]: `O email informado já foi registrado`,
      })
      this.status(StatusCodes.UNAUTHORIZED)
    }
  }

  export class YouCannotHasAccessToThisCompanyError extends AppError {
    constructor() {
      super("You cannot has access to this company", {
        [Lang.EN]: `You do not have access to this company`,
        [Lang.PT_BR]: `Você não possui acesso a esta empresa`,
      })
      this.status(StatusCodes.UNAUTHORIZED)
    }
  }
}
