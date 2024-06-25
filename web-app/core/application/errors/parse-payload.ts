import { AppError } from "@/core/shared/entities"
import { Lang } from "@/core/shared/intl"
import { StatusCodes } from "http-status-codes"

export namespace ParsePayloadErrors {
  export class InvalidPayloadError extends AppError {
    constructor(keyName: string, message = "") {
      super("Invalid payload", {
        [Lang.EN]: `Error in data input. The data 'payload.${keyName}' is invalid. ${message}`,
        [Lang.PT_BR]: `Erro na entrada de dados. O dado 'payload.${keyName}' é inválido. ${message}`,
      })
      this.status(StatusCodes.BAD_REQUEST)
    }
  }
}
