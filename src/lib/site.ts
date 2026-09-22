/**
 * Site-wide configuration.
 *
 * The brand is deliberately neutral and lives in one place so renaming the
 * product is a single edit here plus the favicon.
 */

export const SITE = {
  name: 'Examer',
  /** Used in titles: "<page> | <tagline-safe short name>". */
  shortName: 'Examer',
  tagline: 'Admission test preparation, verified against official sources',
  description:
    'Free practice questions, exam format guides and timed practice for the Bocconi Online Test, Digital SAT, Enhanced ACT, LSAT, GMAT and GRE. Every format claim is sourced to the test maker.',
  locale: 'en',
  /** Editorial identity shown on public content and in structured data. */
  publisher: 'Examer Editorial',
} as const;

/** Absolute base URL, without a trailing slash. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path: string): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl()}${suffix}`;
}

/**
 * Whether this deployment may be indexed.
 *
 * Defaults to false so a staging or preview deployment is never indexed by
 * accident. This is an indexing control, NOT access control - private pages
 * are protected by authorization, never by noindex.
 */
export function indexingEnabled(): boolean {
  return process.env.SEARCH_INDEXING_ENABLED === 'true';
}

/**
 * The independence notice. We are not affiliated with any test maker, and
 * saying so is a trust and legal requirement, not a footer nicety.
 */
export const INDEPENDENCE_NOTICE =
  'Examer is an independent study resource. It is not affiliated with, endorsed by, or accredited by ' +
  'College Board, ACT, LSAC, GMAC, ETS or Università Bocconi. SAT is a trademark of College Board; ACT ' +
  'of ACT; LSAT of LSAC; GMAT of GMAC; GRE of ETS. All practice questions on this site are original ' +
  'material written by our editorial team.';
