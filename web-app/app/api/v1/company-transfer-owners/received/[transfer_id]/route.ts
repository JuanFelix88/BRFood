import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, cxt: { params: { transfer_id: string } }) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)
    const transferId = Number(cxt.params.transfer_id)

    const acceptedRequest = await BRFood.acceptCompanyTransferOwner.handle(transferId, userId)

    return NextResponse.json(acceptedRequest, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function DELETE(req: NextRequest, cxt: { params: { transfer_id: string } }) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)
    const transferId = Number(cxt.params.transfer_id)

    const declinedRequest = await BRFood.declineCompanyTransferOwner.handle(transferId, userId)

    return NextResponse.json(declinedRequest, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
