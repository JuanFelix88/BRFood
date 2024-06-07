import { Usecase } from "@/src/shared/entities/Usecase"
import { AuthToken } from "@/src/shared/entities/AuthToken"
import { AuthRepository } from "../repositories/auth-repository"
import { Email } from "@/src/shared/entities/Email"
import { AuthErrors } from "../errors/auth"

export class SignInUser implements Usecase {
  constructor(private readonly authRepository: AuthRepository) {}

  public async handle(email: Email, password: string): Promise<AuthToken> {
    if (email === undefined) {
      throw new AuthErrors.EmailCannotEmptyError()
    }

    if (password === undefined || password.length === 0) {
      throw new AuthErrors.PasswordCannotEmptyError()
    }

    return await this.authRepository.SignIn(email, password)
  }
}
