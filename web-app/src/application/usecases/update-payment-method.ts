import { Usecase } from "@/src/shared/entities/Usecase"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { PaymentMethod } from "../entities/PaymentMethod/PaymentMethod"
import { PaymentMethodErrors } from "../errors/payment-method"
import { CompanyErrors } from "../errors/company"
import { UUID } from "@/src/shared/entities/UUID"
import { CompanyRepository } from "../repositories/company-repository"

interface UpdatePaymentMethodPayload {
  name: string
  fee: CurrencyValue
  authorId: UUID
}

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

    const { ownerCompanyId } =
      await this.paymentMethodRepository.get(paymentMethodId)

    const isAuthorizedCompany = await this.companyRepository.isUserAuthorized(
      ownerCompanyId,
      authorId,
    )

    if (!isAuthorizedCompany) {
      throw new CompanyErrors.CompanyIsNotAuthorizedError()
    }

    return await this.paymentMethodRepository.update(paymentMethodId, {
      name,
      fee,
      authorId,
      ownerCompanyId,
    })
  }
}
