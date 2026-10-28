import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ATTEMPTS, fetchLive, retryDelay, snapshotPublicPages } from '../../scripts/snapshot-pages';

/**
 * The deploy-time snapshot of public pages (scripts/snapshot-pages.ts). On the
 * Workers Free plan a page can answer 503 (error 1102) for minutes while the
 * snapshot keeps the Worker busy, so it must wait that out rather than give up.
 */

const BUILD = 'build-new';
const html = (body: string, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html' } });

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('retrying a page', () => {
  it('backs off from 3 s to 20 s and waits several minutes in all before giving up', () => {
    expect([1, 2, 3, 6, 7, 20].map(retryDelay)).toEqual([3000, 6000, 9000, 18_000, 20_000, 20_000]);
    let total = 0;
    for (let attempt = 1; attempt < ATTEMPTS; attempt++) total += retryDelay(attempt);
    // /tr/exams needed 268 s on 2026-10-28; the old limit was about a minute.
    expect(total).toBeGreaterThan(300_000);
    expect(total).toBeLessThan(600_000);
  });

  it('waits out 503s until the page comes through', async () => {
    const answers = [html('', 503), html('', 503), html(`<p>${BUILD}</p>`)];
    const get = vi.fn(async () => answers.shift()!);
    const sleep = vi.fn(async (_ms: number) => {});
    const body = await fetchLive('https://example.test/tr/exams', BUILD, { fetch: get, sleep });
    expect(body.toString()).toContain(BUILD);
    expect(get).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls.map(([ms]) => ms)).toEqual([3000, 6000]);
  });

  it('does not take a page from the previous deployment, and names the reason when it gives up', async () => {
    const get = vi.fn(async () => html('<p>build-old</p>'));
    const sleep = vi.fn(async (_ms: number) => {});
    await expect(fetchLive('https://example.test/', BUILD, { fetch: get, sleep })).rejects.toThrow(
      `https://example.test/: served by the previous deployment, ${ATTEMPTS} attempts.`,
    );
    expect(get).toHaveBeenCalledTimes(ATTEMPTS);
    expect(sleep).toHaveBeenCalledTimes(ATTEMPTS - 1);
  });
});

describe('saving the pages', () => {
  let assetsDir = '';
  beforeEach(() => {
    assetsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapshot-'));
  });
  afterEach(() => {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  });

  const site = 'https://example.test';
  const sitemap = `<urlset><url><loc>${site}/</loc></url><url><loc>${site}/exams</loc></url></urlset>`;
  const fakeSite = () =>
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith('/sitemap.xml')) return new Response(sitemap, { headers: { 'content-type': 'application/xml' } });
      if (/\.(txt|ico|svg|png|webmanifest)$/.test(url)) return new Response('file', { headers: { 'content-type': 'text/plain' } });
      return html(`<p>${BUILD} ${url}</p>`);
    });

  it('keeps pages an earlier run saved from this build, refetches the rest, and pauses between pages', async () => {
    fs.writeFileSync(path.join(assetsDir, 'it.html'), `<p>${BUILD} kept</p>`);
    fs.writeFileSync(path.join(assetsDir, 'tr.html'), '<p>build-old stale</p>');
    const get = fakeSite();
    const sleep = vi.fn(async (_ms: number) => {});

    const paths = await snapshotPublicPages({ site, assetsDir, buildId: BUILD }, { fetch: get, sleep });

    const fetched = get.mock.calls.map(([input]) => String(input));
    expect(fetched).not.toContain(`${site}/it`);
    expect(fetched).toContain(`${site}/tr`);
    expect(fs.readFileSync(path.join(assetsDir, 'it.html'), 'utf8')).toContain('kept');
    expect(fs.readFileSync(path.join(assetsDir, 'tr.html'), 'utf8')).toContain(BUILD);
    expect(fs.readFileSync(path.join(assetsDir, 'pl', 'exams.html'), 'utf8')).toContain(`${site}/pl/exams`);
    // One pause after each page fetched except the last; no retries were needed.
    expect(sleep).toHaveBeenCalledTimes(paths.length - 2);
    expect(sleep.mock.calls.every(([ms]) => ms === 1500)).toBe(true);
  });
});
