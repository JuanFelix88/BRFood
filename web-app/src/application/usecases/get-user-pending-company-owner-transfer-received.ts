import { UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"
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
