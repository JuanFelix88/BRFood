import { PaymentMethodWithFees } from "@/src/application/entities/PaymentMethod/PaymentMethodWithFees"
import { MapperErrors } from "@/src/application/errors"
import { CurrencyValue, DateTime } from "@/src/shared/entities"
import { StaticClass } from "@/src/shared/utils"

export class PaymentMethodWithFeesMapper extends StaticClass {
  public static toDomain(raw: {
    id: number
    name: string
    fees: {
      id: number
      fee: number
      created_at: Date
    }[]
    owner_company_id: number
    created_at: Date
    updated_at: Date
  }): PaymentMethodWithFees {
    try {
      return {
        id: Number(raw.id),
        name: String(raw.name),
        fees: raw.fees.map((fee) => ({
          id: Number(fee.id),
          fee: new CurrencyValue(fee.fee),
          createdAt: DateTime.fromDate(fee.created_at),
        })),
        ownerCompanyId: Number(raw.owner_company_id),
        createdAt: DateTime.fromDate(raw.created_at),
        updatedAt: DateTime.fromDate(raw.updated_at),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(PaymentMethodWithFeesMapper, error.message)
    }
  }
}
