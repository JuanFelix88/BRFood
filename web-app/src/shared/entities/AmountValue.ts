import { AmountValueErrors } from "@/src/application/errors/amount-value"
import { Serializable } from "./Serializable"

export class AmountValue implements Serializable {
  constructor(private readonly value: number) {
    if (this.value.toString().includes(".")) {
      throw new AmountValueErrors.FloatError(value)
    }

    if (this.value < 0) {
      throw new AmountValueErrors.QuantityError(value)
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
