import * as Errors from "@/core/application/errors"
import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"

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
