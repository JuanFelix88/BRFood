import { Usecase } from "@/src/shared/entities/Usecase"
import { CompanyRepository } from "../repositories/company-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { Sale } from "../entities/Sale/Sale"
import { CompanyErrors } from "../errors/company"
import { UserErrors } from "../errors/user"
import { SaleRepository } from "../repositories/sale-repository"
import { ArrayCountAll } from "@/src/shared/entities/ArrayCountAll"
import { Pagination } from "@/src/shared/entities/Pagination"
import { injectable } from "@/src/shared/utils/dependency-injection"

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

    const isAuthorizedUser = await this.companyRepository.isUserAuthorized(
      companyId,
      userId,
    )

    if (!isAuthorizedUser) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.saleRepository.getByCompanyId(
      companyId,
      pagination.offset,
      pagination.limit,
    )
  }
}
