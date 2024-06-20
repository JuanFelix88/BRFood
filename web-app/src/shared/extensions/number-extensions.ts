export const numberExtensions = true

declare global {
  interface Number {
    isNumber(this: number, target: any): target is number
  }
}

Number.prototype.isNumber = function (
  this: number,
  target: any,
): target is number {
  return target instanceof Number
}
