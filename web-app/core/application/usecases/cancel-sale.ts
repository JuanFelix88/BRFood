import { DateTime } from "@/core/shared/entities/DateTime"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyErrors } from "../errors/company"
import { SaleErrors } from "../errors/sale"
import { UserErrors } from "../errors/user"
import { CompanyRepository } from "../repositories/company-repository"
import { SaleRepository } from "../repositories/sale-repository"

@injectable()
export class CancelSale implements Usecase {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(saleId: number, userId: UUID): Promise<void> {
    if (!Number.isInteger(saleId)) {
      throw new SaleErrors.SaleIdIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const sale = await this.saleRepository.get(saleId)

    const isAuthorized = await this.companyRepository.isUserAuthorized(sale.ownerCompanyId, userId)

    if (!isAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    if (sale.cancelledAt instanceof DateTime) {
      throw new SaleErrors.SaleAlreadyCancelledError()
    }

    await this.saleRepository.cancel(saleId, userId)
  }
}
