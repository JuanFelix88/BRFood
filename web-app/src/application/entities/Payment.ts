import { CurrencyValue } from '@/src/shared/entities/CurrencyValue'
import { DateTime } from '@/src/shared/entities/DateTime'

export interface PaymentMethod {
  id: number
  name: string
  fee: CurrencyValue
  updatedAt: DateTime
  createdAt: DateTime
}