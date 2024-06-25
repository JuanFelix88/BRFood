import { StaticClass } from "../utils/static-class"
import { Serializable } from "./Serializable"

type FromDBType<T extends Date | string | null | undefined> = T extends Date
  ? DateTime
  : T extends string
    ? DateTime
    : undefined

export class DateTime extends StaticClass implements Serializable {
  protected formatter = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  })

  constructor(private value: number) {
    super()
  }

  public static fromDBType<T extends Date | string | null | undefined>(date: T): FromDBType<T> {
    if (!date) {
      return undefined as FromDBType<T>
    }

    if (typeof date === "string") {
      return new DateTime(Date.parse(date).valueOf()) as FromDBType<T>
    }

    return this.fromDate(date) as FromDBType<T>
  }

  public static fromDate(date: Date): DateTime {
    return new DateTime(date.valueOf())
  }

  public static fromIso(isoString: string): DateTime {
    return new DateTime(Date.parse(isoString).valueOf())
  }

  public static now(): DateTime {
    return new DateTime(Date.now())
  }

  public compareDays(other: DateTime): number {
    return Math.floor((this.value - other.value) / (1_000 * 60 * 60 * 24))
  }

  public get iso(): string {
    return new Date(this.value).toISOString()
  }

  public toString(): string {
    return this.formatter.format(new Date(this.value)).replaceAll(",", "")
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "number") {
      return this.value
    }

    return this.toString()
  }

  public toJSON(): string {
    return this.iso
  }
}
