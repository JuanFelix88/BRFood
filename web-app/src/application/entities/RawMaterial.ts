import { AmountValue } from "@/src/shared/entities/AmountValue"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { DateTime } from "@/src/shared/entities/DateTime"

export interface RawMaterial {
  id: number
  name: string
  amount: AmountValue
  amountType: string
  lastUnitPrice: CurrencyValue
  createdAt: DateTime
  updatedAt: DateTime
}
