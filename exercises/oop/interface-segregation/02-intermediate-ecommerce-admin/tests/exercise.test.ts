// exercises/oop/interface-segregation/02-intermediate-ecommerce-admin/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  FinanceModule,
  GodAdminService,
  InventoryClerk,
  ReportingDashboard,
} from '../src/ecommerceAdmin';

describe('E-commerce admin (ISP intermediate)', () => {
  let admin: GodAdminService;
  let reporting: ReportingDashboard;
  let clerk: InventoryClerk;
  let finance: FinanceModule;

  beforeEach(() => {
    admin = new GodAdminService();
    reporting = new ReportingDashboard(admin);
    clerk = new InventoryClerk(admin);
    finance = new FinanceModule(admin);
  });

  it('reporting dashboard can read reports and orders without touching other concerns', () => {
    const summary = reporting.getSummary('2026-Q2');
    expect(summary.report.totalSales).toBeGreaterThan(0);
    expect(summary.recentCount).toBeGreaterThan(0);
  });

  it('inventory clerk can adjust stock and query low stock', () => {
    const before = admin.getStock('SKU-1');
    clerk.restock('SKU-1', 5);
    expect(admin.getStock('SKU-1')).toBe(before + 5);

    const low = clerk.findItemsToReorder(5);
    expect(low).toContain('SKU-2');
  });

  it('finance module can refund and pull financial reports', () => {
    finance.issueRefund('o1', 50);
    // observable via god (or could expose on finance if segregated)
    // we inspect via the underlying for the test; in real the finance module would return its own record
    const report = finance.getFinancialReport('current');
    expect(report.totalSales).toBeGreaterThan(0);
  });

  it('all modules can be backed by the same full admin impl (effects visible across concerns when appropriate)', () => {
    clerk.restock('SKU-2', 10);
    finance.issueRefund('o1', 10);
    const summary = reporting.getSummary('test');
    expect(summary.report.totalSales).toBeGreaterThan(0);
    expect(admin.getStock('SKU-2')).toBeGreaterThan(5);
  });
});
