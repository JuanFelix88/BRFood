import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { AuthErrors } from "../errors/auth"
import { ProductErrors } from "../errors/product"
import { CompanyRepository } from "../repositories/company-repository"
import { ProductRepository } from "../repositories/product-repository"

@injectable()
export class GetProductById implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async handle(productId: number, userId: UUID): Promise<unknown> {
    if (typeof productId !== "number" || isNaN(productId)) {
      throw new ProductErrors.IdProductIsMissingError()
    }

    const { ownerCompanyId } = await this.productRepository.get(productId)

    const ownerCompany = await this.companyRepository.get(ownerCompanyId)

    const isUserAuthorized = ownerCompany.authorizedUsersIds.some(
      (authorizedId) => authorizedId.toString() === userId.toString(),
    )

    if (!isUserAuthorized) {
      throw new AuthErrors.YouCannotHasAccessToThisCompanyError()
    }

    const [product] = await this.productRepository.getByIds([{ productId }])

    if (!product) {
      throw new ProductErrors.ProductNotFound()
    }

    return product
  }
}
