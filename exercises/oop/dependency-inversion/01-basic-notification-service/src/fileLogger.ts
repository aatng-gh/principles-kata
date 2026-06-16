import type { AuditLogger, Order } from './notificationService';

export class FileLogger implements AuditLogger {
  private entries: string[] = [];

  logOrderProcessed(order: Order): void {
    this.log(`order_processed ${order.id} total=${order.total} customer=${order.customerEmail}`);
  }

  log(message: string): void {
    const entry = `[LOG ${new Date().toISOString()}] ${message}`;
    this.entries.push(entry);
    console.log(entry);
  }
  getEntries() {
    return [...this.entries];
  }
}
