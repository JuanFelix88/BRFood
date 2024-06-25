import { CurrencyValue, DateTime, UUID } from "@/core/shared/entities"

export interface ClientCredit {
  id: number
  clientId: UUID
  value: CurrencyValue
  createdAt: DateTime
}
