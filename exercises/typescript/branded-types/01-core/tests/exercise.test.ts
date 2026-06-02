import { describe, expect, it } from 'vitest';
import { type PostId, type UserId, asPostId, asUserId } from '../src/brand';

describe('Branded Types 01 (core)', () => {
  it('branded IDs are distinct at type level but same at runtime', () => {
    const uid = asUserId('u1');
    const pid = asPostId('p1');

    expect(typeof uid).toBe('string');
    expect(typeof pid).toBe('string');

    // Type distinction
    function takesUser(id: UserId) {
      return id;
    }
    function takesPost(id: PostId) {
      return id;
    }

    // @ts-expect-error - cannot pass PostId where UserId expected
    takesUser(pid);

    // @ts-expect-error - cannot pass raw string
    takesUser('raw');
  });
});
