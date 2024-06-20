import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { DateTime } from "@/src/shared/entities/DateTime"

export interface PaymentMethodWithFees {
  id: number
  name: string
  fees: {
    id: number
    fee: CurrencyValue
    createdAt: DateTime
  }[]
  ownerCompanyId: number
  updatedAt: DateTime
  createdAt: DateTime
}
