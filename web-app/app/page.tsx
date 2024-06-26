import { MethodsExceptions } from '@/core/shared/utils/methods-exceptions';
import { API } from '@/core/infra/http/api';

export default async function Home() {
  const { data } = await API.get("/api/v1/companies/[company_id]", { company_id: 27 })

  if (MethodsExceptions.isError(data)) {
    return (
      <main>
        <h1>{data.errorMessage}</h1>
      </main>
    );
  }


  return (
    <main>
      {JSON.stringify(data)}
    </main>
  );
}
