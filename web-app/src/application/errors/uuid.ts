import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace UUIDErrors {
  export class InvalidUUID extends AppError {
    constructor() {
      super("Invalid UUID", {
        [Lang.EN]: "Invalid UUID",
        [Lang.PT_BR]: "UUID inválido",
      })
    }
  }

  export class IdIsMissingInUUIDConvertion extends AppError {
    constructor() {
      super("Id is missing in UUID convertion", {
        [Lang.EN]: "Id is missing in UUID convertion",
        [Lang.PT_BR]: "O id não foi informado na conversão de UUID",
      })
    }
  }
}
