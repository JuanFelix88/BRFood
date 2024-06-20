import { Usecase } from "@/src/shared/entities/Usecase"
import { RawMaterialRepository } from "../repositories/raw-material-repository"
import { PurchaseErrors } from "../errors/purchase"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { PurchaseRepository } from "../repositories/purchase-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { injectable } from "@/src/shared/utils/dependency-injection"

interface AddPurchaseData {
  rawMaterialId: number
  amount: AmountValue
  unitPrice: CurrencyValue
}

@injectable()
export class AddPurchase implements Usecase {
  constructor(
    private readonly rawMaterialRepository: RawMaterialRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  public async handle({
    amount,
    rawMaterialId,
    unitPrice,
  }: AddPurchaseData): Promise<void> {
    if (!(await this.rawMaterialRepository.exists(rawMaterialId))) {
      throw new PurchaseErrors.RawMaterialNotFound(rawMaterialId)
    }

    if (unitPrice.isNegative()) {
      throw new PurchaseErrors.UnitPriceIsNegative()
    }

    const cost = new CurrencyValue(unitPrice.int * amount.int)

    await this.purchaseRepository.add(cost, unitPrice, amount, rawMaterialId)
  }
}
