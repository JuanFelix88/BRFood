import { UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"
import * as Errors from "@/src/application/errors"
import { CompanyOwnerTransfer } from "../entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import { CompanyOwnerTransferRepository, CompanyRepository } from "../repositories"

@injectable()
export class DeclineCompanyTransferOwner implements Usecase {
  constructor(private readonly companyOwnerTransferRepository: CompanyOwnerTransferRepository) {}
  public async handle(transferId: number, authorId: UUID): Promise<CompanyOwnerTransfer> {
    if (!Number.isInteger(transferId)) {
      throw new Errors.CompanyOwnerTransferErrors.TransferIdIsMissingError()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    const { toUserId } = await this.companyOwnerTransferRepository.get(transferId)

    if (!toUserId.isEqual(authorId)) {
      throw new Errors.CompanyOwnerTransferErrors.UnauthorizedModifyRequestError()
    }

    return await this.companyOwnerTransferRepository.decline(transferId)
  }
}
