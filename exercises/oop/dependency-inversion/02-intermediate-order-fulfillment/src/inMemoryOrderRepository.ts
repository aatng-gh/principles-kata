import type { Order, OrderRepository } from './ports';

export class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();
  async findById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, { ...order });
  }
}
