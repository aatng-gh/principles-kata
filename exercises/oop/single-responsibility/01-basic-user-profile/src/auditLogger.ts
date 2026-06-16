import type { UserProfile } from './userProfileService';

export interface AuditLogger {
  userRegistered(profile: UserProfile): Promise<void>;
}

export class ConsoleAuditLogger implements AuditLogger {
  async userRegistered(profile: UserProfile): Promise<void> {
    console.log(`[AUDIT] user_registered ${profile.id} ${profile.email}`);
  }
}
