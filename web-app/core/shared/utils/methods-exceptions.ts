import { MapperErrors } from "@/core/application/errors"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { AppError } from "../entities/AppError"
import { Lang } from "../intl/lang"
import { PrefLang } from "../intl/pref-lang"
import { HttpResponse } from "./http-response"
import { StaticClass } from "./static-class"

const DEFAULT_ERROR = {
  [Lang.EN]: "Unidentified internal error of the server",
  [Lang.PT_BR]: "Erro interno não identificado do servidor",
}

const ZOD_ERROR = {
  [Lang.EN]: "There is payload error",
  [Lang.PT_BR]: "Há erros de mapamento de dados",
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
  public static handleError(req: NextRequest, error: any): NextResponse<ResponseError> {
    const prefLang = PrefLang.getFromRequest(req)

    this.consoleError(req, error)

    if (error instanceof ZodError) {
      const errorMessage = ZOD_ERROR[prefLang.lang]
      return HttpResponse.from(req).json(
        {
          errorMessage,
          issues: error.flatten().formErrors,
        },
        StatusCodes.BAD_REQUEST,
      )
    }

    if (error instanceof MapperErrors.MappingError) {
      return HttpResponse.from(req).json(
        {
          errorMessage: prefLang.messageFromError(error).errorMessage,
          issues: error.issues!,
        },
        StatusCodes.BAD_REQUEST,
      )
    }

    if (error instanceof AppError) {
      return HttpResponse.from(req).json(
        prefLang.messageFromError(error),
        error.statusCode || StatusCodes.BAD_REQUEST,
      )
    }

    return HttpResponse.from(req).json(
      {
        errorMessage: DEFAULT_ERROR[prefLang.lang],
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
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
