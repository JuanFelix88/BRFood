import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Pagination } from "@/core/shared/entities/Pagination"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)
    const pagination = Pagination.fromNextRequest(req)

    const paymentMethods = await BRFood.getPaymentMethodsByCompanyId.handle(
      companyId,
      userId,
      pagination,
    )

    return NextResponse.json(paymentMethods, {
      status: StatusCodes.OK,
      headers: pagination.getHeaderWithXTotalCount(paymentMethods),
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest, cxt: { params: { company_id: string } }) {
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
