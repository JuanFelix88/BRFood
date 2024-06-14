import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { DateTime } from "@/src/shared/entities/DateTime"

interface RevenueRawMaterial {
  rawMaterialId: number
  rawMaterialName: string
  amount: AmountValue
  cost: CurrencyValue
}

export interface Revenue {
  id: number
  name: string
  rawMaterials: RevenueRawMaterial[]
  totalCost: CurrencyValue
  createdAt: DateTime
}
