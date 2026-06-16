import type { UserProfile } from './userProfileService';

export interface UserRepository {
  save(profile: UserProfile): Promise<void>;
  findById(id: string): UserProfile | undefined;
}

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserProfile>();

  async save(profile: UserProfile): Promise<void> {
    this.users.set(profile.id, profile);
  }

  findById(id: string): UserProfile | undefined {
    return this.users.get(id);
  }
}
