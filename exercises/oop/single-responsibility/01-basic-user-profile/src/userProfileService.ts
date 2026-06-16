// exercises/oop/single-responsibility/01-basic-user-profile/src/userProfileService.ts
import { type AuditLogger, ConsoleAuditLogger } from './auditLogger';
import { ConsoleEmailNotifier, type EmailNotifier } from './emailNotifier';
import { DefaultUserProfileFactory, type UserProfileFactory } from './userProfileFactory';
import { InMemoryUserRepository, type UserRepository } from './userRepository';
import { BasicUserValidator, type UserValidator } from './userValidator';

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

export interface UserProfileServiceDependencies {
  readonly validator: UserValidator;
  readonly profileFactory: UserProfileFactory;
  readonly repository: UserRepository;
  readonly emailNotifier: EmailNotifier;
  readonly auditLogger: AuditLogger;
}

export function createDefaultUserProfileDependencies(): UserProfileServiceDependencies {
  return {
    validator: new BasicUserValidator(),
    profileFactory: new DefaultUserProfileFactory(),
    repository: new InMemoryUserRepository(),
    emailNotifier: new ConsoleEmailNotifier(),
    auditLogger: new ConsoleAuditLogger(),
  };
}

export class UserProfileService {
  private readonly validator: UserValidator;
  private readonly profileFactory: UserProfileFactory;
  private readonly repository: UserRepository;
  private readonly emailNotifier: EmailNotifier;
  private readonly auditLogger: AuditLogger;

  constructor(
    dependencies: UserProfileServiceDependencies = createDefaultUserProfileDependencies()
  ) {
    this.validator = dependencies.validator;
    this.profileFactory = dependencies.profileFactory;
    this.repository = dependencies.repository;
    this.emailNotifier = dependencies.emailNotifier;
    this.auditLogger = dependencies.auditLogger;
  }

  async register(input: RegisterInput): Promise<UserProfile> {
    this.validator.validate(input);

    const profile = this.profileFactory.create(input);

    await this.repository.save(profile);
    await this.emailNotifier.sendWelcome(profile);
    await this.auditLogger.userRegistered(profile);

    return profile;
  }

  // for test inspection only — real impl would not expose this
  getUser(id: string) {
    return this.repository.findById(id);
  }
}
