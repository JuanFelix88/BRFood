import { createFactory } from "@/src/shared/utils/create-factory"
import { PostgresProductRepository } from "@/src/infra/database/postgres/repositories/postgres-product-repository"
import { PostgresCompanyRepository } from "../database/postgres/repositories/postgres-company-repository"
import { PostgresPaymentMethodRepository } from "../database/postgres/repositories/postgres-payment-method-repository"
import { PostgresUserRepository } from "../database/postgres/repositories/postgres-user-repository"
import { SupabaseAuthRepository } from "../supabase/repositories/supabase-auth-repository"

export const vercelFactory = createFactory([
  PostgresProductRepository,
  PostgresCompanyRepository,
  PostgresPaymentMethodRepository,
  PostgresUserRepository,
  SupabaseAuthRepository,
])
