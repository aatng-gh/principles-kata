import type { RegisterInput } from './types';

export class UserValidator {
  validate(input: RegisterInput): void {
    if (!input.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (input.displayName.trim().length < 2) {
      throw new Error('Invalid displayName');
    }
  }
}
