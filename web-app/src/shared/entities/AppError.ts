import { Lang } from "../intl/lang"

type AppErrorProp = {
  [key in Lang]: string
}

export class AppError extends Error {
  constructor(name: string, prop: AppErrorProp) {
    super(prop[Lang.EN])
    this.name = name
  }
}
