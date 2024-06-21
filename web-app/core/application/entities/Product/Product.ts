import { BucketImage } from "@/core/shared/entities/BucketImage"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"

export interface Product {
  id: number
  name: string
  lastPrice: CurrencyValue
  lastProfit: CurrencyValue
  lastPriceId: number
  coverImage?: BucketImage
  ownerCompanyId: number
  updatedAt: DateTime
  createdAt: DateTime
}
