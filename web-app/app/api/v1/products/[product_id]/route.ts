import type { POST } from "@/app/api/v1/companies/[company_id]/products/route"
import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { InternalImage } from "@/core/shared/entities/Image"
import { IntlMessage } from "@/core/shared/entities/IntlMessage"
import { Lang } from "@/core/shared/intl/lang"
import { PrefLang } from "@/core/shared/intl/pref-lang"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { product_id: string } }) {
  try {
    const productId = Number(cxt.params.product_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const product = await BRFood.getProductById.handle(productId, userId)

    return NextResponse.json(product)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function PUT(req: NextRequest, cxt: { params: { product_id: string } }) {
  try {
    const { name, price, profit, extensionImage, imgBase64 }: PUT.Body = await req.json()

    const productId = Number(cxt.params.product_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const product = await BRFood.updateProduct.handle(productId, {
      name,
      price: new CurrencyValue(price),
      profit: new CurrencyValue(profit),
      authorId: userId,
      coverImage: InternalImage.fromBase64(imgBase64, extensionImage),
    })

    return NextResponse.json(product, {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function DELETE(req: NextRequest, cxt: { params: { product_id: string } }) {
  try {
    const productId = Number(cxt.params.product_id)
    const { userId } = AuthToken.getFromNextRequest(req)
    const langpref = PrefLang.getFromRequest(req)

    await BRFood.deleteProductById.handle(productId, userId)

    const message = new IntlMessage({
      [Lang.EN]: "Product deleted successfully",
      [Lang.PT_BR]: "Produto excluído com sucesso",
    })

    return NextResponse.json(langpref.messageFromIntlMessage(message), {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace PUT {
  export type Body = POST.Body
}
