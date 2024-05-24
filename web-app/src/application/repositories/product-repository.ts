import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { Product } from "../entities/Product"
import { BucketImage } from "@/src/shared/entities/BucketImage"

namespace ProductRepository {
  export interface AddPayload {
    name: string
    price: CurrencyValue
    coverBucketImg?: BucketImage
  }
}

export abstract class ProductRepository {
  public abstract add(payload: ProductRepository.AddPayload): Promise<void>

  /**
   * @throws When product not found
   */
  public abstract getByIds(ids: { productId: number }[]): Promise<Product[]>
}
