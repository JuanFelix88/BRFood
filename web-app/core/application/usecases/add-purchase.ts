import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { PurchaseErrors } from "../errors/purchase"
import { PurchaseRepository } from "../repositories/purchase-repository"
import { RawMaterialRepository } from "../repositories/raw-material-repository"

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

  public async handle({ amount, rawMaterialId, unitPrice }: AddPurchaseData): Promise<void> {
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
