import { Register } from "@/src/shared/entities/Register"
import { Feedstock } from "../entities/Feedstock"
import { AmountValue } from "@/src/shared/entities/AmountValue"

export abstract class FeedstockRepository {
  public abstract add(
    feedstock: Omit<Feedstock, keyof Register>
  ): Promise<Feedstock>
  public abstract addNewAmount(id: number, amount: AmountValue): Promise<void>
  public abstract exists(id: number): Promise<boolean>
  public abstract get(id: number): Promise<Feedstock>
  public abstract all(): Promise<Feedstock[]>
  public abstract perPage(offset: number, amount: number): Promise<Feedstock[]>
  public abstract save(feedstock: Feedstock): Promise<void>
  public abstract delete(reg: Register): Promise<void>
}
