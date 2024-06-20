import * as Errors from "@/src/application/errors"
import { Email, UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"
import { CompanyOwnerTransfer } from "../entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import { CompanyErrors } from "../errors"
import { CompanyOwnerTransferRepository, CompanyRepository, UserRepository } from "../repositories"

@injectable()
export class RequestUpdateOwnerCompany implements Usecase {
  constructor(
    private readonly companyOwnerTransferRepository: CompanyOwnerTransferRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}
  public async handle(
    companyId: number,
    toUserEmail: Email,
    authorId: UUID,
  ): Promise<CompanyOwnerTransfer> {
    if (!Number.isInteger(companyId)) {
      throw new CompanyErrors.IdCompanyIsMissingError()
    }

    if (toUserEmail instanceof Email === false) {
      throw new CompanyErrors.EmailOwnerTargetMissingError()
    }

    const { ownerUserId } = await this.companyRepository.get(companyId)

    if (!ownerUserId.isEqual(authorId)) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    const companyAlreadyInTransference =
      await this.companyOwnerTransferRepository.existsByCompanyId(companyId)

    if (companyAlreadyInTransference) {
      throw new Errors.CompanyOwnerTransferErrors.CompanyAlreadyInTransferenceError()
    }

    const { id: toUserId } = await this.userRepository.getByEmail(toUserEmail)

    return await this.companyOwnerTransferRepository.add({
      companyId,
      fromUserId: authorId,
      toUserId,
    })
  }
}
