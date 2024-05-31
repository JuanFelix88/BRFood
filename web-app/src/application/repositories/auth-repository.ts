import { AuthToken } from "@/src/shared/entities/AuthToken"
import { Email } from "@/src/shared/entities/Email"

export abstract class AuthRepository {
  public abstract SignIn(email: Email, password: string): Promise<AuthToken>
}
