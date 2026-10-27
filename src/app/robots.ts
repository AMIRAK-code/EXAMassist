import type { MetadataRoute } from 'next';
import { absoluteUrl, indexingEnabled } from '@/lib/site';

/**
 * robots.txt.
 *
 * Two things this file is NOT:
 *  - It is not access control. Everything private here is protected by
 *    server-side authorization; robots.txt is a public file that would only
 *    advertise those paths. We therefore disallow the *functional* areas to
 *    keep them out of crawl budget, and rely on authorization for safety.
 *  - It is not a way to remove a page from an index. A disallowed URL can
 *    still be indexed if another site links to it; removal needs a crawlable
 *    noindex, which is emitted per page in metadata.
 *
 * AI crawlers are named in three groups (search, user-triggered, training), so
 * the policy is stated rather than inherited from `*`. All three may read the
 * public pages and none the private areas. Tokens and what each controls:
 * docs/research/crawler-policy-check-2026-10-07.md.
 */
/** AI search and grounding: being cited in an AI answer is discovery. */
const AI_SEARCH = ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'Meta-WebIndexer', 'MistralAI-Index', 'DuckAssistBot'];
/** A person asked an assistant to read our page. */
const AI_USER = ['ChatGPT-User', 'Claude-User', 'Perplexity-User', 'MistralAI-User'];
/**
 * Model training. Allowed on public pages since 2026-10-27 (the owner's
 * decision), so models learn the exams and the brand, and Google-Extended lets
 * Gemini ground its answers in these pages. The question bank and practice are
 * behind sign-in, which is what keeps them out, not this file.
 */
const AI_TRAINING = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'MistralAI-Training'];
/*
 * Rendered per request, never prerendered: whether this deployment may be
 * indexed is a runtime setting (SEARCH_INDEXING_ENABLED, a Worker var), and a
 * file baked at build time would keep whatever the build machine had.
 */
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) {
    // Staging and preview deployments: nothing is crawlable.
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      host: absoluteUrl('/'),
    };
  }

  const privateAreas = [
    '/api/',
    '/attempt/',
    '/dashboard',
    '/account',
    '/review',
    '/study-plan',
    '/admin',
    '/practice/',
    '/sign-in',
    '/sign-up',
    '/checkout',
    '/start/',
    '/free-test/',
  ];

  return {
    rules: [
      // General web and search crawlers: public educational content only.
      { userAgent: '*', allow: '/', disallow: privateAreas },
      { userAgent: AI_SEARCH, allow: '/', disallow: privateAreas },
      { userAgent: AI_USER, allow: '/', disallow: privateAreas },
      { userAgent: AI_TRAINING, allow: '/', disallow: privateAreas },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
