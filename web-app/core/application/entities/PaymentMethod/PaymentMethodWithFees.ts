import { UUID } from "@/core/shared/entities"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"

export interface PaymentMethodWithFees {
  id: number
  name: string
  fees: {
    id: number
    fee: CurrencyValue
    createdAt: DateTime
  }[]
  ownerCompanyId: number
  author: {
    id: UUID
    name: string
  }
  updatedAt: DateTime
  createdAt: DateTime
}
