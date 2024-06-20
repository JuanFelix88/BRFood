import { createFactoryWithGlobalDependencyList } from "@/src/shared/utils/create-factory"
import "@/src/application/usecases"
import "@/src/infra/database/postgres/repositories"
import "@/src/infra/supabase/repositories"

export const vercelFactory = createFactoryWithGlobalDependencyList([
  "Postgres",
  "Supabase",
])
