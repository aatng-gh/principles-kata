import type { AuditLogger } from './types';

export class ConsoleAuditLogger implements AuditLogger {
  async logUserRegistered(id: string, email: string): Promise<void> {
    console.log(`[AUDIT] user_registered ${id} ${email}`);
  }
}
