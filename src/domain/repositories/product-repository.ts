import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "../entities/product";

export interface ProductRepository {
  findById(productId: UniqueEntityID): Promise<Product | null>;
  save(product: Product): Promise<void>;
}
