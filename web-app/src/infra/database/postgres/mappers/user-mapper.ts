import { User } from "@/src/application/entities/User/User"
import { MapperErrors } from "@/src/application/errors/mapper"
import { DateTime } from "@/src/shared/entities/DateTime"
import { Email } from "@/src/shared/entities/Email"
import { UUID } from "@/src/shared/entities/UUID"
import { StaticClass } from "@/src/shared/utils/static-class"

export class UserMapper extends StaticClass {
  public static toDomain(raw: {
    id: string
    name: string
    email: string
    created_at: Date
    deleted_at: Date | null
  }): User {
    try {
      return {
        id: new UUID(raw.id),
        name: String(raw.name),
        email: new Email(raw.email),
        createdAt: DateTime.fromDate(raw.created_at),
        status: raw.deleted_at === null ? User.Status.Active : User.Status.Inactive,
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(UserMapper, error.message)
    }
  }
}
