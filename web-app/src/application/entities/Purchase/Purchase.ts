import { AmountValue } from "@/src/shared/entities/AmountValue"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { DateTime } from "@/src/shared/entities/DateTime"
import { UUID } from "@/src/shared/entities/UUID"

interface PurchaseRawMaterial {
  rawMaterialId: number
  rawMaterialUnitPriceId: number
  itemName: string
  unitPrice: CurrencyValue
  amount: AmountValue
}

interface PurchasePaymentMethod {
  paymentMethodId: number
  value: CurrencyValue
}

export interface Purchase {
  id: number
  rawMaterials: PurchaseRawMaterial[]
  cost: CurrencyValue
  paymentMethods: PurchasePaymentMethod[]
  authorId: UUID
  cancelAuthorId?: UUID
  cancelledAt?: DateTime
  createdAt: DateTime
}
