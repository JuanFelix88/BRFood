import { AuthErrors } from "@/src/application/errors/auth"
import { NextRequest } from "next/server"

export class AuthToken {
  public static hasTokenNextRequest(req: NextRequest) {
    return req.headers.get("Authorization") !== null
  }

  public static getFromNextRequest(req: NextRequest) {
    if (req.signal) {
      return new AuthToken("usadhasdhasd")
    }

    const token = req.headers.get("Authorization")
    if (token === null) {
      throw new AuthErrors.GetNextResponseAuthTokenError()
    }

    return new AuthToken(token)
  }

  constructor(private readonly value: string) {}

  public [Symbol.toPrimitive](hint: string) {
    if (hint === "string") {
      return this.value
    }

    return this.value.length
  }

  public toJSON() {
    return this.value
  }

  public toString() {
    return this.value
  }
}
