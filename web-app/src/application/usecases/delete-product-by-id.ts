import * as Errors from "@/src/application/errors"
import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { injectable } from "@/src/shared/utils/dependency-injection"
import { SaleRepository } from "../repositories"
import { CompanyRepository } from "../repositories/company-repository"
import { ProductRepository } from "../repositories/product-repository"

@injectable()
export class DeleteProductById implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly saleRepository: SaleRepository,
  ) {}

  public async handle(productId: number, authorId: UUID): Promise<void> {
    if (typeof productId !== "number" || isNaN(productId)) {
      throw new Errors.ProductErrors.IdProductIsMissingError()
    }

    if (authorId instanceof UUID === false) {
      throw new Errors.AuthErrors.AuthorIdIsMissingError()
    }

    const { ownerCompanyId } = await this.productRepository.get(productId)

    const isUserAuthorized = await this.companyRepository.isUserAuthorized(ownerCompanyId, authorId)

    if (!isUserAuthorized) {
      throw new Errors.CompanyErrors.IsNotAuthorizedError()
    }

    const hasSalesWithProduct = await this.saleRepository.hasSalesByProductId(productId)

    if (hasSalesWithProduct) {
      throw new Errors.ProductErrors.NotAllowedDeleteProductHasSalesError()
    }

    await this.productRepository.delete(productId)
  }
}
