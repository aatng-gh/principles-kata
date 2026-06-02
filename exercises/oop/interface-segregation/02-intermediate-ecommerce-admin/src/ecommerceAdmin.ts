// exercises/oop/interface-segregation/02-intermediate-ecommerce-admin/src/ecommerceAdmin.ts
// THIS IS THE STARTER — one broad IAdminService.
// The three modules take the fat interface but only use subsets.
// God impl provides everything (tests pass via the exercised paths).

export interface Order {
  id: string;
  total: number;
  status: string;
}

export interface Report {
  period: string;
  totalSales: number;
}

export interface IAdminService {
  // orders
  getOrder(id: string): Order | undefined;
  listRecentOrders(limit: number): Order[];
  refundOrder(id: string, amount: number): void;

  // inventory
  getStock(sku: string): number;
  updateStock(sku: string, delta: number): void;
  getLowStock(threshold: number): string[];

  // reports
  generateSalesReport(period: string): Report;

  // users
  suspendUser(userId: string): void;
  getUserStatus(userId: string): string;

  // promos
  createPromo(code: string, percent: number): void;
  listActivePromos(): string[];
}

export class GodAdminService implements IAdminService {
  private orders = new Map<string, Order>();
  private stock = new Map<string, number>();
  private refunds: Array<{ id: string; amount: number }> = [];
  private promos = new Map<string, number>();
  private suspended = new Set<string>();

  constructor() {
    // seed some data
    this.orders.set('o1', { id: 'o1', total: 99.5, status: 'paid' });
    this.stock.set('SKU-1', 10);
    this.stock.set('SKU-2', 2);
  }

  getOrder(id: string) {
    return this.orders.get(id);
  }
  listRecentOrders(limit: number) {
    return Array.from(this.orders.values()).slice(0, limit);
  }
  refundOrder(id: string, amount: number) {
    this.refunds.push({ id, amount });
    const o = this.orders.get(id);
    if (o) o.status = 'refunded';
  }

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

  generateSalesReport(period: string): Report {
    const total = Array.from(this.orders.values()).reduce((s, o) => s + o.total, 0);
    return { period, totalSales: total };
  }

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

// Modules that only need a slice but are typed to the whole thing in the starter.

export class ReportingDashboard {
  constructor(private admin: IAdminService) {}
  getSummary(period: string) {
    const report = this.admin.generateSalesReport(period);
    const recent = this.admin.listRecentOrders(5);
    return { report, recentCount: recent.length };
  }
}

export class InventoryClerk {
  constructor(private admin: IAdminService) {}
  restock(sku: string, qty: number) {
    this.admin.updateStock(sku, qty);
  }
  findItemsToReorder(threshold = 5) {
    return this.admin.getLowStock(threshold);
  }
}

export class FinanceModule {
  constructor(private admin: IAdminService) {}
  issueRefund(orderId: string, amount: number) {
    this.admin.refundOrder(orderId, amount);
  }
  getFinancialReport(period: string) {
    return this.admin.generateSalesReport(period);
  }
}
