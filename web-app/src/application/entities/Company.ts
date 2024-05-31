import { DateTime } from "@/src/shared/entities/DateTime"
import { UUID } from "@/src/shared/entities/UUID"

export interface Company {
  id: number
  name: string
  ownerUserId: UUID
  authorizedUsersIds: UUID[]
  createdAt: DateTime
  updatedAt: DateTime
}
