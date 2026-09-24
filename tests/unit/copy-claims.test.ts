import { describe, expect, it } from 'vitest';
import { GUEST_TTL_DAYS } from '@/lib/auth/session';
import { GUEST_NOTE, GUEST_NOTE_SHORT } from '@/components/site/nav-items';
import { INDEPENDENCE_NOTICE, SITE } from '@/lib/site';

/**
 * Public statements that describe behaviour, checked against the behaviour.
 * These are claims a learner relies on, so they must not drift from the code.
 */

describe('guest messaging', () => {
  it('states the guest session lifetime the server actually applies', () => {
    for (const note of [GUEST_NOTE, GUEST_NOTE_SHORT]) {
      expect(note).toContain(`${GUEST_TTL_DAYS} days`);
    }
  });

  it('never promises that signing in merges guest history', () => {
    for (const note of [GUEST_NOTE, GUEST_NOTE_SHORT]) {
      expect(note.toLowerCase()).not.toMatch(/sign(ing)? in .*(keep|merge|move|bring)/);
    }
  });
});

describe('editorial claims', () => {
  it('does not claim a human editorial team the question records do not name', () => {
    expect(INDEPENDENCE_NOTICE).not.toMatch(/editorial team/i);
    expect(INDEPENDENCE_NOTICE).toMatch(/AI-assisted/);
    expect(SITE.publisher).not.toMatch(/editorial/i);
  });
});
