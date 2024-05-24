import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace FeedstockErrors {
  export class NameError extends AppError {
    constructor() {
      super("Feedstock name error", {
        [Lang.EN]: "Name of the feedstock is invalid for application",
        [Lang.PT_BR]: "Nome da matéria prima é inválido para aplicação",
      })
    }
  }

  export class AmountError extends AppError {
    constructor(count: number) {
      super("Feedstock amount error", {
        [Lang.EN]: `Amount of the feedstock is invalid for application: ${count}`,
        [Lang.PT_BR]: `Quantidade da prima é inválida: ${count}`,
      })
    }
  }

  export class AmountTypeError extends AppError {
    constructor() {
      super("Feedstock amount type error", {
        [Lang.EN]: "Amount type of the feedstock is invalid for application",
        [Lang.PT_BR]: "Tipo de quantidade da prima é inválido para aplicação",
      })
    }
  }
}
