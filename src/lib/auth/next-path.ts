/**
 * The `?next=` destination after signing in, signing up, resetting a password
 * or confirming an address.
 *
 * A `?next=` value is attacker-controllable, so only a path on this site is
 * ever accepted. Anything that could leave the origin - an absolute URL, a
 * protocol-relative "//host", a backslash form some browsers normalise to a
 * slash, whitespace or control characters - is discarded rather than corrected.
 */

/** Sending someone back to an auth page after they authenticate would loop them, and the API is not a page. */
const AUTH_PAGES = new Set(['/sign-in', '/sign-in/code', '/sign-up', '/forgot-password', '/verify-email']);

export function safeNext(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('//') || value.startsWith('/\\')) return null;
  if (/[\s\u0000-\u001f\u007f]/.test(value)) return null;

  const path = value.split(/[?#]/)[0];
  if (AUTH_PAGES.has(path) || path.startsWith('/api/')) return null;

  return value;
}

/** A query string carrying `next`, or nothing when there is none. */
export function withNext(path: string, next: string | null): string {
  return next ? `${path}${path.includes('?') ? '&' : '?'}next=${encodeURIComponent(next)}` : path;
}
