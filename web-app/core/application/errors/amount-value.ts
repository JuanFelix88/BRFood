import { AppError } from "@/core/shared/entities/AppError"
import { Lang } from "@/core/shared/intl/lang"

export namespace AmountValueErrors {
  export class QuantityErrorError extends AppError {
    constructor(n: number) {
      super("Amount error", {
        [Lang.EN]: `Amount is invalid: ${n}`,
        [Lang.PT_BR]: `Quantidade é inválida: ${n}, considere N >= 0`,
      })
    }
  }

  export class FloatError extends AppError {
    constructor(n: number) {
      super("Amount error float value", {
        [Lang.EN]: `Amount error float value: ${n}`,
        [Lang.PT_BR]: `A quantidade informada é inválida pois é um valor decimal: ${n}`,
      })
    }
  }

  export class InvalidEntryValueError extends AppError {
    constructor(n: number) {
      super("Amount error", {
        [Lang.EN]: `The input value for quantity is invalid: ${n}`,
        [Lang.PT_BR]: `O valor de entrada para quantidade é inválido: ${n}`,
      })
    }
  }
}
