// exercises/oop/dependency-inversion/02-intermediate-order-fulfillment/src/wiring.ts
// Composition root / default wiring for the exercise contract.
// This is the ONLY place that mentions (and constructs) the concrete adapter implementations.
// Policy (FulfillmentService) and port definitions have zero knowledge of which adapters are used.
import { InMemoryOrderRepository } from './inMemoryOrderRepository';
import { StripePaymentGateway } from './stripePaymentGateway';
import { SystemClock } from './systemClock';
import { WarehouseInventory } from './warehouseInventory';
import type { FulfillmentPorts } from './ports';

export function createDefaultFulfillmentPorts(): FulfillmentPorts {
  return {
    orders: new InMemoryOrderRepository(),
    payments: new StripePaymentGateway(),
    inventory: new WarehouseInventory({ WIDGET: 10, GADGET: 5 }),
    clock: new SystemClock(),
  };
}
