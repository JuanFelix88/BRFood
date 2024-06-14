import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { Product } from "../entities/Product/Product"
import { ProductRepository } from "../repositories/product-repository"
import { UserRepository } from "../repositories/user-repository"
import { UserErrors } from "../errors/user"

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

    return await this.productRepository.listByUserIdRelativeToOwnerCompany(
      userId.toString(),
    )
  }
}
