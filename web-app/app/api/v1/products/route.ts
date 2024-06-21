import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { InternalImage } from "@/core/shared/entities/Image"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const authToken = AuthToken.getFromNextRequest(req)

    const listProducts = await BRFood.getProductsByUserId.handle(authToken.userId)
    return NextResponse.json(listProducts, {
      status: 200,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, price, extensionImage, imgBase64, ownerCompanyId }: POST.Body = await req.json()

    const authToken = AuthToken.getFromNextRequest(req)

    const productCreated = await BRFood.addProduct.handle({
      name,
      price: new CurrencyValue(price),
      coverImage: imgBase64 ? new InternalImage(imgBase64, extensionImage) : undefined,
      authorId: authToken.userId,
      ownerCompanyId: ownerCompanyId,
      profit: new CurrencyValue(0),
    })

    return NextResponse.json(productCreated)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export interface Body {
    name: string
    price: number
    extensionImage?: string
    imgBase64?: string
    ownerCompanyId: number
  }
}
