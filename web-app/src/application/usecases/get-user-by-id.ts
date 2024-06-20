import { Usecase } from "@/src/shared/entities/Usecase"
import { UUID } from "@/src/shared/entities/UUID"
import { User } from "../entities/User/User"
import { UserRepository } from "../repositories/user-repository"
import { UserErrors } from "../errors/user"
import { injectable } from "@/src/shared/utils/dependency-injection"

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
