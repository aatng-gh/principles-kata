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

export interface UserRepository {
  save(profile: UserProfile): Promise<void>;
  findById(id: string): Promise<UserProfile | undefined>;
}

export interface EmailNotifier {
  sendWelcome(profile: UserProfile): Promise<void>;
}

export interface AuditLogger {
  logUserRegistered(id: string, email: string): Promise<void>;
}
