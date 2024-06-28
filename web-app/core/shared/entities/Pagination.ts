import { PaginationErrors } from "@/core/application/errors/pagination"
import { NextRequest } from "next/server"
import { StaticClass } from "../utils/static-class"
import { ArrayCA } from "./ArrayCountAll"

class Throws {
  constructor(private readonly self: Pagination) {}

  public ifLimitIsGreaterThan(amountLimit: number): void {
    if (this.self.limit > amountLimit) {
      throw new PaginationErrors.ReachedLimitError(amountLimit)
    }
  }
}

export class Pagination extends StaticClass {
  public static fromNextRequest(req: NextRequest) {
    const page = Number(req.nextUrl.searchParams.get("page") ?? "1")
    const perPage = Number(req.nextUrl.searchParams.get("per_page") ?? "10")

    if (perPage < 1) {
      throw new PaginationErrors.InvalidPerPageError()
    }

    if (page < 1) {
      throw new PaginationErrors.InvalidPageError()
    }

    const offset = (page - 1) * perPage
    return new Pagination(offset, perPage)
  }

  private constructor(
    public readonly offset: number,
    public readonly limit: number,
  ) {
    super()
  }

  public readonly throws = new Throws(this)

  public defineHeader(headers: Headers, arr: ArrayCA<unknown>) {
    if (ArrayCA.is(arr)) {
      headers.set("X-Total-Count", `${arr.total()}`)
      return
    }

    throw new PaginationErrors.NotPossibleToGenerateXCountTotalHeaderError()
  }

  public getHeaderWithXTotalCount(arr: ArrayCA<unknown>) {
    const headers = new Headers()
    this.defineHeader(headers, arr)

    return headers
  }
}
