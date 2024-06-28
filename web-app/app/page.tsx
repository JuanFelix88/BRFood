import { API } from "@/core/infra/http"
import { MethodsExceptions } from '@/core/shared/utils'

export default async function Home() {
  const { data } = await API.get("/api/v1/companies/[company_id]/clients", {company_id: 27})

  if (MethodsExceptions.isError(data)) {
    return <main>{data.errorMessage}</main>
  }

  return <main>OI!</main>
}
