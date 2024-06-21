import * as Errors from "@/src/application/errors"
import { Email, UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { StringValidation } from "@/src/shared/utils"
import { injectable } from "@/src/shared/utils/dependency-injection"
import { Company } from "../entities/Company"
import { CompanyRepository, UserRepository } from "../repositories"

interface AddCompanyPayload {
  name: string
  authorizedEmails: Email[]
}

@injectable()
export class AddCompany implements Usecase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}
  public async handle(
    { authorizedEmails, name }: AddCompanyPayload,
    authorId: UUID,
  ): Promise<Company> {
    if (StringValidation.notIs(name, 3, 70)) {
      throw new Errors.CompanyErrors.InvalidInputCompanyName()
    }

    const hasAnyInvalidEmail = authorizedEmails.some((email) => email instanceof Email === false)

    if (hasAnyInvalidEmail) {
      throw new Errors.CompanyErrors.HasIncorrectEmailsErrors()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    const authorizedUsers = await this.userRepository.getManyByEmail(authorizedEmails)

    if (authorizedUsers.length !== authorizedEmails.length) {
      throw new Errors.CompanyErrors.HasIncorrectEmailsErrors()
    }

    return await this.companyRepository.add({
      name,
      authorizedUsersIds: [authorId, ...authorizedUsers.map(({ id }) => id)],
      ownerUserId: authorId,
    })
  }
}
