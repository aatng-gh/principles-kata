import type { CreateInvoiceInput } from './invoiceService';

export interface InvoiceValidator {
  validate(input: CreateInvoiceInput): void;
}

export class BasicInvoiceValidator implements InvoiceValidator {
  validate(input: CreateInvoiceInput): void {
    if (!input.customerId || input.items.length === 0) {
      throw new Error('Invalid invoice input');
    }
  }
}
