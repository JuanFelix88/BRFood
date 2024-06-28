import { AmountValue, DateTime, UUID } from "@/core/shared/entities"

export namespace ProductInventory {
  export interface Sale {
    saleId: number
    authorId: UUID
  }

  export interface Discard {
    discardId: number
    authorId: UUID
  }

  export interface Purchase {
    purchaseId: number
    authorId: UUID
  }
}

/**
 * ### ProductInventory
 * Respective product stock, contains a history of movement ↗️
 */
export interface ProductInventory {
  id: number
  amount: AmountValue
  productId: number
  productName: string
  authorId: UUID
  sale?: ProductInventory.Sale
  discard?: ProductInventory.Discard
  purchase?: ProductInventory.Purchase
  createdAt: DateTime
}
