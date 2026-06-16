import type { EmailNotifier, Order } from './notificationService';

export class EmailSender implements EmailNotifier {
  async sendOrderConfirmation(order: Order): Promise<void> {
    const subject = `Order ${order.id} confirmed`;
    const body = `Thank you. Total: ${order.total}. Items: ${order.items.join(', ')}`;
    await this.send(order.customerEmail, subject, body);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`[EMAIL] to=${to} subject="${subject}" body="${body}"`);
  }
}
