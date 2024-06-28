import { Client } from "@/core/application/entities/Client/Client"
import { MapperErrors } from "@/core/application/errors/mapper"
import { CurrencyValue, Email, UUID } from "@/core/shared/entities"
import { DateTime } from "@/core/shared/entities/DateTime"
import { StaticClass } from "@/core/shared/utils/static-class"
import { z } from "zod"

export class ClientMapper extends StaticClass {
  public static toDomain(raw: z.input<typeof schema>): Client {
    try {
      return schema.parse(raw)
    } catch (error: any) {
      throw new MapperErrors.MappingError(ClientMapper, error)
    }
  }
}

const schema = z
  .object({
    id: z.number().int().nonnegative(),
    user_id: z
      .string()
      .uuid()
      .transform((v) => new UUID(v)),
    name: z.string(),
    email: z.string().transform((v) => new Email(v)),
    company_id: z.number().int().nonnegative(),
    last_credit: z.number().transform((v) => new CurrencyValue(v)),
    created_at: z.date().transform((v) => DateTime.fromDBType(v)),
  })
  .transform(
    (v) =>
      ({
        id: v.id,
        userId: v.user_id,
        name: v.name,
        email: v.email,
        companyId: v.company_id,
        lastCredit: v.last_credit,
        createdAt: v.created_at,
      }) satisfies Client,
  )
