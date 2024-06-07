import { Product } from "@/src/application/entities/Product"
import { AddProduct } from "@/src/application/usecases/add-product"
import { vercelFactory } from "@/src/infra/factories/vercel"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { Email } from "@/src/shared/entities/Email"
import { InternalImage } from "@/src/shared/entities/Image"
import { UUID } from "@/src/shared/entities/UUID"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { NextRequest, NextResponse } from "next/server"

const addProduct = vercelFactory.inject<AddProduct>(AddProduct)

export namespace POST {
  export interface Body {
    name: string
    priceInt: number
    extensionImage?: string
    imgBase64?: string
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json([], { status: 200 })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, priceInt, extensionImage, imgBase64 }: POST.Body =
      await req.json()

    const authToken = AuthToken.getFromNextRequest(req)

    const productCreated = await addProduct.handle({
      name,
      price: new CurrencyValue(priceInt),
      coverImage: imgBase64
        ? new InternalImage(imgBase64, extensionImage)
        : undefined,
      authorId: new UUID(authToken.toJSON()),
    })

    return NextResponse.json({
      id: productCreated.id,
      name: productCreated.name,
      price: productCreated.price,
      profit: productCreated.profit,
      coverImage: productCreated.coverImage,
      createdAt: productCreated.createdAt,
      updatedAt: productCreated.updatedAt,
    } satisfies Product)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
