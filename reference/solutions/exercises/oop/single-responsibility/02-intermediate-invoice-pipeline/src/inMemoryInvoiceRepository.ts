import type { Invoice, InvoiceRepository } from './types';

export class InMemoryInvoiceRepository implements InvoiceRepository {
  private invoices = new Map<string, Invoice>();

  async save(invoice: Invoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }

  async findById(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }
}
