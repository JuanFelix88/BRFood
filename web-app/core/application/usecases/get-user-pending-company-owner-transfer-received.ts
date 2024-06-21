import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyOwnerTransfer } from "../entities/CompanyOwnerTransfer/CompanyOwnerTransfer"
import { UserErrors } from "../errors"
import { CompanyOwnerTransferRepository } from "../repositories"

@injectable()
export class GetUserPendingCompanyOwnerTransferReceived implements Usecase {
  constructor(private readonly companyOwnerTransferRepository: CompanyOwnerTransferRepository) {}
  public async handle(userId: UUID): Promise<CompanyOwnerTransfer[]> {
    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    return await this.companyOwnerTransferRepository.getPendingByToUserId(userId)
  }
}
