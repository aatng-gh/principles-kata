// DIP ports-and-adapters for fulfillment.
// Policy depends only on ports. Adapters implement ports. All new of details is in wiring.
// A fake/test clock and in-memory adapters make the policy 100% deterministic and side-effect free in tests.

export interface Order {
  readonly id: string;
  readonly customerId: string;
  items: Array<{ sku: string; qty: number; unitPrice: number }>;
  status: 'pending' | 'fulfilled' | 'failed';
}

export interface OrderRepository {
  findById(id: string): Promise<Order | undefined>;
  save(order: Order): Promise<void>;
}

export interface PaymentGateway {
  charge(orderId: string, amount: number): Promise<{ success: boolean; chargeId?: string }>;
}

export interface Inventory {
  hasStock(sku: string, qty: number): Promise<boolean>;
  reserve(sku: string, qty: number): Promise<boolean>;
}

export interface Clock {
  now(): Date;
}

export class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();
  async findById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, { ...order, items: [...order.items] });
  }
}

export class FakePaymentGateway implements PaymentGateway {
  async charge(orderId: string, amount: number): Promise<{ success: boolean; chargeId?: string }> {
    console.log(`[STRIPE] charged ${amount} for ${orderId}`);
    return { success: true, chargeId: `ch_${orderId}` };
  }
}

export class InMemoryInventory implements Inventory {
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

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class TestClock implements Clock {
  private t: Date;
  constructor(start = new Date('2026-06-01T00:00:00Z')) {
    this.t = start;
  }
  now(): Date {
    return this.t;
  }
  advance(ms: number) {
    this.t = new Date(this.t.getTime() + ms);
  }
}

export class FulfillmentService {
  constructor(
    private readonly repo: OrderRepository = new InMemoryOrderRepository(),
    private readonly payment: PaymentGateway = new FakePaymentGateway(),
    private readonly inventory: Inventory = new InMemoryInventory({ WIDGET: 10, GADGET: 5 }),
    private readonly clock: Clock = new SystemClock()
  ) {}

  async fulfill(orderId: string): Promise<{ fulfilled: boolean; reason?: string }> {
    const order = await this.repo.findById(orderId);
    if (!order) return { fulfilled: false, reason: 'order not found' };
    if (order.status !== 'pending') return { fulfilled: false, reason: 'already processed' };

    const total = order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

    for (const item of order.items) {
      if (!(await this.inventory.hasStock(item.sku, item.qty))) {
        order.status = 'failed';
        await this.repo.save(order);
        return { fulfilled: false, reason: `insufficient stock for ${item.sku}` };
      }
    }

    const charge = await this.payment.charge(orderId, total);
    if (!charge.success) {
      order.status = 'failed';
      await this.repo.save(order);
      return { fulfilled: false, reason: 'payment declined' };
    }

    for (const item of order.items) {
      await this.inventory.reserve(item.sku, item.qty);
    }

    order.status = 'fulfilled';
    await this.repo.save(order);

    console.log(`[AUDIT ${this.clock.now().toISOString()}] fulfilled ${orderId}`);

    return { fulfilled: true };
  }

  // test helpers preserved for the exercise test contract
  async seedOrder(order: Order) {
    await this.repo.save(order);
  }
  async getOrder(id: string) {
    return this.repo.findById(id);
  }
}

export function createDefaultFulfillmentService(): FulfillmentService {
  return new FulfillmentService();
}
