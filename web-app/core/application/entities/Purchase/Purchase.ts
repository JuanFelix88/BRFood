import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { UUID } from "@/core/shared/entities/UUID"

export namespace Purchase {
  export interface Product {
    id: number
    cost: CurrencyValue
    costId: number
  }

  export interface PaymentMethod {
    paymentMethodId: number
    value: CurrencyValue
  }
}

export interface Purchase {
  id: number
  totalCost: CurrencyValue
  authorId: UUID
  products: Purchase.Product[]
  paymentMethods: Purchase.PaymentMethod[]
  createdAt: DateTime
  cancelAuthorId?: UUID
  cancelledAt?: DateTime
}
