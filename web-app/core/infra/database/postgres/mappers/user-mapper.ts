import { User } from "@/core/application/entities/User/User"
import { MapperErrors } from "@/core/application/errors/mapper"
import { DateTime } from "@/core/shared/entities/DateTime"
import { Email } from "@/core/shared/entities/Email"
import { UUID } from "@/core/shared/entities/UUID"
import { ParsePayload } from "@/core/shared/utils"
import { StaticClass } from "@/core/shared/utils/static-class"

export class UserMapper extends StaticClass {
  public static toDomain(raw: {
    id: string
    name: string
    email: string
    created_at: Date
    deleted_at: Date | null
  }): User {
    try {
      const dataProxy = ParsePayload.handleObjectMapper(raw)
      return {
        id: new UUID(dataProxy.id),
        name: String(dataProxy.name),
        email: new Email(dataProxy.email),
        createdAt: DateTime.fromDate(dataProxy.created_at),
        status: dataProxy.deleted_at === null ? User.Status.Active : User.Status.Inactive,
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(UserMapper, error)
    }
  }
}
