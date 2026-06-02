// DIP-correct: high level (OrderProcessor) depends only on abstractions.
// Low-level details (senders, logger) implement the abstractions.
// Wiring (new of concretes) lives in the composition root / factory or at call sites that know the environment.

export interface Order {
  readonly id: string;
  readonly customerEmail: string;
  readonly customerPhone?: string;
  readonly items: readonly string[];
  readonly total: number;
}

export interface INotifier {
  send(to: string, subjectOrMessage: string, body?: string): Promise<void>;
}

export interface ILogger {
  log(message: string): void;
}

export class EmailSender implements INotifier {
  async send(to: string, subject: string, body = ''): Promise<void> {
    console.log(`[EMAIL] to=${to} subject="${subject}" body="${body}"`);
  }
}

export class SmsSender implements INotifier {
  async send(phone: string, message: string): Promise<void> {
    console.log(`[SMS] to=${phone} msg="${message}"`);
  }
}

export class FileLogger implements ILogger {
  private entries: string[] = [];
  log(message: string): void {
    const entry = `[LOG ${new Date().toISOString()}] ${message}`;
    this.entries.push(entry);
    console.log(entry);
  }
  getEntries() {
    return [...this.entries];
  }
}

export class OrderProcessor {
  private readonly emailer: INotifier;
  private readonly sms: INotifier;
  private readonly logger: ILogger;

  constructor(emailer?: INotifier, sms?: INotifier, logger?: ILogger) {
    // defaults for convenience / original test contract; real wiring should come from outside
    this.emailer = emailer ?? new EmailSender();
    this.sms = sms ?? new SmsSender();
    this.logger = logger ?? new FileLogger();
  }

  async process(order: Order): Promise<void> {
    const subject = `Order ${order.id} confirmed`;
    const body = `Thank you. Total: ${order.total}. Items: ${order.items.join(', ')}`;
    await this.emailer.send(order.customerEmail, subject, body);

    if (order.customerPhone) {
      await this.sms.send(
        order.customerPhone,
        `Your order ${order.id} total ${order.total} is confirmed.`
      );
    }

    this.logger.log(
      `order_processed ${order.id} total=${order.total} customer=${order.customerEmail}`
    );
  }
}

// Example composition root (production or test setup can call this or do equivalent).
export function createDefaultOrderProcessor(): OrderProcessor {
  return new OrderProcessor(new EmailSender(), new SmsSender(), new FileLogger());
}
