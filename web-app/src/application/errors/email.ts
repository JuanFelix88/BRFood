import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace EmailErrors {
  export class InvalidEmailError extends AppError {
    constructor() {
      super("Invalid Email Error", {
        [Lang.EN]: "Invalid email",
        [Lang.PT_BR]: "Email inválido",
      })
    }
  }
}
