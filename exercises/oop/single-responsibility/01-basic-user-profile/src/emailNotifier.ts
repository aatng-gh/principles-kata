import type { UserProfile } from './userProfileService';

export interface EmailNotifier {
  sendWelcome(profile: UserProfile): Promise<void>;
}

export class ConsoleEmailNotifier implements EmailNotifier {
  async sendWelcome(profile: UserProfile): Promise<void> {
    console.log(`[EMAIL] Welcome ${profile.displayName} <${profile.email}>`);
  }
}
