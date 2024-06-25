import { PaymentMethodWithFees } from "@/core/application/entities/PaymentMethod/PaymentMethodWithFees"
import { MapperErrors } from "@/core/application/errors"
import { CurrencyValue, DateTime, UUID } from "@/core/shared/entities"
import { ParsePayload, StaticClass } from "@/core/shared/utils"

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
    author_id: string
    author_name: string
  }): PaymentMethodWithFees {
    const dataProxy = ParsePayload.handleObjectMapper(raw)
    try {
      return {
        id: Number(dataProxy.id),
        name: String(dataProxy.name),
        fees: dataProxy.fees.map((fee) => ({
          id: Number(fee.id),
          fee: new CurrencyValue(fee.fee),
          createdAt: DateTime.fromDate(fee.created_at),
        })),
        ownerCompanyId: Number(dataProxy.owner_company_id),
        author: {
          id: new UUID(dataProxy.author_id),
          name: String(dataProxy.author_name),
        },
        updatedAt: DateTime.fromDate(dataProxy.updated_at),
        createdAt: DateTime.fromDate(dataProxy.created_at),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(PaymentMethodWithFeesMapper, error)
    }
  }
}
