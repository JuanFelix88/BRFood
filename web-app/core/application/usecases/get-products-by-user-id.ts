import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { Product } from "../entities/Product/Product"
import { UserErrors } from "../errors/user"
import { ProductRepository } from "../repositories/product-repository"
import { UserRepository } from "../repositories/user-repository"

@injectable()
export class GetProductsByUserId implements Usecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(userId: UUID): Promise<Product[]> {
    const existsUser = await this.userRepository.exists(userId)

    if (!existsUser) {
      throw new UserErrors.UserNotFound()
    }

    return await this.productRepository.listByUserIdRelativeToOwnerCompany(userId.toString())
  }
}
