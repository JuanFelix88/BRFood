import { StaticClass } from "./static-class"

export class StringValidation extends StaticClass {
  public static is(str: unknown, minLength: number, maxLength: number = 999): boolean {
    if (typeof str !== "string") return false

    return str.length >= minLength && str.length <= maxLength
  }

  public static notIs(str: unknown, minLength: number, maxLength: number = 999): boolean {
    return !this.is(str, minLength, maxLength)
  }
}
