// exercises/oop/single-responsibility/02-intermediate-invoice-pipeline/src/invoiceService.ts
import { DefaultInvoiceCalculator, type InvoiceCalculator } from './invoiceCalculator';
import { DefaultInvoiceFactory, type InvoiceFactory } from './invoiceFactory';
import { ConsoleInvoiceNotifier, type InvoiceNotifier } from './invoiceNotifier';
import { InMemoryInvoiceRepository, type InvoiceRepository } from './invoiceRepository';
import { BasicInvoiceValidator, type InvoiceValidator } from './invoiceValidator';
import { ConsolePdfRenderer, type PdfRenderer } from './pdfRenderer';

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface CreateInvoiceInput {
  customerId: string;
  items: InvoiceItem[];
}

export interface Invoice {
  id: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}

export interface InvoiceServiceDependencies {
  readonly validator: InvoiceValidator;
  readonly calculator: InvoiceCalculator;
  readonly invoiceFactory: InvoiceFactory;
  readonly repository: InvoiceRepository;
  readonly pdfRenderer: PdfRenderer;
  readonly notifier: InvoiceNotifier;
}

export function createDefaultInvoiceServiceDependencies(): InvoiceServiceDependencies {
  return {
    validator: new BasicInvoiceValidator(),
    calculator: new DefaultInvoiceCalculator(),
    invoiceFactory: new DefaultInvoiceFactory(),
    repository: new InMemoryInvoiceRepository(),
    pdfRenderer: new ConsolePdfRenderer(),
    notifier: new ConsoleInvoiceNotifier(),
  };
}

export class InvoiceService {
  private readonly validator: InvoiceValidator;
  private readonly calculator: InvoiceCalculator;
  private readonly invoiceFactory: InvoiceFactory;
  private readonly repository: InvoiceRepository;
  private readonly pdfRenderer: PdfRenderer;
  private readonly notifier: InvoiceNotifier;

  constructor(
    dependencies: InvoiceServiceDependencies = createDefaultInvoiceServiceDependencies()
  ) {
    this.validator = dependencies.validator;
    this.calculator = dependencies.calculator;
    this.invoiceFactory = dependencies.invoiceFactory;
    this.repository = dependencies.repository;
    this.pdfRenderer = dependencies.pdfRenderer;
    this.notifier = dependencies.notifier;
  }

  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    this.validator.validate(input);
    const totals = this.calculator.calculate(input.items);
    const invoice = this.invoiceFactory.create(input, totals);

    await this.repository.save(invoice);
    await this.pdfRenderer.render(invoice);
    await this.notifier.notifyCreated(invoice);

    return invoice;
  }

  // for test inspection only
  getInvoice(id: string) {
    return this.repository.findById(id);
  }
}
