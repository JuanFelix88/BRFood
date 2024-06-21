import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

export namespace UserErrors {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", {
        [Lang.EN]: "User not found, please check your credentials and try again",
        [Lang.PT_BR]:
          "Usuário não encontrado, por favor, verifique suas credenciais e tente novamente",
      })
    }
  }

  export class UserNotFoundByEmailError extends AppError {
    constructor() {
      super("User not found by email error", {
        [Lang.EN]: "User not found by email",
        [Lang.PT_BR]: "Usuário não encontrado através do email informado",
      })
    }
  }

  export class InvalidInputName extends AppError {
    constructor() {
      super("Invalid Input Name", {
        [Lang.EN]: "Invalid name, the name should contain up to a maximum of 60 characters",
        [Lang.PT_BR]: "Nome inválido, o nome deverá conter até no máximo 60 caracteres",
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

  export class PasswordsDontMatch extends AppError {
    constructor() {
      super("Passwords don't match", {
        [Lang.EN]: "Passwords don't match",
        [Lang.PT_BR]: "Senhas não conferem",
      })
    }
  }

  export class PasswordIsTooShort extends AppError {
    constructor() {
      super("Password is too short", {
        [Lang.EN]: "Password is too short",
        [Lang.PT_BR]: "A senha é muito curta, considere pelo menos 8 caracteres",
      })
    }
  }

  export class IdUserIsMissingError extends AppError {
    constructor() {
      super("Id user is missing", {
        [Lang.EN]: "The user ID is missing, check and try again",
        [Lang.PT_BR]: "O ID do usuário está faltando, verifique e tente novamente",
      })
    }
  }
}
