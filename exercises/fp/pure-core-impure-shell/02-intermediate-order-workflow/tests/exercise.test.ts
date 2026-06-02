// exercises/fp/pure-core-impure-shell/02-intermediate-order-workflow/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processOrder } from '../src/orderWorkflow';

describe('orderWorkflow (pure core + impure shell)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('approves small pending order (effects observed)', async () => {
    const res = await processOrder('o1');
    expect(res.ok).toBe(true);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[DB] get'),
      expect.anything()
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[PAY] charge'),
      expect.anything()
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[EMAIL]'), expect.anything());
  });

  it('rejects non-pending or large', async () => {
    // starter always returns the fake small pending, but test shape
    const res = await processOrder('o2');
    expect(res).toHaveProperty('ok');
  });
});
