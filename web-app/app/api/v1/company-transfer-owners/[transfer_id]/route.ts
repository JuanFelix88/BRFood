import { BRFood } from "@/src/infra/main/main"
import { IntlMessage } from "@/src/shared/entities"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { Lang, PrefLang } from "@/src/shared/intl"
import { MethodsExceptions } from "@/src/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, cxt: { params: { transfer_id: string } }) {
  try {
    const { userId } = AuthToken.getFromNextRequest(req)
    const transferId = Number(cxt.params.transfer_id)
    const prefLang = PrefLang.getFromRequest(req)

    await BRFood.deleteCompanyTransferOwner.handle(transferId, userId)

    const message = new IntlMessage({
      [Lang.EN]: "The company transfer request was successfully deleted",
      [Lang.PT_BR]: "A solicitação de transferência de empresa foi excluída com sucesso",
    })

    return NextResponse.json(prefLang.messageFromIntlMessage(message), {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
