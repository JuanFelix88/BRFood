import { Register } from "@/src/shared/entities/Register"
import { Sale } from "@/src/application/entities/Sale/Sale"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"

namespace SaleRepository {
  export interface AddPayload {
    products: Omit<Sale["products"][0], "name" | "total">[]
    paymentMethods: Omit<Sale["paymentMethods"][0], "name">[]
    total: CurrencyValue
    note?: string
  }
}

export abstract class SaleRepository {
  public abstract add(payload: SaleRepository.AddPayload): Promise<void>
  public abstract all(): Promise<Sale[]>
  public abstract get(id: number): Promise<Sale>
  public abstract save(sale: Sale): Promise<void>
  public abstract delete(reg: Register): Promise<void>
}
