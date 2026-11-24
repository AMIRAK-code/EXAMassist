import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Db } from '@/lib/db';
import { createSession, type AuthUser } from '@/lib/auth/session';
import {
  EmailConsentError,
  contactsCsv,
  emailContacts,
  getEmailConsent,
  recordSignUpConsent,
  setNewsConsent,
} from '@/lib/account/email-consent';
import { createTestDb, createUser } from './helpers/test-db';

/**
 * Email consent: account emails are agreed to at sign-up; news is a separate,
 * optional opt-in that can be withdrawn, never for an account marked under 16.
 * The contact export carries each address's news consent and nothing else.
 */

const state: { db: Db | null; token: string | undefined } = { db: null, token: undefined };
vi.mock('@/lib/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/db')>();
  return { ...actual, getDb: () => state.db! };
});
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (name === 'examer_session' && state.token ? { value: state.token } : undefined),
    set: () => undefined,
  }),
  headers: async () => new Headers(),
}));

const { POST: contactsRoute } = await import('@/app/api/admin/users/contacts/route');
const { PATCH: preferencesRoute } = await import('@/app/api/account/email-preferences/route');
const { POST: signUpRoute } = await import('@/app/api/auth/sign-up/route');

const ORIGIN = 'http://localhost:3000';
function request(path: string, method: string, body: unknown, headers: Record<string, string> = { origin: ORIGIN }): Request {
  return new Request(`${ORIGIN}${path}`, {
    method,
    headers: { 'content-type': 'application/json', host: 'localhost:3000', ...headers },
    body: JSON.stringify(body),
  });
}

async function account(db: Db, options: { role?: AuthUser['role']; isMinor?: boolean; isGuest?: boolean } = {}): Promise<AuthUser> {
  const id = await createUser(db, { role: options.role, isGuest: options.isGuest });
  if (options.isMinor) await db.prepare('UPDATE users SET is_minor = 1 WHERE id = ?').run(id);
  return {
    id,
    email: options.isGuest ? null : `${id}@example.invalid`,
    displayName: null,
    role: options.role ?? 'learner',
    isGuest: Boolean(options.isGuest),
    locale: 'en',
    targetExamKey: null,
    targetDate: null,
    weeklyMinutes: null,
    isMinor: Boolean(options.isMinor),
    emailVerifiedAt: null,
  };
}

async function code(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
    return 'ok';
  } catch (error) {
    if (error instanceof EmailConsentError) return error.code;
    throw error;
  }
}

describe('email consent', () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb();
    state.db = db;
    state.token = undefined;
  });
  afterEach(() => { state.db = null; });

  it('records both sign-up answers, and never news for an account under 16', async () => {
    const adult = await account(db);
    await recordSignUpConsent(db, adult.id, { news: true, isMinor: false });
    const a = await getEmailConsent(db, adult.id);
    expect(a.accountEmailConsentAt).not.toBeNull();
    expect(a.newsConsentAt).not.toBeNull();

    const quiet = await account(db);
    await recordSignUpConsent(db, quiet.id, { news: false, isMinor: false });
    expect((await getEmailConsent(db, quiet.id)).newsConsentAt).toBeNull();

    const minor = await account(db, { isMinor: true });
    await recordSignUpConsent(db, minor.id, { news: true, isMinor: true });
    expect((await getEmailConsent(db, minor.id)).newsConsentAt).toBeNull();
  });

  it('lets the account holder turn news on and off, and logs each change', async () => {
    const user = await account(db);
    expect((await setNewsConsent(db, user, true)).newsConsentAt).not.toBeNull();
    expect((await setNewsConsent(db, user, false)).newsConsentAt).toBeNull();
    const log = (await db.prepare("SELECT action FROM audit_log WHERE entity_id = ? ORDER BY id").all(user.id)) as Array<{ action: string }>;
    expect(log.map((r) => r.action)).toEqual(['email_consent.news_on', 'email_consent.news_off']);

    expect(await code(setNewsConsent(db, await account(db, { isMinor: true }), true))).toBe('minor');
    expect(await code(setNewsConsent(db, await account(db, { isGuest: true }), true))).toBe('no-account');
  });

  it('exports every account address with its consent, or only the subscribers, and nothing about guests or deleted accounts', async () => {
    const subscribed = await account(db);
    await setNewsConsent(db, subscribed, true);
    const plain = await account(db);
    const minor = await account(db, { isMinor: true });
    // Even a stray stored consent on an under-16 account does not count.
    await db.prepare('UPDATE users SET news_consent_at = ? WHERE id = ?').run('2026-11-24T00:00:00.000Z', minor.id);
    await account(db, { isGuest: true });
    const gone = await account(db);
    await db.prepare('UPDATE users SET deleted_at = ? WHERE id = ?').run('2026-11-24T00:00:00.000Z', gone.id);

    const all = await emailContacts(db, 'all');
    expect(all.map((c) => c.email).sort()).toEqual([subscribed.email, plain.email, minor.email].sort());
    expect(all.find((c) => c.email === minor.email)?.newsConsent).toBe(false);
    expect(all.find((c) => c.email === subscribed.email)?.newsConsent).toBe(true);
    expect((await emailContacts(db, 'news')).map((c) => c.email)).toEqual([subscribed.email]);

    const csv = contactsCsv(all);
    expect(csv.split('\r\n')[0]).toBe('EMAIL,LANGUAGE,NEWS_CONSENT,NEWS_CONSENT_DATE');
    expect(csv).toContain(`${plain.email},en,no,`);
    // Four columns, nothing more about the person.
    expect(csv.trim().split('\r\n').every((line) => line.split(',').length === 4)).toBe(true);
  });

  it('sign-up requires the account-email consent and stores the news choice', async () => {
    const refused = await signUpRoute(request('/api/auth/sign-up', 'POST', { email: 'no-consent@example.test', password: 'a quiet harbour at dawn' }));
    expect(refused.status).toBe(400);

    const created = await signUpRoute(
      request('/api/auth/sign-up', 'POST', { email: 'yes@example.test', password: 'a quiet harbour at dawn', accountEmailConsent: true, newsConsent: true }),
    );
    expect(created.status).toBe(201);
    const { userId } = (await created.json()) as { userId: string };
    const consent = await getEmailConsent(db, userId);
    expect(consent.accountEmailConsentAt).not.toBeNull();
    expect(consent.newsConsentAt).not.toBeNull();
  });

  it('downloads contacts only for administrators, from the same site', async () => {
    const learner = await account(db);
    state.token = (await createSession(db, learner.id)).token;
    expect((await contactsRoute(request('/api/admin/users/contacts', 'POST', { scope: 'all' }))).status).toBe(403);
    expect((await preferencesRoute(request('/api/account/email-preferences', 'PATCH', { news: true }))).status).toBe(200);

    const admin = await account(db, { role: 'admin' });
    state.token = (await createSession(db, admin.id)).token;
    expect((await contactsRoute(request('/api/admin/users/contacts', 'POST', { scope: 'all' }, { origin: 'https://evil.example' }))).status).toBe(403);
    const ok = await contactsRoute(request('/api/admin/users/contacts', 'POST', { scope: 'news' }));
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-type')).toContain('text/csv');
    expect(await ok.text()).toContain(learner.email!);
    const logged = (await db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'users.contacts_exported'").get()) as { n: number };
    expect(Number(logged.n)).toBe(1);

    state.token = undefined;
    expect((await contactsRoute(request('/api/admin/users/contacts', 'POST', { scope: 'all' }))).status).toBe(401);
  });
});
