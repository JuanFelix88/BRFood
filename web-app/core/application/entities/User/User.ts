import { DateTime } from "@/core/shared/entities/DateTime"
import { Email } from "@/core/shared/entities/Email"
import { UUID } from "@/core/shared/entities/UUID"

export namespace User {
  export enum Status {
    Active = "active",
    Inactive = "inactive",
  }
}

export interface User {
  id: UUID
  name: string
  email: Email
  createdAt: DateTime
  status: User.Status
}
