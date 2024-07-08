import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { InternalImage } from "@/core/shared/entities/Image"
import { Pagination } from "@/core/shared/entities/Pagination"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const companyId = Number(cxt.params.company_id)
    const pagination = Pagination.fromNextRequest(req)
    const { userId } = AuthToken.getFromNextRequest(req)

    const products = await BRFood.getProductsByCompanyId.handle(companyId, userId, pagination)

    return HttpResponse.from(req).json(
      products.toArray(),
      StatusCodes.OK,
      pagination.getHeaderWithXTotalCount(products),
    )
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)
    const { name, price, extensionImage, imgBase64, profit }: POST.Body = await req.json()

    const products = await BRFood.addProduct.handle({
      authorId: userId,
      name,
      ownerCompanyId: companyId,
      price: new CurrencyValue(price),
      profit: new CurrencyValue(profit),
      coverImage: InternalImage.fromBase64(imgBase64, extensionImage),
    })

    return HttpResponse.from(req).json(products, StatusCodes.CREATED)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    name: string
    price: number
    profit: number
    imgBase64?: string
    extensionImage?: string
  }
}
