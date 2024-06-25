import { NextRequest } from "next/server"
import { ProxyParser } from "./proxy-parser"

export class ParsePayload extends ProxyParser {
  public static async getBodyFromNext<T = any>(req: NextRequest): Promise<T> {
    const data = await req.json()

    if (Array.isArray(data)) {
      return data as T
    }

    return super.getMainBody(data) as T
  }

  public static handleObjectMapper<T>(data: T): T {
    return data
  }
}
