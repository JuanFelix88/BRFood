import { Sale } from "@/core/application/entities/Sale/Sale"
import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { UUID } from "@/core/shared/entities/UUID"
import { StaticClass } from "@/core/shared/utils/static-class"

export class SaleMapper extends StaticClass {
  public static toDomain(raw: {
    id: number
    note?: string
    payment_methods: {
      name: string
      payment_method_id: number
      payment_method_fee_id: number
      value: number
    }[]
    products: {
      name: string
      amount: number
      product_id: number
      product_price_id: number
      total: number
    }[]
    created_at: Date
    total: number
    author_id: string
    owner_company_id: number
    cancelled_at?: Date
  }): Sale {
    return {
      id: raw.id,
      note: raw.note,
      paymentMethods: raw.payment_methods.map((pm) => ({
        name: String(pm.name),
        paymentMethodId: pm.payment_method_id,
        value: new CurrencyValue(pm.value),
        paymentMethodFeeId: pm.payment_method_fee_id,
      })),
      createdAt: DateTime.fromDate(raw.created_at),
      products: raw.products.map((p) => ({
        name: p.name,
        amount: new AmountValue(p.amount),
        productId: p.product_id,
        total: new CurrencyValue(p.total),
        productPriceId: p.product_price_id,
      })),
      total: new CurrencyValue(raw.total),
      authorId: new UUID(raw.author_id),
      ownerCompanyId: Number(raw.owner_company_id),
      cancelledAt: raw.cancelled_at ? DateTime.fromDate(raw.cancelled_at) : void null,
    }
  }
}
