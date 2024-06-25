import { Product } from "@/core/application/entities/Product/Product"
import { MapperErrors } from "@/core/application/errors/mapper"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { ParsePayload } from "@/core/shared/utils"
import { StaticClass } from "@/core/shared/utils/static-class"

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
    const dataProxy = ParsePayload.handleObjectMapper(raw)
    try {
      return {
        id: Number(dataProxy.id),
        name: String(dataProxy.name),
        lastPrice: new CurrencyValue(Number(dataProxy.price)),
        lastProfit: new CurrencyValue(Number(dataProxy.profit)),
        lastPriceId: Number(dataProxy.price_id),
        ownerCompanyId: Number(dataProxy.owner_company_id),
        createdAt: DateTime.fromDate(dataProxy.created_at),
        updatedAt: DateTime.fromDate(dataProxy.updated_at),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(ProductMapper, error)
    }
  }
}
