import { UUID } from "@/core/shared/entities"
import { CompanyOwnerTransfer } from "../entities/CompanyOwnerTransfer/CompanyOwnerTransfer"

export namespace CompanyOwnerTransferRepository {
  export interface AddPayload {
    companyId: number
    fromUserId: UUID
    toUserId: UUID
  }
}

export abstract class CompanyOwnerTransferRepository {
  public abstract getPendingByToUserId(toUserId: UUID): Promise<CompanyOwnerTransfer[]>
  public abstract get(id: number): Promise<CompanyOwnerTransfer>
  public abstract existsByCompanyId(companyId: number): Promise<boolean>
  public abstract add(
    payload: CompanyOwnerTransferRepository.AddPayload,
  ): Promise<CompanyOwnerTransfer>
  public abstract accept(companyOwnerTransferId: number): Promise<CompanyOwnerTransfer>
  public abstract decline(companyOwnerTransferId: number): Promise<CompanyOwnerTransfer>
  public abstract delete(companyOwnerTransferId: number): Promise<void>
}
