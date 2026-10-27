import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GET as llmsTxtRoute } from '@/app/llms.txt/route';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { organizationSchema, webSiteSchema } from '@/components/seo/json-ld';
import { listGuides } from '@/lib/content/guides';
import { EXAM_HUBS } from '@/lib/exams/registry';
import { googleSiteVerification } from '@/lib/site';
import { LOCALES, localizePath, splitLocale } from '@/i18n/locales';
import { pageAlternates } from '@/i18n/alternates';

/**
 * What search engines are told in production: robots.txt, the sitemap and the
 * Search Console token. Both files read the environment when they are
 * requested, so the tests set it the way the Worker does.
 */

const SITE = 'https://uniexamer.com';
const PRIVATE = ['/api/', '/attempt/', '/dashboard', '/account', '/study-plan', '/admin', '/practice/', '/start/', '/free-test/', '/checkout'];
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
    for (const path of ['/', '/exams', '/exams/bocconi-online-test', '/exams/digital-sat/format', '/guides', '/guides/lsat-without-logic-games', '/about/privacy', '/pricing']) {
      expect(blocked(path), path).toBe(false);
    }
  });

  it('points to the production sitemap', () => {
    production();
    expect(robots().sitemap).toBe(`${SITE}/sitemap.xml`);
  });

  it('names AI search, user-triggered and training crawlers, and gives each the public pages but not the private ones', () => {
    production();
    const rules = robots().rules as Rule[];
    const agents = [
      'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'ChatGPT-User', 'Claude-User',
      'GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'MistralAI-Training',
    ];
    const star = groupFor(rules, '*')!;
    for (const agent of agents) {
      const group = groupFor(rules, agent);
      expect(group, agent).toBeDefined();
      expect(list(group!.allow), agent).toEqual(['/']);
      expect(list(group!.disallow), agent).toEqual(list(star.disallow));
    }
  });

  it('closes everything on a deployment that may not be indexed', () => {
    process.env.SEARCH_INDEXING_ENABLED = 'false';
    expect(robots().rules).toEqual([{ userAgent: '*', disallow: '/' }]);
  });
});

describe('the sitemap in production', () => {
  it('lists every public hub, format guide, guide and fixed page once per language, on the production domain', () => {
    production();
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    const expected = [
      '/', '/exams', '/guides', '/pricing',
      '/about/editorial-standards', '/about/how-scoring-works', '/about/privacy', '/about/terms',
      ...EXAM_HUBS.flatMap((hub) => [`/exams/${hub.slug}`, `/exams/${hub.slug}/format`]),
      ...listGuides().map((guide) => `/guides/${guide.slug}`),
    ].flatMap((path) => LOCALES.map((locale) => localizePath(path, locale)));
    expect(urls.sort()).toEqual(expected.map((path) => `${SITE}${path}`).sort());
  });

  it('names every language version, itself included, and English as x-default, on each entry', () => {
    production();
    for (const entry of sitemap()) {
      const languages = entry.alternates?.languages as Record<string, string>;
      expect(Object.keys(languages).sort(), entry.url).toEqual([...LOCALES, 'x-default'].sort());
      expect(Object.values(languages), entry.url).toContain(entry.url);
      expect(languages['x-default'], entry.url).toBe(languages.en);
    }
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

describe('canonical and hreflang on the pages', () => {
  it('makes each language version its own canonical, and lists them all with English as x-default', async () => {
    production();
    const italian = await pageAlternates(Promise.resolve({ locale: 'it' }), '/exams/gmat');
    expect(italian).toEqual({
      canonical: `${SITE}/it/exams/gmat`,
      languages: {
        en: `${SITE}/exams/gmat`,
        it: `${SITE}/it/exams/gmat`,
        tr: `${SITE}/tr/exams/gmat`,
        es: `${SITE}/es/exams/gmat`,
        pl: `${SITE}/pl/exams/gmat`,
        'x-default': `${SITE}/exams/gmat`,
      },
    });
    expect((await pageAlternates(Promise.resolve({ locale: 'en' }), '/')).canonical).toBe(`${SITE}/`);
    expect((await pageAlternates(Promise.resolve({ locale: 'pl' }), '/')).canonical).toBe(`${SITE}/pl`);
    // An unknown locale never reaches a page (the layout answers 404), but it would fall back to English.
    expect((await pageAlternates(Promise.resolve({ locale: 'xx' }), '/guides')).canonical).toBe(`${SITE}/guides`);
  });

  it('is what every page that sets its own canonical uses', () => {
    // A page's `alternates` replaces the layout's, so a fixed English canonical
    // here would make every translation point at the English page again.
    const pages = fs
      .readdirSync(path.join('src', 'app', '[locale]'), { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('page.tsx'))
      .map((file) => path.join('src', 'app', '[locale]', file));
    const withAlternates = pages.filter((file) => /\balternates\b/.test(fs.readFileSync(file, 'utf8')));
    expect(withAlternates.length).toBeGreaterThanOrEqual(11);
    for (const file of withAlternates) {
      const source = fs.readFileSync(file, 'utf8');
      expect(source, file).toContain('pageAlternates(params');
      expect(source, file).not.toMatch(/canonical:\s*absoluteUrl/);
    }
  });
});

describe('llms.txt in production', () => {
  it('links only pages from the sitemap, and every page in it below the listings', async () => {
    production();
    const response = llmsTxtRoute();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
    const text = await response.text();
    const linked = [...text.matchAll(/\]\((https?:[^)]+)\)/g)].map((match) => match[1]);
    // llms.txt maps the English pages; the sitemap also lists every translation.
    const listed = sitemap()
      .map((entry) => entry.url)
      .filter((url) => splitLocale(new URL(url).pathname).locale === 'en');
    for (const url of linked) expect(listed, url).toContain(url);
    const listings = ['/', '/exams', '/guides'].map((p) => `${SITE}${p}`);
    for (const url of listed.filter((u) => !listings.includes(u))) expect(linked, url).toContain(url);
  });

  it('names the site and its other names, and says it is independent', async () => {
    production();
    const text = await llmsTxtRoute().text();
    expect(text.startsWith('# UniExamer\n')).toBe(true);
    expect(text).toContain('Also known as Examer and uniexamer.com.');
    expect(text).toContain('not affiliated with');
  });

  it('is not served on a deployment that may not be indexed', () => {
    process.env.SEARCH_INDEXING_ENABLED = 'false';
    expect(llmsTxtRoute().status).toBe(404);
  });
});

describe('site name in structured data', () => {
  it('offers the former name, Examer, and the domain as alternate names', () => {
    expect(webSiteSchema(SITE, 'UniExamer', ['Examer', 'uniexamer.com']).alternateName).toEqual(['Examer', 'uniexamer.com']);
    expect(organizationSchema(SITE, 'UniExamer', 'd', ['Examer']).alternateName).toEqual(['Examer']);
    expect(organizationSchema(SITE, 'UniExamer', 'd').logo).toBe(`${SITE}/brand/uniexamer-symbol.png`);
    expect(webSiteSchema(SITE, 'UniExamer')).not.toHaveProperty('alternateName');
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
