import { NextResponse } from "next/server"

export type GetResponse<T extends (...args: any) => any> =
  ReturnType<T> extends Promise<NextResponse<infer J>> ? J : never
