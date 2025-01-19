import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { MovementHistory } from "@/domain/entities/value-objects/movement-history";
import { StockQuantity } from "@/domain/entities/value-objects/stock-quantity";

import { describe, expect, it } from "vitest";

describe("Product Entity", () => {
  it("should edit product name and stock quantity", () => {
    const product = Product.create({
      id_product: new UniqueEntityID(),
      supplier_id: new UniqueEntityID(),
      name: "Example Product",
      stock_quantity: new StockQuantity(50, 10),
      minimum_quantity_available: 10,
      movement_history: new MovementHistory(),
      createdAt: new Date(),
    });

    const updatedProduct = Product.edit(product, {
      name: "Product A Updated",
      stock_quantity: new StockQuantity(20, 5)
    });

    // Verifica se o nome foi atualizado
    expect(updatedProduct.getName()).toBe("Product A Updated");
    
    // Verifica se o stock quantity foi atualizado
    expect(updatedProduct.getStockQuantity().getCurrent()).toBe(20);
    expect(updatedProduct.getStockQuantity().getMinimum()).toBe(5);
    
    // Verifica se o movimento foi registrado corretamente
    expect(updatedProduct.getMovementHistory().getMovements()).toHaveLength(1);
    const movement = updatedProduct.getMovementHistory().getMovements()[0];
    expect(movement).toMatchObject({
      quantity: 30, // diferença entre 50 e 20
      type: "out",
      description: "Stock updated through edit",
    });

    // Verifica se a data de atualização foi modificada
    expect(updatedProduct.getUpdatedAt()).toBeDefined();
  });

  it("should edit only product name without affecting stock", () => {
    const product = Product.create({
      id_product: new UniqueEntityID(),
      supplier_id: new UniqueEntityID(),
      name: "Example Product",
      stock_quantity: new StockQuantity(50, 10),
      minimum_quantity_available: 10,
      movement_history: new MovementHistory(),
      createdAt: new Date(),
    });

    const updatedProduct = Product.edit(product, {
      name: "Product A Updated"
    });

    expect(updatedProduct.getName()).toBe("Product A Updated");
    expect(updatedProduct.getStockQuantity().getCurrent()).toBe(50);
    expect(updatedProduct.getMovementHistory().getMovements()).toHaveLength(0);
  });

  it("should throw error when trying to set negative stock quantity", () => {
    const product = Product.create({
      id_product: new UniqueEntityID(),
      supplier_id: new UniqueEntityID(),
      name: "Example Product",
      stock_quantity: new StockQuantity(50, 10),
      minimum_quantity_available: 10,
      movement_history: new MovementHistory(),
      createdAt: new Date(),
    });

    expect(() => 
      Product.edit(product, {
        stock_quantity: new StockQuantity(-10, 5)
      })
    ).toThrow("Stock quantity cannot be negative");
  });

  it("should maintain original properties when not specified in update", () => {
    const originalDate = new Date();
    const originalId = new UniqueEntityID();
    const originalSupplierId = new UniqueEntityID();

    const product = Product.create({
      id_product: originalId,
      supplier_id: originalSupplierId,
      name: "Example Product",
      stock_quantity: new StockQuantity(50, 10),
      minimum_quantity_available: 10,
      movement_history: new MovementHistory(),
      createdAt: originalDate,
    });

    const updatedProduct = Product.edit(product, {
      name: "Updated Name"
    });


    expect(updatedProduct.getId()).toEqual(originalId);
    expect(updatedProduct.getSupplierid()).toEqual(originalSupplierId);
    expect(updatedProduct.getCreatedAt()).toEqual(originalDate);
    expect(updatedProduct.getStockQuantity().getCurrent()).toBe(50);
    expect(updatedProduct.getStockQuantity().getMinimum()).toBe(10);
  });
});