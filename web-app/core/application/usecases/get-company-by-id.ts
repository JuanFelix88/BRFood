import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Company } from "../entities/Company/Company"
import { CompanyErrors } from "../errors/company"
import { UserErrors } from "../errors/user"
import { CompanyRepository } from "../repositories/company-repository"

@injectable()
export class GetCompanyById implements Usecase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async handle(id: number, userId: UUID): Promise<Company> {
    if (typeof id !== "number") {
      throw new CompanyErrors.IdCompanyIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(id, userId)

    if (!isUserAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    return await this.companyRepository.get(id)
  }
}
