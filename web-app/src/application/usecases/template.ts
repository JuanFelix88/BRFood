import { Usecase } from "@/src/shared/entities/Usecase"

export class Template implements Usecase {
  constructor() {}
  public async handle(...args: unknown[]): Promise<unknown> {
    throw new Error("Method not implemented.")
  }
}
