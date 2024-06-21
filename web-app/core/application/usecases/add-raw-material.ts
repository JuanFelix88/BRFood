import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { RawMaterialErrors } from "../errors/raw-material"
import { RawMaterialRepository } from "../repositories/raw-material-repository"

interface AddRawMaterialData {
  name: string
  amountInt: number
  amountType: string
  unitPriceInt: number
}

@injectable()
export class AddRawMaterial implements Usecase {
  constructor(private readonly rawMaterialRepository: RawMaterialRepository) {}

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
