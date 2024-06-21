import { DateTime } from "@/core/shared/entities/DateTime"
import { UUID } from "@/core/shared/entities/UUID"

export interface Company {
  id: number
  name: string
  ownerUserId: UUID
  authorizedUsersIds: UUID[]
  createdAt: DateTime
  updatedAt: DateTime
}
