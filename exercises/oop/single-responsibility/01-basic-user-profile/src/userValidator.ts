import type { RegisterInput } from './userProfileService';

export interface UserValidator {
  validate(input: RegisterInput): void;
}

export class BasicUserValidator implements UserValidator {
  validate(input: RegisterInput): void {
    if (!input.email.includes('@') || input.displayName.trim().length < 2) {
      throw new Error('Invalid input');
    }
  }
}
