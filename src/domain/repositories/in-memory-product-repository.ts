import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "../entities/product";

export class InMemoryProductRepository {
  private static products: Product[] = [];

  static async findById(id: UniqueEntityID): Promise<Product | null> {
    return this.products.find(product => product.getId().equals(id)) || null;
  }

  static async save(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.getId().equals(product.getId()));
    if (index >= 0) {
      this.products[index] = product;
    } else {
      this.products.push(product);
    }
  }

  static clear(): void {
    this.products = [];
  }
}