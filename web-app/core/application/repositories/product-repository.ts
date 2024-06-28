import { ArrayCA } from "@/core/shared/entities/ArrayCountAll"
import { BucketImage } from "@/core/shared/entities/BucketImage"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { UUID } from "@/core/shared/entities/UUID"
import { Product } from "../entities/Product/Product"

export namespace ProductRepository {
  export interface AddPayload {
    name: string
    price: CurrencyValue
    profit: CurrencyValue
    coverBucketImg?: BucketImage
    authorId: UUID
    ownerCompanyId: number
  }

  export type UpdatePayload = AddPayload
}

export abstract class ProductRepository {
  public abstract add(payload: ProductRepository.AddPayload): Promise<Product>

  public abstract get(id: number): Promise<Product>

  /**
   * @throws When any product not found
   */
  public abstract getByIds(ids: { productId: number }[]): Promise<Product[]>

  public abstract update(
    productId: number,
    payload: ProductRepository.UpdatePayload,
  ): Promise<Product>

  public abstract getByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCA<Product>>

  public abstract listByUserIdRelativeToOwnerCompany(userId: string): Promise<Product[]>

  public abstract delete(productId: number): Promise<void>
}
