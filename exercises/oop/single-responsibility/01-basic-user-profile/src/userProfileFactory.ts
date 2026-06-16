import type { RegisterInput, UserProfile } from './userProfileService';

export interface UserProfileFactory {
  create(input: RegisterInput): UserProfile;
}

export class DefaultUserProfileFactory implements UserProfileFactory {
  create(input: RegisterInput): UserProfile {
    return {
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      displayName: input.displayName.trim(),
      createdAt: new Date(),
      marketingOptIn: !!input.marketingOptIn,
    };
  }
}
