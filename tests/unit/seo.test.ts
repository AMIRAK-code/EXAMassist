import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { listGuides } from '@/lib/content/guides';
import { EXAM_HUBS } from '@/lib/exams/registry';
import { googleSiteVerification } from '@/lib/site';

/**
 * What search engines are told in production: robots.txt, the sitemap and the
 * Search Console token. Both files read the environment when they are
 * requested, so the tests set it the way the Worker does.
 */

const SITE = 'https://exam.assist365.app';
const PRIVATE = ['/api/', '/attempt/', '/dashboard', '/account', '/study-plan', '/admin', '/practice/', '/start/', '/free-test/', '/premium/welcome'];
const saved = { ...process.env };

function production() {
  process.env.NEXT_PUBLIC_SITE_URL = SITE;
  process.env.SEARCH_INDEXING_ENABLED = 'true';
}

beforeEach(() => {
  process.env = { ...saved };
});
afterEach(() => {
  process.env = { ...saved };
});

type Rule = { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[] };
const list = (value: string | string[] | undefined) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);
const groupFor = (rules: Rule[], agent: string) => rules.find((r) => list(r.userAgent).includes(agent));

describe('robots.txt in production', () => {
  it('lets every crawler that falls back to * (Googlebot, bingbot) reach public pages, and keeps it out of private ones', () => {
    production();
    const result = robots();
    const star = groupFor(result.rules as Rule[], '*')!;
    expect(list(star.allow)).toContain('/');
    for (const path of PRIVATE) expect(list(star.disallow)).toContain(path);
    // No group is named for Googlebot or bingbot, so they follow *.
    expect(groupFor(result.rules as Rule[], 'Googlebot')).toBeUndefined();
    expect(groupFor(result.rules as Rule[], 'bingbot')).toBeUndefined();

    const blocked = (path: string) => list(star.disallow).some((prefix) => path.startsWith(prefix));
    for (const path of ['/', '/exams', '/exams/bocconi-online-test', '/exams/digital-sat/format', '/guides', '/guides/lsat-without-logic-games', '/about/privacy', '/premium']) {
      expect(blocked(path), path).toBe(false);
    }
  });

  it('points to the production sitemap', () => {
    production();
    expect(robots().sitemap).toBe(`${SITE}/sitemap.xml`);
  });

  it('allows AI search and user-triggered crawlers and blocks training crawlers', () => {
    production();
    const rules = robots().rules as Rule[];
    for (const agent of ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'ChatGPT-User', 'Claude-User']) {
      expect(list(groupFor(rules, agent)?.disallow), agent).not.toContain('/');
    }
    for (const agent of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'MistralAI-Training']) {
      expect(list(groupFor(rules, agent)?.disallow), agent).toEqual(['/']);
    }
  });

  it('closes everything on a deployment that may not be indexed', () => {
    process.env.SEARCH_INDEXING_ENABLED = 'false';
    expect(robots().rules).toEqual([{ userAgent: '*', disallow: '/' }]);
  });
});

describe('the sitemap in production', () => {
  it('lists every public hub, format guide, guide and fixed page once, on the production domain', () => {
    production();
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    const expected = [
      '/', '/exams', '/guides', '/premium',
      '/about/editorial-standards', '/about/how-scoring-works', '/about/privacy', '/about/terms',
      ...EXAM_HUBS.flatMap((hub) => [`/exams/${hub.slug}`, `/exams/${hub.slug}/format`]),
      ...listGuides().map((guide) => `/guides/${guide.slug}`),
    ];
    expect(urls.sort()).toEqual(expected.map((path) => `${SITE}${path}`).sort());
  });

  it('never lists a private route', () => {
    production();
    for (const { url } of sitemap()) {
      const path = url.slice(SITE.length);
      expect(PRIVATE.some((prefix) => path.startsWith(prefix)), url).toBe(false);
    }
  });

  it('gives every entry a real date, never a future one', () => {
    production();
    const today = new Date();
    for (const entry of sitemap()) {
      expect(entry.lastModified, entry.url).toBeInstanceOf(Date);
      expect((entry.lastModified as Date).getTime(), entry.url).toBeLessThanOrEqual(today.getTime());
      expect(entry.changeFrequency, entry.url).toBeTruthy();
      expect(entry.priority, entry.url).toBeGreaterThan(0);
    }
  });

  it('is empty on a deployment that may not be indexed', () => {
    process.env.SEARCH_INDEXING_ENABLED = 'false';
    expect(sitemap()).toEqual([]);
  });
});

describe('Search Console verification token', () => {
  it('takes the bare token or the whole tag Search Console shows', () => {
    expect(googleSiteVerification({ GOOGLE_SITE_VERIFICATION: 'abcDEF123_-xyz789' })).toBe('abcDEF123_-xyz789');
    expect(
      googleSiteVerification({ GOOGLE_SITE_VERIFICATION: '<meta name="google-site-verification" content="abcDEF123_-xyz789" />' }),
    ).toBe('abcDEF123_-xyz789');
  });

  it('emits nothing when unset, and refuses anything that is not token-shaped', () => {
    expect(googleSiteVerification({})).toBeNull();
    expect(googleSiteVerification({ GOOGLE_SITE_VERIFICATION: '  ' })).toBeNull();
    expect(googleSiteVerification({ GOOGLE_SITE_VERIFICATION: '"><script>alert(1)</script>' })).toBeNull();
  });
});
