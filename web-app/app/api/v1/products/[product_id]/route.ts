import { BRFood } from "@/src/infra/main/main"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { NextRequest, NextResponse } from "next/server"
import type { POST } from "@/app/api/v1/companies/[company_id]/products/route"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { InternalImage } from "@/src/shared/entities/Image"
import { StatusCodes } from "http-status-codes"
import { PrefLang } from "@/src/shared/intl/pref-lang"
import { IntlMessage } from "@/src/shared/entities/IntlMessage"
import { Lang } from "@/src/shared/intl/lang"

export async function GET(
  req: NextRequest,
  cxt: { params: { product_id: string } },
) {
  try {
    const productId = Number(cxt.params.product_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const product = await BRFood.getProductById.handle(productId, userId)

    return NextResponse.json(product)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function PUT(
  req: NextRequest,
  cxt: { params: { product_id: string } },
) {
  try {
    const { name, price, profit, extensionImage, imgBase64 }: PUT.Body =
      await req.json()

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

export async function DELETE(
  req: NextRequest,
  cxt: { params: { product_id: string } },
) {
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
