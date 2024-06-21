import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyErrors } from "../errors/company"
import { PaymentMethodErrors } from "../errors/payment-method"
import { CompanyRepository } from "../repositories/company-repository"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"

@injectable()
export class DeletePaymentMethodById implements Usecase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(paymentMethodId: number, userId: UUID): Promise<void> {
    if (typeof paymentMethodId !== "number" || isNaN(paymentMethodId)) {
      throw new PaymentMethodErrors.IdPaymentMethodIsInvalidOrNotFoundError()
    }

    const { ownerCompanyId } = await this.paymentMethodRepository.get(paymentMethodId)

    const isAuthorizedInCompany = await this.companyRepository.isUserAuthorized(
      ownerCompanyId,
      userId,
    )

    if (!isAuthorizedInCompany) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    await this.paymentMethodRepository.delete(paymentMethodId)
  }
}
