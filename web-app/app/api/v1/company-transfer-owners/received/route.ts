import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, cxt: {}) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)

    const pendingRequestTransfers =
      await BRFood.getUserPendingCompanyOwnerTransferReceived.handle(userId)

    return HttpResponse.from(req).json(pendingRequestTransfers, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
