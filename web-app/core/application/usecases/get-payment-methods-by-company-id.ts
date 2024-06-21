import { ArrayCountAll } from "@/core/shared/entities/ArrayCountAll"
import { Pagination } from "@/core/shared/entities/Pagination"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { CompanyErrors } from "../errors/company"
import { UserErrors } from "../errors/user"
import { CompanyRepository } from "../repositories/company-repository"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"

@injectable()
export class GetPaymentMethodsByCompanyId implements Usecase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(
    companyId: number,
    userId: UUID,
    pagination: Pagination,
  ): Promise<ArrayCountAll<PaymentMethod>> {
    pagination.throws.ifLimitIsGreaterThan(50)

    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(companyId, userId)

    if (!isUserAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.paymentMethodRepository.getByCompanyId(
      companyId,
      pagination.offset,
      pagination.limit,
    )
  }
}
