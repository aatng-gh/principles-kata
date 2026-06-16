import type { InvoiceItem } from './invoiceService';

export interface InvoiceTotals {
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
}

export interface InvoiceCalculator {
  calculate(items: readonly InvoiceItem[]): InvoiceTotals;
}

export class DefaultInvoiceCalculator implements InvoiceCalculator {
  calculate(items: readonly InvoiceItem[]): InvoiceTotals {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  }
}
