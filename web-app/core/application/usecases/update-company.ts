import { UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Company } from "../entities/Company"
import { CompanyErrors, UserErrors } from "../errors"
import { CompanyRepository } from "../repositories"

interface UpdateCompanyPayload {
  id: number
  name: string
}

@injectable()
export class UpdateCompany implements Usecase {
  constructor(private readonly companyRepository: CompanyRepository) {}
  public async handle({ id, name }: UpdateCompanyPayload, userId: UUID): Promise<Company> {
    if (name?.length === 0 || (name?.length ?? 0) > 70) {
      throw new CompanyErrors.InvalidInputCompanyName()
    }

    if (userId instanceof UUID === false) {
      throw new UserErrors.IdUserIsMissingError()
    }

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(id, userId)

    if (!isUserAuthorized) {
      throw new CompanyErrors.IsNotAuthorizedError()
    }

    const { ownerUserId } = await this.companyRepository.get(id)

    return await this.companyRepository.update(id, { name, ownerUserId })
  }
}
