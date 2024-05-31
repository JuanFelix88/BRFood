import { Register } from "@/src/shared/entities/Register"
import { Purchase } from "../entities/Purchase"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { AmountValue } from "@/src/shared/entities/AmountValue"

export abstract class PurchaseRepository {
  public abstract add(
    cost: CurrencyValue,
    unitPrice: CurrencyValue,
    amount: AmountValue,
    rawMaterialId: number
  ): Promise<Purchase>
  public abstract get(id: number): Promise<Purchase>
  public abstract all(): Promise<Purchase[]>
  public abstract perPage(offset: number, amount: number): Promise<Purchase[]>
  public abstract save(purchase: Purchase): Promise<void>
  public abstract delete(reg: Register): Promise<void>
}
