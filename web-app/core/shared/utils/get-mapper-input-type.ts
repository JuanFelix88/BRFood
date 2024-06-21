export type GetMapperInputType<T extends { toDomain: (raw: any) => any }> =
  T["toDomain"] extends (raw: infer B) => any ? B : never
