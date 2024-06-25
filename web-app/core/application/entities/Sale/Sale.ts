import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { UUID } from "@/core/shared/entities/UUID"

export namespace Sale {
  export interface Product {
    productId: number
    productPriceId: number
    name: string
    amount: AmountValue
    total: CurrencyValue
  }

  export interface PaymentClientCredit {
    id: number
    client: {
      clientId: number
      clientName: string
    }
    creditPayment: {
      clientCreditId: number
      value: CurrencyValue
      newClientCreditValue: CurrencyValue
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
  products: Sale.Product[]
  payments: Sale.Payment[]
  total: CurrencyValue
  note?: string
  createdAt: DateTime
  authorId: UUID
  ownerCompanyId: number
  cancelledAt?: DateTime
}
