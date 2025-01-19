export class StockQuantity {
    private readonly current: number
    private readonly minimum: number
  
    constructor(current: number, minimum: number) {
      if (current < 0) {
        throw new Error("Stock quantity cannot be negative")
      }
      if (minimum < 0) {
        throw new Error("The minimum quantity cannot be negative.")
      }
  
      this.current = current
      this.minimum = minimum
    }
  
    getCurrent() {
      return this.current
    }
  
    getMinimum() {
      return this.minimum
    }
  
    isCritical(): boolean {
      return this.current < this.minimum
    }
  }
  