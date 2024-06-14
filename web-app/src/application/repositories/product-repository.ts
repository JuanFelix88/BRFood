import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { Product } from "../entities/Product/Product"
import { BucketImage } from "@/src/shared/entities/BucketImage"
import { UUID } from "@/src/shared/entities/UUID"

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

  public abstract getByCompanyId(companyId: number): Promise<Product[]>

  public abstract listByUserIdRelativeToOwnerCompany(
    userId: string,
  ): Promise<Product[]>

  public abstract delete(productId: number): Promise<void>
}
