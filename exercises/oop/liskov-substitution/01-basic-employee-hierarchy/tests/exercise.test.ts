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

  it('contractor pay is hours * rate and remains substitutable for small approvals', () => {
    const c = new Contractor('c1', 'Pat', 75, 40);
    expect(c.calculatePay()).toBe(3000);
    expect(c.approveExpense(100)).toBe(true);
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

    // Polymorphic use via base: all calls succeed (no exceptions) even though Intern (limit=0) will return false for 200.
    // This demonstrates special role behavior is observable through the base without weakening contract or forcing instanceof in client.
    const noExceptions = emps.every((e) => {
      try {
        e.approveExpense(200); // intern returns false here; manager/contractor return true
        return true;
      } catch {
        return false;
      }
    });
    expect(noExceptions).toBe(true);
  });
});
