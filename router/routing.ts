/**
 * Where each request to uniexamer.com goes (docs/SPLIT-HOSTING.md). The router
 * Worker only runs for requests that matched no static file: every public
 * page, script and image saved at deploy time is answered by Cloudflare
 * before it.
 *
 * - "examer": pricing and payments, served by the Cloudflare Worker `examer`
 *   (OpenNext) through a service binding. Only this host holds Stripe keys.
 * - "vercel": everything else that is not a file (sign-in, practice, the free
 *   test, attempts, the study plan, the tutor, admin, the other /api routes).
 */

export type Origin = 'examer' | 'vercel';

/** The site's one address; other host names the router answers redirect here. */
export const CANONICAL_HOST = 'uniexamer.com';

const LOCALE_PREFIX = /^\/(?:it|es|pl|tr)(?=\/|$)/;

/** Pages served by `examer`, with or without a language prefix. */
const EXAMER_PAGES = ['/pricing', '/checkout', '/account'];
/** API routes served by `examer`. */
const EXAMER_API = ['/api/billing', '/api/account'];

const under = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

export function originFor(pathname: string): Origin {
  if (EXAMER_API.some((prefix) => under(pathname, prefix))) return 'examer';
  const page = pathname.replace(LOCALE_PREFIX, '') || '/';
  if (EXAMER_PAGES.some((prefix) => under(page, prefix))) return 'examer';
  return 'vercel';
}

/**
 * A redirect from Vercel names Vercel's own host, which the visitor must never
 * see: point it back at the public address. Other locations pass unchanged.
 */
export function publicLocation(location: string, vercelOrigin: string, publicOrigin: string): string {
  let target: URL;
  try {
    target = new URL(location, vercelOrigin);
  } catch {
    return location;
  }
  const vercelHost = new URL(vercelOrigin).host;
  if (target.host !== vercelHost && !target.host.endsWith('.vercel.app')) return location;
  return new URL(`${target.pathname}${target.search}${target.hash}`, publicOrigin).toString();
}
