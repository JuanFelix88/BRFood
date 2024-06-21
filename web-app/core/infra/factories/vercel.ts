import "@/core/application/usecases"
import "@/core/infra/database/postgres/repositories"
import "@/core/infra/supabase/repositories"
import { createFactoryWithGlobalDependencyList } from "@/core/shared/utils/create-factory"

export const vercelFactory = createFactoryWithGlobalDependencyList(["Postgres", "Supabase"])
