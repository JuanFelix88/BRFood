declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly IGNORE_DEPENDENCIES?: "YES"
      readonly CONSOLE_ERROR?: "YES"
      readonly JWT_SECRET: string
      readonly SUPABASE_URL: string
      readonly SUPABASE_KEY: string
      readonly POSTGRES_HOST: string
      readonly POSTGRES_PORT: number
      readonly POSTGRES_USER: string
      readonly POSTGRES_PASSWORD: string
      readonly POSTGRES_DATABASE: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
