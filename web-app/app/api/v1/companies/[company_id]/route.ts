import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const companyId = Number(cxt.params.company_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const company = await BRFood.getCompanyById.handle(companyId, userId)

    return HttpResponse.from(req).json(company, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function PUT(req: NextRequest, cxt: { params: { company_id: string } }) {
  try {
    const companyId = Number(cxt.params.company_id)
    const { name }: PUT.Body = await req.json()
    const { userId } = AuthToken.getFromNextRequest(req)

    const company = await BRFood.updateCompany.handle(
      {
        id: companyId,
        name,
      },
      userId,
    )

    return HttpResponse.from(req).json(company, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace PUT {
  export type Body = {
    name: string
  }
}
