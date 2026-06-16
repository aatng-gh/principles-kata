// exercises/oop/dependency-inversion/02-intermediate-order-fulfillment/src/orderFulfillment.ts
// DIP: high-level FulfillmentService policy only here (depends on ports only).
// Ports, Order data model, and createDefault wiring live in separate modules (ports.ts, wiring.ts).
// This removes co-location of contracts/data/wiring from the policy file. No `new` or Date in this file.
// Adapters implement ports in their files; they no longer import from the policy module.
import type {
  Order,
  OrderRepository,
  PaymentGateway,
  Inventory,
  Clock,
  FulfillmentPorts,
} from './ports';
import { createDefaultFulfillmentPorts } from './wiring';

export type { Order } from './ports';
export type {
  OrderRepository,
  PaymentGateway,
  Inventory,
  Clock,
  FulfillmentPorts,
} from './ports';
export { createDefaultFulfillmentPorts } from './wiring';

export class FulfillmentService {
  private readonly orders: OrderRepository;
  private readonly payments: PaymentGateway;
  private readonly inventory: Inventory;
  private readonly clock: Clock;

  constructor(ports: FulfillmentPorts = createDefaultFulfillmentPorts()) {
    this.orders = ports.orders;
    this.payments = ports.payments;
    this.inventory = ports.inventory;
    this.clock = ports.clock;
  }

  async fulfill(orderId: string): Promise<{ fulfilled: boolean; reason?: string }> {
    const order = await this.orders.findById(orderId);
    if (!order) return { fulfilled: false, reason: 'order not found' };
    if (order.status !== 'pending') return { fulfilled: false, reason: 'already processed' };

    const total = order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

    for (const item of order.items) {
      if (!(await this.inventory.hasStock(item.sku, item.qty))) {
        const failedOrder = { ...order, status: 'failed' as const };
        await this.orders.save(failedOrder);
        return { fulfilled: false, reason: `insufficient stock for ${item.sku}` };
      }
    }

    const charge = await this.payments.charge(orderId, total);
    if (!charge.success) {
      const failedOrder = { ...order, status: 'failed' as const };
      await this.orders.save(failedOrder);
      return { fulfilled: false, reason: 'payment declined' };
    }

    for (const item of order.items) {
      await this.inventory.reserve(item.sku, item.qty);
    }

    const fulfilledOrder = { ...order, status: 'fulfilled' as const };
    await this.orders.save(fulfilledOrder);

    console.log(`[AUDIT ${this.clock.now().toISOString()}] fulfilled ${orderId}`);

    return { fulfilled: true };
  }

  // test helpers (exposed in starter)
  async seedOrder(order: Order) {
    await this.orders.save(order);
  }
  getOrder(id: string) {
    return this.orders.findById(id);
  }
}
