import { NextRequest, NextResponse } from "next/server"
import { AppError } from "../entities/AppError"
import { PrefLang } from "../intl/pref-lang"
import { Lang } from "../intl/lang"
import { StaticClass } from "./static-class"
import { StatusCodes } from "http-status-codes"

const DEFAULT_ERROR = {
  [Lang.EN]: "Unidentified internal error of the server",
  [Lang.PT_BR]: "Erro interno não identificado do servidor",
}

interface ResponseError {
  errorMessage: string
}

export class MethodsExceptions extends StaticClass {
  /**
   * Validate is response error
   * @returns Boolean test
   */
  public static isError(err: any): err is ResponseError {
    return "errorMessage" in err
  }

  /**
   * Transform error to response
   * @returns NextResponse with error message
   */
  public static handleError(
    req: NextRequest,
    error: any,
  ): NextResponse<ResponseError> {
    const prefLang = PrefLang.getFromRequest(req)

    this.consoleError(req, error)

    if (error instanceof AppError) {
      return NextResponse.json(prefLang.messageFromError(error), {
        status: error.statusCode || StatusCodes.BAD_REQUEST,
      })
    }

    return NextResponse.json(
      {
        errorMessage: DEFAULT_ERROR[prefLang.lang],
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    )
  }

  private static consoleError(req: NextRequest, error: Error) {
    if (process.env.CONSOLE_ERROR !== "YES") {
      return
    }

    console.log(`\n❌ ERROR ❌`)
    console.log(`🦠 ${req.method} ${req.url}\n`)
    console.log(error)
    console.log(`❌ ERROR ❌`)
  }
}
