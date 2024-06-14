import { DateTime } from "@/src/shared/entities/DateTime"
import { Product } from "./Product/Product"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { PaymentMethod } from "./Payment/Payment"
import { AmountValue } from "@/src/shared/entities/AmountValue"

interface SaleProductItem {
  productId: number
  name: string
  amount: AmountValue
  total: CurrencyValue
}

interface SalePaymentMethod {
  paymentMethodId: number
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
}
