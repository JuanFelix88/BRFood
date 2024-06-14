import * as supabase from "@supabase/supabase-js"

export class SupabaseService {
  protected client: ReturnType<typeof supabase.createClient> | null = null

  public get() {
    if (!this.client) {
      this.client = supabase.createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!,
      )
    }

    return this.client
  }
}
