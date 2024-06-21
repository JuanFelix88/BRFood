import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

export namespace RawMaterialErrors {
  export class NameError extends AppError {
    constructor() {
      super("RawMaterial name error", {
        [Lang.EN]: "Name of the raw-material is invalid for application",
        [Lang.PT_BR]: "Nome da matéria prima é inválido para aplicação",
      })
    }
  }

  export class AmountError extends AppError {
    constructor(count: number) {
      super("RawMaterial amount error", {
        [Lang.EN]: `Amount of the raw-material is invalid for application: ${count}`,
        [Lang.PT_BR]: `Quantidade da prima é inválida: ${count}`,
      })
    }
  }

  export class AmountTypeError extends AppError {
    constructor() {
      super("RawMaterial amount type error", {
        [Lang.EN]: "Amount type of the raw-material is invalid for application",
        [Lang.PT_BR]: "Tipo de quantidade da prima é inválido para aplicação",
      })
    }
  }
}
