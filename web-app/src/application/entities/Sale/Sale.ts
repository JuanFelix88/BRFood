import { DateTime } from "@/src/shared/entities/DateTime"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { UUID } from "@/src/shared/entities/UUID"

interface SaleProductItem {
  productId: number
  productPriceId: number
  name: string
  amount: AmountValue
  total: CurrencyValue
}

interface SalePaymentMethod {
  paymentMethodId: number
  paymentMethodFeeId: number
  name: string
  value: CurrencyValue
}

export interface Sale {
  id: number
  products: SaleProductItem[]
  paymentMethods: SalePaymentMethod[]
  total: CurrencyValue
  note?: string
  createdAt: DateTime
  authorId: UUID
  ownerCompanyId: number
  cancelledAt?: DateTime
}
