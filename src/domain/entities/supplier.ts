import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface SupplierProps {
    name: string
    phone: string
    email: string
    products_available: string
    delivery_time: string
    createdAt: Date
    updatedAt?: Date
}

export class Supplier extends Entity<SupplierProps> {
    static create(
        props: SupplierProps,
        id?: UniqueEntityID,
    ) {
        const supplier = new Supplier(props, id)

        return supplier
    }
}