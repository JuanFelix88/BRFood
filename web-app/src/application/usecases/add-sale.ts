import { Usecase } from "@/src/shared/entities/Usecase"
import { SaleRepository } from "../repositories/sale-repository"
import { SaleErrors } from "../errors/sale"
import { ProductRepository } from "../repositories/product-repository"
import { AmountValue } from "@/src/shared/entities/AmountValue"
import { PaymentMethodRepository } from "../repositories/paymentmethod-repository"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"

interface AddSaleData {
  products: { productId: number; amountInt: number }[]
  paymentMethods: { paymentMethodId: number; valueInt: number }[]
  note?: string
}

export class AddSale implements Usecase {
  constructor(
    public saleRepository: SaleRepository,
    public productRepository: ProductRepository,
    public paymentMethodRepository: PaymentMethodRepository
  ) {}

  public async handle({
    paymentMethods,
    products,
    note,
  }: AddSaleData): Promise<void> {
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

    const getProductPriceById = (productId: number) =>
      databaseProducts.find((p) => p.id === productId)!.price

    if (await this.paymentMethodRepository.existsIds(paymentMethods)) {
      throw new SaleErrors.TheListHastPaymentMethodNotFound()
    }

    const checkedProducts = products.map(({ amountInt, ...product }) => ({
      ...product,
      amount: new AmountValue(amountInt),
      price: getProductPriceById(product.productId),
    }))

    const checkedPaymentMethods = paymentMethods.map(
      ({ valueInt, ...paymentMethod }) => ({
        ...paymentMethod,
        value: new CurrencyValue(valueInt),
      })
    )

    const sumPaymentMethodsValue = new CurrencyValue(
      checkedPaymentMethods.reduce((acc, p) => acc + p.value.int, 0)
    )

    const sumProductsValue = new CurrencyValue(
      checkedProducts.reduce((acc, p) => acc + p.price.int * p.amount.int, 0)
    )

    if (sumProductsValue.int !== sumPaymentMethodsValue.int) {
      throw new SaleErrors.PaymentMethodsValueError()
    }

    await this.saleRepository.add({
      paymentMethods: checkedPaymentMethods,
      products: checkedProducts,
      total: sumProductsValue,
      note,
    })
  }
}
