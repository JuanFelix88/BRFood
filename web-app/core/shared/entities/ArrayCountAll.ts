import { StaticClass } from "../utils/static-class"

/**
 * ### Array With Count All
 * This class is important to have a database return standard
 * with the Count reference of all lines, for pagination.
 * @public
 */
export class ArrayCA<T> extends StaticClass {
  public static is(target: any): target is ArrayCA<any> {
    return target instanceof ArrayCA
  }

  public static fromArray<B extends any[]>(list: B, countTotal: number): ArrayCA<B[0]> {
    return new ArrayCA(list, countTotal)
  }

  public static countAll(rows: { full_count: number }[]): number {
    return rows[0]?.full_count || 0
  }

  private constructor(
    private readonly list: T[],
    private readonly countTotal: number,
  ) {
    super()

    if (!Array.isArray(this.list)) {
      throw new Error("CountableList error: list must be an array")
    }
  }

  public total(): number {
    return this.countTotal
  }

  public toArray(): T[] {
    return this.list
  }
}
