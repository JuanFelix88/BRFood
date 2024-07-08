import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { payment_method_id: string } }) {
  try {
    const paymentMethodId = Number(cxt.params.payment_method_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const paymentMethodWithFees = await BRFood.getPaymentMethodWithFees.handle(
      paymentMethodId,
      userId,
    )

    return HttpResponse.from(req).json(paymentMethodWithFees, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
