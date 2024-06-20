import { DateTime } from "@/src/shared/entities/DateTime"
import { Usecase } from "@/src/shared/entities/Usecase"
import { ProductRepository } from "../repositories/product-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { CompanyErrors } from "../errors/company"
import { ProductErrors } from "../errors/product"
import { AuthErrors } from "../errors/auth"
import { injectable } from "@/src/shared/utils/dependency-injection"

@injectable()
export class DeleteProductById implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async handle(productId: number, userId: UUID): Promise<void> {
    if (typeof productId !== "number" || isNaN(productId)) {
      throw new ProductErrors.IdProductIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new AuthErrors.AuthorIdIsMissingError()
    }

    const { ownerCompanyId } = await this.productRepository.get(productId)

    const ownerCompany = await this.companyRepository.get(ownerCompanyId)

    const isAuthorizedInCompany = ownerCompany.authorizedUsersIds.some(
      (authId) => authId.isEqual(userId),
    )

    if (!isAuthorizedInCompany) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    await this.productRepository.delete(productId)
  }
}
