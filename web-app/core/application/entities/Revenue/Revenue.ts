import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"

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
