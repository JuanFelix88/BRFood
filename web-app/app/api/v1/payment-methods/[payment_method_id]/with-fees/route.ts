import { BRFood } from "@/src/infra/main/main"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { payment_method_id: string } }) {
  try {
    const paymentMethodId = Number(cxt.params.payment_method_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const paymentMethodWithFees = await BRFood.getPaymentMethodWithFees.handle(
      paymentMethodId,
      userId,
    )

    return NextResponse.json(paymentMethodWithFees, { status: StatusCodes.OK })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
