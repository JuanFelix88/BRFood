import { BRFood } from "@/core/infra/main/main"
import { Email } from "@/core/shared/entities"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)

    const company = await BRFood.getCompaniesByUser.handle(userId)

    return NextResponse.json(company, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)
    const { authorizedEmails, companyName }: POST.Body = await req.json()

    const newCompany = await BRFood.addCompany.handle(
      {
        authorizedEmails: authorizedEmails.map((email) => new Email(email)),
        name: companyName,
      },
      userId,
    )

    return NextResponse.json(newCompany, { status: StatusCodes.CREATED })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    companyName: string
    authorizedEmails: string[]
  }
}
