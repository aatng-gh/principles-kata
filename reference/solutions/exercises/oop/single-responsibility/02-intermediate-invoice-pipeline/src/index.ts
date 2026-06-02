import { ConsoleInvoiceNotifier } from './consoleInvoiceNotifier';
import { ConsolePdfRenderer } from './consolePdfRenderer';
import { InMemoryInvoiceRepository } from './inMemoryInvoiceRepository';
import { DefaultInvoiceCalculator } from './invoiceCalculator';
import { InvoiceCreationService } from './invoiceCreationService';

export function createInvoiceCreationService() {
  return new InvoiceCreationService(
    new DefaultInvoiceCalculator(),
    new InMemoryInvoiceRepository(),
    new ConsolePdfRenderer(),
    new ConsoleInvoiceNotifier()
  );
}

export { InvoiceCreationService } from './invoiceCreationService';
export type { Invoice, LineItem } from './types';
