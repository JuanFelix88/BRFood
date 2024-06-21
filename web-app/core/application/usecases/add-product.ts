import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { InternalImage } from "@/core/shared/entities/Image"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Product } from "../entities/Product/Product"
import { AuthErrors } from "../errors/auth"
import { CompanyErrors } from "../errors/company"
import { ProductErrors } from "../errors/product"
import { CompanyRepository } from "../repositories/company-repository"
import { CoverImageRepository } from "../repositories/cover-image-repository"
import { ProductRepository } from "../repositories/product-repository"
import { UserRepository } from "../repositories/user-repository"

interface AddProductPayload {
  name: string
  price: CurrencyValue
  profit: CurrencyValue
  ownerCompanyId: number
  coverImage?: InternalImage
  authorId: UUID
}

@injectable()
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

    const authorIsFoundedInAuthorizedList = ownerCompany.authorizedUsersIds.some(
      (id) => id.toString() === authorId.toString(),
    )

    if (!authorIsFoundedInAuthorizedList) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    const coverBucketImg =
      coverImage !== undefined ? await this.coverImageRepository.upload(coverImage) : undefined

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
