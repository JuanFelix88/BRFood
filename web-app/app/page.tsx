import { API } from "@/core/infra/http"
import { MethodsExceptions } from "@/core/shared/utils"

export default async function Home() {
  await API.post(
    "/api/v1/auth/signin",
    {
      email: "da2@a23.com",
      password: "12345678",
    },
    {},
  )

  const { data } = await API.get("/api/v1/companies/[company_id]/clients", {company_id: 27}, {})

  if (MethodsExceptions.isError(data)) {
    return <main>{data.errorMessage}</main>
  }

  return (
    <main>
      <h1>OI!</h1>
      <span>{data[0].createdAt.toString()}</span>
    </main>
  )
}
