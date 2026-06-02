// Reference copy (uses shell + pure).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processOrder } from '../src/shell';

describe('orderWorkflow reference (pure decider + commands)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('processes via commands from decider', async () => {
    const res = await processOrder('o1');
    expect(res.ok).toBe(true);
  });
});
