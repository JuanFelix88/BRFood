import { DateTime } from "@/src/shared/entities/DateTime"
import { Company } from "./Company"
import { Email } from "@/src/shared/entities/Email"
import { UUID } from "@/src/shared/entities/UUID"

namespace User {
  export enum Status {
    Active = "active",
    Inactive = "inactive",
  }
}

export interface User {
  id: UUID
  name: string
  company: Company
  email: Email
  createdAt: DateTime
  status: User.Status
}
