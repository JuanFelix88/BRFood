import { StaticClass } from "../utils/static-class"

/**
 * This class is important to have a database return standard
 * with the Count reference of all lines, for pagination.
 * @public
 */
export class ArrayCountAll<T> extends StaticClass {
  public static is(target: any): target is ArrayCountAll<any> {
    return target instanceof ArrayCountAll
  }

  public static fromArray<B extends any[]>(
    list: B,
    countTotal: number,
  ): ArrayCountAll<B[0]> {
    return new ArrayCountAll(list, countTotal)
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

  public toJSON() {
    return this.list
  }

  public toArray(): T[] {
    return this.list
  }
}
