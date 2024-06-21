import { GetResponse } from '@/core/shared/utils/get-response';
import Image from "next/image";
import type { GET } from '@/app/api/v1/products/route'
import { MethodsExceptions } from '@/core/shared/utils/methods-exceptions';

export default async function Home() {
  const resp = await fetch("http://localhost:3000/api/v1/products")

  const respProducts: GetResponse<typeof GET> = await resp.json()

  if (MethodsExceptions.isError(respProducts)) {
    return (
      <main>
        <h1>{respProducts.errorMessage}</h1>
      </main>
    );
  }

  return (
    <main>
      {respProducts.map((product) => (product)).join(", ")}
    </main>
  );
}
