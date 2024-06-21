import { Usecase } from "@/core/shared/entities/Usecase"
import { UUID } from "@/core/shared/entities/UUID"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { User } from "../entities/User/User"
import { UserErrors } from "../errors/user"
import { UserRepository } from "../repositories/user-repository"

@injectable()
export class GetUserById implements Usecase {
  constructor(private readonly userRepository: UserRepository) {}
  public async handle(id: UUID): Promise<User> {
    if (!(id instanceof UUID)) {
      throw new UserErrors.IdUserIsMissingError()
    }

    return await this.userRepository.get(id)
  }
}
