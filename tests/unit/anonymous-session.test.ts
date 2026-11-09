import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Without a session cookie there is no one to look up, so getCurrentUser must
 * not open the database: the course pages are prerendered at build time,
 * where there is no database, and an anonymous request on the Worker should
 * not pay for a connection it never uses.
 */

const cookie = vi.hoisted(() => ({ value: undefined as string | undefined }));
const opened = vi.hoisted(() => ({ count: 0 }));

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => (cookie.value === undefined ? undefined : { name: 'examer_session', value: cookie.value }) }),
}));

vi.mock('@/lib/db', async (original) => ({
  ...(await original<typeof import('@/lib/db')>()),
  getDb: () => {
    opened.count++;
    return { prepare: () => ({ get: async () => undefined }) };
  },
}));

const { getCurrentUser } = await import('@/lib/auth/session');

describe('the current user', () => {
  beforeEach(() => {
    opened.count = 0;
  });

  it('is nobody, with the database untouched, when the request has no session cookie', async () => {
    cookie.value = undefined;
    expect(await getCurrentUser()).toBeNull();
    cookie.value = '';
    expect(await getCurrentUser()).toBeNull();
    expect(opened.count).toBe(0);
  });

  it('is looked up in the database when there is a session cookie', async () => {
    cookie.value = 'not-a-real-token';
    expect(await getCurrentUser()).toBeNull();
    expect(opened.count).toBe(1);
  });
});
