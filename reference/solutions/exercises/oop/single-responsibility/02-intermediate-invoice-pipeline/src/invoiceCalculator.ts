import type { InvoiceCalculator, LineItem } from './types';

export class DefaultInvoiceCalculator implements InvoiceCalculator {
  compute(items: readonly LineItem[]): { subtotal: number; tax: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const taxRate = 0.1;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    return { subtotal, tax, total };
  }
}
