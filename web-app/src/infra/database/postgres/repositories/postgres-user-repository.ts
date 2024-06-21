import { User } from "@/src/application/entities/User/User"
import { UserErrors } from "@/src/application/errors/user"
import { UserRepository } from "@/src/application/repositories/user-repository"
import { PostgresService } from "@/src/infra/services/postgres"
import { Email } from "@/src/shared/entities"
import { UUID } from "@/src/shared/entities/UUID"
import { injectable } from "@/src/shared/utils/dependency-injection"
import format from "pg-format"
import { UserMapper } from "../mappers/user-mapper"

@injectable("Postgres")
export class PostgresUserRepository implements UserRepository {
  public async exists(id: UUID): Promise<boolean> {
    const { rowCount } = await PostgresService.query(`SELECT 1 FROM auth.users WHERE id = $1`, [
      id.toString(),
    ])

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
      [JSON.stringify({ name: basicData.name }), basicData.email.complete, id.toString()],
    )
  }

  public async get(id: UUID): Promise<User> {
    const { rows: rowsUserFind } = await PostgresService.query<{
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

  public async getByEmail(email: Email): Promise<User> {
    const { rows: rowsUserMatched } = await PostgresService.query<{
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
      FROM auth.users u WHERE u.email = $1
    `,
      [email.complete],
    )

    if (rowsUserMatched.length === 0) {
      throw new UserErrors.UserNotFoundByEmailError()
    }

    return UserMapper.toDomain(rowsUserMatched[0])
  }

  public async getManyByEmail(emails: Email[]): Promise<User[]> {
    const query = format(
      `--sql
      SELECT 
        u.id, 
        u.raw_user_meta_data->>'name' AS name ,
        u.email,
        u.created_at,
        u.deleted_at
      FROM auth.users u WHERE u.email in (%L)
    `,
      ["", ...emails.map((email) => email.complete)],
    )

    console.log(query)

    const { rows: rowsUsers } = await PostgresService.query<{
      id: string
      name: string
      email: string
      created_at: Date
      deleted_at: Date | null
    }>(query)

    return rowsUsers.map(UserMapper.toDomain)
  }
}
