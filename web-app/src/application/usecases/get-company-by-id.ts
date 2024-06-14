import { Usecase } from "@/src/shared/entities/Usecase"
import { Company } from "../entities/Company/Company"
import { CompanyErrors } from "../errors/company"
import { CompanyRepository } from "../repositories/company-repository"
import { UUID } from "@/src/shared/entities/UUID"
import { UserErrors } from "../errors/user"

export class GetCompanyById implements Usecase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async handle(id: number, userId: UUID): Promise<Company> {
    if (typeof id !== "number") {
      throw new CompanyErrors.IdCompanyIsMissingError()
    }

    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(
      id,
      userId,
    )

    if (!isUserAuthorized) {
      throw new CompanyErrors.CompanyIsNotAuthorizedError()
    }

    return await this.companyRepository.get(id)
  }
}
