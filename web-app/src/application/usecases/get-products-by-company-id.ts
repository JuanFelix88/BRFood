import { Usecase } from "@/src/shared/entities/Usecase"
import { Product } from "../entities/Product/Product"
import { CompanyErrors } from "../errors/company"
import { ProductRepository } from "../repositories/product-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { AuthErrors } from "../errors/auth"
import { CompanyRepository } from "../repositories/company-repository"

export class GetProductsByCompanyId implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(companyId: number, userId: UUID): Promise<Product[]> {
    if (typeof companyId !== "number" || isNaN(companyId)) {
      throw new CompanyErrors.IdCompanyIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new AuthErrors.InvalidAuthTokenError()
    }

    if (companyId <= 0) {
      throw new CompanyErrors.IdCompanyIsInvalidError()
    }

    const company = await this.companyRepository.get(companyId)

    if (
      !company.authorizedUsersIds.some(
        (authorizedId) => authorizedId.toString() === userId.toString(),
      )
    ) {
      throw new AuthErrors.YouCannotHasAccessToThisCompanyError()
    }

    return await this.productRepository.getByCompanyId(company.id)
  }
}