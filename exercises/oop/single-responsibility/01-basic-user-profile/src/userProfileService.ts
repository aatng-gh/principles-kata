// exercises/oop/single-responsibility/01-basic-user-profile/src/userProfileService.ts
// THIS IS THE STARTER — it mixes 4 responsibilities on purpose.

export interface RegisterInput {
  email: string;
  displayName: string;
  marketingOptIn?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  marketingOptIn: boolean;
}

export class UserProfileService {
  private users = new Map<string, UserProfile>();

  async register(input: RegisterInput): Promise<UserProfile> {
    // 1. Validation (mixed in)
    if (!input.email.includes('@') || input.displayName.length < 2) {
      throw new Error('Invalid input');
    }

    // 2. "Persistence"
    const id = crypto.randomUUID();
    const profile: UserProfile = {
      id,
      email: input.email.toLowerCase(),
      displayName: input.displayName.trim(),
      createdAt: new Date(),
      marketingOptIn: !!input.marketingOptIn,
    };
    this.users.set(id, profile);

    // 3. Email (side effect, mixed in)
    console.log(`[EMAIL] Welcome ${profile.displayName} <${profile.email}>`);

    // 4. Audit log (side effect, mixed in)
    console.log(`[AUDIT] user_registered ${id} ${profile.email}`);

    return profile;
  }

  // for test inspection only — real impl would not expose this
  getUser(id: string) {
    return this.users.get(id);
  }
}
