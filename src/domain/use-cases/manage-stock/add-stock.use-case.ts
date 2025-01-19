import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { InMemoryProductRepository } from "@/domain/repositories/in-memory-product-repository";
import { ProductNotFound } from "./errors/product_not_found";
import { QuantityMustBeGreaterThanZero } from "./errors/quantity_must_be_greater_than_zero";
import { ManageStockInput, ManageStockOutput } from "./manage-stock.dto";

export class AddStockUseCase {
  async execute(input: ManageStockInput): Promise<ManageStockOutput> {
    const { productId, quantity, description } = input;
    
    const product = await this.loadProduct(productId); 

    if (!product) {
      throw new ProductNotFound();
    }

    if (quantity <= 0) {
      throw new QuantityMustBeGreaterThanZero();
    }

    product.addStock(quantity, description ?? 'stock adjustment');

    return {
      success: true,
      productId: productId.toString(),
      newStockQuantity: product.getStockQuantity().getCurrent(),
      isCritical: product.getStockQuantity().getCurrent() <= product.getStockQuantity().getMinimum(),
    };
  }

  private async loadProduct(productId: UniqueEntityID): Promise<Product | null> {
    const product = await InMemoryProductRepository.findById(productId);
    
    if (!product) {
      throw new ProductNotFound();
    }
  
    return product;
  }
}
