import { AuthErrors } from "@/core/application/errors/auth"
import { AuthRepository } from "@/core/application/repositories/auth-repository"
import { AuthToken } from "@/core/shared/entities/AuthToken"
import { Email } from "@/core/shared/entities/Email"
import { injectable } from "@/core/shared/utils"
import { SupabaseService } from "../../services/supabase"

@injectable("Supabase")
export class SupabaseAuthRepository implements AuthRepository {
  private readonly supabase = new SupabaseService()

  public async signIn(email: Email, password: string): Promise<AuthToken> {
    const supabaseClient = this.supabase.get()

    const resultAuth = await supabaseClient.auth.signInWithPassword({
      email: email.complete,
      password: password,
    })

    if (resultAuth.error || !resultAuth.data) {
      throw new AuthErrors.SignInFailedAuthError(resultAuth.error!.name)
    }

    return new AuthToken(resultAuth.data.session!.access_token)
  }

  public async signUp(email: Email, password: string): Promise<AuthToken> {
    const supabaseClient = this.supabase.get()

    const resultAuth = await supabaseClient.auth.signUp({
      email: email.complete,
      password: password,
    })

    if (resultAuth.error?.message === "User already registered") {
      throw new AuthErrors.UserAlreadyRegisteredByEmailError()
    }

    if (resultAuth.error || !resultAuth.data) {
      throw new AuthErrors.SignUpFailedAuthError(resultAuth.error!.message)
    }

    return new AuthToken(resultAuth.data.session!.access_token)
  }
}
