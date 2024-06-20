import { BRFood } from "@/src/infra/main/main"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, cxt: {}) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)

    const pendingRequestTransfers =
      await BRFood.getUserPendingCompanyOwnerTransferReceived.handle(userId)

    return NextResponse.json(pendingRequestTransfers, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
