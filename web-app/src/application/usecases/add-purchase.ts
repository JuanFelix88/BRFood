import { Usecase } from "@/src/shared/entities/Usecase"
import { RawMaterialRepository } from "../repositories/raw-material-repository"
import { PurchaseErrors } from "../errors/purchase"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { PurchaseRepository } from "../repositories/purchase-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"

interface AddPurchaseData {
  rawMaterialId: number
  amountInt: number
  unitPriceInt: number
}

export class AddPurchase implements Usecase {
  constructor(
    public rawMaterialRepository: RawMaterialRepository,
    public purchaseRepository: PurchaseRepository
  ) {}

  public async handle({
    amountInt,
    rawMaterialId,
    unitPriceInt,
  }: AddPurchaseData): Promise<void> {
    if (!(await this.rawMaterialRepository.exists(rawMaterialId))) {
      throw new PurchaseErrors.RawMaterialNotFound(rawMaterialId)
    }

    const unitPrice = new CurrencyValue(unitPriceInt)

    if (unitPrice.isNegative()) {
      throw new PurchaseErrors.UnitPriceIsNegative()
    }

    const amountValue = new AmountValue(amountInt)

    const cost = new CurrencyValue(unitPrice.int * amountValue.int)

    await this.purchaseRepository.add(
      cost,
      unitPrice,
      amountValue,
      rawMaterialId
    )
  }
}
