import { BRFood } from "@/core/infra/main/main"
import { Email } from "@/core/shared/entities/Email"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, password, companyName, confirmPassword, name }: POST.Body = await req.json()

    const {
      authToken: token,
      company,
      user,
    } = await BRFood.signupUser.handle({
      email: new Email(email),
      password,
      companyName,
      confirmPassword,
      name,
    })

    const headers = token.createResponseHeaders()

    return NextResponse.json(
      {
        company,
        user,
      },
      {
        status: StatusCodes.OK,
        headers,
      },
    )
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    email: string
    password: string
    confirmPassword: string
    name: string
    companyName?: string
  }
}
