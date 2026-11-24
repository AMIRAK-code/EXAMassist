import type { Db } from '@/lib/db';
import type { AuthUser } from '@/lib/auth/session';

/**
 * What an account holder agreed to about email (migration 021).
 *
 * - Account email: the minimum the account needs (sign-in codes, messages
 *   about the account and purchases). Required to sign up with the form.
 * - News: news about courses and tests and occasional offers. Optional,
 *   never pre-ticked, refused for an account marked under 16, withdrawn at
 *   any time from the account page.
 *
 * Every change is written to audit_log. The administrators' contact export
 * (`emailContacts`) carries each address's news consent, so a mailing tool
 * can send news only to those who asked for it.
 */

export class EmailConsentError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'EmailConsentError';
  }
}

export interface EmailConsent {
  accountEmailConsentAt: string | null;
  newsConsentAt: string | null;
}

export async function getEmailConsent(db: Db, userId: string): Promise<EmailConsent> {
  const row = (await db
    .prepare('SELECT account_email_consent_at, news_consent_at FROM users WHERE id = ?')
    .get(userId)) as { account_email_consent_at: string | null; news_consent_at: string | null } | undefined;
  return { accountEmailConsentAt: row?.account_email_consent_at ?? null, newsConsentAt: row?.news_consent_at ?? null };
}

async function audit(db: Db, userId: string, action: string, payload: unknown, at: string) {
  await db
    .prepare('INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(userId, action, 'user', userId, JSON.stringify(payload), at);
}

/** Records the two answers given on the sign-up form. */
export async function recordSignUpConsent(db: Db, userId: string, input: { news: boolean; isMinor: boolean }, now = new Date()): Promise<void> {
  const at = now.toISOString();
  const news = input.news && !input.isMinor;
  await db
    .prepare('UPDATE users SET account_email_consent_at = ?, news_consent_at = ? WHERE id = ?')
    .run(at, news ? at : null, userId);
  await audit(db, userId, 'email_consent.sign_up', { accountEmail: true, news }, at);
}

/** The account holder turns news emails on or off for themselves. */
export async function setNewsConsent(db: Db, user: AuthUser, on: boolean, now = new Date()): Promise<EmailConsent> {
  if (user.isGuest || !user.email) {
    throw new EmailConsentError('no-account', 'Create an account with an email address first.', 403);
  }
  if (on && user.isMinor) {
    throw new EmailConsentError('minor', 'News emails are not available for accounts marked under 16.', 403);
  }
  const current = await getEmailConsent(db, user.id);
  if (Boolean(current.newsConsentAt) === on) return current;
  const at = now.toISOString();
  await db.prepare('UPDATE users SET news_consent_at = ?, updated_at = ? WHERE id = ?').run(on ? at : null, at, user.id);
  await audit(db, user.id, on ? 'email_consent.news_on' : 'email_consent.news_off', {}, at);
  return getEmailConsent(db, user.id);
}

export interface EmailContact {
  email: string;
  language: string;
  newsConsent: boolean;
  newsConsentAt: string | null;
}

/**
 * Account email addresses for the mailing tool: signed-up accounts only (no
 * guests, no deleted accounts), with the language and the news consent of
 * each. `scope: 'news'` keeps only those who opted in. Nothing else about the
 * person leaves the site.
 */
export async function emailContacts(db: Db, scope: 'all' | 'news'): Promise<EmailContact[]> {
  const rows = (await db
    .prepare(
      `SELECT email, locale, news_consent_at, is_minor FROM users
        WHERE is_guest = 0 AND deleted_at IS NULL AND email IS NOT NULL
        ${scope === 'news' ? 'AND news_consent_at IS NOT NULL AND is_minor = 0' : ''}
        ORDER BY created_at`,
    )
    .all()) as Array<{ email: string; locale: string; news_consent_at: string | null; is_minor: number }>;
  return rows.map((r) => {
    // An account marked under 16 never counts as consenting to news, whatever is stored.
    const news = Boolean(r.news_consent_at) && Number(r.is_minor) === 0;
    return { email: r.email, language: r.locale, newsConsent: news, newsConsentAt: news ? r.news_consent_at : null };
  });
}

/** Brevo's contact import format: EMAIL first, then attributes; semicolon-free values, so commas are safe. */
export function contactsCsv(contacts: readonly EmailContact[]): string {
  const cell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = ['EMAIL,LANGUAGE,NEWS_CONSENT,NEWS_CONSENT_DATE'];
  for (const c of contacts) {
    lines.push([c.email, c.language, c.newsConsent ? 'yes' : 'no', c.newsConsentAt?.slice(0, 10) ?? ''].map(cell).join(','));
  }
  return `${lines.join('\r\n')}\r\n`;
}
