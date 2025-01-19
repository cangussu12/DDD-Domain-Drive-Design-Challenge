import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { MovementHistory } from "@/domain/entities/value-objects/movement-history";
import { StockQuantity } from "@/domain/entities/value-objects/stock-quantity";

import { describe, expect, it } from "vitest";

describe("Product Entity", () => {
  it("should add stock and register the movement", () => {
    const product = Product.create({
      id_product: new UniqueEntityID(),
      supplier_id: new UniqueEntityID(),
      name: "Example Product",
      stock_quantity: new StockQuantity(50, 10),
      minimum_quantity_available: 10,
      movement_history: new MovementHistory(),
      createdAt: new Date(),
    });

    // Adicionando estoque
    product.addStock(20, "Added stock");

    // Verifica se o estoque foi atualizado corretamente
    expect(product.getStockQuantity().getCurrent()).toBe(70);

    // Confirma que o movimento foi registrado
    expect(product.getMovementHistory().getMovements()).toHaveLength(1);

    // Verifica as propriedades do movimento registrado
    const movement = product.getMovementHistory().getMovements()[0];
    expect(movement).toMatchObject({
      quantity: 20,
      type: "in",
      description: "Added stock",
    });
  });
});
