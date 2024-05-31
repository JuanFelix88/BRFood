import { Lang } from "../intl/lang"

type AppErrorProp = {
  [key in Lang]: string
}

export class AppError extends Error {
  constructor(name: string, public readonly props: AppErrorProp) {
    super(props[Lang.EN])
    this.name = name
  }
}
