import type {
  AuditLogger,
  EmailNotifier,
  RegisterInput,
  UserProfile,
  UserRepository,
} from './types';
import type { UserValidator } from './userValidator';

export class UserRegistrationService {
  constructor(
    private readonly validator: UserValidator,
    private readonly repo: UserRepository,
    private readonly emailer: EmailNotifier,
    private readonly audit: AuditLogger
  ) {}

  async register(input: RegisterInput): Promise<UserProfile> {
    this.validator.validate(input);

    const id = crypto.randomUUID();
    const profile: UserProfile = {
      id,
      email: input.email.toLowerCase(),
      displayName: input.displayName.trim(),
      createdAt: new Date(),
      marketingOptIn: !!input.marketingOptIn,
    };

    await this.repo.save(profile);
    await this.emailer.sendWelcome(profile);
    await this.audit.logUserRegistered(id, profile.email);

    return profile;
  }
}
