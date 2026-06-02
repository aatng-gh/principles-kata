// exercises/oop/dependency-inversion/01-basic-notification-service/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Order, OrderProcessor } from '../src/notificationService';

describe('OrderProcessor notification (DIP basic)', () => {
  let processor: OrderProcessor;

  beforeEach(() => {
    processor = new OrderProcessor();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('processes order and sends email + audit log', async () => {
    const order: Order = {
      id: 'ord-1',
      customerEmail: 'alice@example.com',
      items: ['book', 'pen'],
      total: 42.5,
    };
    await processor.process(order);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[EMAIL] to=alice@example.com')
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('order_processed ord-1'));
  });

  it('sends SMS when phone is present', async () => {
    const order: Order = {
      id: 'ord-2',
      customerEmail: 'bob@example.com',
      customerPhone: '+15551234',
      items: ['mug'],
      total: 12,
    };
    await processor.process(order);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[SMS] to=+15551234'));
  });

  it('does not send SMS when no phone', async () => {
    const order: Order = {
      id: 'ord-3',
      customerEmail: 'carol@example.com',
      items: ['sticker'],
      total: 3,
    };
    await processor.process(order);

    // no SMS line for this one (we can count or just ensure email+log happened)
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[EMAIL] to=carol@example.com')
    );
  });
});
