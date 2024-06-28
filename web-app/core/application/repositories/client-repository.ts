import { Client } from "@/core/application/entities/Client/Client"
import { ArrayCA } from "@/core/shared/entities"

export abstract class ClientRepository {
  public abstract listByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCA<Client>>
}
