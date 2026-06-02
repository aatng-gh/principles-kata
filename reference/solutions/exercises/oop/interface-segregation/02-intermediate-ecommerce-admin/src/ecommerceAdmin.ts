// ISP segregated version.
// Narrow role interfaces for the three consumers.
// GodAdminService implements all of them so it can back any module (or a full admin UI).
// Modules now only know (and depend on) their slice.

export interface Order {
  readonly id: string;
  total: number;
  status: string;
}

export interface Report {
  readonly period: string;
  readonly totalSales: number;
}

export interface IReporting {
  generateSalesReport(period: string): Report;
  listRecentOrders(limit: number): Order[];
}

export interface IInventoryOps {
  getStock(sku: string): number;
  updateStock(sku: string, delta: number): void;
  getLowStock(threshold: number): string[];
}

export interface IFinanceOps {
  refundOrder(id: string, amount: number): void;
  generateSalesReport(period: string): Report; // reports are shared with reporting in this grouping
}

export interface IAdminService extends IReporting, IInventoryOps, IFinanceOps {
  // The full surface still exists for any truly cross-cutting admin console.
  // (We also keep the old user/promo methods on the god for completeness, but
  // they are not part of the segregated contracts the three modules use.)
  suspendUser(userId: string): void;
  getUserStatus(userId: string): string;
  createPromo(code: string, percent: number): void;
  listActivePromos(): string[];
}

export class GodAdminService implements IReporting, IInventoryOps, IFinanceOps, IAdminService {
  private orders = new Map<string, Order>();
  private stock = new Map<string, number>();
  private refunds: Array<{ id: string; amount: number }> = [];
  private promos = new Map<string, number>();
  private suspended = new Set<string>();

  constructor() {
    this.orders.set('o1', { id: 'o1', total: 99.5, status: 'paid' });
    this.stock.set('SKU-1', 10);
    this.stock.set('SKU-2', 2);
  }

  // IReporting + shared
  generateSalesReport(period: string): Report {
    const total = Array.from(this.orders.values()).reduce((s, o) => s + o.total, 0);
    return { period, totalSales: total };
  }
  listRecentOrders(limit: number) {
    return Array.from(this.orders.values()).slice(0, limit);
  }

  // IInventoryOps
  getStock(sku: string) {
    return this.stock.get(sku) ?? 0;
  }
  updateStock(sku: string, delta: number) {
    const cur = this.stock.get(sku) ?? 0;
    this.stock.set(sku, cur + delta);
  }
  getLowStock(threshold: number) {
    return Array.from(this.stock.entries())
      .filter(([, q]) => q < threshold)
      .map(([s]) => s);
  }

  // IFinanceOps
  refundOrder(id: string, amount: number) {
    this.refunds.push({ id, amount });
    const o = this.orders.get(id);
    if (o) o.status = 'refunded';
  }

  // remaining full-admin surface (not used by the three modules)
  suspendUser(userId: string) {
    this.suspended.add(userId);
  }
  getUserStatus(userId: string) {
    return this.suspended.has(userId) ? 'suspended' : 'active';
  }
  createPromo(code: string, percent: number) {
    this.promos.set(code, percent);
  }
  listActivePromos() {
    return Array.from(this.promos.keys());
  }
}

// Segregated modules

export class ReportingDashboard {
  constructor(private reporting: IReporting) {}
  getSummary(period: string) {
    const report = this.reporting.generateSalesReport(period);
    const recent = this.reporting.listRecentOrders(5);
    return { report, recentCount: recent.length };
  }
}

export class InventoryClerk {
  constructor(private inventory: IInventoryOps) {}
  restock(sku: string, qty: number) {
    this.inventory.updateStock(sku, qty);
  }
  findItemsToReorder(threshold = 5) {
    return this.inventory.getLowStock(threshold);
  }
}

export class FinanceModule {
  constructor(private finance: IFinanceOps) {}
  issueRefund(orderId: string, amount: number) {
    this.finance.refundOrder(orderId, amount);
  }
  getFinancialReport(period: string) {
    return this.finance.generateSalesReport(period);
  }
}
