// import "@/core/shared/entities" // cache all entities (http mapper)
import { NextRequest, NextResponse } from "next/server"
import { ArrayCA } from "../entities"
import { HttpMapper } from "./http-mapper"
import { StaticClass } from "./static-class"

type NotAcceptablesTypes<T> = T extends ArrayCA<infer _> ? never : T

class ResponseResolve {
  constructor(protected readonly req?: NextRequest) {}

  public json<T>(data: NotAcceptablesTypes<T>, status = 200, headers?: Headers) {
    if (this.req?.headers.has(HttpMapper.CONTENT_MAPPER)) {
      const outHeaders = new Headers(headers)

      HttpMapper.encodeToHeader(outHeaders, data)

      return NextResponse.json(data, { status, headers: outHeaders })
    }

    return NextResponse.json(data, { status, headers })
  }
}

/**
 * ### HTTP Response
 *
 * Use for default response
 */
export class HttpResponse extends StaticClass {
  public static from(req: NextRequest) {
    return new ResponseResolve(req)
  }

  public static json<T = any>(data: NotAcceptablesTypes<T>, status = 200, headers?: Headers) {
    return new ResponseResolve().json(data, status, headers)
  }
}
