import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { BucketImage } from "@/src/shared/entities/BucketImage"
import { DateTime } from "@/src/shared/entities/DateTime"

export interface Product {
  id: number
  name: string
  price: CurrencyValue
  profit: CurrencyValue
  coverImage?: BucketImage
  updatedAt: DateTime
  createdAt: DateTime
}
