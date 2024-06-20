import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { CompanyErrors } from "../errors/company"
import { UserErrors } from "../errors/user"
import { Pagination } from "@/src/shared/entities/Pagination"
import { ArrayCountAll } from "@/src/shared/entities/ArrayCountAll"
import { injectable } from "@/src/shared/utils/dependency-injection"

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

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(
      companyId,
      userId,
    )

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
