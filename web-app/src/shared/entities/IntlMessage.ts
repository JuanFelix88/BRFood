import { Lang } from "../intl/lang"

type IntlMessageProp = {
  [key in Lang]: string
}

export class IntlMessage {
  constructor(public readonly props: IntlMessageProp) {}
}
