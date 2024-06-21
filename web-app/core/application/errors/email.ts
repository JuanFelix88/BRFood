import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

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
