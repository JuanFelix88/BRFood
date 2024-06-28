import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { PurchaseRepository } from "../repositories/purchase-repository"
import { RawMaterialRepository } from "../repositories/raw-material-repository"

export namespace AddPurchase {
  export interface Payload {
    products: AddPurchase.Product[]
    paymentMethods: AddPurchase.PaymentMethod[]
  }

  export interface Product {
    amount: AmountValue
    productId: number
    unitPrice: CurrencyValue
  }

  export interface PaymentMethod {
    paymentMethodId: number
    payValue: CurrencyValue
  }
}

@injectable()
export class AddPurchase implements Usecase {
  constructor(
    private readonly rawMaterialRepository: RawMaterialRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  public async handle({}: AddPurchase.Payload): Promise<void> {}
}
