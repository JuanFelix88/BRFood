import { UUID } from "@/src/shared/entities"
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
  author: {
    id: UUID
    name: string
  }
  updatedAt: DateTime
  createdAt: DateTime
}
