import { Usecase } from "@/src/shared/entities/Usecase"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { AuthRepository } from "../repositories/auth-repository"
import { Email } from "@/src/shared/entities/Email"
import { AuthErrors } from "../errors/auth"

export class SignInUser implements Usecase {
  constructor(public authRepository: AuthRepository) {}

  public async handle(email: string, password: string): Promise<AuthToken> {
    if (email === undefined || email.length === 0) {
      throw new AuthErrors.EmailCannotEmptyError()
    }

    if (password === undefined || password.length === 0) {
      throw new AuthErrors.PasswordCannotEmptyError()
    }

    return await this.authRepository.SignIn(new Email(email), password)
  }
}
