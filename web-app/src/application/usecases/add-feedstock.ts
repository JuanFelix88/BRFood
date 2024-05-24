import { Usecase } from "@/src/shared/entities/Usecase"
import { FeedstockRepository } from "../repositories/feedstock-repository"
import { FeedstockErrors } from "../errors/feedstock"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { AmountValue } from "@/src/shared/entities/AmountValue"

interface AddFeedstockData {
  name: string
  amountInt: number
  amountType: string
  unitPriceInt: number
}

export class AddFeedstock implements Usecase {
  constructor(private readonly feedstockRepository: FeedstockRepository) {}

  public async handle({
    name,
    amountInt,
    amountType,
    unitPriceInt,
  }: AddFeedstockData): Promise<void> {
    name = name.trim()
    amountType = amountType.trim()

    if (name.length === 0 || name.length > 60) {
      throw new FeedstockErrors.NameError()
    }

    if (amountType.length === 0 || amountType.length > 60) {
      throw new FeedstockErrors.AmountTypeError()
    }

    const unitPrice = new CurrencyValue(unitPriceInt)

    await this.feedstockRepository.add({
      amount: new AmountValue(amountInt),
      amountType,
      lastUnitPrice: unitPrice,
      name,
    })
  }
}
