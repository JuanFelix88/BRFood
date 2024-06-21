import * as Errors from "@/src/application/errors"
import { UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"

@injectable()
export class Template implements Usecase {
  constructor() {}
  public async handle(first: unknown, authorId: UUID): Promise<unknown> {
    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    throw new Error("Not implemented")
  }
}
