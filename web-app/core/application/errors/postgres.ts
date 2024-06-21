import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

export namespace PostgresErrors {
  export class MissingEnvVarsError extends AppError {
    constructor() {
      super("Missing Env Vars", {
        [Lang.EN]: "Missing Env Vars",
        [Lang.PT_BR]: "Há variáveis de ambiente não definidas para Postgres Service",
      })
    }
  }
}
