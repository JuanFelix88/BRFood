import { Sale } from "@/src/application/entities/Sale/Sale"
import { ArrayCountAll } from "@/src/shared/entities/ArrayCountAll"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { UUID } from "@/src/shared/entities/UUID"

export namespace SaleRepository {
  export interface AddPayload {
    products: Omit<Sale["products"][0], "name" | "total">[]
    paymentMethods: Omit<Sale["paymentMethods"][0], "name">[]
    total: CurrencyValue
    note?: string
    authorId: UUID
    ownerCompanyId: number
  }
}

export abstract class SaleRepository {
  public abstract add(payload: SaleRepository.AddPayload): Promise<Sale>
  public abstract get(id: number): Promise<Sale>
  public abstract getByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCountAll<Sale>>
  public abstract save(sale: Sale): Promise<void>
  public abstract hasSalesByProductId(productId: number): Promise<boolean>
  public abstract cancel(saleId: number, authorId: UUID): Promise<void>
}
