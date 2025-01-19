import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { MovementHistory } from "@/domain/entities/value-objects/movement-history";
import { StockQuantity } from "@/domain/entities/value-objects/stock-quantity";
import { describe, expect, it } from "vitest";
import { ManageStockInput, ManageStockOutput } from "./manage-stock.dto";

describe("Manage Stock Use Case", () => {
  it("should remove stock and register the movement", () => {
    // Configuração inicial
    const product = Product.create({
      id_product: new UniqueEntityID(),
      supplier_id: new UniqueEntityID(),
      name: "Example Product",
      stock_quantity: new StockQuantity(50, 10),
      minimum_quantity_available: 10,
      movement_history: new MovementHistory(),
      createdAt: new Date(),
    });

    // Entrada simulada para o gerenciamento de estoque
    const input: ManageStockInput = {
      productId: product.id,
      quantity: -20, // Quantidade negativa indica remoção de estoque
    };

    // Executando a lógica de remoção
    const initialStock = product.getStockQuantity().getCurrent();
    product.removeStock(Math.abs(input.quantity), "Removed stock");

    // Saída esperada do gerenciamento de estoque
    const output: ManageStockOutput = {
      success: true,
      productId: input.productId.toString(),  // Aqui garantimos que estamos comparando uma string
      newStockQuantity: product.getStockQuantity().getCurrent(),
      isCritical: product.getStockQuantity().isCritical(),
    };

    // Verificações
    expect(output.success).toBe(true);
    expect(output.productId).toBe(input.productId.toString());  // Agora estamos comparando strings
    expect(output.newStockQuantity).toBe(initialStock - Math.abs(input.quantity));
    expect(output.isCritical).toBe(false); // O estoque não está abaixo do limite mínimo

    // Confirma que o movimento foi registrado
    expect(product.getMovementHistory().getMovements()).toHaveLength(1);

    // Verifica as propriedades do movimento registrado
    const movement = product.getMovementHistory().getMovements()[0];
    expect(movement).toMatchObject({
      quantity: 20, // A quantidade é sempre positiva no movimento
      type: "out",  // Tipo de movimento: saída
      description: "Removed stock",
    });
  });
});
