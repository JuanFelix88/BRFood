import { NextRequest, NextResponse } from "next/server"
import { Lang } from "./lang"
import { AppError } from "../entities/AppError"
import { IntlMessage } from "../entities/IntlMessage"

export class PrefLang {
  public static readonly DEFAULT = Lang.PT_BR

  public static getFromRequest(req: NextRequest) {
    const acceptLanguage = req.headers.get("Accept-Language")

    const lang = Object.entries(Lang)
      .map(([, val]) => val)
      .find((itemLang) => itemLang === acceptLanguage)

    return new PrefLang(lang ?? PrefLang.DEFAULT, lang === null)
  }

  constructor(
    public readonly lang: Lang,
    private readonly defaultSet: boolean,
  ) {}

  public isDefaultSet(): boolean {
    return this.defaultSet
  }

  public messageFromError(error: AppError): { errorMessage: string } {
    return { errorMessage: error.props[this.lang] }
  }

  public messageFromIntlMessage(msg: IntlMessage): { message: string } {
    return { message: msg.props[this.lang] }
  }
}
