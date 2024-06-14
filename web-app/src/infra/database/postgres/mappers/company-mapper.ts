import { Company } from "@/src/application/entities/Company/Company"
import { MapperErrors } from "@/src/application/errors/mapper"
import { DateTime } from "@/src/shared/entities/DateTime"
import { UUID } from "@/src/shared/entities/UUID"
import { StaticClass } from "@/src/shared/utils/static-class"

export class CompanyMapper extends StaticClass {
  public static toDomain(raw: {
    id: number
    name: string
    authorized_users_ids: string[]
    owner_user_id: string
    created_at: Date
    updated_at: Date
  }): Company {
    try {
      return {
        id: Number(raw.id),
        name: String(raw.name),
        authorizedUsersIds: raw.authorized_users_ids.map((id) => new UUID(id)),
        ownerUserId: new UUID(raw.owner_user_id),
        updatedAt: DateTime.fromDate(raw.updated_at),
        createdAt: DateTime.fromDate(raw.created_at),
      }
    } catch (error: any) {
      throw new MapperErrors.MappingError(CompanyMapper, error.message)
    }
  }
}
