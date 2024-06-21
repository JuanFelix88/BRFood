import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { UUID } from "@/core/shared/entities/UUID"

export namespace Sale {
  export interface ProductItem {
    productId: number
    productPriceId: number
    name: string
    amount: AmountValue
    total: CurrencyValue
  }

  export interface PaymentMethod {
    paymentMethodId: number
    paymentMethodFeeId: number
    name: string
    value: CurrencyValue
  }

  export interface ClientPayment {
    id: number
    clientId: number
    clientName: string
    saleValue: CurrencyValue
    creditPayment?: {
      lastCreditValue: CurrencyValue
      newCreditValue: CurrencyValue
    }
    cancelledAt: DateTime
  }

  export interface PaymentClientCredit {
    id: number
    client: {
      clientId: number
      clientName: string
      creditPayment: {
        saleValue: CurrencyValue
        lastCreditValue: CurrencyValue
        newCreditValue: CurrencyValue
      }
    }
  }

  export interface PaymentPaymentMethod {
    id: number
    paymentMethod: {
      paymentMethodId: number
      paymentMethodFeeId: number
      name: string
      value: CurrencyValue
    }
  }

  export interface PaymentPaymentMethodClient {
    id: number
    client: {
      clientId: number
      clientName: string
    }
    paymentMethod: {
      paymentMethodId: number
      paymentMethodFeeId: number
      name: string
      value: CurrencyValue
    }
  }

  export type Payment = PaymentClientCredit | PaymentPaymentMethod | PaymentPaymentMethodClient
}

export interface Sale {
  id: number
  products: Sale.ProductItem[]
  paymentMethods: Sale.PaymentMethod[]
  total: CurrencyValue
  note?: string
  createdAt: DateTime
  authorId: UUID
  ownerCompanyId: number
  cancelledAt?: DateTime
}

export interface Sale2 {
  id: number
  products: Sale.ProductItem[]
  payments: Sale.Payment[]
  total: CurrencyValue
  note?: string
  createdAt: DateTime
  authorId: UUID
  ownerCompanyId: number
  cancelledAt?: DateTime
}
