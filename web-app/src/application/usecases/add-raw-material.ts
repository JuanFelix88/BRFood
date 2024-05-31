import { Usecase } from "@/src/shared/entities/Usecase"
import { RawMaterialRepository } from "../repositories/raw-material-repository"
import { RawMaterialErrors } from "../errors/raw-material"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { AmountValue } from "@/src/shared/entities/AmountValue"

interface AddRawMaterialData {
  name: string
  amountInt: number
  amountType: string
  unitPriceInt: number
}

export class AddRawMaterial implements Usecase {
  constructor(public rawMaterialRepository: RawMaterialRepository) {}

  public async handle({
    name,
    amountInt,
    amountType,
    unitPriceInt,
  }: AddRawMaterialData): Promise<void> {
    name = name.trim()
    amountType = amountType.trim()

    if (name.length === 0 || name.length > 60) {
      throw new RawMaterialErrors.NameError()
    }

    if (amountType.length === 0 || amountType.length > 60) {
      throw new RawMaterialErrors.AmountTypeError()
    }

    const unitPrice = new CurrencyValue(unitPriceInt)

    await this.rawMaterialRepository.add({
      amount: new AmountValue(amountInt),
      amountType,
      lastUnitPrice: unitPrice,
      name,
    })
  }
}
