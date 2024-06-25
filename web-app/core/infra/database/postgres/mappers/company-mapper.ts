import { Company } from "@/core/application/entities/Company/Company"
import { MapperErrors } from "@/core/application/errors/mapper"
import { UUID } from "@/core/shared/entities"
import { DateTime } from "@/core/shared/entities/DateTime"
import { StaticClass } from "@/core/shared/utils/static-class"
import { z } from "zod"

export class CompanyMapper extends StaticClass {
  public static toDomain(raw: z.input<typeof schema>): Company {
    try {
      return schema.parse(raw)
    } catch (error: any) {
      throw new MapperErrors.MappingError(CompanyMapper, error)
    }
  }
}

const schema = z
  .object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    authorized_users_ids: z.array(z.string().transform((v) => new UUID(v))),
    owner_user_id: z.string().transform((v) => new UUID(v)),
    created_at: z.date().transform((v) => DateTime.fromDBType(v)),
    updated_at: z.date().transform((v) => DateTime.fromDBType(v)),
  })
  .transform((v) => ({
    id: v.id,
    name: v.name,
    authorizedUsersIds: v.authorized_users_ids,
    ownerUserId: v.owner_user_id,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  }))
