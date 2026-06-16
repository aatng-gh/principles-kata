import type { InvoiceTotals } from './invoiceCalculator';
import type { CreateInvoiceInput, Invoice } from './invoiceService';

export interface InvoiceFactory {
  create(input: CreateInvoiceInput, totals: InvoiceTotals): Invoice;
}

export class DefaultInvoiceFactory implements InvoiceFactory {
  create(input: CreateInvoiceInput, totals: InvoiceTotals): Invoice {
    return {
      id: `inv_${Date.now()}`,
      customerId: input.customerId,
      items: input.items.map((item) => ({ ...item })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      createdAt: new Date(),
    };
  }
}
