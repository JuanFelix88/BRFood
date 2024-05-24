import { AmountValue } from '@/src/shared/entities/AmountValue'
import { CurrencyValue } from '@/src/shared/entities/CurrencyValue'
import { DateTime } from '@/src/shared/entities/DateTime'

interface PurchaseFeedstock {
  feedstockId: number
  itemName: string
  unitPrice: CurrencyValue
  amount: AmountValue
}

export interface Purchase {
  id: number
  feedstock: PurchaseFeedstock
  cost: CurrencyValue
  createdAt: DateTime
}