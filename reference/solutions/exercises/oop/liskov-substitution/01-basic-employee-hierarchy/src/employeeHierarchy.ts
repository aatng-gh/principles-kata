// Reference good implementation — all subtypes are safely substitutable for Employee.
// Special rules expressed via ctor params (approval limit, bonus) or simple positive overrides.
// No new exceptions, no weakening of "small expense can be approved" (interns have limit 0 => false for >0).
// A client written against Employee can use any subtype (or mix in array) without instanceof or surprises.

export class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string,
    protected readonly baseSalary: number,
    protected readonly maxExpenseApproval: number = 1000
  ) {}

  calculatePay(): number {
    return this.baseSalary;
  }

  approveExpense(amount: number): boolean {
    return amount > 0 && amount <= this.maxExpenseApproval;
  }
}

export class Manager extends Employee {
  constructor(
    id: string,
    name: string,
    baseSalary: number,
    private readonly bonus: number
  ) {
    super(id, name, baseSalary, 10000);
  }

  calculatePay(): number {
    return this.baseSalary + this.bonus;
  }
}

export class Contractor extends Employee {
  constructor(
    id: string,
    name: string,
    private readonly hourlyRate: number,
    private readonly hours: number
  ) {
    // Contractor can approve only very small routine expenses; still honors "small can succeed" for <=200
    super(id, name, 0, 200);
  }

  calculatePay(): number {
    return this.hourlyRate * this.hours;
  }
}

export class Intern extends Employee {
  constructor(id: string, name: string) {
    // Intern stipend 0; approval limit 0 means cannot approve any positive amount (returns false, never throws)
    super(id, name, 0, 0);
  }

  calculatePay(): number {
    return 0;
  }
}
