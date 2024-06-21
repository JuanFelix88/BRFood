import { AuthToken } from "@/core/shared/entities/AuthToken"
import { Email } from "@/core/shared/entities/Email"
import { Usecase } from "@/core/shared/entities/Usecase"
import { injectable } from "@/core/shared/utils/dependency-injection"
import { AuthErrors } from "../errors/auth"
import { AuthRepository } from "../repositories/auth-repository"

@injectable()
export class SigninUser implements Usecase {
  constructor(private readonly authRepository: AuthRepository) {}

  public async handle(email: Email, password: string): Promise<AuthToken> {
    if (email === undefined) {
      throw new AuthErrors.EmailCannotEmptyError()
    }

    if (password === undefined || password.length === 0) {
      throw new AuthErrors.PasswordCannotEmptyError()
    }

    return await this.authRepository.signIn(email, password)
  }
}
