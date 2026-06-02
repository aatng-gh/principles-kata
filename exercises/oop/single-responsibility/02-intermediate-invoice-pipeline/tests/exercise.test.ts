// exercises/oop/single-responsibility/02-intermediate-invoice-pipeline/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type CreateInvoiceInput, InvoiceService } from '../src/invoiceService';

describe('InvoiceService (SRP intermediate)', () => {
  let service: InvoiceService;

  beforeEach(() => {
    service = new InvoiceService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('creates invoice with correct totals', async () => {
    const input: CreateInvoiceInput = {
      customerId: 'cust_1',
      items: [
        { description: 'Widget', amount: 100 },
        { description: 'Gadget', amount: 50 },
      ],
    };
    const inv = await service.createInvoice(input);

    expect(inv.id).toBeTypeOf('string');
    expect(inv.customerId).toBe('cust_1');
    expect(inv.subtotal).toBeCloseTo(150);
    expect(inv.tax).toBeCloseTo(15);
    expect(inv.total).toBeCloseTo(165);
    expect(inv.createdAt).toBeInstanceOf(Date);
    expect(inv.items).toHaveLength(2);
  });

  it('persists the invoice for retrieval', async () => {
    const input: CreateInvoiceInput = {
      customerId: 'c2',
      items: [{ description: 'Item', amount: 20 }],
    };
    const created = await service.createInvoice(input);
    const retrieved = service.getInvoice(created.id);
    expect(retrieved?.total).toBeCloseTo(22);
  });

  it('renders a PDF stub (observable via console)', async () => {
    await service.createInvoice({ customerId: 'c3', items: [{ description: 'X', amount: 10 }] });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[PDF] Rendered invoice'));
  });

  it('sends notifications for customer and accounting', async () => {
    await service.createInvoice({ customerId: 'c4', items: [{ description: 'Y', amount: 30 }] });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[NOTIFY] Invoice'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Accounting copy'));
  });

  it('rejects invalid input (no customer or no items)', async () => {
    await expect(
      service.createInvoice({ customerId: '', items: [{ description: 'Z', amount: 5 }] })
    ).rejects.toThrow(/invalid/i);
    await expect(service.createInvoice({ customerId: 'c5', items: [] })).rejects.toThrow(
      /invalid/i
    );
  });
});
