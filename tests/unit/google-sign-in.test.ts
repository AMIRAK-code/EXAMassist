import { createHash, randomBytes } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import type { OAuthIdentityRow, OAuthRequestRow, UserRow } from '@/lib/db/rows';
import {
  GOOGLE_CERTS_URL,
  GOOGLE_TOKEN_URL,
  finishGoogleSignIn,
  googleNotice,
  googleSettings,
  startGoogleSignIn,
  verifyGoogleIdToken,
  type GoogleSettings,
} from '@/lib/auth/google';
import { createSession, resolveSession } from '@/lib/auth/session';
import { createTestDb, createUser } from './helpers/test-db';

/**
 * The Google sign-in, end to end, against a stand-in for Google.
 *
 * Google is not reachable from the tests, so `fetch` is replaced by FakeGoogle:
 * it issues authorization codes, refuses a code it has already exchanged,
 * checks the PKCE verifier against the challenge, and signs ID tokens with a
 * real RSA key whose public half it publishes as Google does. Nothing in
 * src/lib/auth/google.ts is mocked: the signature, claims, state, nonce and
 * database checks all run as they do in production.
 */

const SETTINGS: GoogleSettings = {
  clientId: 'test-client.apps.googleusercontent.com',
  clientSecret: 'test-client-secret',
  redirectUri: 'http://localhost:3000/api/auth/google/callback',
};
const NOW = new Date('2026-11-03T10:00:00.000Z');
const seconds = (date: Date) => Math.floor(date.getTime() / 1000);

interface Claims {
  sub: string;
  email: string;
  email_verified?: boolean | string;
  given_name?: string;
  [claim: string]: unknown;
}

interface IssuedCode {
  challenge: string;
  nonce: string;
  claims: Claims;
}

class FakeGoogle {
  readonly kid = `kid-${randomBytes(4).toString('hex')}`;
  readonly codes = new Map<string, IssuedCode>();
  readonly spent = new Set<string>();
  tokenRequests = 0;
  /** Google's clock, for `iat` and `exp`. */
  now = NOW;
  private keys!: CryptoKeyPair;

  static async create(): Promise<FakeGoogle> {
    const google = new FakeGoogle();
    google.keys = (await crypto.subtle.generateKey(
      { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['sign', 'verify'],
    )) as CryptoKeyPair;
    return google;
  }

  /** The learner picks a Google account on the consent page: Google redirects back with a code. */
  authorize(consentUrl: string, claims: Claims): string {
    const params = new URL(consentUrl).searchParams;
    const code = `code-${randomBytes(8).toString('hex')}`;
    this.codes.set(code, { challenge: params.get('code_challenge')!, nonce: params.get('nonce')!, claims });
    return code;
  }

  /** An ID token signed with this stand-in's key (or another key, to forge one). */
  async idToken(payload: Record<string, unknown>, options: { kid?: string; key?: CryptoKey } = {}): Promise<string> {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: options.kid ?? this.kid, typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      options.key ?? this.keys.privateKey,
      new TextEncoder().encode(`${header}.${body}`),
    );
    return `${header}.${body}.${Buffer.from(signature).toString('base64url')}`;
  }

  /** Standard claims for a code, valid for an hour from Google's `now`. */
  payloadFor(issued: IssuedCode): Record<string, unknown> {
    return {
      iss: 'https://accounts.google.com',
      aud: SETTINGS.clientId,
      azp: SETTINGS.clientId,
      iat: seconds(this.now),
      exp: seconds(this.now) + 3600,
      nonce: issued.nonce,
      email_verified: true,
      ...issued.claims,
    };
  }

  readonly fetch: typeof fetch = async (input, init) => {
    const url = String(input);
    if (url === GOOGLE_CERTS_URL) {
      const jwk = await crypto.subtle.exportKey('jwk', this.keys.publicKey);
      return Response.json(
        { keys: [{ ...jwk, kid: this.kid, alg: 'RS256', use: 'sig' }] },
        { headers: { 'cache-control': 'public, max-age=3600' } },
      );
    }
    if (url === GOOGLE_TOKEN_URL) {
      this.tokenRequests++;
      const form = new URLSearchParams(String(init?.body));
      const code = form.get('code') ?? '';
      const issued = this.codes.get(code);
      const verifier = form.get('code_verifier') ?? '';
      const challenge = createHash('sha256').update(verifier).digest('base64url');
      if (
        !issued ||
        this.spent.has(code) ||
        challenge !== issued.challenge ||
        form.get('client_id') !== SETTINGS.clientId ||
        form.get('client_secret') !== SETTINGS.clientSecret ||
        form.get('redirect_uri') !== SETTINGS.redirectUri
      ) {
        return Response.json({ error: 'invalid_grant' }, { status: 400 });
      }
      this.spent.add(code);
      return Response.json({ id_token: await this.idToken(this.payloadFor(issued)), token_type: 'Bearer' });
    }
    return new Response('not found', { status: 404 });
  };
}

let db: Db;
let google: FakeGoogle;

beforeEach(async () => {
  db = await createTestDb();
  google = await FakeGoogle.create();
});

async function userRow(id: string): Promise<UserRow> {
  return (await db.prepare('SELECT * FROM users WHERE id = ?').get(id)) as UserRow;
}

async function userByEmail(email: string): Promise<UserRow | undefined> {
  return (await db.prepare('SELECT * FROM users WHERE email = ?').get(email)) as UserRow | undefined;
}

async function identities(): Promise<OAuthIdentityRow[]> {
  return (await db.prepare('SELECT * FROM oauth_identities').all()) as OAuthIdentityRow[];
}

/** Start a sign-in, let the learner choose the Google account `claims`, and return what the callback receives. */
async function signInAs(
  claims: Claims,
  options: { next?: string | null; locale?: 'en' | 'it'; at?: Date } = {},
): Promise<{ params: URLSearchParams; cookieState: string; consentUrl: string }> {
  const started = await startGoogleSignIn(
    db,
    SETTINGS,
    { next: options.next ?? null, locale: options.locale ?? 'en' },
    { now: options.at ?? NOW },
  );
  const code = google.authorize(started.url, claims);
  return { params: new URLSearchParams({ code, state: started.state }), cookieState: started.state, consentUrl: started.url };
}

function finish(
  callback: { params: URLSearchParams; cookieState: string | undefined },
  options: { guestUserId?: string | null; now?: Date } = {},
) {
  return finishGoogleSignIn(
    db,
    SETTINGS,
    { params: callback.params, cookieState: callback.cookieState, guestUserId: options.guestUserId ?? null },
    { fetch: google.fetch, now: options.now ?? NOW },
  );
}

const alice: Claims = { sub: '1001', email: 'alice@example.com', given_name: 'Alice' };

describe('settings', () => {
  it('hides Google sign-in unless both the client id and secret are set', () => {
    expect(googleSettings({})).toBeNull();
    expect(googleSettings({ GOOGLE_CLIENT_ID: 'id' })).toBeNull();
    expect(googleSettings({ GOOGLE_CLIENT_ID: ' ', GOOGLE_CLIENT_SECRET: 'secret' })).toBeNull();
    const settings = googleSettings({ GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret' });
    expect(settings).toMatchObject({ clientId: 'id', clientSecret: 'secret' });
    expect(settings?.redirectUri).toMatch(/\/api\/auth\/google\/callback$/);
  });
});

describe('starting a sign-in', () => {
  it('sends the learner to Google with PKCE, state, nonce and only the three scopes', async () => {
    const started = await startGoogleSignIn(db, SETTINGS, { next: '/practice', locale: 'it' }, { now: NOW });
    const url = new URL(started.url);
    expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    const params = url.searchParams;
    expect(params.get('client_id')).toBe(SETTINGS.clientId);
    expect(params.get('redirect_uri')).toBe(SETTINGS.redirectUri);
    expect(params.get('response_type')).toBe('code');
    expect(params.get('scope')).toBe('openid email profile');
    expect(params.get('state')).toBe(started.state);
    expect(params.get('code_challenge_method')).toBe('S256');
    expect(params.get('nonce')).toMatch(/^[\w-]{43}$/);
    expect(params.get('hl')).toBe('it');

    // The database holds hashes of the state and nonce, never the values.
    const row = (await db.prepare('SELECT * FROM oauth_requests').get()) as OAuthRequestRow;
    expect(row.id).toBe(createHash('sha256').update(started.state).digest('hex'));
    expect(row.nonce_hash).toBe(createHash('sha256').update(params.get('nonce')!).digest('hex'));
    expect(createHash('sha256').update(row.code_verifier).digest('base64url')).toBe(params.get('code_challenge'));
    expect(row).toMatchObject({ next_path: '/practice', locale: 'it', consumed_at: null });
    expect(row.expires_at).toBe('2026-11-03T10:10:00.000Z');
  });

  it('drops a destination that is not a path on this site', async () => {
    await startGoogleSignIn(db, SETTINGS, { next: 'https://evil.example/', locale: 'en' }, { now: NOW });
    const row = (await db.prepare('SELECT next_path FROM oauth_requests').get()) as { next_path: string | null };
    expect(row.next_path).toBeNull();
  });

  it('purges requests a day past their expiry', async () => {
    await startGoogleSignIn(db, SETTINGS, { next: null, locale: 'en' }, { now: NOW });
    await startGoogleSignIn(db, SETTINGS, { next: null, locale: 'en' }, { now: new Date(NOW.getTime() + 25 * 3600_000) });
    const { n } = (await db.prepare('SELECT COUNT(*) AS n FROM oauth_requests').get()) as { n: number };
    expect(n).toBe(1);
  });
});

describe('the callback refuses', () => {
  it('a state that does not match the cookie, before calling Google', async () => {
    const callback = await signInAs(alice);
    const other = await signInAs(alice);

    expect(await finish({ params: callback.params, cookieState: other.cookieState })).toMatchObject({ ok: false, failure: 'invalid-state' });
    expect(await finish({ params: callback.params, cookieState: undefined })).toMatchObject({ ok: false, failure: 'invalid-state' });
    const noState = new URLSearchParams({ code: callback.params.get('code')! });
    expect(await finish({ params: noState, cookieState: callback.cookieState })).toMatchObject({ ok: false, failure: 'invalid-state' });
    expect(google.tokenRequests).toBe(0);
    expect(await identities()).toEqual([]);
  });

  it('a state this server never issued, even when the cookie agrees', async () => {
    const forged = randomBytes(32).toString('base64url');
    const result = await finish({ params: new URLSearchParams({ code: 'code-x', state: forged }), cookieState: forged });
    expect(result).toMatchObject({ ok: false, failure: 'invalid-state' });
    expect(google.tokenRequests).toBe(0);
  });

  it('a replayed code: the second callback never reaches Google', async () => {
    const callback = await signInAs(alice);
    const first = await finish(callback);
    expect(first.ok).toBe(true);

    const replay = await finish(callback);
    expect(replay).toMatchObject({ ok: false, failure: 'replayed' });
    expect(google.tokenRequests).toBe(1);
  });

  it('two simultaneous callbacks for one sign-in: only one goes on', async () => {
    const callback = await signInAs(alice);
    const results = await Promise.all([finish(callback), finish(callback)]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.filter((result) => !result.ok)).toMatchObject([{ failure: 'replayed' }]);
    expect(google.tokenRequests).toBe(1);
  });

  it('a sign-in that took longer than ten minutes', async () => {
    const callback = await signInAs(alice);
    const result = await finish(callback, { now: new Date(NOW.getTime() + 11 * 60_000) });
    expect(result).toMatchObject({ ok: false, failure: 'expired' });
    expect(google.tokenRequests).toBe(0);
  });

  it('an address Google has not confirmed, and creates nothing', async () => {
    const callback = await signInAs({ ...alice, email_verified: false });
    const result = await finish(callback);
    expect(result).toMatchObject({ ok: false, failure: 'unverified-email' });
    expect(googleNotice('unverified-email')).toBe('unverified');
    expect(await userByEmail(alice.email)).toBeUndefined();
    expect(await identities()).toEqual([]);
  });

  it('a code Google will not exchange', async () => {
    const callback = await signInAs(alice);
    callback.params.set('code', 'code-never-issued');
    expect(await finish(callback)).toMatchObject({ ok: false, failure: 'exchange-failed' });
  });

  it('a cancelled consent, and keeps the language and destination for the page that says so', async () => {
    const started = await startGoogleSignIn(db, SETTINGS, { next: '/practice', locale: 'it' }, { now: NOW });
    const params = new URLSearchParams({ error: 'access_denied', state: started.state });
    const result = await finish({ params, cookieState: started.state });
    expect(result).toEqual({ ok: false, failure: 'cancelled', next: '/practice', locale: 'it' });
    // The request is spent all the same.
    expect(await finish({ params, cookieState: started.state })).toMatchObject({ failure: 'replayed' });
  });
});

describe('the ID token', () => {
  const nonce = 'the-nonce';
  const nonceHash = createHash('sha256').update(nonce).digest('hex');
  const expected = { clientId: SETTINGS.clientId, nonceHash };
  const valid = () => ({
    iss: 'https://accounts.google.com',
    aud: SETTINGS.clientId,
    iat: seconds(NOW),
    exp: seconds(NOW) + 3600,
    nonce,
    sub: '1001',
    email: 'Alice@Example.com',
    email_verified: true,
    given_name: 'Alice',
  });
  const verify = async (payload: Record<string, unknown>, options?: Parameters<FakeGoogle['idToken']>[1]) =>
    verifyGoogleIdToken(await google.idToken(payload, options), expected, { fetch: google.fetch, now: NOW });

  it('is accepted when every check passes, with the address lowercased', async () => {
    expect(await verify(valid())).toEqual({ sub: '1001', email: 'alice@example.com', emailVerified: true, givenName: 'Alice' });
  });

  it('is refused when signed with any other key', async () => {
    const other = (await crypto.subtle.generateKey(
      { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['sign', 'verify'],
    )) as CryptoKeyPair;
    expect(await verify(valid(), { key: other.privateKey })).toBeNull();
    expect(await verify(valid(), { kid: 'unknown-kid' })).toBeNull();
  });

  it('is refused unless it is RS256', async () => {
    const [, body] = (await google.idToken(valid())).split('.');
    const none = `${Buffer.from(JSON.stringify({ alg: 'none', kid: google.kid })).toString('base64url')}.${body}.`;
    expect(await verifyGoogleIdToken(none, expected, { fetch: google.fetch, now: NOW })).toBeNull();
  });

  it('is refused for another issuer, another client, or after it expires', async () => {
    expect(await verify({ ...valid(), iss: 'https://evil.example' })).toBeNull();
    expect(await verify({ ...valid(), aud: 'someone-else.apps.googleusercontent.com' })).toBeNull();
    expect(await verify({ ...valid(), aud: [SETTINGS.clientId, 'other'], azp: 'other' })).toBeNull();
    expect(await verify({ ...valid(), aud: [SETTINGS.clientId, 'other'], azp: SETTINGS.clientId })).not.toBeNull();
    expect(await verify({ ...valid(), exp: seconds(NOW) - 120 })).toBeNull();
    expect(await verify({ ...valid(), iat: seconds(NOW) + 600 })).toBeNull();
  });

  it('is refused when the nonce is not the one this sign-in sent', async () => {
    expect(await verify({ ...valid(), nonce: 'another-nonce' })).toBeNull();
    const { nonce: _dropped, ...withoutNonce } = valid();
    expect(await verify(withoutNonce)).toBeNull();
  });

  it('reports an unconfirmed address rather than hiding it', async () => {
    expect(await verify({ ...valid(), email_verified: false })).toMatchObject({ emailVerified: false });
    expect(await verify({ ...valid(), email_verified: 'true' })).toMatchObject({ emailVerified: true });
  });
});

describe('confirmed addresses, which checkout requires', () => {
  const earlier = '2026-10-01T00:00:00.000Z';

  it('a new account made by Google sign-in is confirmed when it is created', async () => {
    const result = await finish(await signInAs(alice));
    if (!result.ok) throw new Error(`sign-in failed: ${result.failure}`);
    expect((await userRow(result.user.id)).email_verified_at).toBe(NOW.toISOString());
    expect(result.user.email_verified_at).toBe(NOW.toISOString());
  });

  it('an existing account is confirmed when Google is linked, keeping an earlier confirmation date', async () => {
    const unconfirmed = await createUser(db);
    const linkedNow = await finish(await signInAs({ sub: '5005', email: `${unconfirmed}@example.invalid` }));
    expect(linkedNow).toMatchObject({ ok: true, created: false });
    expect((await userRow(unconfirmed)).email_verified_at).toBe(NOW.toISOString());

    const confirmed = await createUser(db);
    await db.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').run(earlier, confirmed);
    const linkedLater = await finish(await signInAs({ sub: '6006', email: `${confirmed}@example.invalid` }));
    expect(linkedLater).toMatchObject({ ok: true, created: false });
    expect((await userRow(confirmed)).email_verified_at).toBe(earlier);
  });

  it('a guest upgraded through Google sign-in is confirmed', async () => {
    const guestId = await createUser(db, { isGuest: true });
    expect((await userRow(guestId)).email_verified_at).toBeNull();
    const result = await finish(await signInAs(alice), { guestUserId: guestId });
    expect(result).toMatchObject({ ok: true, upgradedFromGuest: true });
    expect((await userRow(guestId)).email_verified_at).toBe(NOW.toISOString());
  });

  it('nothing is confirmed when Google has not confirmed the address', async () => {
    const existing = await createUser(db);
    const guestId = await createUser(db, { isGuest: true });

    const forExisting = await finish(await signInAs({ sub: '7007', email: `${existing}@example.invalid`, email_verified: false }));
    const forGuest = await finish(await signInAs({ ...alice, email_verified: false }), { guestUserId: guestId });

    expect(forExisting).toMatchObject({ ok: false, failure: 'unverified-email' });
    expect(forGuest).toMatchObject({ ok: false, failure: 'unverified-email' });
    expect(await userRow(existing)).toMatchObject({ email_verified_at: null, password_hash: 'x' });
    expect(await userRow(guestId)).toMatchObject({ email_verified_at: null, is_guest: 1, email: null });
    expect(await identities()).toEqual([]);
  });
});

describe('linking accounts', () => {
  it('creates a new account with a confirmed address and the first name', async () => {
    const result = await finish(await signInAs(alice, { next: '/practice', locale: 'it' }));
    expect(result).toMatchObject({ ok: true, created: true, upgradedFromGuest: false, next: '/practice', locale: 'it' });
    if (!result.ok) return;

    const user = await userRow(result.user.id);
    expect(user).toMatchObject({
      email: 'alice@example.com',
      password_hash: null,
      display_name: 'Alice',
      is_guest: 0,
      locale: 'it',
      email_verified_at: NOW.toISOString(),
    });
    expect(await identities()).toEqual([
      expect.objectContaining({ provider: 'google', subject: '1001', user_id: user.id, email: 'alice@example.com' }),
    ]);
  });

  it('upgrades the browser’s guest account, so its practice carries over', async () => {
    const guestId = await createUser(db, { isGuest: true });
    const result = await finish(await signInAs(alice), { guestUserId: guestId });
    expect(result).toMatchObject({ ok: true, created: true, upgradedFromGuest: true });
    if (!result.ok) return;
    expect(result.user.id).toBe(guestId);
    expect(await userRow(guestId)).toMatchObject({ email: 'alice@example.com', is_guest: 0 });
  });

  it('signs into an existing account with the same address, keeping a confirmed account’s password', async () => {
    const id = await createUser(db);
    const email = `${id}@example.invalid`;
    await db.prepare("UPDATE users SET email_verified_at = '2026-10-01T00:00:00.000Z' WHERE id = ?").run(id);
    const session = await createSession(db, id);

    const result = await finish(await signInAs({ sub: '2002', email }));
    expect(result).toMatchObject({ ok: true, created: false });
    if (!result.ok) return;
    expect(result.user.id).toBe(id);

    const user = await userRow(id);
    expect(user.password_hash).toBe('x');
    expect(user.email_verified_at).toBe('2026-10-01T00:00:00.000Z');
    expect(await resolveSession(db, session.token)).not.toBeNull();
    expect(await identities()).toMatchObject([{ subject: '2002', user_id: id }]);
  });

  it('confirms an unconfirmed account’s address, and removes the password whoever registered it chose', async () => {
    const id = await createUser(db);
    const email = `${id}@example.invalid`;
    const session = await createSession(db, id);

    const result = await finish(await signInAs({ sub: '3003', email: email.toUpperCase() }));
    expect(result).toMatchObject({ ok: true, created: false });

    const user = await userRow(id);
    expect(user.email_verified_at).toBe(NOW.toISOString());
    expect(user.password_hash).toBeNull();
    expect(await resolveSession(db, session.token)).toBeNull();
  });

  it('follows the Google subject, not the address, once linked', async () => {
    const first = await finish(await signInAs(alice));
    if (!first.ok) throw new Error('first sign-in failed');

    // The account's address changes; the same Google account still signs into it.
    await db.prepare("UPDATE users SET email = 'renamed@example.com' WHERE id = ?").run(first.user.id);
    const again = await finish(await signInAs({ ...alice, email: 'alice.new@example.com' }));
    expect(again).toMatchObject({ ok: true, created: false });
    if (!again.ok) return;
    expect(again.user.id).toBe(first.user.id);
    expect(await userByEmail('alice.new@example.com')).toBeUndefined();

    // A different Google account that now has the account's address is refused, not let in.
    const newcomer = await finish(await signInAs({ sub: '9999', email: 'renamed@example.com' }));
    expect(newcomer).toMatchObject({ ok: false, failure: 'conflict' });
  });

  it('never moves an account to a second Google identity', async () => {
    const first = await finish(await signInAs(alice));
    expect(first.ok).toBe(true);
    const second = await finish(await signInAs({ sub: '4004', email: alice.email }));
    expect(second).toMatchObject({ ok: false, failure: 'conflict' });
    expect(googleNotice('conflict')).toBe('conflict');
    expect(await identities()).toHaveLength(1);
  });

  it('stamps when a linked identity was last used', async () => {
    await finish(await signInAs(alice));
    const later = new Date(NOW.getTime() + 24 * 3600_000);
    google.now = later;
    expect(await finish(await signInAs(alice, { at: later }), { now: later })).toMatchObject({ ok: true, created: false });
    const [identity] = await identities();
    expect(identity.created_at).toBe(NOW.toISOString());
    expect(identity.last_used_at).toBe(later.toISOString());
  });
});
