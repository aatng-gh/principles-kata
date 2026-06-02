// exercises/oop/liskov-substitution/01-basic-employee-hierarchy/src/employeeHierarchy.ts
// STARTER — subtypes violate substitutability (e.g. Intern throws on approve, pay logic differs in incompatible ways).

export abstract class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  abstract calculatePay(): number;

  approveExpense(amount: number): boolean {
    return amount < 1000; // default
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
    return this.base + this.bonus;
  }
  override approveExpense(amount: number): boolean {
    return amount < 10000; // ok, wider
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
    return this.rate * this.hours;
  }
  // contractors can't approve? but overrides to false always — may violate caller expectations
  override approveExpense(_amount: number): boolean {
    return false;
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
    return this.stipend;
  }
  override approveExpense(_amount: number): boolean {
    throw new Error('Interns may not approve expenses');
  }
}
