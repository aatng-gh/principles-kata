// exercises/oop/dependency-inversion/02-intermediate-order-fulfillment/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FulfillmentService, type Order } from '../src/orderFulfillment';

describe('Order fulfillment (DIP intermediate)', () => {
  let service: FulfillmentService;

  beforeEach(() => {
    service = new FulfillmentService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('happy path: fulfills, charges, reserves, updates status', async () => {
    const order: Order = {
      id: 'f1',
      customerId: 'c1',
      items: [{ sku: 'WIDGET', qty: 2, unitPrice: 10 }],
      status: 'pending',
    };
    await service.seedOrder(order);

    const res = await service.fulfill('f1');
    expect(res.fulfilled).toBe(true);

    const final = await service.getOrder('f1');
    expect(final?.status).toBe('fulfilled');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[STRIPE] charged 20 for f1'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[INV] reserved 2 of WIDGET'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[AUDIT'));
  });

  it('fails when insufficient stock', async () => {
    const order: Order = {
      id: 'f2',
      customerId: 'c2',
      items: [{ sku: 'GADGET', qty: 99, unitPrice: 5 }],
      status: 'pending',
    };
    await service.seedOrder(order);

    const res = await service.fulfill('f2');
    expect(res.fulfilled).toBe(false);
    expect(res.reason).toMatch(/stock/i);

    const final = await service.getOrder('f2');
    expect(final?.status).toBe('failed');
  });

  it('fails for unknown order', async () => {
    const res = await service.fulfill('nope');
    expect(res.fulfilled).toBe(false);
    expect(res.reason).toMatch(/not found/i);
  });
});
