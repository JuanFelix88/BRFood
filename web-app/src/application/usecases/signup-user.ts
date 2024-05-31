import { Usecase } from "@/src/shared/entities/Usecase"
import { UserErrors } from "../errors/user"
import { UserRepository } from "../repositories/user-repository"
import { CompanyRepository } from "../repositories/company-repository"
import { Email } from "@/src/shared/entities/Email"
import { AuthRepository } from "../repositories/auth-repository"
import { AuthToken } from "@/src/shared/entities/AuthToken"

export interface SignUpUserData {
  name: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
}

export class SignUpUser implements Usecase {
  constructor(
    public userRepository: UserRepository,
    public companyRepository: CompanyRepository,
    public authRepository: AuthRepository
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
    email = email.trim()

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

    const emailContent = new Email(email)

    const { id: userId, ...user } = await this.userRepository.add({
      email: emailContent,
      password,
      name,
    })

    const company = await this.companyRepository.add({
      name: companyName,
      ownerUserId: userId,
      authorizedUsersIds: [userId],
    })

    const authToken = await this.authRepository.SignIn(emailContent, password)

    return {
      authToken,
      company,
      user,
    }
  }
}
