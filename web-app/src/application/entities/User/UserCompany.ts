import { Company } from "@/src/application/entities/Company/Company"
import { User } from "./User"

export interface UserCompany extends User {
  company: Company
}
