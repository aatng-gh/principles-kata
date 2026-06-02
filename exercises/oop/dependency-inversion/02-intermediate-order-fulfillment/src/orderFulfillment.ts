// exercises/oop/dependency-inversion/02-intermediate-order-fulfillment/src/orderFulfillment.ts
// THIS IS THE STARTER — high level FulfillmentService directly news 4 low-level details
// (repo, payment, inventory, clock via Date). Delivers the functional happy/failure paths.

export interface Order {
  id: string;
  customerId: string;
  items: Array<{ sku: string; qty: number; unitPrice: number }>;
  status: 'pending' | 'fulfilled' | 'failed';
}

export class InMemoryOrderRepository {
  private orders = new Map<string, Order>();
  async findById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, { ...order });
  }
}

export class StripePaymentGateway {
  async charge(orderId: string, amount: number): Promise<{ success: boolean; chargeId?: string }> {
    // always succeeds in starter for the test amounts
    console.log(`[STRIPE] charged ${amount} for ${orderId}`);
    return { success: true, chargeId: `ch_${orderId}` };
  }
}

export class WarehouseInventory {
  private stock = new Map<string, number>();
  constructor(seed?: Record<string, number>) {
    if (seed) for (const [k, v] of Object.entries(seed)) this.stock.set(k, v);
  }
  async hasStock(sku: string, qty: number): Promise<boolean> {
    return (this.stock.get(sku) ?? 0) >= qty;
  }
  async reserve(sku: string, qty: number): Promise<boolean> {
    const cur = this.stock.get(sku) ?? 0;
    if (cur < qty) return false;
    this.stock.set(sku, cur - qty);
    console.log(`[INV] reserved ${qty} of ${sku}`);
    return true;
  }
}

export class FulfillmentService {
  private repo = new InMemoryOrderRepository();
  private payment = new StripePaymentGateway();
  private inventory = new WarehouseInventory({ WIDGET: 10, GADGET: 5 });

  async fulfill(orderId: string): Promise<{ fulfilled: boolean; reason?: string }> {
    const order = await this.repo.findById(orderId);
    if (!order) return { fulfilled: false, reason: 'order not found' };
    if (order.status !== 'pending') return { fulfilled: false, reason: 'already processed' };

    const total = order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

    // check inventory (all items)
    for (const item of order.items) {
      if (!(await this.inventory.hasStock(item.sku, item.qty))) {
        order.status = 'failed';
        await this.repo.save(order);
        return { fulfilled: false, reason: `insufficient stock for ${item.sku}` };
      }
    }

    // charge
    const charge = await this.payment.charge(orderId, total);
    if (!charge.success) {
      order.status = 'failed';
      await this.repo.save(order);
      return { fulfilled: false, reason: 'payment declined' };
    }

    // reserve
    for (const item of order.items) {
      await this.inventory.reserve(item.sku, item.qty);
    }

    order.status = 'fulfilled';
    await this.repo.save(order);

    // "audit" with real time (bad)
    console.log(`[AUDIT ${new Date().toISOString()}] fulfilled ${orderId}`);

    return { fulfilled: true };
  }

  // test helpers (exposed in starter)
  async seedOrder(order: Order) {
    await this.repo.save(order);
  }
  getOrder(id: string) {
    return this.repo.findById(id);
  }
}
