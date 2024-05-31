import { SignInUser } from "@/src/application/usecases/signin-user"
import { vercelFactory } from "@/src/infra/factories/vercel"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { NextRequest, NextResponse } from "next/server"

const signInUser = vercelFactory.inject<SignInUser>(SignInUser)

namespace POST {
  export interface Body {
    email: string
    password: string
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password }: POST.Body = await req.json()

    const authToken = await signInUser.handle(email, password)

    return NextResponse.json(
      { token: authToken.toJson() },
      {
        status: 200,
      }
    )
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
