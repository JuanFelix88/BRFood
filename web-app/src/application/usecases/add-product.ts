import { Usecase } from "@/src/shared/entities/Usecase"
import { ProductRepository } from "../repositories/product-repository"
import { ProductErrors } from "../errors/product"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { InternalImage } from "@/src/shared/entities/Image"
import { CoverImageRepository } from "../repositories/cover-image-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { AuthErrors } from "../errors/auth"
import { UserRepository } from "../repositories/user-repository"
import { Product } from "../entities/Product"

interface AddProductData {
  name: string
  price: CurrencyValue
  coverImage?: InternalImage
  authorId: UUID
}

export class AddProduct implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly coverImageRepository: CoverImageRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async handle({
    authorId,
    name,
    price,
    coverImage,
  }: AddProductData): Promise<Product> {
    if (name === undefined) {
      throw new ProductErrors.MissingInputName()
    }

    if (name.length === 0 || name.length > 60) {
      throw new ProductErrors.InvalidInputName()
    }

    if (!(await this.userRepository.exists(authorId))) {
      throw new AuthErrors.UserNotFoundError()
    }

    if (price.isNegative()) {
      throw new ProductErrors.ProductPriceIsNegative(price.float)
    }

    const {
      id,
      createdAt,
      coverImage: coverImageBucket,
    } = await this.productRepository.add({
      name,
      price,
      coverBucketImg:
        coverImage !== undefined
          ? await this.coverImageRepository.upload(coverImage)
          : undefined,
    })

    return {
      id,
      name,
      price,
      coverImage: coverImageBucket,
      profit: price,
      updatedAt: createdAt,
      createdAt,
    }
  }
}
