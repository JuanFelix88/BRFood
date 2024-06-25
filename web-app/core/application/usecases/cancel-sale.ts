import * as Errors from "@/core/application/errors"
import { DateTime } from "@/core/shared/entities/DateTime"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyErrors } from "../errors/company"
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
      throw new Errors.SaleErrors.SaleIdIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    const sale = await this.saleRepository.get(saleId)

    const isAuthorized = await this.companyRepository.isUserAuthorized(sale.ownerCompanyId, userId)

    if (!isAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    if (sale.cancelledAt instanceof DateTime) {
      throw new Errors.SaleErrors.SaleAlreadyCancelledError()
    }

    if (DateTime.now().compareDays(sale.createdAt) > 2) {
      throw new Errors.SaleErrors.NotAllowedCancelSaleTimeLimitExceedError()
    }

    await this.saleRepository.cancel(saleId, userId)
  }
}
