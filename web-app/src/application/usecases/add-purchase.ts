import { Usecase } from "@/src/shared/entities/Usecase"
import { FeedstockRepository } from "../repositories/feedstock-repository"
import { PurchaseErrors } from "../errors/purchase"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { PurchaseRepository } from "../repositories/purchase-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"

interface AddPurchaseData {
  feedstockId: number
  amountInt: number
  unitPriceInt: number
}

export class AddPurchase implements Usecase {
  constructor(
    private readonly feedstockRepository: FeedstockRepository,
    private readonly purchaseRepository: PurchaseRepository
  ) {}

  public async handle({
    amountInt,
    feedstockId,
    unitPriceInt,
  }: AddPurchaseData): Promise<void> {
    if (!(await this.feedstockRepository.exists(feedstockId))) {
      throw new PurchaseErrors.FeedstockNotFound(feedstockId)
    }

    const unitPrice = new CurrencyValue(unitPriceInt)

    if (unitPrice.isNegative()) {
      throw new PurchaseErrors.UnitPriceIsNegative()
    }

    const amountValue = new AmountValue(amountInt)

    const cost = new CurrencyValue(unitPrice.int * amountValue.int)

    await this.purchaseRepository.add(cost, unitPrice, amountValue, feedstockId)
  }
}
