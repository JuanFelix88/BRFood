import { StaticClass } from "./static-class"

export const classesList: any[] = []

/**
 * @decorator
 */
export function HTTPTransformable<T extends { new (...args: any[]): {} }>() {
  return function (target: T) {
    classesList.push(target as any)
    return target
  }
}

export class HttpMapper extends StaticClass {
  public static readonly CONTENT_MAPPER = "content-mapper"
  protected static isCode(val: unknown) {
    if (typeof val !== "string") {
      return false
    }

    return val.startsWith("%") && val.endsWith("%")
  }

  protected static isComplex(val: unknown) {
    return Array.isArray(val) || typeof val === "object"
  }

  protected static getTransfer(obj: any) {
    if (!this.isComplex(obj)) {
      return undefined
    }

    for (const class0 of classesList) {
      if (obj instanceof class0 === false) continue
      return `%${class0.name}%`
    }

    const out: any = Array.isArray(obj) ? [] : {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const itemVal = (obj as any)[key]
        out[key] = this.getTransfer(itemVal)
      }
    }

    return out
  }

  protected static encode(obj: any): string {
    const out = this.getTransfer(obj)
    return JSON.stringify(out)
  }

  protected static decode<T = any>(data: any, contentMapper: any): T {
    if (this.isCode(contentMapper)) {
      for (const class0 of classesList) {
        if (contentMapper === `%${class0.name}%`) {
          return new class0(data) as T
        }
      }
    }

    if (!this.isComplex(data)) return data

    const out: any = Array.isArray(data) ? [] : {}

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        out[key] = this.decode((data as any)[key], (contentMapper as any)[key])
      }
    }

    return out
  }

  public static encodeToHeader(header: Headers, responseData: any) {
    if (!responseData) {
      return header
    }

    if (Array.isArray(responseData)) {
      header.set("Content-Type", "application/json")
      header.set(HttpMapper.CONTENT_MAPPER, this.encode(responseData))
    }

    return header
  }

  public static encondeData(responseData: any) {
    return this.encodeToHeader(new Headers(), responseData)
  }

  public static decodeDataFromHeader(header: Headers, data: any) {
    if (!header.has("Content-Mapper")) return data

    if (!data) {
      throw new Error("No data to decode")
    }

    return this.decode(data, JSON.parse(header.get("Content-Mapper") as string))
  }
}
