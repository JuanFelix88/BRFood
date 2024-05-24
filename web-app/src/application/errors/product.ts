import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace ProductErrors {
  export class InvalidInputName extends AppError {
    constructor() {
      super("Invalid Input Name", {
        [Lang.EN]: "Invalid name",
        [Lang.PT_BR]: "Nome inválido",
      })
    }
  }

  export class ProductPriceIsNegative extends AppError {
    constructor(n: number) {
      super("Product price is negative", {
        [Lang.EN]: `The product price is negative: ${n}`,
        [Lang.PT_BR]: `O valor do produto não pode ser negativo: ${n}`,
      })
    }
  }
}
