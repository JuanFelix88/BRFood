import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { CompanyErrors } from "../errors/company"
import { PaymentMethodErrors } from "../errors/payment-method"
import { UserErrors } from "../errors/user"
import { CompanyRepository } from "../repositories/company-repository"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"

interface AddPaymentMethodPayload {
  name: string
  ownerCompanyId: number
  authorId: UUID
  fee: CurrencyValue
}

@injectable()
export class AddPaymentMethod implements Usecase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async handle({
    authorId,
    ownerCompanyId,
    fee,
    name,
  }: AddPaymentMethodPayload): Promise<PaymentMethod> {
    if (authorId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    if (typeof ownerCompanyId !== "number" || isNaN(ownerCompanyId)) {
      throw new CompanyErrors.IdCompanyIsMissingError()
    }

    if (fee.isNegative()) {
      throw new PaymentMethodErrors.FeeIsInvalidError()
    }

    if (!(await this.companyRepository.isUserAuthorized(ownerCompanyId, authorId))) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.paymentMethodRepository.add({
      name,
      fee,
      ownerCompanyId,
      authorId,
    })
  }
}
