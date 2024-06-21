import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Register } from "@/core/shared/entities/Register"
import { Purchase } from "../entities/Purchase"

export abstract class PurchaseRepository {
  public abstract add(
    cost: CurrencyValue,
    unitPrice: CurrencyValue,
    amount: AmountValue,
    rawMaterialId: number,
  ): Promise<Purchase>
  public abstract get(id: number): Promise<Purchase>
  public abstract all(): Promise<Purchase[]>
  public abstract perPage(offset: number, amount: number): Promise<Purchase[]>
  public abstract save(purchase: Purchase): Promise<void>
  public abstract delete(reg: Register): Promise<void>
}
