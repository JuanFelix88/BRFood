import { BRFood } from "@/core/infra/main/main"
import { Pagination } from "@/core/shared/entities"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const { userId: authorId } = AuthToken.getFromNextRequest(req)
    const companyId = Number(cxt.params.company_id)
    const pagination = Pagination.fromNextRequest(req)

    const clients = await BRFood.getClientsByCompanyId.handle(companyId, authorId, pagination)

    const headers = pagination.getHeaderWithXTotalCount(clients)

    return NextResponse.json(clients, {
      status: StatusCodes.OK,
      headers,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
