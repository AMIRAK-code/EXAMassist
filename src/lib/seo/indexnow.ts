/**
 * IndexNow: tells Bing (and through its index, Copilot), Yandex, Seznam, Naver
 * and the other participating engines that pages were added or changed,
 * instead of waiting for a recrawl. Bing's webmaster guidelines recommend it.
 * Submitting never guarantees crawling or indexing.
 *
 * The key is public by design: an engine fetches /<key>.txt (public/) and
 * checks it matches before accepting a submission for the host.
 */
export const INDEXNOW_KEY = '811d1a89b07625ad45692a67dc7fde59';

/** The shared endpoint; participating engines pass submissions to each other. */
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * The submission for one site. URLs on any other host are left out: IndexNow
 * rejects a batch that mixes hosts, and the old address only redirects.
 */
export function indexNowPayload(siteUrl: string, urls: readonly string[]): IndexNowPayload {
  const origin = new URL(siteUrl).origin;
  const host = new URL(siteUrl).host;
  return {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
    urlList: [...new Set(urls.filter((url) => new URL(url).host === host))],
  };
}

/** The <loc> entries of a sitemap. */
export function sitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
}
