import { randomUUID } from "node:crypto";

export class UniqueEntityID {
    private value: string;

    constructor(value?: string) {
        this.value = value ?? randomUUID();
    }

    // Método equals para comparar dois UniqueEntityID
    equals(id: UniqueEntityID): boolean {
        return this.value === id.toValue();
    }

    toString() {
        return this.value;
    }

    toValue() {
        return this.value;
    }
}
