import { User } from "@/src/application/entities/User/User"
import { Email } from "@/src/shared/entities/Email"
import { UUID } from "@/src/shared/entities/UUID"

export namespace UserRepository {
  export interface AddPayload {
    name: string
    email: Email
    password: string
  }

  export interface OverWriteBasicDataPayload {
    name: string
    email: Email
  }
}

export abstract class UserRepository {
  public abstract overWriteBasic(
    id: UUID,
    basicData: UserRepository.OverWriteBasicDataPayload,
  ): Promise<void>
  public abstract exists(id: UUID): Promise<boolean>
  public abstract get(id: UUID): Promise<User>
  public abstract getByEmail(email: Email): Promise<User>
}
