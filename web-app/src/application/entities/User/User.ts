import { DateTime } from "@/src/shared/entities/DateTime"
import { Company } from "@/src/application/entities/Company/Company"
import { Email } from "@/src/shared/entities/Email"
import { UUID } from "@/src/shared/entities/UUID"

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
