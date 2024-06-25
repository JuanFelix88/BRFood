import { BRFood } from "@/core/infra/main/main"
import { AmountValue } from "@/core/shared/entities/AmountValue"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Pagination } from "@/core/shared/entities/Pagination"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const pagination = Pagination.fromNextRequest(req)
    const { userId } = AuthToken.getFromNextRequest(req)
    const companyId = Number(cxt.params.company_id)

    const sales = await BRFood.getCompanySales.handle(companyId, userId, pagination)

    return NextResponse.json(sales, {
      status: StatusCodes.OK,
      headers: pagination.getHeaderWithXTotalCount(sales),
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const { payments, products, note } = POST.bodySchema.parse(await req.json())

    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const sale = await BRFood.addSale.handle({
      authorId: userId,
      companyId,
      payments,
      products,
      note,
    })

    return NextResponse.json(sale, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    console.log(error)
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export const bodySchema = z
    .object({
      payments: z.array(
        z.union([
          z.object({
            paymentMethodId: z.number().nonnegative(),
            paymentMethodValue: z.number().transform((v) => new CurrencyValue(v)),
          }),
          z.object({
            paymentMethodId: z.number().nonnegative(),
            paymentMethodValue: z.number().transform((v) => new CurrencyValue(v)),
            clientId: z.number().nonnegative(),
          }),
          z.object({
            paymentCreditValue: z.number().transform((v) => new CurrencyValue(v)),
            clientId: z.number(),
          }),
        ]),
      ),
      products: z.array(
        z.object({
          productId: z.number().nonnegative().int(),
          amount: z
            .number()
            .int()
            .transform((v) => new AmountValue(v)),
        }),
      ),
      note: z.string().optional(),
    })
    .strict()

  export type Body = z.input<typeof bodySchema>
}
