import { ConsoleAuditLogger } from './consoleAuditLogger';
import { ConsoleEmailNotifier } from './consoleEmailNotifier';
import { InMemoryUserRepository } from './inMemoryUserRepository';
import { UserRegistrationService } from './userRegistrationService';
import { UserValidator } from './userValidator';

export function createUserRegistrationService() {
  return new UserRegistrationService(
    new UserValidator(),
    new InMemoryUserRepository(),
    new ConsoleEmailNotifier(),
    new ConsoleAuditLogger()
  );
}

export { UserRegistrationService } from './userRegistrationService';
export type { RegisterInput, UserProfile } from './types';
