import * as Errors from "@/core/application/errors"
import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Company } from "../entities/Company"
import { CompanyRepository } from "../repositories"

@injectable()
export class GetCompaniesByUser implements Usecase {
  constructor(private readonly companyRepository: CompanyRepository) {}
  public async handle(userId: UUID): Promise<Company[]> {
    if (userId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    return await this.companyRepository.getByAuthorizedUserId(userId)
  }
}
