import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { MovementHistory } from "./value-objects/movement-history"
import { StockQuantity } from "./value-objects/stock-quantity"

interface ProductProps {
    id_product: UniqueEntityID
    supplier_id: UniqueEntityID
    name: string
    stock_quantity: StockQuantity
    minimum_quantity_available: number
    movement_history: MovementHistory
    createdAt: Date
    updatedAt?: Date
    size?: string
    color?: string
}

export class Product extends Entity<ProductProps> {
  static create(props: ProductProps): Product {
    if (!props.createdAt) {
      props.createdAt = new Date();
    }
    return new Product(props);
  }

  static edit(product: Product, updates: Partial<ProductProps>): Product {
    // Validações
    if (updates.stock_quantity) {
      if (updates.stock_quantity.getCurrent() < 0) {
        throw new Error("Stock quantity cannot be negative");
      }
    }
  
    // Se houver atualização no nome, pode adicionar validação
    if (updates.name) {
      if (updates.name.length < 3) {
        throw new Error("Product name must be at least 3 characters long");
      }
    }
  
    const updatedProps = {
      ...product.props,
      ...updates,
      updatedAt: new Date()
    };
  
    if (updates.stock_quantity && 
        updates.stock_quantity.getCurrent() !== product.props.stock_quantity.getCurrent()) {
      
      const quantityDiff = updates.stock_quantity.getCurrent() - product.props.stock_quantity.getCurrent();
      
      updatedProps.movement_history.addMovement({
        date: new Date(),
        quantity: Math.abs(quantityDiff),
        type: quantityDiff > 0 ? "in" : "out",
        description: "Stock updated through edit"
      });
    }
  
    return new Product(updatedProps);
  }

      getName(): string {
        return this.props.name;
      }

      getId(): UniqueEntityID {
        return this.props.id_product;
      }

      getCreatedAt(): Date {
        return this.props.createdAt;
      }

      getUpdatedAt(): Date | undefined {
        return this.props.updatedAt;
      }

      getSupplierid(): UniqueEntityID {
        return this.props.supplier_id
      }
    
      getStockQuantity(): StockQuantity {
        return this.props.stock_quantity
      }
    
      getMovementHistory(): MovementHistory {
        return this.props.movement_history
      }
    
      addStock(quantity: number, p0: string) {
        const current = this.props.stock_quantity.getCurrent() + quantity
        const minimum = this.props.stock_quantity.getMinimum()
        this.props.stock_quantity = new StockQuantity(current, minimum)
        this.props.movement_history.addMovement({
          date: new Date(),
          quantity,
          type: "in",
          description: "Added stock"
        })
        this.touch()
      }
    
      removeStock(quantity: number, p0: string) {
        const current = this.props.stock_quantity.getCurrent() - quantity
        if (current < 0) {
          throw new Error("Estoque insuficiente para a remoção.")
        }
    
        const minimum = this.props.stock_quantity.getMinimum()
        this.props.stock_quantity = new StockQuantity(current, minimum)
        this.props.movement_history.addMovement({
          date: new Date(),
          quantity,
          type: "out",
          description: "Removed stock"
        })
        this.touch()
      }

      editStock(quantity: number, p0: string) {
        const current = this.props.stock_quantity.getCurrent() + quantity
        const minimum = this.props.stock_quantity.getMinimum()
        this.props.stock_quantity = new StockQuantity(current, minimum)
        this.props.movement_history.addMovement({
          date: new Date(),
          quantity,
          type: "in",
          description: "Edited stock"
        })
        this.touch()
      }
    
      private touch() {
        this.props.updatedAt = new Date()
      }

}