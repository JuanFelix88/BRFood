import * as Errors from "@/core/application/errors"
import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyOwnerTransferRepository } from "../repositories"

@injectable()
export class DeleteCompanyTransferOwner implements Usecase {
  constructor(private readonly companyOwnerTransferRepository: CompanyOwnerTransferRepository) {}
  public async handle(transferId: number, authorId: UUID): Promise<void> {
    if (!Number.isInteger(transferId)) {
      throw new Errors.CompanyOwnerTransferErrors.TransferIdIsMissingError()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    const { fromUserId } = await this.companyOwnerTransferRepository.get(transferId)

    if (!fromUserId.isEqual(authorId)) {
      throw new Errors.CompanyOwnerTransferErrors.UnauthorizedModifyRequestError()
    }

    await this.companyOwnerTransferRepository.delete(transferId)
  }
}
