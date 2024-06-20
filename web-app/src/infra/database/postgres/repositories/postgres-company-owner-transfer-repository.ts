import { CompanyOwnerTransfer } from "@/src/application/entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import * as Errors from "@/src/application/errors"
import { CompanyOwnerTransferRepository } from "@/src/application/repositories"
import { PostgresService } from "@/src/infra/services"
import { UUID } from "@/src/shared/entities"
import { injectable } from "@/src/shared/utils"
import { CompanyOwnerTransferMapper } from "../mappers"

@injectable("Postgres")
export class PostgresCompanyOwnerTransferRepository implements CompanyOwnerTransferRepository {
  public async getPendingByToUserId(toUserId: UUID): Promise<CompanyOwnerTransfer[]> {
    const { rows } = await PostgresService.query<{
      id: number
      to_user_id: string
      from_user_id: string
      company_id: number
      accepted_at?: Date
      declined_at?: Date
      created_at: Date
    }>(
      `--sql
      SELECT
        id,
        to_user_id,
        from_user_id,
        company_id,
        accepted_at,
        declined_at,
        created_at
      FROM public.company_owner_transfers 
      WHERE to_user_id = $1 AND accepted_at IS NOT NULL AND declined_at IS NULL
      ORDER BY created_at DESC
    `,
      [toUserId.toString()],
    )

    return rows.map(CompanyOwnerTransferMapper.toDomain)
  }

  public async existsByCompanyId(companyId: number): Promise<boolean> {
    const { rowCount } = await PostgresService.query(
      `--sql
      SELECT 1 as exists
      FROM public.company_owner_transfers 
      WHERE to_user_id = $1 AND accepted_at IS NOT NULL AND declined_at IS NULL
      ORDER BY created_at DESC
    `,
      [companyId],
    )

    return (rowCount ?? 0) > 0
  }

  public async add({
    companyId,
    fromUserId,
    toUserId,
  }: CompanyOwnerTransferRepository.AddPayload): Promise<CompanyOwnerTransfer> {
    const { rows } = await PostgresService.query<{
      id: number
      from_user_id: string
      to_user_id: string
      company_id: number
      created_at: Date
    }>(
      `--sql
      INSERT INTO public.company_owner_transfers(company_id, from_user_id, to_user_id)
      VALUES ($1, $2, $3)
      RETURNING 
        id,
        from_user_id,
        to_user_id,
        company_id,
        created_at
    `,
      [companyId, fromUserId.toString(), toUserId.toString()],
    )

    if (rows.length === 0) {
      throw new Errors.CompanyOwnerTransferErrors.TransferNotRequestedDatabaseError()
    }

    return CompanyOwnerTransferMapper.toDomain(rows[0])
  }

  public async accept(companyOwnerTransferId: number): Promise<CompanyOwnerTransfer> {
    const { rows } = await PostgresService.query<{
      id: number
      from_user_id: string
      to_user_id: string
      company_id: number
      accepted_at?: Date
      declined_at?: Date
      created_at: Date
    }>(
      `--sql
      UPDATE public.company_owner_transfers SET
        declined_at = NULL,
        accepted_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        from_user_id,
        to_user_id,
        company_id,
        accepted_at,
        declined_at,
        created_at
      `,
      [companyOwnerTransferId],
    )

    if (rows.length === 0) {
      throw new Errors.CompanyOwnerTransferErrors.TransferAcceptDatabaseError()
    }

    return CompanyOwnerTransferMapper.toDomain(rows[0])
  }

  public async decline(companyOwnerTransferId: number): Promise<CompanyOwnerTransfer> {
    const { rows } = await PostgresService.query<{
      id: number
      from_user_id: string
      to_user_id: string
      company_id: number
      accepted_at?: Date
      declined_at?: Date
      created_at: Date
    }>(
      `--sql
      UPDATE public.company_owner_transfers SET
        accepted_at = NULL,
        declined_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        from_user_id,
        to_user_id,
        company_id,
        accepted_at,
        declined_at,
        created_at
      `,
      [companyOwnerTransferId],
    )

    if (rows.length === 0) {
      throw new Errors.CompanyOwnerTransferErrors.TransferAcceptDatabaseError()
    }

    return CompanyOwnerTransferMapper.toDomain(rows[0])
  }

  public async get(id: number): Promise<CompanyOwnerTransfer> {
    const { rows } = await PostgresService.query<{
      id: number
      from_user_id: string
      to_user_id: string
      company_id: number
      accepted_at?: Date
      declined_at?: Date
      created_at: Date
    }>(
      `--sql
      SELECT
        id,
        from_user_id,
        to_user_id,
        company_id,
        accepted_at,
        declined_at,
        created_at
      FROM public.company_owner_transfers
      WHERE id = $1
      `,
      [id],
    )

    if (rows.length === 0) {
      throw new Errors.CompanyOwnerTransferErrors.CompanyOwnerTransferNotFoundError()
    }

    return CompanyOwnerTransferMapper.toDomain(rows[0])
  }

  public async delete(transferId: number): Promise<void> {
    const { rowCount } = await PostgresService.query<{
      id: number
      from_user_id: string
      to_user_id: string
      company_id: number
      accepted_at?: Date
      declined_at?: Date
      created_at: Date
    }>(
      `--sql
      DELETE FROM public.company_owner_transfers
      WHERE id = $1
      `,
      [transferId],
    )

    if (rowCount === 0) {
      throw new Errors.CompanyOwnerTransferErrors.DeleteTransferDatabaseError()
    }
  }
}
