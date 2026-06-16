// exercises/oop/liskov-substitution/01-basic-employee-hierarchy/src/employeeHierarchy.ts
export abstract class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  abstract calculatePay(): number;

  approveExpense(amount: number): boolean {
    return amount <= this.expenseApprovalLimit;
  }

  protected get expenseApprovalLimit(): number {
    return 1000;
  }

  protected nonNegative(amount: number): number {
    return Math.max(0, amount);
  }
}

export class Manager extends Employee {
  constructor(
    id: string,
    name: string,
    private base: number,
    private bonus: number
  ) {
    super(id, name);
  }
  override calculatePay(): number {
    return this.nonNegative(this.base + this.bonus);
  }

  protected override get expenseApprovalLimit(): number {
    return 10000;
  }
}

export class Contractor extends Employee {
  constructor(
    id: string,
    name: string,
    private rate: number,
    private hours: number
  ) {
    super(id, name);
  }
  override calculatePay(): number {
    return this.nonNegative(this.rate * this.hours);
  }

  protected override get expenseApprovalLimit(): number {
    return 1000;
  }
}

export class Intern extends Employee {
  constructor(
    id: string,
    name: string,
    private stipend: number
  ) {
    super(id, name);
  }
  override calculatePay(): number {
    return this.nonNegative(this.stipend);
  }

  protected override get expenseApprovalLimit(): number {
    return 0; // special role: interns have $0 approval authority; still substitutable (returns false for >0, never throws)
  }
}
