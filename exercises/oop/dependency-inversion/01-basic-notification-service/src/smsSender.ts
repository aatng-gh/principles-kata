import type { Order, SmsNotifier } from './notificationService';

export class SmsSender implements SmsNotifier {
  async sendOrderConfirmation(order: Order): Promise<void> {
    if (!order.customerPhone) return;
    await this.send(
      order.customerPhone,
      `Your order ${order.id} total ${order.total} is confirmed.`
    );
  }

  async send(phone: string, message: string): Promise<void> {
    console.log(`[SMS] to=${phone} msg="${message}"`);
  }
}
