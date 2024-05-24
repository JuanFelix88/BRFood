import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { AmountValue } from "@/src/shared/entities/AmountValue"

interface RevenueFeedstock {
  feedstockId: number
  feedstockName: string
  amount: AmountValue
  cost: CurrencyValue
}

export interface Revenue {
  id: number
  name: string
  feedstocks: RevenueFeedstock[]
  totalCost: CurrencyValue
}
