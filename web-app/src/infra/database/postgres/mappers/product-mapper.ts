import { Product } from "@/src/application/entities/Product/Product"
import { MapperErrors } from "@/src/application/errors/mapper"
import { CurrencyValue } from "@/src/shared/entities/CurrencyValue"
import { DateTime } from "@/src/shared/entities/DateTime"
import { StaticClass } from "@/src/shared/utils/static-class"

export class ProductMapper extends StaticClass {
  public static toDomain(raw: {
    id: number
    name: string
    price: string
    profit: string
    price_id: number
    owner_company_id: number
    created_at: Date
    updated_at: Date
  }): Product {
    try {
      return {
        id: Number(raw.id),
        name: String(raw.name),
        lastPrice: new CurrencyValue(Number(raw.price)),
        lastProfit: new CurrencyValue(Number(raw.profit)),
        lastPriceId: Number(raw.price_id),
        ownerCompanyId: Number(raw.owner_company_id),
        createdAt: DateTime.fromDate(raw.created_at),
        updatedAt: DateTime.fromDate(raw.updated_at),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(ProductMapper, error.message)
    }
  }
}
