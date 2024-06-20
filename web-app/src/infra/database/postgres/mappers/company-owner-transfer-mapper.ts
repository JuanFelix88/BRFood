import { CompanyOwnerTransfer } from "@/src/application/entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import { DateTime, UUID } from "@/src/shared/entities"
import { StaticClass } from "@/src/shared/utils"

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
    return {
      id: raw.id,
      fromUserId: new UUID(raw.from_user_id),
      toUserId: new UUID(raw.to_user_id),
      companyId: Number(raw.company_id),
      createdAt: DateTime.fromDate(raw.created_at),
    }
  }
}
