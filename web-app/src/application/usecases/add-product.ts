import { Usecase } from "@/src/shared/entities/Usecase"
import { ProductRepository } from "../repositories/product-repository"
import { ProductErrors } from "../errors/product"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { InternalImage } from "@/src/shared/entities/Image"
import { CoverImageRepository } from "../repositories/cover-image-repository"

interface AddProductData {
  name: string
  priceInt: number
  imgBase64?: string
  extensionImage?: string
}

export class AddProduct implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly coverImageRepository: CoverImageRepository
  ) {}

  public async handle({
    name,
    priceInt,
    imgBase64,
    extensionImage,
  }: AddProductData): Promise<void> {
    if (name.length === 0 || name.length > 60) {
      throw new ProductErrors.InvalidInputName()
    }

    const price = new CurrencyValue(priceInt)
    const cover =
      imgBase64 && extensionImage
        ? InternalImage.fromBase64(imgBase64, "jpg")
        : undefined

    if (price.isNegative()) {
      throw new ProductErrors.ProductPriceIsNegative(priceInt)
    }

    const coverBucketImg = cover
      ? await this.coverImageRepository.upload(cover)
      : undefined

    await this.productRepository.add({
      name,
      price,
      coverBucketImg,
    })
  }
}
