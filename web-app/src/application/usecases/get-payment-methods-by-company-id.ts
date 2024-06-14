import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { CompanyErrors } from "../errors/company"
import { UserErrors } from "../errors/user"

export class GetPaymentMethodsByCompanyId implements Usecase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(
    companyId: number,
    userId: UUID,
  ): Promise<PaymentMethod[]> {
    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(
      companyId,
      userId,
    )

    if (!isUserAuthorized) {
      throw new CompanyErrors.CompanyIsNotAuthorizedError()
    }

    return await this.paymentMethodRepository.getByCompanyId(companyId)
  }
}
