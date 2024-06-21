import { AuthToken } from "@/core/shared/entities/AuthToken"
import { Email } from "@/core/shared/entities/Email"

export abstract class AuthRepository {
  public abstract signIn(email: Email, password: string): Promise<AuthToken>
  public abstract signUp(email: Email, password: string): Promise<AuthToken>
}
