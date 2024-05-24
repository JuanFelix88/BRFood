import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { BucketImage } from "@/src/shared/entities/BucketImage"

export interface Product {
  id: number
  name: number
  price: CurrencyValue
  profit: CurrencyValue
  coverImage?: BucketImage
}
