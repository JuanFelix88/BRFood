import { EmailErrors } from "@/core/application/errors/email"
import { Serializable } from "./Serializable"

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

export class Email implements Serializable {
  constructor(private readonly value: string) {
    this.value = this.value.toLowerCase()
    if (!EMAIL_REGEX.test(this.value)) {
      throw new EmailErrors.InvalidEmailError()
    }
  }

  public get emailName(): string {
    return this.value.split("@")[0]
  }

  public get emailDomain(): string {
    return this.value.split("@")[1]
  }

  public get complete(): string {
    return this.value.toString()
  }

  public toJSON(): string {
    return this.value
  }
}
