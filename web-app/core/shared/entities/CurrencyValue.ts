import { Serializable } from "./Serializable"

export class CurrencyValue implements Serializable {
  constructor(private readonly intValue: number) {
    if (typeof this.intValue === "string") {
      this.intValue = parseInt(this.intValue)
    }

    if (isNaN(this.intValue)) {
      throw new TypeError("The value informed for currency conversion is incorrect")
    }

    if (typeof this.intValue !== "number") {
      throw new TypeError("The value informed for currency conversion is incorrect")
    }

    if (this.intValue.toString().includes(".")) {
      throw new TypeError("The value informed for currency conversion must be an integer")
    }
  }

  public isNegative(): boolean {
    return this.intValue < 0
  }

  /**
   * ### Int value
   * Use for operations.
   */
  public get int(): number {
    return this.intValue
  }

  /**
   * ### Float value
   * Don't use for operations.
   */
  public get float(): number {
    return this.intValue / 100
  }

  /**
   * ### User view text
   * @example "R$ 1.000,00"
   */
  public toString(): string {
    return `R$ ${this.intValue.toFixed(2).replace(".", ",")}`
  }

  public isEqual(otherValue: CurrencyValue | string | number): boolean {
    if (otherValue instanceof CurrencyValue) {
      return this.int === otherValue.int
    }

    if (typeof otherValue === "string") {
      return this.int === parseInt(otherValue)
    }

    if (typeof otherValue === "number") {
      return this.int === otherValue
    }

    return false
  }

  public get userView(): string {
    return this.toString()
  }

  public toJSON() {
    return this.int
  }
}
