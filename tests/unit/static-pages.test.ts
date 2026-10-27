import { describe, expect, it } from 'vitest';
import { ACCOUNT_HINT_KEY, readAccountHint, rememberAccount } from '@/lib/auth/account-hint';
import { DYNAMIC_PUBLIC_PATHS, STATIC_EXTRA_PATHS, assetFileFor, isSnapshotRequest, staticPagePaths } from '@/lib/seo/static-pages';

/**
 * Public pages served as static files on the Workers Free plan: which paths
 * are saved, where each file goes, and the browser's memory of a session that
 * lets those pages show a learner their own menu.
 */

describe('the pages saved as files', () => {
  const sitemap = [
    'https://uniexamer.com/',
    'https://uniexamer.com/exams',
    'https://uniexamer.com/premium',
    'https://uniexamer.com/exams/gmat',
    'https://uniexamer.com/exams/gmat/format',
    'https://uniexamer.com/guides/lsat-without-logic-games',
  ];

  it('takes every sitemap page except the dynamic ones, plus the files crawlers fetch', () => {
    const paths = staticPagePaths(sitemap);
    expect(paths).toContain('/');
    expect(paths).toContain('/exams/gmat/format');
    for (const dynamic of DYNAMIC_PUBLIC_PATHS) expect(paths).not.toContain(dynamic);
    for (const extra of STATIC_EXTRA_PATHS) expect(paths).toContain(extra);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('names each file the way Cloudflare looks for it', () => {
    expect(assetFileFor('/')).toBe('index.html');
    expect(assetFileFor('/exams')).toBe('exams.html');
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
