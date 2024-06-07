import { Usecase } from "@/src/shared/entities/Usecase"
import { UserErrors } from "../errors/user"
import { UserRepository } from "../repositories/user-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { Email } from "@/src/shared/entities/Email"
import { AuthRepository } from "../repositories/auth-repository"
import { AuthToken } from "@/src/shared/entities/AuthToken"

export interface SignUpUserData {
  name: string
  email: Email
  password: string
  confirmPassword: string
  companyName: string
}

export class SignUpUser implements Usecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly authRepository: AuthRepository
  ) {}

  public async handle({
    name,
    companyName,
    confirmPassword,
    email,
    password,
  }: SignUpUserData) {
    name = name.trim()
    companyName = companyName.trim()

    if (name.length === 0 || name.length > 60) {
      throw new UserErrors.InvalidInputName()
    }

    if (companyName.length === 0 || companyName.length > 70) {
      throw new UserErrors.InvalidInputCompanyName()
    }

    if (password !== confirmPassword) {
      throw new UserErrors.PasswordsDontMatch()
    }

    if (password.length < 8) {
      throw new UserErrors.PasswordIsTooShort()
    }

    const { id: userId, ...user } = await this.userRepository.add({
      email,
      password,
      name,
    })

    const company = await this.companyRepository.add({
      name: companyName,
      ownerUserId: userId,
      authorizedUsersIds: [userId],
    })

    const authToken = await this.authRepository.SignIn(email, password)

    return {
      authToken,
      company,
      user,
    }
  }
}
