import { Usecase } from "@/src/shared/entities/Usecase"
import { RawMaterialRepository } from "../repositories/raw-material-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"

export interface ChangeRawMaterialAmountData {
  rawMaterialId: number
  amount: AmountValue
}

export class ChangeRawMaterialAmount implements Usecase {
  constructor(private readonly rawMaterialRepository: RawMaterialRepository) {}

  public async handle({
    amount,
    rawMaterialId,
  }: ChangeRawMaterialAmountData): Promise<void> {
    await this.rawMaterialRepository.addNewAmount(rawMaterialId, amount)
  }
}
