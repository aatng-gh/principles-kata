// exercises/fp/function-composition/01-basic-data-pipeline/tests/exercise.test.ts
import { describe, expect, it } from 'vitest';
import { ProcessedRecord, processCSV } from '../src/dataPipeline';

describe('dataPipeline (composition basic)', () => {
  it('parses, cleans, enriches, validates sample csv', () => {
    const csv =
      'id,name,amount,cat\n1,Alice,10.5,standard\n2,bob,  -3 ,vip\n3,Carol,20.0,VIP\nbadrow';
    const res = processCSV(csv);
    expect(res).toHaveLength(2);
    expect(res[0]).toEqual({ id: '1', name: 'alice', amount: 10.5, category: 'STANDARD' });
    expect(res[1]).toEqual({ id: '3', name: 'carol', amount: 20, category: 'PREMIUM' });
  });

  it('skips invalid rows', () => {
    const csv = 'id,name,amount,cat\nx,y,NaN,z';
    expect(processCSV(csv)).toHaveLength(0);
  });
});
