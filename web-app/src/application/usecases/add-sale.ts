import { Usecase } from "@/src/shared/entities/Usecase"
import { SaleRepository } from "../repositories/sale-repository"
import { SaleErrors } from "../errors/sale"
import { ProductRepository } from "../repositories/product-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { PaymentMethodRepository } from "../repositories/payment-method-repository"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { CompanyRepository } from "../repositories/company-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { CompanyErrors } from "../errors/company"
import { Sale } from "../entities/Sale/Sale"
import { injectable } from "@/src/shared/utils/dependency-injection"

interface AddSaleData {
  companyId: number
  products: { productId: number; amount: AmountValue }[]
  paymentMethods: { paymentMethodId: number; value: CurrencyValue }[]
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
  ) {}

  public async handle({
    companyId,
    paymentMethods,
    products,
    note,
    authorId,
  }: AddSaleData): Promise<Sale> {
    note = note?.trim()

    if (!paymentMethods.length) {
      throw new SaleErrors.PaymentMethodsAmountError()
    }

    if (!products.length) {
      throw new SaleErrors.ProductsAmountError()
    }

    if (note && note.length > 200) {
      throw new SaleErrors.NoteLengthError()
    }

    const databaseProducts = await this.productRepository.getByIds(products)

    const getProductById = (productId: number) =>
      databaseProducts.find((p) => p.id === productId)!

    const databasePaymentMethods = await this.paymentMethodRepository.getByIds(
      paymentMethods,
      companyId,
    )

    const getPaymentMethodById = (paymentMethodId: number) =>
      databasePaymentMethods.find((p) => p.id === paymentMethodId)!

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(
      companyId,
      authorId,
    )

    if (!isUserAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    const checkedProducts = products.map(({ ...product }) => ({
      ...product,
      price: getProductById(product.productId).lastPrice,
      productPriceId: getProductById(product.productId).lastPriceId,
    }))

    const checkedPaymentMethods = paymentMethods.map(
      ({ ...paymentMethod }) => ({
        ...paymentMethod,
        paymentMethodFeeId: getPaymentMethodById(paymentMethod.paymentMethodId)
          .lastFeeId,
      }),
    )

    const sumPaymentMethodsValue = new CurrencyValue(
      paymentMethods.reduce((acc, p) => acc + p.value.int, 0),
    )

    const sumProductsValue = new CurrencyValue(
      checkedProducts.reduce((acc, p) => acc + p.price.int * p.amount.int, 0),
    )

    if (sumProductsValue.int !== sumPaymentMethodsValue.int) {
      throw new SaleErrors.PaymentMethodsValueError()
    }

    return await this.saleRepository.add({
      paymentMethods: checkedPaymentMethods,
      products: checkedProducts,
      total: sumProductsValue,
      note,
      authorId: authorId,
      ownerCompanyId: companyId,
    })
  }
}
