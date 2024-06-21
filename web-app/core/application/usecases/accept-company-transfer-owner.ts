import * as Errors from "@/core/application/errors"
import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyOwnerTransfer } from "../entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import { CompanyOwnerTransferRepository, CompanyRepository } from "../repositories"

@injectable()
export class AcceptCompanyTransferOwner implements Usecase {
  constructor(
    private readonly companyOwnerTransferRepository: CompanyOwnerTransferRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  public async handle(transferId: number, authorId: UUID): Promise<CompanyOwnerTransfer> {
    if (!Number.isInteger(transferId)) {
      throw new Errors.CompanyOwnerTransferErrors.TransferIdIsMissingError()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    const { toUserId, companyId } = await this.companyOwnerTransferRepository.get(transferId)

    if (!toUserId.isEqual(authorId)) {
      throw new Errors.CompanyOwnerTransferErrors.UnauthorizedModifyRequestError()
    }

    const { name } = await this.companyRepository.get(companyId)

    await this.companyRepository.update(companyId, {
      name,
      ownerUserId: toUserId,
    })

    return await this.companyOwnerTransferRepository.accept(transferId)
  }
}
