// Reference copy of the test (passes against the good composed impl).
import { describe, expect, it } from 'vitest';
import { processData } from '../src/dataPipeline';

describe('processData reference (composed)', () => {
  it('produces correct enriched records', () => {
    const input = [
      'id,name,email,amount',
      '1, Alice ,ALICE@EX.COM, 100.5 ',
      '3,Carol,carol@ex.com,50',
    ];
    const out = processData(input);
    expect(out).toHaveLength(2);
    expect(out[0].total).toBeCloseTo(110.55);
  });
});
