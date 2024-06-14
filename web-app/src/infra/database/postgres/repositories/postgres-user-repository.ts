import { User } from "@/src/application/entities/User/User"
import { UserErrors } from "@/src/application/errors/user"
import { UserRepository } from "@/src/application/repositories/user-repository"
import { PostgresService } from "@/src/infra/services/postgres"
import { UUID } from "@/src/shared/entities/UUID"
import { UserMapper } from "../mappers/user-mapper"

export class PostgresUserRepository implements UserRepository {
  public async exists(id: UUID): Promise<boolean> {
    const { rowCount } = await PostgresService.query(
      `SELECT 1 FROM auth.users WHERE id = $1`,
      [id.toString()],
    )

    return rowCount === 1
  }

  public async overWriteBasic(
    id: UUID,
    basicData: UserRepository.OverWriteBasicDataPayload,
  ): Promise<void> {
    using client = await PostgresService.connect()

    if (!(await this.exists(id))) {
      throw new UserErrors.UserNotFound()
    }

    await client.query(
      `--sql
      UPDATE auth.users SET 
        raw_user_meta_data = ($1)::jsonb,
        email = $2
      WHERE auth.users.id = $3
    `,
      [
        JSON.stringify({ name: basicData.name }),
        basicData.email.complete,
        id.toString(),
      ],
    )
  }

  public async get(id: UUID): Promise<User> {
    using client = await PostgresService.connect()

    const { rows: rowsUserFind } = await client.query<{
      id: string
      name: string
      email: string
      created_at: Date
      deleted_at: Date | null
    }>(
      `--sql
      SELECT 
        u.id, 
        u.raw_user_meta_data->>'name' AS name ,
        u.email,
        u.created_at,
        u.deleted_at
      FROM auth.users u WHERE u.id = $1
    `,
      [id.toString()],
    )

    if (rowsUserFind.length === 0) {
      throw new UserErrors.UserNotFound()
    }

    return UserMapper.toDomain(rowsUserFind[0])
  }
}
