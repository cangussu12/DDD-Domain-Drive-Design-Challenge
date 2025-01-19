import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { InMemoryProductRepository } from "@/domain/repositories/in-memory-product-repository";
import { ProductNotFound } from "./errors/product_not_found";
import { QuantityMustBeGreaterThanZero } from "./errors/quantity_must_be_greater_than_zero";

interface RemoveStockInput {
  productId: UniqueEntityID;  
  quantity: number;        
  description: string;      
}

interface RemoveStockOutput {
  product: Product;         
}

export class AddStockUseCase {
  async execute(input: RemoveStockInput): Promise<RemoveStockOutput> {
    const { productId, quantity, description } = input;
    
    const product = await this.loadProduct(productId); 

    if (!product) {
      throw new ProductNotFound();
    }

    if (quantity <= 0) {
      throw new QuantityMustBeGreaterThanZero();
    }

    product.removeStock(quantity, description);

    return {
      product
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