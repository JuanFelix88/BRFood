import { SignUpUser } from "@/src/application/usecases/signup-user"
import { vercelFactory } from "@/src/infra/factories/vercel"
import { Email } from "@/src/shared/entities/Email"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { NextRequest, NextResponse } from "next/server"

const singUpUser = vercelFactory.inject<SignUpUser>(SignUpUser)

namespace POST {
  export interface Body {
    email: string
    password: string
    confirmPassword: string
    name: string
    companyName: string
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password, companyName, confirmPassword, name }: POST.Body =
      await req.json()

    const { authToken, company, user } = await singUpUser.handle({
      email: new Email(email),
      password,
      companyName,
      confirmPassword,
      name,
    })

    return NextResponse.json(
      {
        token: authToken,
        company,
        user,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
