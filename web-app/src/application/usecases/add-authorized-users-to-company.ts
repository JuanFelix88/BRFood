import * as Errors from "@/src/application/errors"
import { Email, UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"
import { Company } from "../entities/Company"
import { CompanyRepository, UserRepository } from "../repositories"

@injectable()
export class AddAuthorizedUsersToCompany implements Usecase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}
  public async handle(
    companyId: number,
    authorizedEmails: Email[],
    authorId: UUID,
  ): Promise<Company> {
    if (!Number.isInteger(companyId)) {
      throw new Errors.CompanyErrors.IdCompanyIsMissingError()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    if (authorizedEmails.length === 0) {
      throw new Errors.CompanyErrors.AuthorizedUsersListIsEmptyError()
    }

    const { ownerUserId: companyOwnerUserId, authorizedUsersIds } =
      await this.companyRepository.get(companyId)

    if (!companyOwnerUserId.isEqual(authorId)) {
      throw new Errors.CompanyErrors.IsNotAuthorizedOwnerError()
    }

    const hasAnyInvalidEmail = authorizedEmails.some((email) => email instanceof Email === false)

    if (hasAnyInvalidEmail) {
      throw new Errors.CompanyErrors.HasIncorrectEmailsErrors()
    }

    const usersCandidates = await this.userRepository.getManyByEmail(authorizedEmails)

    if (usersCandidates.length !== authorizedEmails.length) {
      throw new Errors.CompanyErrors.HasIncorrectEmailsErrors()
    }

    const hasAlreadyAuthorizedUsersPreventDuplicates = authorizedUsersIds.some((authorizedUserId) =>
      usersCandidates.some(({ id }) => id.isEqual(authorizedUserId)),
    )

    if (hasAlreadyAuthorizedUsersPreventDuplicates) {
      throw new Errors.CompanyErrors.HasAuthorizedUsersInListError()
    }

    await this.companyRepository.addAuthorizedUsers(
      usersCandidates.map(({ id: userId }) => ({
        authorId,
        companyId,
        userId,
      })),
    )

    return await this.companyRepository.get(companyId)
  }
}
