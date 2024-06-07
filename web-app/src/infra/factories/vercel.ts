import { createFactory } from "@/src/shared/utils/create-factory"

class VercelProductRepository {
  constructor() {}
}

export const vercelFactory = createFactory([VercelProductRepository])
