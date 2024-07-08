import { BRFood } from "@/core/infra/main/main"
import { Email } from "@/core/shared/entities/Email"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

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

    return HttpResponse.from(req).json(
      {
        company,
        user,
      },
      StatusCodes.OK,
      headers,
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
