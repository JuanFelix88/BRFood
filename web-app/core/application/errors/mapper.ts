import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"
import { StatusCodes } from "http-status-codes"
import { ZodError, ZodIssue } from "zod"

export namespace MapperErrors {
  export class MappingError extends AppError {
    public issues?: ZodIssue[]
    constructor(mapper: { name: string }, err: any) {
      if (err instanceof AppError) {
        super(`Mapping ${mapper.name} error`, err.props)
        this.status(StatusCodes.INTERNAL_SERVER_ERROR)
        return
      }

      if (err instanceof ZodError) {
        super(`Mapping ${mapper.name} error`, {
          [Lang.EN]: `It was not possible to map the data due to error in the data input: ${err || ""}`,
          [Lang.PT_BR]: "Não foi possível mapear os dados devido erro na entrada de dados interna",
        })
        this.issues = err.issues
        return
      }

      super(`Mapping ${mapper.name} error`, {
        [Lang.EN]: `It was not possible to map the data due to error in the data input: ${err || ""}`,
        [Lang.PT_BR]: "Não foi possível mapear os dados devido erro na entrada de dados interna",
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  export class InvalidDataError extends AppError {
    constructor(keyName: string) {
      super(`Invalid data`, {
        [Lang.EN]: `Error in data mapping.'data.${keyName}' is invalid.`,
        [Lang.PT_BR]: `Erro no mapeamento de dados. 'data.${keyName}' é inválido.`,
      })
      this.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
