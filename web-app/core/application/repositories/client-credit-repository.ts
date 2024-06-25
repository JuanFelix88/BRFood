import { CurrencyValue, UUID } from "@/core/shared/entities"
import { ClientCredit } from "../entities/ClientCredit/ClientCredit"

export abstract class ClientCreditRepository {
  public abstract getByUserId(userId: UUID): Promise<ClientCredit>
  public abstract byIdGreatherThan(
    companyClientId: number,
    testValue: CurrencyValue,
  ): Promise<boolean>
}
