/**
 * Site-wide configuration.
 *
 * The brand lives in one place so renaming the product is a single edit here
 * plus the logo files. Those come from the UniExamer logo pack (October 2026):
 * the logo, wordmark and symbol in primary, white and mono in public/brand,
 * the favicon (src/app/favicon.ico and src/app/icon.svg), the Apple touch icon
 * (src/app/apple-icon.png) and the app icons in public/manifest.webmanifest.
 * Use the PNGs wherever there is lettering: the pack's SVG lettering is live
 * Arial text, which a device without Arial redraws in another font.
 */

export const SITE = {
  name: 'UniExamer',
  /** Used in titles: "<page> | <tagline-safe short name>". */
  shortName: 'UniExamer',
  /**
   * Other names people may search for: Examer was the name until October 2026,
   * and the domain is uniexamer.com. Offered to search engines as WebSite and
   * Organization `alternateName`.
   */
  alternateNames: ['Examer', 'uniexamer.com'],
  tagline: 'Bocconi, SAT & University Admission Test Practice',
  description:
    'Prepare for Bocconi, SAT, TOLC and more with original practice questions, worked explanations and timed tests. Start free with UniExamer.',
  locale: 'en',
  /**
   * Publisher identity shown on public content and in structured data. Not
   * "UniExamer Editorial": no record names a human editorial team, so the
   * byline does not imply one.
   */
  publisher: 'UniExamer',
} as const;

/**
 * Where to write to us. Support mail is answered by a person on the team
 * within 48 hours (the footer says so in every language); info is for
 * everything else.
 */
export const CONTACT = {
  support: 'support@uniexamer.com',
  info: 'info@uniexamer.com',
} as const;

/** The site's own profiles, in the order the footer shows them; also the Organization's sameAs. */
export const SOCIAL_LINKS = [
  { key: 'blog', name: 'Hashnode', href: 'https://uniexamer.hashnode.dev/' },
  { key: 'linkedin', name: 'LinkedIn', href: 'https://www.linkedin.com/company/uniexamer/' },
  { key: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/uniexamer/' },
  { key: 'substack', name: 'Substack', href: 'https://substack.com/@uniexamerresearchteam' },
] as const;
export type SocialKey = (typeof SOCIAL_LINKS)[number]['key'];

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
  `${SITE.name} is an independent study resource. It is not affiliated with, endorsed by, or accredited by ` +
  'College Board, ACT, LSAC, GMAC, ETS, Università Bocconi, Politecnico di Torino or CISIA. SAT is a trademark of College Board; ACT ' +
  'of ACT; LSAT of LSAC; GMAT of GMAC; GRE of ETS. The practice questions are original, AI-assisted ' +
  'material; see our editorial standards for how they are created and checked.';
