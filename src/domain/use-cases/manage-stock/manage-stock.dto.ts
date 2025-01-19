import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface ManageStockInput {
    productId: UniqueEntityID
    quantity: number
    description?: string
  }
  
  export interface ManageStockOutput {
    success: boolean
    productId: string
    newStockQuantity: number
    isCritical: boolean
  }
  