import { BRFood } from "@/src/infra/main/main"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  cxt: { params: { company_id: string } },
) {
  try {
    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const paymentMethod = await BRFood.getPaymentMethodsByCompanyId.handle(
      companyId,
      userId,
    )

    return NextResponse.json(paymentMethod, { status: StatusCodes.OK })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(
  req: NextRequest,
  cxt: { params: { company_id: string } },
) {
  try {
    const { name, fee }: POST.Body = await req.json()
    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const paymentMethod = await BRFood.addPaymentMethod.handle({
      name,
      authorId: userId,
      ownerCompanyId: companyId,
      fee: new CurrencyValue(fee),
    })

    return NextResponse.json(paymentMethod, { status: StatusCodes.OK })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    name: string
    fee: number
  }
}
