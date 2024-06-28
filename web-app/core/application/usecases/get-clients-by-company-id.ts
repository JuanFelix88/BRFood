import { Client } from "@/core/application/entities/Client/Client"
import * as Errors from "@/core/application/errors"
import { ArrayCA, Pagination, UUID } from "@/core/shared/entities"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { CompanyRepository } from "../repositories"
import { ClientRepository } from "../repositories/client-repository"

@injectable()
export class GetClientsByCompanyId implements Usecase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly clientRepository: ClientRepository,
  ) {}
  public async handle(
    companyId: number,
    authorId: UUID,
    pagination: Pagination,
  ): Promise<ArrayCA<Client>> {
    pagination.throws.ifLimitIsGreaterThan(50)

    if (authorId instanceof UUID === false) {
      throw new Errors.UserErrors.IdUserIsMissingError()
    }

    if (!Number.isInteger(companyId)) {
      throw new Errors.CompanyErrors.IdCompanyIsMissingError()
    }

    if (companyId <= 0) {
      throw new Errors.CompanyErrors.IdCompanyIsInvalidError()
    }

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(companyId, authorId)

    if (!isUserAuthorized) {
      throw new Errors.CompanyErrors.IsNotAuthorizedError()
    }

    return await this.clientRepository.listByCompanyId(
      companyId,
      pagination.offset,
      pagination.limit,
    )
  }
}
