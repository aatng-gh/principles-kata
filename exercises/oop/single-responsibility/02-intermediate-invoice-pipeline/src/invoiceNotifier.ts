import type { Invoice } from './invoiceService';

export interface InvoiceNotifier {
  notifyCreated(invoice: Invoice): Promise<void>;
}

export class ConsoleInvoiceNotifier implements InvoiceNotifier {
  async notifyCreated(invoice: Invoice): Promise<void> {
    console.log(`[NOTIFY] Invoice ${invoice.id} sent to customer ${invoice.customerId}`);
    console.log(`[NOTIFY] Accounting copy for invoice ${invoice.id} total ${invoice.total}`);
  }
}
