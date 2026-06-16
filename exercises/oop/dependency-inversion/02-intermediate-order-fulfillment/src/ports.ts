// exercises/oop/dependency-inversion/02-intermediate-order-fulfillment/src/ports.ts
// Ports (abstractions the policy depends on) and Order data model (shared entity shape).
// Adapters depend on and implement these; policy depends only on these names.
// Moved out of policy implementation file to eliminate co-location of contracts/data with FulfillmentService.
export interface Order {
  id: string;
  customerId: string;
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

export interface FulfillmentPorts {
  readonly orders: OrderRepository;
  readonly payments: PaymentGateway;
  readonly inventory: Inventory;
  readonly clock: Clock;
}
