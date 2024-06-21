import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { CompanyErrors } from "../errors/company"
import { PaymentMethodErrors } from "../errors/payment-method"
import { CompanyRepository } from "../repositories/company-repository"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"

interface UpdatePaymentMethodPayload {
  name: string
  fee: CurrencyValue
  authorId: UUID
}

@injectable()
export class UpdatePaymentMethod implements Usecase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(
    paymentMethodId: number,
    { fee, name, authorId }: UpdatePaymentMethodPayload,
  ): Promise<PaymentMethod> {
    if (typeof paymentMethodId !== "number" || isNaN(paymentMethodId)) {
      throw new PaymentMethodErrors.IdPaymentMethodIsInvalidOrNotFoundError()
    }

    if (typeof name !== "string" || name.length === 0 || name.length > 60) {
      throw new PaymentMethodErrors.NameIsInvalidError()
    }

    if (fee.isNegative()) {
      throw new PaymentMethodErrors.FeeIsInvalidError()
    }

    const { ownerCompanyId } = await this.paymentMethodRepository.get(paymentMethodId)

    const isAuthorizedCompany = await this.companyRepository.isUserAuthorized(
      ownerCompanyId,
      authorId,
    )

    if (!isAuthorizedCompany) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.paymentMethodRepository.update(paymentMethodId, {
      name,
      fee,
      authorId,
      ownerCompanyId,
    })
  }
}
