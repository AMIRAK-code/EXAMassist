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
 * AI crawlers are split three ways, because blocking a training crawler does
 * NOT remove us from that vendor's AI search, and blocking a search crawler
 * silently destroys discovery. See docs/research/seo-and-crawler-policy.md.
 */
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
  ];

  return {
    rules: [
      // General web and search crawlers: public educational content only.
      { userAgent: '*', allow: '/', disallow: privateAreas },

      // AI search and grounding crawlers. Allowed: being cited in an AI answer
      // is discovery, and these obey robots.txt.
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: privateAreas },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: privateAreas },
      { userAgent: 'PerplexityBot', allow: '/', disallow: privateAreas },

      // User-triggered fetchers: a person asked an assistant to read our page.
      { userAgent: 'ChatGPT-User', allow: '/', disallow: privateAreas },
      { userAgent: 'Claude-User', allow: '/', disallow: privateAreas },

      // Model-training crawlers. Disallowed by default: our editorial content is
      // the product. This has no effect on inclusion in AI search above, and no
      // effect on Google Search ranking in the case of Google-Extended.
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'Applebot-Extended', disallow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
