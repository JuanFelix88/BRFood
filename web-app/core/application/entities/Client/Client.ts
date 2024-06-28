import { CurrencyValue, DateTime, Email, UUID } from "@/core/shared/entities"

export interface Client {
  id: number
  userId: UUID
  name: string
  email: Email
  companyId: number
  lastCredit: CurrencyValue
  createdAt: DateTime
}
