import { PaymentMethod } from "@/core/application/entities/PaymentMethod/PaymentMethod"
import { MapperErrors } from "@/core/application/errors/mapper"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { ParsePayload } from "@/core/shared/utils"
import { StaticClass } from "@/core/shared/utils/static-class"

export class PaymentMethodMapper extends StaticClass {
  public static toDomain(raw: {
    id: number
    name: string
    fee: number
    fee_id: number
    updated_at: Date
    created_at: Date
    owner_company_id: number
  }): PaymentMethod {
    const dataProxy = ParsePayload.handleObjectMapper(raw)
    try {
      return {
        id: Number(dataProxy.id),
        name: String(dataProxy.name),
        lastFee: new CurrencyValue(Number(dataProxy.fee)),
        lastFeeId: Number(dataProxy.fee_id),
        updatedAt: DateTime.fromDate(dataProxy.updated_at),
        createdAt: DateTime.fromDate(dataProxy.created_at),
        ownerCompanyId: Number(dataProxy.owner_company_id),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(PaymentMethodMapper, error)
    }
  }
}
