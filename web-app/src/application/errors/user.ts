import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace UserErrors {
  export class InvalidInputName extends AppError {
    constructor() {
      super("Invalid Input Name", {
        [Lang.EN]:
          "Invalid name, the name should contain up to a maximum of 60 characters",
        [Lang.PT_BR]:
          "Nome inválido, o nome deverá conter até no máximo 60 caracteres",
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
        [Lang.PT_BR]:
          "A senha é muito curta, considere pelo menos 8 caracteres",
      })
    }
  }
}
