import { BRFood } from "@/src/infra/main/main"
import { Email } from "@/src/shared/entities"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: NextRequest,
  cxt: { params: { company_id: string; owner_email: string } },
) {
  try {
    const companyId = Number(cxt.params.company_id)
    const toUserEmail = new Email(cxt.params.owner_email)
    const { userId } = AuthToken.getFromNextRequest(req)

    const requestTransfer = await BRFood.requestUpdateOwnerCompany.handle(
      companyId,
      toUserEmail,
      userId,
    )

    return NextResponse.json(requestTransfer, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
