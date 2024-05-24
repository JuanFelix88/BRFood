export class CurrencyValue {
  constructor(private readonly intValue: number) {
    if (intValue.toString().includes('.')) {
      throw new Error()
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
    return `R$ ${this.intValue.toFixed(2).replace('.', ',')}`
  }

  public get userView(): string {
    return this.toString()
  }
}
