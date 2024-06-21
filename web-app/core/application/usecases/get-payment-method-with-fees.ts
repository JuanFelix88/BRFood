import * as Errors from "@/core/application/errors"
import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { PaymentMethodWithFees } from "../entities/PaymentMethod"
import { CompanyRepository, PaymentMethodWithFeesRepository } from "../repositories"

@injectable()
export class GetPaymentMethodWithFees implements Usecase {
  constructor(
    private readonly paymentMethodWithFeesRepository: PaymentMethodWithFeesRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(paymentMethodId: number, authorId: UUID): Promise<PaymentMethodWithFees> {
    if (!Number.isInteger(paymentMethodId)) {
      throw new Errors.PaymentMethodWithFeesErrors.PaymentMethodIdIsMissingError()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    const paymentMethodWithFees = await this.paymentMethodWithFeesRepository.get(paymentMethodId)

    const { ownerCompanyId } = paymentMethodWithFees

    const isUserAuthorized = this.companyRepository.isUserAuthorized(ownerCompanyId, authorId)

    if (!isUserAuthorized) {
      throw new Errors.CompanyErrors.IsNotAuthorizedError()
    }

    return paymentMethodWithFees
  }
}
