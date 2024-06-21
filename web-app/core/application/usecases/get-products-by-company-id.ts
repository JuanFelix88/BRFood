import { ArrayCountAll } from "@/core/shared/entities/ArrayCountAll"
import { Pagination } from "@/core/shared/entities/Pagination"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Product } from "../entities/Product/Product"
import { AuthErrors } from "../errors/auth"
import { CompanyErrors } from "../errors/company"
import { CompanyRepository } from "../repositories/company-repository"
import { ProductRepository } from "../repositories/product-repository"

@injectable()
export class GetProductsByCompanyId implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(
    companyId: number,
    userId: UUID,
    pagination: Pagination,
  ): Promise<ArrayCountAll<Product>> {
    pagination.throws.ifLimitIsGreaterThan(50)

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

    return await this.productRepository.getByCompanyId(
      company.id,
      pagination.offset,
      pagination.limit,
    )
  }
}
