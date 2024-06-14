import { AuthToken } from "@/src/shared/entities/AuthToken"
import { Email } from "@/src/shared/entities/Email"

export abstract class AuthRepository {
  public abstract signIn(email: Email, password: string): Promise<AuthToken>
  public abstract signUp(email: Email, password: string): Promise<AuthToken>
}
