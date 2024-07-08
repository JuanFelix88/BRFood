import type { POST } from "@/app/api/v1/companies/[company_id]/payment-methods/route"
import { BRFood } from "@/core/infra/main/main"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { IntlMessage } from "@/core/shared/entities/IntlMessage"
import { Lang } from "@/core/shared/intl/lang"
import { PrefLang } from "@/core/shared/intl/pref-lang"
import { HttpResponse } from "@/core/shared/utils/http-response"
import { MethodsExceptions } from "@/core/shared/utils/methods-exceptions"
import { StatusCodes } from "http-status-codes"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest, cxt: { params: { payment_method_id: string } }) {
  try {
    const { name, fee }: PUT.Body = await req.json()
    const paymentMethodId = Number(cxt.params.payment_method_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const paymentMethod = await BRFood.updatePaymentMethod.handle(paymentMethodId, {
      name,
      fee: new CurrencyValue(fee),
      authorId: userId,
    })

    return HttpResponse.from(req).json(paymentMethod, StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export async function DELETE(req: NextRequest, cxt: { params: { payment_method_id: string } }) {
  try {
    const paymentMethodId = Number(cxt.params.payment_method_id)
    const { userId } = AuthToken.getFromNextRequest(req)

    const prefLang = PrefLang.getFromRequest(req)
    await BRFood.deletePaymentMethodById.handle(paymentMethodId, userId)

    const message = new IntlMessage({
      [Lang.EN]: "The payment method was successfully deleted",
      [Lang.PT_BR]: "O método de pagamento foi excluído com sucesso",
    })

    return HttpResponse.from(req).json(prefLang.messageFromIntlMessage(message), StatusCodes.OK)
  } catch (error) {
    return MethodsExceptions.handleError(req, error)
  }
}

export namespace PUT {
  export type Body = POST.Body
}
