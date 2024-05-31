import { UUIDErrors } from "@/src/application/errors/uuid"
import { randomUUID } from "crypto"
import { Serializable } from "./Serializable"

export class UUID implements Serializable {
  public static generate(): UUID {
    return new UUID(randomUUID())
  }

  constructor(private readonly value: string) {
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

  public toString(): string {
    return this.value
  }

  public toJSON(): string {
    return this.value
  }
}