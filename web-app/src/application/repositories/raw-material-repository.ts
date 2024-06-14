import { Register } from "@/src/shared/entities/Register"
import { RawMaterial } from "../entities/RawMaterial/RawMaterial"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { AutoGenerateds } from "@/src/shared/entities/AutoGenerateds"

export abstract class RawMaterialRepository {
  public abstract add(
    rawMaterial: Omit<RawMaterial, keyof AutoGenerateds>
  ): Promise<RawMaterial>
  public abstract addNewAmount(id: number, amount: AmountValue): Promise<void>
  public abstract exists(id: number): Promise<boolean>
  public abstract get(id: number): Promise<RawMaterial>
  public abstract all(): Promise<RawMaterial[]>
  public abstract perPage(
    offset: number,
    amount: number
  ): Promise<RawMaterial[]>
  public abstract save(rawMaterial: RawMaterial): Promise<void>
  public abstract delete(reg: Register): Promise<void>
}
