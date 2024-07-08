import { BRFood } from "@/core/infra/main/main"
import { AuthToken, Email } from "@/core/shared/entities"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)

    const companies = await BRFood.getCompaniesByUser.handle(userId)

    return HttpResponse.from(req).json(companies, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)
    const { authorizedEmails, companyName } = POST.bodySchema.parse(await req.json())

    const newCompany = await BRFood.addCompany.handle(
      {
        authorizedEmails,
        name: companyName,
      },
      userId,
    )

    return HttpResponse.from(req).json(newCompany, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace POST {
  export type Body = z.input<typeof bodySchema>

  export const bodySchema = z.object({
    companyName: z.string(),
    authorizedEmails: z.array(
      z
        .string()
        .email()
        .transform((v) => new Email(v)),
    ),
  })
}
