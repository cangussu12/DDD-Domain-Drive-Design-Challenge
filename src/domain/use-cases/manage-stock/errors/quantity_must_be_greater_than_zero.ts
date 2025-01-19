export class QuantityMustBeGreaterThanZero extends Error {
    constructor() {
        super('Quantity must be greater than zero')
    }
}