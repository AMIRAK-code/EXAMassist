import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import type { Db } from '@/lib/db';
import type { OAuthIdentityRow, OAuthRequestRow, UserRow } from '@/lib/db/rows';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales';
import { siteUrl } from '@/lib/site';
import { safeNext } from './next-path';
import { destroyAllSessionsFor } from './session';

/**
 * Sign in with Google: OpenID Connect, authorization code flow with PKCE
 * (migration 018).
 *
 * Starting a sign-in stores a request row keyed by the SHA-256 of a random
 * `state`, holding the PKCE verifier and the nonce's hash, and gives the
 * browser the `state` in a short-lived cookie. The callback must bring the
 * same `state` in both the URL and that cookie, which ties Google's answer to
 * the browser that asked for it, and spends the row exactly once, so a code
 * that comes back a second time is refused before it reaches Google.
 *
 * The ID token is checked here in full - its RS256 signature against Google's
 * published keys, `iss`, `aud`, `exp`, `iat`, the nonce, and
 * `email_verified` - even though it arrives straight from Google's token
 * endpoint over TLS.
 *
 * Accounts are matched on Google's subject (`sub`), which never changes, and
 * only on the email address the first time, when the identity is linked. From
 * then on a change of address on either side cannot move the Google account
 * to someone else's account.
 *
 * Everything that talks to Google takes `fetch` and the clock as
 * dependencies, so the tests run the whole flow against a stand-in.
 */

export const GOOGLE_STATE_COOKIE = 'examer_google';
export const GOOGLE_START_PATH = '/api/auth/google';
export const GOOGLE_CALLBACK_PATH = '/api/auth/google/callback';
export const GOOGLE_REQUEST_TTL_MINUTES = 10;
/** Finished and abandoned requests are deleted once they are this far past expiry. */
const PURGE_AFTER_MS = 24 * 60 * 60 * 1000;

export const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);
export const GOOGLE_SCOPES = 'openid email profile';
/** How far Google's clock and ours may disagree about `exp` and `iat`. */
const CLOCK_SKEW_MS = 60_000;
/** How long Google's keys are kept when its response gives no max-age. */
const DEFAULT_KEY_CACHE_MS = 60 * 60 * 1000;

export interface GoogleSettings {
  clientId: string;
  clientSecret: string;
  /** Must be listed exactly under the OAuth client's authorised redirect URIs. */
  redirectUri: string;
}

/**
 * This deployment's Google OAuth client, or null when it has none. Pages use
 * it to decide whether to offer "Continue with Google" at all.
 */
export function googleSettings(env: Record<string, string | undefined> = process.env): GoogleSettings | null {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret, redirectUri: `${siteUrl()}${GOOGLE_CALLBACK_PATH}` };
}

export interface GoogleDeps {
  now?: Date;
  fetch?: typeof fetch;
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function randomToken(): string {
  return randomBytes(32).toString('base64url');
}

function sameText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// ---------------------------------------------------------------------------
// Starting a sign-in
// ---------------------------------------------------------------------------

export interface StartedGoogleSignIn {
  /** Google's consent page, with every parameter of this request. */
  url: string;
  /** For the state cookie; it is stored nowhere else in clear. */
  state: string;
  expiresAt: Date;
}

export async function startGoogleSignIn(
  db: Db,
  settings: GoogleSettings,
  input: { next: string | null; locale: Locale },
  deps: GoogleDeps = {},
): Promise<StartedGoogleSignIn> {
  const now = deps.now ?? new Date();
  const state = randomToken();
  const nonce = randomToken();
  const verifier = randomToken();
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const expiresAt = new Date(now.getTime() + GOOGLE_REQUEST_TTL_MINUTES * 60_000);

  const store = db.transaction(async () => {
    (await db.prepare('DELETE FROM oauth_requests WHERE expires_at < ?').run(
      new Date(now.getTime() - PURGE_AFTER_MS).toISOString(),
    ));
    (await db.prepare(
      `INSERT INTO oauth_requests (id, provider, code_verifier, nonce_hash, next_path, locale, created_at, expires_at, consumed_at)
       VALUES (?, 'google', ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(sha256Hex(state), verifier, sha256Hex(nonce), safeNext(input.next ?? undefined), input.locale, now.toISOString(), expiresAt.toISOString()));
  });
  (await store());

  const url = new URL(GOOGLE_AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: settings.clientId,
    redirect_uri: settings.redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    // Lets someone with several Google accounts choose, rather than silently
    // using whichever one the browser is signed in to.
    prompt: 'select_account',
    // Google's own pages in the language the learner was using here.
    hl: input.locale,
  }).toString();

  return { url: url.toString(), state, expiresAt };
}

// ---------------------------------------------------------------------------
// Checking Google's ID token
// ---------------------------------------------------------------------------

export interface GoogleClaims {
  /** Google's stable id for the person. */
  sub: string;
  /** Lowercased. */
  email: string;
  emailVerified: boolean;
  /** The first name Google holds, if any; offered as the display name of a new account. */
  givenName: string | null;
}

interface GoogleKey extends JsonWebKey {
  kid?: string;
}

interface KeyCache {
  keys: GoogleKey[];
  expiresAt: number;
}

/** Google's signing keys, per fetch implementation so tests never share them. */
const keyCaches = new WeakMap<typeof fetch, KeyCache>();

async function googleKeys(fetcher: typeof fetch, now: number, refresh: boolean): Promise<GoogleKey[]> {
  const cached = keyCaches.get(fetcher);
  if (cached && !refresh && cached.expiresAt > now) return cached.keys;

  const response = await fetcher(GOOGLE_CERTS_URL, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Google's signing keys could not be fetched (${response.status}).`);
  const body = (await response.json()) as { keys?: GoogleKey[] };
  const keys = Array.isArray(body.keys) ? body.keys : [];
  const maxAge = /max-age=(\d+)/.exec(response.headers.get('cache-control') ?? '')?.[1];
  keyCaches.set(fetcher, { keys, expiresAt: now + (maxAge ? Number(maxAge) * 1000 : DEFAULT_KEY_CACHE_MS) });
  return keys;
}

function decodeJson(segment: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as unknown;
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function signatureMatches(key: GoogleKey, signed: string, signature: string): Promise<boolean> {
  try {
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      { kty: key.kty, n: key.n, e: key.e },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      Buffer.from(signature, 'base64url'),
      new TextEncoder().encode(signed),
    );
  } catch {
    return false;
  }
}

/**
 * The claims of a genuine ID token for this client and this sign-in, or null.
 * `email_verified` is reported, not enforced: the caller refuses an
 * unverified address with its own answer.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  expected: { clientId: string; nonceHash: string },
  deps: GoogleDeps = {},
): Promise<GoogleClaims | null> {
  const now = (deps.now ?? new Date()).getTime();
  const fetcher = deps.fetch ?? fetch;

  const parts = idToken.split('.');
  if (parts.length !== 3) return null;
  const [headerPart, payloadPart, signaturePart] = parts;
  const header = decodeJson(headerPart);
  const payload = decodeJson(payloadPart);
  if (!header || !payload) return null;
  // Only Google's algorithm: never "none", never a symmetric one.
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;

  // An unknown key id may mean Google has rotated its keys since we cached them.
  let key = (await googleKeys(fetcher, now, false)).find((candidate) => candidate.kid === header.kid);
  if (!key) key = (await googleKeys(fetcher, now, true)).find((candidate) => candidate.kid === header.kid);
  if (!key || key.kty !== 'RSA') return null;
  if (!(await signatureMatches(key, `${headerPart}.${payloadPart}`, signaturePart))) return null;

  if (typeof payload.iss !== 'string' || !GOOGLE_ISSUERS.has(payload.iss)) return null;

  const audience = payload.aud;
  if (Array.isArray(audience)) {
    if (!audience.includes(expected.clientId) || payload.azp !== expected.clientId) return null;
  } else if (audience !== expected.clientId) {
    return null;
  }

  if (typeof payload.exp !== 'number' || payload.exp * 1000 + CLOCK_SKEW_MS <= now) return null;
  if (typeof payload.iat !== 'number' || payload.iat * 1000 - CLOCK_SKEW_MS > now) return null;

  if (typeof payload.nonce !== 'string' || !sameText(sha256Hex(payload.nonce), expected.nonceHash)) return null;

  if (typeof payload.sub !== 'string' || !payload.sub) return null;
  if (typeof payload.email !== 'string' || !payload.email.includes('@')) return null;

  const givenName = typeof payload.given_name === 'string' ? payload.given_name.trim().slice(0, 60) : '';
  return {
    sub: payload.sub,
    email: payload.email.trim().toLowerCase(),
    // Google sends a boolean; very old tokens carried the string "true".
    emailVerified: payload.email_verified === true || payload.email_verified === 'true',
    givenName: givenName || null,
  };
}

// ---------------------------------------------------------------------------
// Linking the Google account to one of ours
// ---------------------------------------------------------------------------

export type LinkResult =
  | { ok: true; user: UserRow; created: boolean; upgradedFromGuest: boolean }
  | { ok: false; failure: 'conflict' };

/**
 * The account this Google identity signs into, creating or upgrading one if
 * needed:
 *
 * 1. An identity already linked signs into its account, whatever either
 *    address is now.
 * 2. Otherwise an account with the same (verified) address is linked and
 *    signed into, and its address is marked confirmed. If that address had
 *    never been confirmed, whoever chose the account's password never proved
 *    they own the inbox - they may have registered someone else's address in
 *    advance - so the password is removed and every session ended. The owner
 *    can set a new password with a reset code.
 * 3. Otherwise a new account is made: the browser's guest account, upgraded
 *    in place so its practice carries over as it does for sign-up, or a fresh
 *    one.
 *
 * An account that already has a different Google identity is never taken
 * over: that is a conflict.
 */
export async function linkGoogleAccount(
  db: Db,
  claims: GoogleClaims,
  context: { guestUserId: string | null; locale: Locale },
  deps: Pick<GoogleDeps, 'now'> = {},
): Promise<LinkResult> {
  const nowIso = (deps.now ?? new Date()).toISOString();

  const link = db.transaction(async (): Promise<LinkResult> => {
    const linked = (await db
      .prepare("SELECT * FROM oauth_identities WHERE provider = 'google' AND subject = ?")
      .get(claims.sub)) as OAuthIdentityRow | undefined;

    if (linked) {
      const user = (await db
        .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
        .get(linked.user_id)) as UserRow | undefined;
      if (!user) return { ok: false, failure: 'conflict' };
      (await db
        .prepare("UPDATE oauth_identities SET last_used_at = ? WHERE provider = 'google' AND subject = ?")
        .run(nowIso, claims.sub));
      if (user.email === claims.email && !user.email_verified_at) {
        (await db.prepare('UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?').run(nowIso, nowIso, user.id));
      }
      return { ok: true, user: await userById(db, user.id), created: false, upgradedFromGuest: false };
    }

    const existing = (await db.prepare('SELECT * FROM users WHERE email = ?').get(claims.email)) as UserRow | undefined;

    if (existing) {
      if (existing.deleted_at) return { ok: false, failure: 'conflict' };
      const other = (await db
        .prepare("SELECT subject FROM oauth_identities WHERE provider = 'google' AND user_id = ?")
        .get(existing.id)) as { subject: string } | undefined;
      if (other) return { ok: false, failure: 'conflict' };

      if (!existing.email_verified_at) {
        (await db.prepare('UPDATE users SET password_hash = NULL WHERE id = ?').run(existing.id));
        (await destroyAllSessionsFor(db, existing.id));
      }
      (await db
        .prepare('UPDATE users SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?')
        .run(nowIso, nowIso, existing.id));
      (await insertIdentity(db, claims, existing.id, nowIso));
      return { ok: true, user: await userById(db, existing.id), created: false, upgradedFromGuest: false };
    }

    // A guest who signs up with Google keeps the practice history they already built.
    if (context.guestUserId) {
      const upgraded = (await db.prepare(
        `UPDATE users SET email = ?, password_hash = NULL, display_name = ?, is_guest = 0, locale = ?,
                          email_verified_at = ?, updated_at = ?
         WHERE id = ? AND is_guest = 1 AND deleted_at IS NULL`,
      ).run(claims.email, claims.givenName, context.locale, nowIso, nowIso, context.guestUserId));
      if (upgraded.changes === 1) {
        (await insertIdentity(db, claims, context.guestUserId, nowIso));
        return { ok: true, user: await userById(db, context.guestUserId), created: true, upgradedFromGuest: true };
      }
    }

    const userId = randomUUID();
    (await db.prepare(
      `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale,
                          is_minor, created_at, updated_at, email_verified_at)
       VALUES (?, ?, NULL, ?, 'learner', 0, ?, 0, ?, ?, ?)`,
    ).run(userId, claims.email, claims.givenName, context.locale, nowIso, nowIso, nowIso));
    (await insertIdentity(db, claims, userId, nowIso));
    return { ok: true, user: await userById(db, userId), created: true, upgradedFromGuest: false };
  });

  return (await link());
}

async function insertIdentity(db: Db, claims: GoogleClaims, userId: string, nowIso: string): Promise<void> {
  (await db.prepare(
    `INSERT INTO oauth_identities (provider, subject, user_id, email, created_at, last_used_at)
     VALUES ('google', ?, ?, ?, ?, ?)`,
  ).run(claims.sub, userId, claims.email, nowIso, nowIso));
}

async function userById(db: Db, id: string): Promise<UserRow> {
  return (await db.prepare('SELECT * FROM users WHERE id = ?').get(id)) as UserRow;
}

// ---------------------------------------------------------------------------
// Finishing a sign-in (the callback)
// ---------------------------------------------------------------------------

/**
 * Why a sign-in did not finish. The learner is told one of four things
 * (`googleNotice`); the detail is for the server log and the tests.
 */
export type GoogleFailure =
  | 'cancelled'
  | 'invalid-state'
  | 'expired'
  | 'replayed'
  | 'exchange-failed'
  | 'invalid-token'
  | 'unverified-email'
  | 'conflict';

export type GoogleCallbackResult =
  | {
      ok: true;
      user: UserRow;
      created: boolean;
      upgradedFromGuest: boolean;
      next: string | null;
      locale: Locale;
    }
  | { ok: false; failure: GoogleFailure; next: string | null; locale: Locale };

export interface GoogleCallbackInput {
  /** The callback's query string: `code` and `state`, or `error`. */
  params: URLSearchParams;
  /** The state cookie's value, if the browser sent one. */
  cookieState: string | undefined;
  /** The browser's guest account, if it has one, to upgrade for a new account. */
  guestUserId: string | null;
}

export async function finishGoogleSignIn(
  db: Db,
  settings: GoogleSettings,
  input: GoogleCallbackInput,
  deps: GoogleDeps = {},
): Promise<GoogleCallbackResult> {
  const now = deps.now ?? new Date();
  const state = input.params.get('state') ?? '';
  let next: string | null = null;
  let locale: Locale = DEFAULT_LOCALE;
  const failed = (failure: GoogleFailure): GoogleCallbackResult => ({ ok: false, failure, next, locale });

  // The URL and the cookie must carry the same state: Google's answer is for
  // the browser that started this sign-in, and for no other.
  if (!state || !input.cookieState || !sameText(state, input.cookieState)) return failed('invalid-state');

  const request = (await db.prepare('SELECT * FROM oauth_requests WHERE id = ?').get(sha256Hex(state))) as
    | OAuthRequestRow
    | undefined;
  if (!request) return failed('invalid-state');
  next = safeNext(request.next_path ?? undefined);
  locale = isLocale(request.locale) ? request.locale : DEFAULT_LOCALE;

  if (request.consumed_at) return failed('replayed');
  // Spent before anything else happens, so only one of two simultaneous
  // callbacks can go on to Google, and a code never comes back a second time.
  const spent = (await db
    .prepare("UPDATE oauth_requests SET consumed_at = ?, code_verifier = '' WHERE id = ? AND consumed_at IS NULL")
    .run(now.toISOString(), request.id));
  if (spent.changes !== 1) return failed('replayed');
  if (new Date(request.expires_at).getTime() <= now.getTime()) return failed('expired');

  const error = input.params.get('error');
  if (error) return failed(error === 'access_denied' ? 'cancelled' : 'exchange-failed');

  const code = input.params.get('code');
  if (!code) return failed('exchange-failed');

  const fetcher = deps.fetch ?? fetch;
  let idToken: unknown;
  try {
    const response = await fetcher(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: settings.clientId,
        client_secret: settings.clientSecret,
        redirect_uri: settings.redirectUri,
        code_verifier: request.code_verifier,
      }).toString(),
    });
    if (!response.ok) {
      console.error('[google] the code exchange was refused:', response.status);
      return failed('exchange-failed');
    }
    idToken = ((await response.json()) as { id_token?: unknown }).id_token;
  } catch (cause) {
    console.error('[google] the code exchange failed:', cause instanceof Error ? cause.message : cause);
    return failed('exchange-failed');
  }
  if (typeof idToken !== 'string') return failed('exchange-failed');

  let claims: GoogleClaims | null;
  try {
    claims = await verifyGoogleIdToken(idToken, { clientId: settings.clientId, nonceHash: request.nonce_hash }, { now, fetch: fetcher });
  } catch (cause) {
    console.error('[google] the ID token could not be checked:', cause instanceof Error ? cause.message : cause);
    return failed('invalid-token');
  }
  if (!claims) return failed('invalid-token');
  if (!claims.emailVerified) return failed('unverified-email');

  const linked = await linkGoogleAccount(db, claims, { guestUserId: input.guestUserId, locale }, { now });
  if (!linked.ok) return failed(linked.failure);
  return { ...linked, next, locale };
}

/** What the sign-in page tells the learner after a sign-in that did not finish. */
export type GoogleNotice = 'cancelled' | 'unverified' | 'conflict' | 'failed' | 'unavailable' | 'rate-limited';

export const GOOGLE_NOTICES: readonly GoogleNotice[] = ['cancelled', 'unverified', 'conflict', 'failed', 'unavailable', 'rate-limited'];

export function googleNotice(failure: GoogleFailure): GoogleNotice {
  if (failure === 'cancelled') return 'cancelled';
  if (failure === 'unverified-email') return 'unverified';
  if (failure === 'conflict') return 'conflict';
  return 'failed';
}

export function isGoogleNotice(value: string | string[] | undefined): value is GoogleNotice {
  return typeof value === 'string' && (GOOGLE_NOTICES as readonly string[]).includes(value);
}
