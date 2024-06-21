import * as Errors from "@/src/application/errors"
import { UUID } from "@/src/shared/entities"
import { Usecase } from "@/src/shared/entities/Usecase"
import { injectable } from "@/src/shared/utils/dependency-injection"
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
