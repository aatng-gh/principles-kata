// exercises/oop/interface-segregation/02-intermediate-ecommerce-admin/src/ecommerceAdmin.ts
export interface Order {
  id: string;
  total: number;
  status: string;
}

export interface Report {
  period: string;
  totalSales: number;
}

export interface IOrderReader {
  getOrder(id: string): Order | undefined;
  listRecentOrders(limit: number): Order[];
}

export interface IReporting {
  generateSalesReport(period: string): Report;
}

export interface IInventoryOps {
  getStock(sku: string): number;
  updateStock(sku: string, delta: number): void;
  getLowStock(threshold: number): string[];
}

export interface IFinanceOps {
  refundOrder(id: string, amount: number): void;
  generateSalesReport(period: string): Report;
}

export interface IUserAdmin {
  suspendUser(userId: string): void;
  getUserStatus(userId: string): string;
}

export interface IPromoAdmin {
  createPromo(code: string, percent: number): void;
  listActivePromos(): string[];
}

export interface IAdminService
  extends IOrderReader,
    IReporting,
    IInventoryOps,
    IFinanceOps,
    IUserAdmin,
    IPromoAdmin {}

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

export class ReportingDashboard {
  constructor(private admin: IReporting & IOrderReader) {}
  getSummary(period: string) {
    const report = this.admin.generateSalesReport(period);
    const recent = this.admin.listRecentOrders(5);
    return { report, recentCount: recent.length };
  }
}

export class InventoryClerk {
  constructor(private admin: IInventoryOps) {}
  restock(sku: string, qty: number) {
    this.admin.updateStock(sku, qty);
  }
  findItemsToReorder(threshold = 5) {
    return this.admin.getLowStock(threshold);
  }
}

export class FinanceModule {
  constructor(private admin: IFinanceOps) {}
  issueRefund(orderId: string, amount: number) {
    this.admin.refundOrder(orderId, amount);
  }
  getFinancialReport(period: string) {
    return this.admin.generateSalesReport(period);
  }
}
