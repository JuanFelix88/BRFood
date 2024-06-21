import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"

export interface RawMaterial {
  id: number
  name: string
  amount: AmountValue
  amountType: string
  lastUnitPrice: CurrencyValue
  createdAt: DateTime
  updatedAt: DateTime
}
