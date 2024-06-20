import { DateTime, UUID } from "@/src/shared/entities"

export interface CompanyOwnerTransfer {
  id: number
  toUserId: UUID
  companyId: number
  fromUserId: UUID
  createdAt: DateTime
  acceptedAt?: DateTime
  declinedAt?: DateTime
}
