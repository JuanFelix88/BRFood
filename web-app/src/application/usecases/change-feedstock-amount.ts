import { Usecase } from "@/src/shared/entities/Usecase"
import { FeedstockRepository } from "../repositories/feedstock-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"

export interface ChangeFeedstockAmountData {
  feedstockId: number
  amountInt: number
}

export class ChangeFeedstockAmount implements Usecase {
  constructor(private readonly feedstockRepository: FeedstockRepository) {}

  public async handle({
    amountInt,
    feedstockId,
  }: ChangeFeedstockAmountData): Promise<void> {
    await this.feedstockRepository.addNewAmount(
      feedstockId,
      new AmountValue(amountInt)
    )
  }
}
