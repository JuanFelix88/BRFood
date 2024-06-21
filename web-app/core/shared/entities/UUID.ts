import { UUIDErrors } from "@/core/application/errors/uuid"
import { randomUUID } from "crypto"
import { Serializable } from "./Serializable"

export class UUID implements Serializable {
  public static generate(): UUID {
    return new UUID(randomUUID())
  }

  constructor(private readonly value: string) {
    if (typeof value !== "string") {
      throw new UUIDErrors.InvalidUUID()
    }

    if (value.startsWith(`"`) || value.endsWith(`"`)) {
      throw new UUIDErrors.IdIsMalformedUUIDError()
    }

    if (!this.value) {
      throw new UUIDErrors.IdIsMissingInUUIDConvertion()
    }

    if (this.value.length <= 10) {
      throw new UUIDErrors.InvalidUUID()
    }
  }

  public [Symbol.toPrimitive](): string {
    return this.value
  }

  public isEqual(otherValue: UUID | string): boolean {
    if (otherValue instanceof UUID) {
      return this.value === otherValue.value
    }

    if (typeof otherValue === "string") {
      return this.value === otherValue
    }

    return false
  }

  public toString(): string {
    return this.value
  }

  public toJSON(): string {
    return this.value
  }
}
