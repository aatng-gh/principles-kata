// exercises/oop/dependency-inversion/01-basic-notification-service/src/notificationService.ts
// DIP: ports (interfaces) + high-level policy (OrderProcessor) only in this file.
// Concrete adapters extracted to emailSender.ts / smsSender.ts / fileLogger.ts.
// createDefault wires them; OrderProcessor source mentions only the port names.

import { EmailSender } from './emailSender';
import { FileLogger } from './fileLogger';
import { SmsSender } from './smsSender';

export { EmailSender } from './emailSender';
export { SmsSender } from './smsSender';
export { FileLogger } from './fileLogger';

export interface Order {
  id: string;
  customerEmail: string;
  customerPhone?: string;
  items: string[];
  total: number;
}

export interface EmailNotifier {
  sendOrderConfirmation(order: Order): Promise<void>;
}

export interface SmsNotifier {
  sendOrderConfirmation(order: Order): Promise<void>;
}

export interface AuditLogger {
  logOrderProcessed(order: Order): void;
}

export interface OrderProcessorDependencies {
  readonly emailNotifier: EmailNotifier;
  readonly smsNotifier: SmsNotifier;
  readonly auditLogger: AuditLogger;
}

export function createDefaultOrderProcessorDependencies(): OrderProcessorDependencies {
  return {
    emailNotifier: new EmailSender(),
    smsNotifier: new SmsSender(),
    auditLogger: new FileLogger(),
  };
}

export class OrderProcessor {
  private readonly emailNotifier: EmailNotifier;
  private readonly smsNotifier: SmsNotifier;
  private readonly auditLogger: AuditLogger;

  constructor(
    dependencies: OrderProcessorDependencies = createDefaultOrderProcessorDependencies()
  ) {
    this.emailNotifier = dependencies.emailNotifier;
    this.smsNotifier = dependencies.smsNotifier;
    this.auditLogger = dependencies.auditLogger;
  }

  async process(order: Order): Promise<void> {
    await this.emailNotifier.sendOrderConfirmation(order);
    await this.smsNotifier.sendOrderConfirmation(order);
    this.auditLogger.logOrderProcessed(order);
  }
}
