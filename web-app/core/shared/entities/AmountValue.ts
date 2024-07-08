import { AmountValueErrors } from "@/core/application/errors/amount-value"
import { HTTPTransformable } from "../utils"
import { Serializable } from "./Serializable"

@HTTPTransformable()
export class AmountValue implements Serializable {
  constructor(private readonly value: number) {
    if (this.value.toString().includes(".")) {
      throw new AmountValueErrors.FloatError(value)
    }

    if (typeof this.value !== "number") {
      this.value = Number(this.value)
    }

    if (isNaN(this.value)) {
      throw new AmountValueErrors.QuantityErrorError(value)
    }

    if (this.value < 0) {
      throw new AmountValueErrors.InvalidEntryValueError(value)
    }
  }

  public isZero(): boolean {
    return this.value === 0
  }

  public [Symbol.toPrimitive](hint: string) {
    if (hint === "number") {
      return this.value
    }

    return String(this.value)
  }

  public get int(): number {
    return this.value
  }

  public toJSON(): number {
    return this.int
  }
}
