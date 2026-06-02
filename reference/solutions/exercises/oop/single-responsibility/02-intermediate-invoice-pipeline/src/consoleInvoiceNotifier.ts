import type { Invoice, InvoiceNotifier } from './types';

export class ConsoleInvoiceNotifier implements InvoiceNotifier {
  async notifyInvoiceReady(invoice: Invoice): Promise<void> {
    console.log(
      `[NOTIFY] Invoice ${invoice.id} ready for order ${invoice.orderId} (total: ${invoice.total})`
    );
  }
}
