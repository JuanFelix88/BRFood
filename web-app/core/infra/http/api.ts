import { AuthToken } from "@/core/shared/entities"
import { StaticClass } from "@/core/shared/utils"
import { StatusCodes } from "http-status-codes"
import type * as Routes from "./routes"

interface Options {
  searchParams?: object
  headers?: {
    [key: string]: string
  }
}

interface ReturnRequest<T> {
  data: T
  headers: Headers
  status: StatusCodes
}

export class API extends StaticClass {
  public static TOKEN: string | null = this.getLocalToken()

  public static getLocalToken(): string | null {
    try {
      return localStorage.getItem("x-auth-token") ?? null
    } catch {
      return null
    }
  }

  public static defineToken(token: string) {
    API.TOKEN = token
    try {
      localStorage.setItem("x-auth-token", token)
    } catch {}
  }

  public static async get<T extends keyof Routes.GETS>(
    route: T,
    params: Routes.GetOfGet<Routes.Params[T]>,
    options?: Options,
  ) {
    return await API.construct<Routes.GetOfGet<Routes.Returns[T]>>(
      route,
      undefined,
      params as object,
      "GET",
      options,
    )
  }

  public static async post<T extends keyof Routes.POSTS>(
    route: T,
    body: Routes.GetOfPost<Routes.Bodies[T]>,
    params: Routes.GetOfPost<Routes.Params[T]>,
    options?: Options,
  ) {
    return await API.construct<Routes.GetOfPost<Routes.Returns[T]>>(
      route,
      body,
      params as object,
      "POST",
      options,
    )
  }

  public static async put<T extends keyof Routes.PUTS>(
    route: T,
    body: Routes.GetOfPut<Routes.Bodies[T]>,
    params: Routes.GetOfPut<Routes.Params[T]>,
    options?: Options,
  ) {
    return await API.construct<Routes.GetOfPut<Routes.Returns[T]>>(
      route,
      body,
      params as object,
      "PUT",
      options,
    )
  }

  public static async patch<T extends keyof Routes.PATCHS>(
    route: T,
    body: Routes.GetOfPatch<Routes.Bodies[T]>,
    params: Routes.GetOfPatch<Routes.Params[T]>,
    options?: Options,
  ) {
    return await API.construct<Routes.GetOfPatch<Routes.Returns[T]>>(
      route,
      body,
      params as object,
      "PATCH",
      options,
    )
  }

  public static async delete<T extends keyof Routes.DELETES>(
    route: T,
    params: Routes.GetOfDelete<Routes.Params[T]>,
    options?: Options,
  ) {
    return await API.construct<Routes.GetOfDelete<Routes.Returns[T]>>(
      route,
      undefined,
      params as object,
      "DELETE",
      options,
    )
  }

  private static async construct<T>(
    route: string,
    body?: object,
    params?: object,
    method?: string,
    options?: Options,
  ) {
    const sParams = new URLSearchParams()

    for (const [key, value] of Object.entries(options?.searchParams ?? {})) {
      sParams.append(key, value)
    }

    for (const [key, value] of Object.entries(params as any)) {
      route = route.replace(`[${key}]`, value as string)
    }

    route = !!options?.searchParams
      ? route +
        `?${Object.entries(sParams)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : route

    route = process.env.API_URL + route

    const headers = options?.headers ?? (body ? { "Content-Type": "application/json" } : {})
    const headersToSend = new Headers()

    for (const [key, value] of Object.entries(headers)) {
      headersToSend.append(key, value)
    }

    if (this.TOKEN) {
      headersToSend.append(AuthToken.HEADER_NAME, this.TOKEN)
    }

    const response = await fetch(route, {
      body: JSON.stringify(body),
      headers: headersToSend,
      method,
    })

    if (AuthToken.hasTokenInHeaders(response.headers)) {
      this.defineToken(AuthToken.getTokenFromHeaders(response.headers))
    }

    let data: any

    try {
      data = await response.json()
    } catch {
      data = { errorMessage: "Não há retorno de dados" }
    }

    return {
      data,
      headers: response.headers,
      status: response.status,
    } as ReturnRequest<T>
  }
}
