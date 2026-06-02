// exercises/oop/dependency-inversion/01-basic-notification-service/src/notificationService.ts
// THIS IS THE STARTER — high-level OrderProcessor directly news low-level concretions.
// Delivers the notifications + logs so tests pass, but violates DIP.

export interface Order {
  id: string;
  customerEmail: string;
  customerPhone?: string;
  items: string[];
  total: number;
}

export class EmailSender {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`[EMAIL] to=${to} subject="${subject}" body="${body}"`);
  }
}

export class SmsSender {
  async send(phone: string, message: string): Promise<void> {
    console.log(`[SMS] to=${phone} msg="${message}"`);
  }
}

export class FileLogger {
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
  async process(order: Order): Promise<void> {
    // high level directly depending on + newing low level details (bad)
    const emailer = new EmailSender();
    const sms = new SmsSender();
    const logger = new FileLogger();

    const subject = `Order ${order.id} confirmed`;
    const body = `Thank you. Total: ${order.total}. Items: ${order.items.join(', ')}`;
    await emailer.send(order.customerEmail, subject, body);

    if (order.customerPhone) {
      await sms.send(
        order.customerPhone,
        `Your order ${order.id} total ${order.total} is confirmed.`
      );
    }

    logger.log(`order_processed ${order.id} total=${order.total} customer=${order.customerEmail}`);

    // in real would also persist order etc., but for this exercise the notifications are the observable
  }
}
