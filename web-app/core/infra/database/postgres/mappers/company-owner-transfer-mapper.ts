import { CompanyOwnerTransfer } from "@/core/application/entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import { MapperErrors } from "@/core/application/errors"
import { DateTime, UUID } from "@/core/shared/entities"
import { ParsePayload, StaticClass } from "@/core/shared/utils"

export class CompanyOwnerTransferMapper extends StaticClass {
  public static toDomain(raw: {
    id: number
    from_user_id: string
    to_user_id: string
    company_id: number
    created_at: Date
    accepted_at?: Date
    declined_at?: Date
  }): CompanyOwnerTransfer {
    try {
      const dataProxy = ParsePayload.handleObjectMapper(raw)
      return {
        id: dataProxy.id,
        fromUserId: new UUID(dataProxy.from_user_id),
        toUserId: new UUID(dataProxy.to_user_id),
        companyId: Number(dataProxy.company_id),
        createdAt: DateTime.fromDate(dataProxy.created_at),
      }
    } catch (error) {
      throw new MapperErrors.MappingError(CompanyOwnerTransferMapper, error)
    }
  }
}
