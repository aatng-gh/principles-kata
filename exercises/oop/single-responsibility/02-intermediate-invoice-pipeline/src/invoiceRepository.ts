import type { Invoice } from './invoiceService';

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  findById(id: string): Invoice | undefined;
}

export class InMemoryInvoiceRepository implements InvoiceRepository {
  private readonly invoices = new Map<string, Invoice>();

  async save(invoice: Invoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }

  findById(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }
}
