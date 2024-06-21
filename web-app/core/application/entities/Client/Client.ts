import { CurrencyValue, DateTime, UUID } from "@/core/shared/entities"

export interface Client {
  userId: UUID
  name: string
  email: string
  companyId: number
  lastCredit: CurrencyValue
  createdAt: DateTime
}
