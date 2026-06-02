import type { UserProfile, UserRepository } from './types';

export class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, UserProfile>();

  async save(profile: UserProfile): Promise<void> {
    this.users.set(profile.id, profile);
  }

  async findById(id: string): Promise<UserProfile | undefined> {
    return this.users.get(id);
  }
}
