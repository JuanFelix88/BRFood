import { Usecase } from "@/src/shared/entities/Usecase"
import { RawMaterialRepository } from "../repositories/raw-material-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"

export interface ChangeRawMaterialAmountData {
  rawMaterialId: number
  amountInt: number
}

export class ChangeRawMaterialAmount implements Usecase {
  constructor(public rawMaterialRepository: RawMaterialRepository) {}

  public async handle({
    amountInt,
    rawMaterialId,
  }: ChangeRawMaterialAmountData): Promise<void> {
    await this.rawMaterialRepository.addNewAmount(
      rawMaterialId,
      new AmountValue(amountInt)
    )
  }
}
