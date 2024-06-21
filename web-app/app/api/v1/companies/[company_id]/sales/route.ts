import { BRFood } from "@/src/infra/main/main"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { Pagination } from "@/src/shared/entities/Pagination"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  cxt: { params: { company_id: string } },
) {
  try {
    const pagination = Pagination.fromNextRequest(req)
    const { userId } = AuthToken.getFromNextRequest(req)
    const companyId = Number(cxt.params.company_id)

    const sales = await BRFood.getCompanySales.handle(
      companyId,
      userId,
      pagination,
    )

    return NextResponse.json(sales, {
      status: StatusCodes.OK,
      headers: pagination.getHeaderWithXTotalCount(sales),
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(
  req: NextRequest,
  cxt: { params: { company_id: string } },
) {
  try {
    const { paymentMethods, products, note }: POST.Body = await req.json()
    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const sale = await BRFood.addSale.handle({
      authorId: userId,
      companyId,
      paymentMethods: paymentMethods.map(({ paymentMethodId, value }) => ({
        paymentMethodId: paymentMethodId,
        value: new CurrencyValue(value),
      })),
      products: products.map(({ amount, productId }) => ({
        amount: new AmountValue(amount),
        productId,
      })),
      note,
    })

    return NextResponse.json(sale, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    paymentMethods: {
      paymentMethodId: number
      value: number
    }[]
    products: {
      productId: number
      amount: number
    }[]
    note?: string
  }
}