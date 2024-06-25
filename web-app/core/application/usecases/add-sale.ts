import * as Errors from "@/core/application/errors"
import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Sale } from "../entities/Sale/Sale"
import { CompanyErrors } from "../errors/company"
import { SaleErrors } from "../errors/sale"
import { ClientCreditRepository } from "../repositories/client-credit-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { ProductRepository } from "../repositories/product-repository"
import { SaleRepository } from "../repositories/sale-repository"

export namespace AddSaleData {
  export type PaymentPayload =
    | {
        paymentMethodId: number
        paymentMethodValue: CurrencyValue
      }
    | {
        paymentMethodId: number
        paymentMethodValue: CurrencyValue
        clientId: number
      }
    | {
        paymentCreditValue: CurrencyValue
        clientId: number
      }
}

export interface AddSaleData {
  companyId: number
  products: { productId: number; amount: AmountValue }[]
  payments: AddSaleData.PaymentPayload[]
  note?: string
  authorId: UUID
}

@injectable()
export class AddSale implements Usecase {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly clientCreditRepository: ClientCreditRepository,
  ) {}

  private getValueFromPayment(p: AddSaleData.PaymentPayload): CurrencyValue {
    if ("paymentCreditValue" in p) return p.paymentCreditValue
    return p.paymentMethodValue
  }

  public async handle({
    companyId,
    payments,
    products,
    note,
    authorId,
  }: AddSaleData): Promise<Sale> {
    note = note?.trim()

    if (!payments.length) {
      throw new SaleErrors.PaymentMethodsAmountError()
    }

    if (!products.length) {
      throw new SaleErrors.ProductsAmountError()
    }

    if (note && note.length > 200) {
      throw new SaleErrors.NoteLengthError()
    }

    const isUserAuthorAuthorized = await this.companyRepository.isUserAuthorized(
      companyId,
      authorId,
    )

    if (!isUserAuthorAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    const databaseProducts = await this.productRepository.getByIds(products)
    const getProductById = (productId: number) => databaseProducts.find((p) => p.id === productId)!

    const databasePaymentMethods = await this.paymentMethodRepository.getByIds(
      payments.filter((p) => "paymentMethodId" in p),
      companyId,
    )
    const getPaymentMethodById = (paymentMethodId: number) =>
      databasePaymentMethods.find((p) => p.id === paymentMethodId)!

    const userCreditBalanceTests = await Promise.all(
      payments
        .filter((p) => "paymentCreditValue" in p)
        .map(({ clientId, paymentCreditValue }) =>
          this.clientCreditRepository.byIdGreatherThan(clientId, paymentCreditValue),
        ),
    )

    if (userCreditBalanceTests.some((hasBalance) => hasBalance === false)) {
      throw new SaleErrors.UserCreditBalanceError()
    }

    const checkedProducts = products.map(({ ...product }) => ({
      ...product,
      price: getProductById(product.productId).lastPrice,
      productPriceId: getProductById(product.productId).lastPriceId,
    }))

    const checkedPayments = payments.map((paymentMethod) => {
      if ("clientId" in paymentMethod && "paymentMethodId" in paymentMethod) {
        return {
          ...paymentMethod,
          paymentMethodFeeId: getPaymentMethodById(paymentMethod.paymentMethodId).lastFeeId,
        } as SaleRepository.PaymentPaymentMethodClient
      }

      if ("paymentMethodId" in paymentMethod) {
        return {
          ...paymentMethod,
          paymentMethodFeeId: getPaymentMethodById(paymentMethod.paymentMethodId).lastFeeId,
        } as SaleRepository.PaymentPaymentMethod
      }

      if ("clientId" in paymentMethod) {
        return {
          ...paymentMethod,
          companyClientId: paymentMethod.clientId,
        } as SaleRepository.PaymentClientCredit
      }

      throw new Errors.SaleErrors.CheckPaymentsPayloadError()
    })

    const sumPaymentsValue = new CurrencyValue(
      payments.reduce((acc, p) => acc + this.getValueFromPayment(p).int, 0),
    )

    const sumProductsValue = new CurrencyValue(
      checkedProducts.reduce((acc, p) => acc + p.price.int * p.amount.int, 0),
    )

    if (sumProductsValue.int !== sumPaymentsValue.int) {
      throw new SaleErrors.PaymentMethodsValueError()
    }

    return await this.saleRepository.add({
      paymentPayloads: checkedPayments,
      products: checkedProducts,
      total: sumProductsValue,
      note,
      authorId: authorId,
      ownerCompanyId: companyId,
    })
  }
}
