import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { SaleErrors } from "../errors/sale"
import { UserErrors } from "../errors/user"
import { SaleRepository } from "../repositories/sale-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { CompanyErrors } from "../errors/company"
import { DateTime } from "@/src/shared/entities/DateTime"
import { injectable } from "@/src/shared/utils/dependency-injection"

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

    const isAuthorized = await this.companyRepository.isUserAuthorized(
      sale.ownerCompanyId,
      userId,
    )

    if (!isAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    if (sale.cancelledAt instanceof DateTime) {
      throw new SaleErrors.SaleAlreadyCancelledError()
    }

    await this.saleRepository.cancel(saleId, userId)
  }
}
