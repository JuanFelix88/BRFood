import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"

export interface PaymentMethod {
  id: number
  name: string
  lastFee: CurrencyValue
  lastFeeId: number
  ownerCompanyId: number
  updatedAt: DateTime
  createdAt: DateTime
}
