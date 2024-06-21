import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"
import { StatusCodes } from "http-status-codes"

export namespace MapperErrors {
  export class MappingError extends AppError {
    constructor(mapper: { name: string }, detail: string) {
      super(`Mapping ${mapper.name} error`, {
        [Lang.EN]: `It was not possible to map the data due to error in the data input: ${detail}`,
        [Lang.PT_BR]: "Não foi possível mapear os dados devido erro na entrada de dados",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
