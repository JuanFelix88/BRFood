import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { BucketImage } from "@/src/shared/entities/BucketImage"
import { DateTime } from "@/src/shared/entities/DateTime"

export interface Product {
  id: number
  name: string
  lastPrice: CurrencyValue
  lastProfit: CurrencyValue
  coverImage?: BucketImage
  ownerCompanyId: number
  updatedAt: DateTime
  createdAt: DateTime
}
