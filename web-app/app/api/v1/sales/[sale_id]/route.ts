import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { IntlMessage } from "@/core/shared/entities/IntlMessage"
import { Lang } from "@/core/shared/intl/lang"
import { PrefLang } from "@/core/shared/intl/pref-lang"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, cxt: { params: { sale_id: string } }) {
  try {
    const saleId = Number(cxt.params.sale_id)
    const { userId } = AuthToken.getFromNextRequest(req)
    const prefLang = PrefLang.getFromRequest(req)

    await BRFood.cancelSale.handle(saleId, userId)

    const message = new IntlMessage({
      [Lang.EN]: "Sale canceled successfully",
      [Lang.PT_BR]: "Venda cancelada com sucesso",
    })

    return NextResponse.json(prefLang.messageFromIntlMessage(message), {
      status: StatusCodes.OK,
    })
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}
