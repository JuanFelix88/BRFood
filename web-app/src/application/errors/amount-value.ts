import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace AmountValueErrors {
  export class QuantityError extends AppError {
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
}
