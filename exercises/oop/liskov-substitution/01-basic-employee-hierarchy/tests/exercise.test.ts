// exercises/oop/liskov-substitution/01-basic-employee-hierarchy/tests/exercise.test.ts
import { describe, expect, it } from 'vitest';
import { Contractor, type Employee, Intern, Manager } from '../src/employeeHierarchy';

describe('Employee hierarchy (LSP basic)', () => {
  it('manager pay includes bonus and has high approval limit', () => {
    const m = new Manager('m1', 'Sam', 8000, 2000);
    expect(m.calculatePay()).toBe(10000);
    expect(m.approveExpense(5000)).toBe(true);
    expect(m.approveExpense(15000)).toBe(false);
  });

  it('contractor pay is hours * rate; currently rejects all expenses (to be made substitutable)', () => {
    const c = new Contractor('c1', 'Pat', 75, 40);
    expect(c.calculatePay()).toBe(3000);
    // current behavior (LSP violation) — test does not require the false for small in the contract
    expect(c.approveExpense(100)).toBe(false);
  });

  it('intern pay is stipend (special rule)', () => {
    const i = new Intern('i1', 'Jo', 1500);
    expect(i.calculatePay()).toBe(1500);
    // NOTE: starter throws on approve; good LSP design makes all subtypes safely substitutable
    // so a uniform processor can call approve without knowing the subtype. We avoid asserting
    // the throw here so that a correct fix (no-throw, consistent contract) keeps this test green.
  });

  it('polymorphic payroll processor works for mixed list via base type', () => {
    const mgr = new Manager('m2', 'Lead', 7000, 1500);
    const ctr = new Contractor('c2', 'Pat', 75, 40);
    const itn = new Intern('i2', 'Jo', 2000);
    const emps: Employee[] = [mgr, ctr, itn];

    // simple processor written against the base type only
    const total = emps.reduce((sum, e) => sum + e.calculatePay(), 0);
    expect(total).toBe(8500 + 3000 + 2000);

    const canApproveSmall = emps.every((e) => {
      try {
        return e.approveExpense(200);
      } catch {
        return false;
      }
    });
    expect(canApproveSmall).toBe(false); // because contractor/intern current behavior
  });
});
