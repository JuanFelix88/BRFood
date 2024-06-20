import { Usecase } from "@/src/shared/entities/Usecase"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { PaymentMethodErrors } from "../errors/payment-method"
import { UUID } from "@/src/shared/entities/UUID"
import { CompanyRepository } from "../repositories/company-repository"
import { CompanyErrors } from "../errors/company"
import { injectable } from "@/src/shared/utils/dependency-injection"

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

    const { ownerCompanyId } =
      await this.paymentMethodRepository.get(paymentMethodId)

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
