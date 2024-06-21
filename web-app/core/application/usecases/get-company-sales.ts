import { ArrayCountAll } from "@/core/shared/entities/ArrayCountAll"
import { Pagination } from "@/core/shared/entities/Pagination"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Sale } from "../entities/Sale/Sale"
import { CompanyErrors } from "../errors/company"
import { UserErrors } from "../errors/user"
import { CompanyRepository } from "../repositories/company-repository"
import { SaleRepository } from "../repositories/sale-repository"

@injectable()
export class GetCompanySales implements Usecase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly saleRepository: SaleRepository,
  ) {}
  public async handle(
    companyId: number,
    userId: UUID,
    pagination: Pagination,
  ): Promise<ArrayCountAll<Sale>> {
    pagination.throws.ifLimitIsGreaterThan(100)

    if (!Number.isInteger(companyId)) {
      throw new CompanyErrors.IdCompanyIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const isAuthorizedUser = await this.companyRepository.isUserAuthorized(companyId, userId)

    if (!isAuthorizedUser) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.saleRepository.getByCompanyId(companyId, pagination.offset, pagination.limit)
  }
}
