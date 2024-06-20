import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { UserErrors } from "../errors/user"
import { CompanyErrors } from "../errors/company"
import { PaymentMethodErrors } from "../errors/payment-method"
import { injectable } from "@/src/shared/utils/dependency-injection"

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

    if (
      !(await this.companyRepository.isUserAuthorized(ownerCompanyId, authorId))
    ) {
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
