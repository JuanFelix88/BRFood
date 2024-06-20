import { Usecase } from "@/src/shared/entities/Usecase"
import { CompanyRepository } from "../repositories/company-repository"
import { ProductRepository } from "../repositories/product-repository"
import { CompanyErrors } from "../errors/company"
import { ProductErrors } from "../errors/product"
import { UUID } from "@/src/shared/entities/UUID"
import { AuthErrors } from "../errors/auth"
import { injectable } from "@/src/shared/utils/dependency-injection"

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
