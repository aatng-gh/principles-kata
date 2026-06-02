// exercises/oop/single-responsibility/01-basic-user-profile/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type RegisterInput, UserProfileService } from '../src/userProfileService';

describe('UserProfileService (SRP basic)', () => {
  let service: UserProfileService;

  beforeEach(() => {
    service = new UserProfileService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('registers a valid user and returns profile with id and createdAt', async () => {
    const input: RegisterInput = { email: 'alice@example.com', displayName: 'Alice' };
    const profile = await service.register(input);

    expect(profile.id).toBeTypeOf('string');
    expect(profile.email).toBe('alice@example.com');
    expect(profile.displayName).toBe('Alice');
    expect(profile.createdAt).toBeInstanceOf(Date);
    expect(profile.marketingOptIn).toBe(false);
  });

  it('records the user so it can be retrieved (persistence effect)', async () => {
    const p = await service.register({ email: 'bob@example.com', displayName: 'Bob' });
    const retrieved = service.getUser(p.id);
    expect(retrieved?.email).toBe('bob@example.com');
  });

  it('sends a welcome email (observable side effect via console in starter)', async () => {
    await service.register({ email: 'carol@example.com', displayName: 'Carol' });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[EMAIL] Welcome Carol'));
  });

  it('writes an audit log entry', async () => {
    await service.register({ email: 'dave@example.com', displayName: 'Dave' });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[AUDIT] user_registered'));
  });

  it('rejects invalid email', async () => {
    await expect(service.register({ email: 'not-an-email', displayName: 'Eve' })).rejects.toThrow(
      /invalid/i
    );
  });
});
