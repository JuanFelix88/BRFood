import { BRFood } from "@/src/infra/main/main"
import { Email } from "@/src/shared/entities"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const { userId: authorId } = AuthToken.getFromNextRequest(req)
    const companyId = Number(cxt.params.company_id)
    const authorizedEmails: POST.Body = await req.json()

    const modifiedCompany = await BRFood.addAuthorizedUsersToCompany.handle(
      companyId,
      authorizedEmails.map((email) => new Email(email)),
      authorId,
    )

    return NextResponse.json(modifiedCompany, { status: StatusCodes.OK })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export type Body = string[]
}
