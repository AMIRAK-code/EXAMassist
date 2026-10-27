/**
 * Site-wide configuration.
 *
 * The brand is deliberately neutral and lives in one place so renaming the
 * product is a single edit here plus the logo files: the wordmark and symbol
 * variants in public/brand, and the favicon (src/app/icon.svg, a copy of
 * public/brand/examer-favicon-micro.svg).
 */

export const SITE = {
  name: 'Examer',
  /** Used in titles: "<page> | <tagline-safe short name>". */
  shortName: 'Examer',
  /**
   * Other names people may search for: the domain is uniexamer.com. Offered to
   * search engines as WebSite and Organization `alternateName`.
   */
  alternateNames: ['UniExamer', 'uniexamer.com'],
  tagline: 'Admission test preparation, verified against official sources',
  description:
    'Practice questions, exam format guides and timed practice for the Bocconi Online Test, Digital SAT, Enhanced ACT, LSAT, GMAT, GRE, Politecnico di Torino TIL and CISIA TOLC, with a free test for every account. Every format claim is sourced to the test maker.',
  locale: 'en',
  /**
   * Publisher identity shown on public content and in structured data. Not
   * "Examer Editorial": no record names a human editorial team, so the byline
   * does not imply one.
   */
  publisher: 'Examer',
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
 * The share image for a page (Open Graph, and X through its og:image
 * fallback): public/og/<key>.png, 1200 × 630, made by `npm run seo:og-images`.
 * Keys are `site`, `exam-<hub slug>` and `guide-<guide slug>`; a page whose
 * metadata sets `openGraph` replaces the layout's, so it must pass one too.
 */
export function shareImages(key: string, alt: string) {
  return [{ url: `/og/${key}.png`, width: 1200, height: 630, alt }];
}

/**
 * Google Search Console HTML-tag verification token, when one is set in code.
 * Prefer the GOOGLE_SITE_VERIFICATION environment variable; put the token here
 * only if the deployment cannot carry one. It is public by design: Google reads
 * it from the page's <meta name="google-site-verification">.
 */
const GOOGLE_SITE_VERIFICATION_TOKEN = '';

/**
 * The Search Console verification token for this deployment, or null.
 *
 * Accepts the bare token or the whole tag Search Console shows
 * (<meta name="google-site-verification" content="…" />), and refuses
 * anything that is not token-shaped, so a pasted typo cannot inject markup.
 * Only emitted where indexing is enabled: a preview has nothing to verify.
 */
export function googleSiteVerification(env: Record<string, string | undefined> = process.env): string | null {
  const raw = (env.GOOGLE_SITE_VERIFICATION?.trim() || GOOGLE_SITE_VERIFICATION_TOKEN).trim();
  if (!raw) return null;
  const token = /content=["']([^"']+)["']/.exec(raw)?.[1] ?? raw;
  return /^[A-Za-z0-9_-]{10,100}$/.test(token) ? token : null;
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
  'College Board, ACT, LSAC, GMAC, ETS, Università Bocconi, Politecnico di Torino or CISIA. SAT is a trademark of College Board; ACT ' +
  'of ACT; LSAT of LSAC; GMAT of GMAC; GRE of ETS. The practice questions are original, AI-assisted ' +
  'material; see our editorial standards for how they are created and checked.';
