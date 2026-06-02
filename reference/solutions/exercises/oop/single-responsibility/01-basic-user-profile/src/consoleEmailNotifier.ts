import type { EmailNotifier, UserProfile } from './types';

export class ConsoleEmailNotifier implements EmailNotifier {
  async sendWelcome(profile: UserProfile): Promise<void> {
    console.log(`[EMAIL] Welcome ${profile.displayName} <${profile.email}>`);
  }
}
