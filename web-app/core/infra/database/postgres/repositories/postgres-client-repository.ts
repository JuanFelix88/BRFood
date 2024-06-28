import { Client } from "@/core/application/entities/Client/Client"
import { ClientRepository } from "@/core/application/repositories"
import { PostgresService } from "@/core/infra/services"
import { ArrayCA } from "@/core/shared/entities"
import { injectable } from "@/core/shared/utils"
import { ClientMapper } from "../mappers/client-mapper"

@injectable("Postgres")
export class PostgresClientRepository implements ClientRepository {
  public async listByCompanyId(
    companyId: number,
    offset: number,
    limit: number,
  ): Promise<ArrayCA<Client>> {
    const { rows } = await PostgresService.query<{
      id: number
      user_id: string
      name: string
      email: string
      last_credit: number
      company_id: number
      created_at: Date
      full_count: number
    }>(
      `--sql
      WITH client_credits_with_rn AS (
        SELECT 
          *,
          ROW_NUMBER() OVER(PARTITION BY company_client_id ORDER BY id DESC) as rn
        FROM public.company_client_credits
      )
      SELECT
        client.id,
        client_user.id as user_id,
        client_user.raw_user_meta_data ->> 'name' as name,
        client_user.email as email,
        client_credit.credit as last_credit,
        client.company_id,
        client.created_at,
        COUNT(*) OVER() AS full_count
      FROM
        public.company_clients client
        INNER JOIN auth.users client_user 
          ON client_user.id = client.user_id
        INNER JOIN client_credits_with_rn client_credit 
          ON client_credit.company_client_id = client.id AND client_credit.rn = 1
      WHERE
        client.company_id = $1
      ORDER BY
        client.created_at DESC 
      OFFSET $2
      LIMIT $3
    `,
      [companyId, offset, limit],
    )

    const count = ArrayCA.countAll(rows)

    return ArrayCA.fromArray(rows.map(ClientMapper.toDomain), count)
  }
}
