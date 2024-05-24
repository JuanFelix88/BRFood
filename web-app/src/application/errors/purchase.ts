import { AppError } from "@/src/shared/entities/AppError"
import { Lang } from "@/src/shared/intl/lang"

export namespace PurchaseErrors {
  export class FeedstockNotFound extends AppError {
    constructor(id: number) {
      super("Feedstock Not Found", {
        [Lang.EN]: `The feedstock with id ${id} was not found`,
        [Lang.PT_BR]: `A matéria prima informada com o id ${id} não foi encontrada`,
      })
    }
  }

  export class UnitPriceIsNegative extends AppError {
    constructor() {
      super("Unit Price Is Negative", {
        [Lang.EN]: "The unit price is negative, verify payload values",
        [Lang.PT_BR]:
          "O preço por unidade informado é negativo, verifique os valores do payload",
      })
    }
  }
}
