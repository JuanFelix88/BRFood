import { Lang } from "../intl/lang"
import { StatusCodes } from "http-status-codes"
type AppErrorProp = {
  [key in Lang]: string
}

export class AppError extends Error {
  private _statusCode = StatusCodes.BAD_REQUEST
  constructor(name: string, public readonly props: AppErrorProp) {
    super(props[Lang.EN])
    this.name = name
  }

  protected status(code: StatusCodes) {
    this._statusCode = code
  }

  public get statusCode(): StatusCodes {
    return this._statusCode
  }
}
