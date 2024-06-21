import { PaymentMethod } from "@/core/application/entities/PaymentMethod/PaymentMethod"
import { MapperErrors } from "@/core/application/errors/mapper"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
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
    try {
      return {
        id: Number(raw.id),
        name: String(raw.name),
        lastFee: new CurrencyValue(Number(raw.fee)),
        lastFeeId: Number(raw.fee_id),
        updatedAt: DateTime.fromDate(raw.updated_at),
        createdAt: DateTime.fromDate(raw.created_at),
        ownerCompanyId: Number(raw.owner_company_id),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(PaymentMethodMapper, error.message)
    }
  }
}
