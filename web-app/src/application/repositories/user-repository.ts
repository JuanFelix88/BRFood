import { AutoGenerateds } from "@/src/shared/entities/AutoGenerateds"
import { User } from "../entities/User"
import { Email } from "@/src/shared/entities/Email"
import { UUID } from "@/src/shared/entities/UUID"

export namespace UserRepository {
  export interface AddPayload {
    name: string
    email: Email
    password: string
  }
}

export abstract class UserRepository {
  public abstract add(
    user: UserRepository.AddPayload
  ): Promise<Omit<User, "company">>
  public abstract exists(id: UUID): Promise<boolean>
  public abstract get(id: number): Promise<User>
  public abstract save(user: User): Promise<void>
  public abstract delete(user: User): Promise<void>
}