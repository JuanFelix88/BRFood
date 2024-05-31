import { Serializable } from "./Serializable"

export class CurrencyValue implements Serializable {
  constructor(private readonly intValue: number) {
    if (typeof intValue !== "number") {
      throw new TypeError(
        "The value informed for currency conversion is incorrect"
      )
    }

    if (intValue.toString().includes(".")) {
      throw new TypeError(
        "The value informed for currency conversion must be an integer"
      )
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

  public get userView(): string {
    return this.toString()
  }

  public toJSON() {
    return this.int
  }
}
