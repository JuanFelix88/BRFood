import { AmountValue } from '@/src/shared/entities/AmountValue'
import { CurrencyValue } from '@/src/shared/entities/CurrencyValue'

export interface Feedstock {
  id: number
  name: string
  amount: AmountValue
  amountType: string
  lastUnitPrice: CurrencyValue
}