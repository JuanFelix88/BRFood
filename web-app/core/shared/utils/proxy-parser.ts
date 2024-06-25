import { ParsePayloadErrors } from "@/core/application/errors"
import { StaticClass } from "./static-class"

export type InvalidError = new (keyname: string) => unknown

export class ProxyParser extends StaticClass {
  protected static getMainBody(
    originalTarget: any,
    Error: InvalidError = ParsePayloadErrors.InvalidPayloadError,
  ) {
    if (Array.isArray(originalTarget)) {
      return originalTarget
    }

    if (typeof originalTarget !== "object") {
      return originalTarget
    }

    return new Proxy(originalTarget, {
      get: (target: any, key: string) => {
        return this.getPreventedObject(target[key], key, Error)
      },
    })
  }

  protected static getPreventedObject(
    originalTarget: any,
    keyName: string,
    Error: InvalidError = ParsePayloadErrors.InvalidPayloadError,
  ) {
    if (typeof originalTarget === "string" || typeof originalTarget === "number") {
      return originalTarget
    }

    return new Proxy(
      originalTarget ?? {
        [Symbol.toStringTag]: () => "undefined",
      },
      {
        get: (target: any, key: string) => {
          if (!originalTarget) {
            throw new Error(keyName)
          }

          if (key in originalTarget === false) {
            throw new Error(keyName)
          }

          return originalTarget[key]
        },
        apply(target, thisArg, argArray) {
          if (!originalTarget) {
            throw new Error(keyName)
          }
          return target(...argArray)
        },
      },
    )
  }
}
