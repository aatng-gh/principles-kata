// exercises/oop/interface-segregation/01-basic-multifunction-device/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AdminConsole,
  BasicPrinter,
  FaxGateway,
  type IMachine,
  MultiFunctionMachine,
} from '../src/multifunctionDevice';

describe('Multifunction device (ISP basic)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('real multifunction machine supports all operations', () => {
    const mfp: IMachine = new MultiFunctionMachine();
    mfp.print('contract');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[MFP] printing: contract'));
    const scanned = mfp.scan();
    expect(scanned).toBe('scanned-content');
    mfp.fax('boss@fax', 'page1');
    mfp.copy();
  });

  it('basic printer client can print (test only exercises the capability it needs)', () => {
    const bp = new BasicPrinter();
    bp.print('memo');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[BASIC] printing: memo'));
    // In the starter the class is forced to implement scan/fax/copy (with throws).
    // A good ISP design removes those methods from BasicPrinter entirely.
  });

  it('fax gateway client can fax (test only exercises fax)', () => {
    const fax = new FaxGateway();
    fax.fax('partner@fax', 'signed-doc');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[FAX] sending to partner@fax')
    );
    // Starter forces the other three methods with throws; segregated design will not.
  });

  it('admin console works with the full machine', () => {
    const mfp = new MultiFunctionMachine();
    const admin = new AdminConsole(mfp);
    admin.runFullDiagnostics();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[MFP] printing: diag-page'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[MFP] faxing'));
  });
});
