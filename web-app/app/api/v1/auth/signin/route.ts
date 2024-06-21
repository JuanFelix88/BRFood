import { BRFood } from "@/core/infra/main/main"
import { Email } from "@/core/shared/entities/Email"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, password }: POST.Body = await req.json()

    const authToken = await BRFood.signinUser.handle(new Email(email), password)

    const headers = authToken.createResponseHeaders()
    const user = await BRFood.getUserById.handle(authToken.userId)

    return NextResponse.json(
      {
        user,
      },
      { status: StatusCodes.OK, headers },
    )
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    email: string
    password: string
  }
}
