import { NextRequest, NextResponse } from "next/server"
import { AppError } from "../entities/AppError"
import { PrefLang } from "../intl/pref-lang"
import { Lang } from "../intl/lang"

const DEFAULT_ERROR = {
  [Lang.EN]: "Unidentified internal error of the server",
  [Lang.PT_BR]: "Erro interno não identificado do servidor",
}

export class MethodsExceptions {
  public static handleError(
    req: NextRequest,
    error: any
  ): NextResponse<unknown> {
    const prefLang = PrefLang.getFromRequest(req)

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: prefLang.messageFromError(error),
        },
        {
          status: 400,
        }
      )
    }

    return NextResponse.json(
      {
        message: DEFAULT_ERROR[prefLang.lang],
      },
      {
        status: 500,
      }
    )
  }
}
