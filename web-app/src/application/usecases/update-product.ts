import { Usecase } from "@/src/shared/entities/Usecase"
import { ProductRepository } from "../repositories/product-repository"
import { Product } from "../entities/Product/Product"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { InternalImage } from "@/src/shared/entities/Image"
import { UUID } from "@/src/shared/entities/UUID"
import { AuthErrors } from "../errors/auth"
import { CompanyErrors } from "../errors/company"
import { ProductErrors } from "../errors/product"
import { CompanyRepository } from "../repositories/company-repository"
import { injectable } from "@/src/shared/utils/dependency-injection"

interface UpdateProductPayload {
  name: string
  price: CurrencyValue
  profit: CurrencyValue
  coverImage?: InternalImage
  authorId: UUID
}

@injectable()
export class UpdateProduct implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async handle(
    productId: number,
    { authorId, name, price, profit, coverImage }: UpdateProductPayload,
  ): Promise<Product> {
    if (name === undefined) {
      throw new ProductErrors.MissingInputName()
    }

    if (typeof name !== "string" || name.length === 0 || name.length > 60) {
      throw new ProductErrors.InvalidInputName()
    }

    if (authorId instanceof UUID === false) {
      throw new AuthErrors.AuthorIdIsMissingError()
    }

    const { ownerCompanyId } = await this.productRepository.get(productId)

    if (price.isNegative()) {
      throw new ProductErrors.ProductPriceIsNegative(price.float)
    }

    if (typeof coverImage !== "undefined") {
      throw new Error("Not implemented coverImage")
    }

    const ownerCompany = await this.companyRepository.get(ownerCompanyId)

    const isAuthorizedInCompany = ownerCompany.authorizedUsersIds.some(
      (id) => id.toString() === authorId.toString(),
    )

    if (!isAuthorizedInCompany) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.productRepository.update(productId, {
      name,
      price: price,
      profit: profit,
      authorId: authorId,
      ownerCompanyId,
    })
  }
}
