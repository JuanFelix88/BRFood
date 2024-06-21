import { AuthToken } from "./AuthToken"
import { UUID } from "./UUID"

export interface AuthCollection {
  authToken: AuthToken
  userId: UUID
  userName: string
}
