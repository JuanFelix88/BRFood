import { ClientCredit } from "@/core/application/entities/ClientCredit/ClientCredit"
import { ClientCreditRepository } from "@/core/application/repositories"
import { PostgresService } from "@/core/infra/services"
import { CurrencyValue, UUID } from "@/core/shared/entities"
import { injectable } from "@/core/shared/utils"

@injectable("Postgres")
export class PostgresClientCreditRepository implements ClientCreditRepository {
  public async byIdGreatherThan(
    companyClientId: number,
    testValue: CurrencyValue,
  ): Promise<boolean> {
    const { rowCount } = await PostgresService.query(
      `--sql
      WITH last_credit AS (
        SELECT *
        FROM public.company_client_credits
        WHERE company_client_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      )

      SELECT 1
      FROM last_credit
      WHERE credit >= $2
    `,
      [companyClientId, testValue.int],
    )

    return (rowCount ?? 0) > 0
  }

  public async getByUserId(userId: UUID): Promise<ClientCredit> {
    throw new Error("Method not implemented.")
  }
}
