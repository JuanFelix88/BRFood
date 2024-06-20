import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"

@injectable()
export class Template implements Usecase {
  constructor() {}
  public async handle(...args: unknown[]): Promise<unknown> {
    throw new Error("Method not implemented.")
  }
}
