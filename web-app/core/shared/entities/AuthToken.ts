import { AuthErrors } from "@/core/application/errors/auth"
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"
import { StaticClass } from "../utils/static-class"
import { UUID } from "./UUID"

export namespace AuthToken {
  export type DecodedToken = {
    aud: "authenticated"
    exp: number
    sub: string
    email: string
    phone: string
    app_metadata: {
      provider: string
      providers: string[]
    }
    user_metadata: { id: string }
    role: "authenticated"
    aal: "aal1"
  }
}

export class AuthToken extends StaticClass {
  public static readonly HEADER_NAME = "X-Auth-Token"

  public static hasTokenNextRequest(req: NextRequest) {
    return req.headers.get(AuthToken.HEADER_NAME) !== null
  }

  public static getFromNextRequest(req: NextRequest) {
    const token = req.headers.get(AuthToken.HEADER_NAME)

    if (token === null) {
      throw new AuthErrors.GetNextResponseAuthTokenError()
    }

    return new AuthToken(token)
  }

  public readonly userId: UUID

  constructor(private readonly value: string) {
    super()

    if (!process.env.JWT_SECRET) {
      throw new AuthErrors.MissingJwtSecretError()
    }

    let id: string | null = null

    try {
      const decoded = jwt.verify(this.value, process.env.JWT_SECRET) as AuthToken.DecodedToken

      id = decoded.sub
    } catch {
      throw new AuthErrors.ParsingJwtError()
    }

    if (typeof id !== "string") {
      throw new AuthErrors.InvalidAuthTokenError()
    }

    this.userId = new UUID(id)
  }

  public [Symbol.toPrimitive](hint: string) {
    if (hint === "string") {
      return this.value
    }

    return this.value.length
  }

  public applyToHeader(headers: Headers) {
    headers.set(AuthToken.HEADER_NAME, this.value)
  }

  public createResponseHeaders(): Headers {
    const headers = new Headers()

    this.applyToHeader(headers)

    return headers
  }

  public toJSON() {
    return this.value
  }

  public toString() {
    return this.value
  }
}
