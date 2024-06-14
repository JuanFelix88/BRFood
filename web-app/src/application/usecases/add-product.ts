import { Usecase } from "@/src/shared/entities/Usecase"
import { ProductRepository } from "../repositories/product-repository"
import { ProductErrors } from "../errors/product"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { InternalImage } from "@/src/shared/entities/Image"
import { CoverImageRepository } from "../repositories/cover-image-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { AuthErrors } from "../errors/auth"
import { UserRepository } from "../repositories/user-repository"
import { Product } from "../entities/Product/Product"
import { CompanyRepository } from "../repositories/company-repository"
import { CompanyErrors } from "../errors/company"

interface AddProductPayload {
  name: string
  price: CurrencyValue
  profit: CurrencyValue
  ownerCompanyId: number
  coverImage?: InternalImage
  authorId: UUID
}

export class AddProduct implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly coverImageRepository: CoverImageRepository,
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async handle({
    authorId,
    name,
    price,
    ownerCompanyId,
    profit,
    coverImage,
  }: AddProductPayload): Promise<Product> {
    if (name === undefined) {
      throw new ProductErrors.MissingInputName()
    }

    if (typeof name !== "string" || name.length === 0 || name.length > 60) {
      throw new ProductErrors.InvalidInputName()
    }

    if (typeof ownerCompanyId !== "number" || isNaN(ownerCompanyId)) {
      throw new ProductErrors.MissingOwnerCompanyId()
    }

    if (!(await this.userRepository.exists(authorId))) {
      throw new AuthErrors.UserNotFoundError()
    }

    if (price.isNegative()) {
      throw new ProductErrors.ProductPriceIsNegative(price.float)
    }

    const ownerCompany = await this.companyRepository.get(ownerCompanyId)

    const authorIsFoundedInAuthorizedList =
      ownerCompany.authorizedUsersIds.some(
        (id) => id.toString() === authorId.toString(),
      )

    if (!authorIsFoundedInAuthorizedList) {
      throw new CompanyErrors.CompanyIsNotAuthorizedError()
    }

    const coverBucketImg =
      coverImage !== undefined
        ? await this.coverImageRepository.upload(coverImage)
        : undefined

    return await this.productRepository.add({
      name,
      authorId,
      ownerCompanyId: ownerCompany.id,
      price,
      profit,
      coverBucketImg,
    })
  }
}
