import { describe, expect, it } from 'vitest';
import { ACCOUNT_HINT_KEY, readAccountHint, rememberAccount } from '@/lib/auth/account-hint';
import { DYNAMIC_PUBLIC_PATHS, STATIC_EXTRA_PATHS, assetFileFor, isSnapshotRequest, localeScript, staticPagePaths } from '@/lib/seo/static-pages';
import { LOCALES } from '@/i18n/locales';

/**
 * Public pages served as static files on the Workers Free plan: which paths
 * are saved, where each file goes, and the browser's memory of a session that
 * lets those pages show a learner their own menu.
 */

describe('the pages saved as files', () => {
  const sitemap = [
    'https://uniexamer.com/',
    'https://uniexamer.com/exams',
    'https://uniexamer.com/pricing',
    'https://uniexamer.com/exams/gmat',
    'https://uniexamer.com/exams/gmat/format',
    'https://uniexamer.com/guides/lsat-without-logic-games',
  ];

  it('takes every sitemap page in every language except the dynamic ones, plus the files crawlers fetch', () => {
    const paths = staticPagePaths(sitemap);
    expect(paths).toContain('/');
    expect(paths).toContain('/it');
    expect(paths).toContain('/exams/gmat/format');
    expect(paths).toContain('/pl/exams/gmat/format');
    expect(paths.filter((p) => p.endsWith('/exams/gmat') || p === '/exams/gmat')).toHaveLength(LOCALES.length);
    for (const dynamic of DYNAMIC_PUBLIC_PATHS) {
      expect(paths).not.toContain(dynamic);
      expect(paths).not.toContain(`/it${dynamic}`);
    }
    for (const extra of STATIC_EXTRA_PATHS) expect(paths).toContain(extra);
    expect(new Set(paths).size).toBe(paths.length);
    // A sitemap that already lists a translated address adds nothing new.
    expect(staticPagePaths([...sitemap, 'https://uniexamer.com/it/exams/gmat'])).toEqual(paths);
  });

  it('names each file the way Cloudflare looks for it', () => {
    expect(assetFileFor('/')).toBe('index.html');
    expect(assetFileFor('/it')).toBe('it.html');
    expect(assetFileFor('/exams')).toBe('exams.html');
    expect(assetFileFor('/tr/exams/gmat')).toBe('tr/exams/gmat.html');
    expect(assetFileFor('/exams/gmat/format')).toBe('exams/gmat/format.html');
    expect(assetFileFor('/robots.txt')).toBe('robots.txt');
    expect(assetFileFor('/sitemap.xml')).toBe('sitemap.xml');
    expect(assetFileFor('/apple-icon.png')).toBe('apple-icon.png');
  });

  it('refuses anything that could write outside the assets directory', () => {
    expect(() => assetFileFor('/../wrangler.jsonc')).toThrow();
    expect(() => assetFileFor('exams')).toThrow();
    expect(() => assetFileFor('/exams?x=1')).toThrow();
  });

  it('recognises the snapshot request by its header alone', () => {
    expect(isSnapshotRequest(new Headers({ 'x-examer-snapshot': '1' }))).toBe(true);
    expect(isSnapshotRequest(new Headers({ 'x-examer-snapshot': 'yes' }))).toBe(false);
    expect(isSnapshotRequest(new Headers())).toBe(false);
  });
});

describe('the language choice on a page saved as a file', () => {
  /** Runs the inline script against a stand-in browser; returns where it went and the cookie. */
  function visit(pageLocale: (typeof LOCALES)[number], options: { pathname: string; cookie?: string; languages: string[] }) {
    const location = {
      pathname: options.pathname,
      search: '?exam=gmat',
      hash: '',
      movedTo: null as string | null,
      replace(url: string) {
        this.movedTo = url;
      },
    };
    const document = { cookie: options.cookie ?? '' };
    new Function('document', 'location', 'navigator', localeScript(pageLocale, 'NEXT_LOCALE'))(document, location, {
      languages: options.languages,
    });
    return { movedTo: location.movedTo, cookie: document.cookie };
  }

  it('leaves English readers and crawlers on the English page, cookie untouched', () => {
    expect(visit('en', { pathname: '/exams', languages: ['en-US', 'en'] })).toEqual({ movedTo: null, cookie: '' });
    expect(visit('en', { pathname: '/exams', cookie: 'NEXT_LOCALE=en', languages: ['it-IT'] }).movedTo).toBeNull();
  });

  it('moves a bare address to the browser’s language, as the proxy would', () => {
    expect(visit('en', { pathname: '/exams', languages: ['it-IT', 'en'] }).movedTo).toBe('/it/exams?exam=gmat');
    expect(visit('en', { pathname: '/', languages: ['tr'] }).movedTo).toBe('/tr?exam=gmat');
  });

  it('prefers the remembered choice to the browser’s languages', () => {
    expect(visit('en', { pathname: '/guides', cookie: 'a=1; NEXT_LOCALE=pl', languages: ['en-GB'] }).movedTo).toBe('/pl/guides?exam=gmat');
    expect(visit('en', { pathname: '/guides', cookie: 'NEXT_LOCALE=xx', languages: ['es-ES'] }).movedTo).toBe('/es/guides?exam=gmat');
  });

  it('remembers a translated page’s language, unless the browser already asks for it', () => {
    expect(visit('it', { pathname: '/it/exams', languages: ['en-US'] }).cookie).toBe('NEXT_LOCALE=it; path=/; max-age=31536000; samesite=lax');
    expect(visit('it', { pathname: '/it/exams', languages: ['it-IT'] })).toEqual({ movedTo: null, cookie: '' });
    expect(visit('it', { pathname: '/it/exams', cookie: 'NEXT_LOCALE=it', languages: ['en'] }).cookie).toBe('NEXT_LOCALE=it');
    expect(visit('es', { pathname: '/es', cookie: 'NEXT_LOCALE=it', languages: ['it'] })).toMatchObject({ movedTo: null, cookie: expect.stringContaining('NEXT_LOCALE=es') });
  });
});

describe('the remembered session', () => {
  function memoryStorage() {
    const values = new Map<string, string>();
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => void values.set(key, value),
      removeItem: (key: string) => void values.delete(key),
    };
  }

  it('remembers guests and accounts, and forgets on visitor', () => {
    const storage = memoryStorage();
    expect(readAccountHint(storage)).toBeNull();
    rememberAccount(storage, 'guest');
    expect(readAccountHint(storage)).toBe('guest');
    rememberAccount(storage, 'registered');
    expect(readAccountHint(storage)).toBe('registered');
    rememberAccount(storage, 'visitor');
    expect(readAccountHint(storage)).toBeNull();
  });

  it('ignores values it did not write, and storage that throws', () => {
    const storage = memoryStorage();
    storage.setItem(ACCOUNT_HINT_KEY, 'admin');
    expect(readAccountHint(storage)).toBeNull();
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readAccountHint(blocked)).toBeNull();
    expect(() => rememberAccount(blocked, 'guest')).not.toThrow();
    expect(readAccountHint(undefined)).toBeNull();
  });
});
