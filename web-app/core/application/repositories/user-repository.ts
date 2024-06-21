import { User } from "@/core/application/entities/User/User"
import { Email } from "@/core/shared/entities/Email"
import { UUID } from "@/core/shared/entities/UUID"

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
  public abstract getManyByEmail(emails: Email[]): Promise<User[]>
}
