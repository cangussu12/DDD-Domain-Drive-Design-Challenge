export interface Movement {
    date: Date
    quantity: number
    type: "in" | "out"
    description?: string
  }
  
  export class MovementHistory {
    private readonly movements: Movement[]
  
    constructor(movements: Movement[] = []) {
      this.movements = movements
    }
  
    addMovement(movement: Movement) {
      this.movements.push(movement)
    }
  
    getMovements(): Movement[] {
      return [...this.movements]
    }
  }
  