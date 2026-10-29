// Crawls a deployed site from its sitemap, follows internal links, and reports
// what search engines would see: status codes, redirects, canonicals, robots
// directives, hreflang reciprocity, titles, descriptions, H1s, structured data
// types and references to hosts that should not appear in production.
//
//   node scripts/seo-crawl.mjs https://uniexamer.com [out.json] [maxPages]
//
// Read-only and paced (four requests at a time). Run it against production
// after a release and compare with the previous run; docs/seo/MEASUREMENT-PLAN.md
// says when.
import { writeFileSync } from 'node:fs';

const origin = (process.argv[2] ?? 'https://uniexamer.com').replace(/\/$/, '');
const out = process.argv[3];
const maxPages = Number(process.argv[4] ?? 600);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => { const m = new RegExp(`${name}="([^"]*)"`, 'i').exec(tag); return m ? decode(m[1]) : null; };
const normal = (url) => url.replace(/\/$/, '') || url;

async function get(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (compatible; UniExamerAudit/1.0)' } });
      if (res.status === 503) { await new Promise((r) => setTimeout(r, 3000)); continue; }
      const html = res.status === 200 && (res.headers.get('content-type') ?? '').includes('html');
      return { status: res.status, location: res.headers.get('location'), xrobots: res.headers.get('x-robots-tag'), body: html ? await res.text() : '' };
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return { status: 0, body: '' };
}

const sitemapXml = await (await fetch(`${origin}/sitemap.xml`)).text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
const queue = [...sitemapUrls];
const seen = new Set(queue.map(normal));
const inlinks = {};
const pages = {};

async function visit(url) {
  const r = await get(url);
  const page = { status: r.status, location: r.location, xrobots: r.xrobots, inSitemap: sitemapUrls.map(normal).includes(normal(url)) };
  if (r.body) {
    const html = r.body;
    const head = html.slice(0, html.indexOf('</head>') + 7);
    page.htmlLang = /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1] ?? null;
    page.title = decode(/<title>([^<]*)<\/title>/.exec(head)?.[1] ?? '');
    page.description = attr(/<meta name="description"[^>]*>/.exec(head)?.[0] ?? '', 'content');
    page.robots = attr(/<meta name="robots"[^>]*>/.exec(head)?.[0] ?? '', 'content');
    page.canonical = attr(/<link rel="canonical"[^>]*>/.exec(head)?.[0] ?? '', 'href');
    page.hreflang = [...head.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => [m[1], decode(m[2])]);
    page.h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, '').trim()));
    page.jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
      try { const d = JSON.parse(m[1]); return (Array.isArray(d) ? d : [d]).map((x) => x['@type']); } catch { return ['INVALID']; }
    });
    page.foreignHost = (html.match(/[^"'\s]*(localhost:\d+|127\.0\.0\.1|vercel\.app|workers\.dev|assist365\.app)[^"'\s]*/) ?? [null])[0];
    for (const m of html.matchAll(/<a [^>]*href="([^"#?]*)[^"]*"/g)) {
      let href = decode(m[1]);
      if (href.startsWith('/')) href = origin + href;
      if (!href.startsWith(origin)) continue;
      href = normal(href);
      (inlinks[href] ??= new Set()).add(url);
      if (!seen.has(href) && seen.size < maxPages) { seen.add(href); queue.push(href); }
    }
  }
  pages[normal(url)] = page;
}

await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await visit(queue.shift()); }));
for (const [url, from] of Object.entries(inlinks)) if (pages[url]) pages[url].inlinks = from.size;
if (out) writeFileSync(out, JSON.stringify({ origin, sitemapUrls, pages }, null, 1));

// --- Report ----------------------------------------------------------------
const issues = {};
const add = (kind, text) => (issues[kind] ??= []).push(text);
const path = (url) => url.replace(origin, '') || '/';
const byStatus = {};
for (const [url, p] of Object.entries(pages)) (byStatus[p.status] ??= []).push(path(url) + (p.location ? ` -> ${p.location}` : ''));
const titles = {};
const descriptions = {};
for (const [url, p] of Object.entries(pages)) {
  if (p.status !== 200 || p.title === undefined) continue;
  const at = path(url);
  const noindex = /noindex/.test(`${p.robots ?? ''} ${p.xrobots ?? ''}`);
  if (p.inSitemap && noindex) add('sitemap page is noindex', at);
  if (!p.canonical) add('no canonical', at);
  else if (normal(p.canonical) !== normal(url)) {
    add('canonical points elsewhere', `${at} -> ${path(p.canonical)}`);
    if (p.inSitemap) add('sitemap lists a non-canonical page', at);
  }
  if (p.h1.length !== 1) add(`${p.h1.length} h1 elements`, at);
  if (!p.description) add('no meta description', at);
  else if (p.description.length > 160) add('description over 160 characters', `${at} (${p.description.length})`);
  if (p.title.length > 70) add('title over 70 characters', `${at} (${p.title.length})`);
  if (p.foreignHost) add('reference to a non-production host', `${at}: ${p.foreignHost}`);
  if (p.jsonLd.includes('INVALID')) add('invalid JSON-LD', at);
  if (!noindex && !p.inSitemap && normal(p.canonical ?? '') === normal(url)) add('indexable page missing from sitemap', at);
  if (!p.inlinks && at !== '/') add('no internal links point here', at);
  if (!noindex && normal(p.canonical ?? '') === normal(url)) {
    (titles[p.title] ??= []).push(at);
    if (p.description) (descriptions[p.description] ??= []).push(at);
  }
  for (const [lang, href] of p.hreflang) {
    const target = pages[normal(href)];
    if (!target) add('hreflang target not crawled', `${at} ${lang} ${href}`);
    else if (target.status !== 200) add('hreflang target not 200', `${at} ${lang} ${href} (${target.status})`);
    else if (!target.hreflang.some(([, h]) => normal(h) === normal(url))) add('hreflang not reciprocal', `${at} -> ${lang}`);
  }
}
for (const [title, at] of Object.entries(titles)) if (at.length > 1) add('duplicate title among canonical pages', `${at.length}x "${title}"`);
for (const at of Object.values(descriptions)) if (at.length > 1) add('duplicate description among canonical pages', at.join(', '));
for (const url of sitemapUrls) if (pages[normal(url)]?.status !== 200) add('sitemap URL not 200', `${path(url)} (${pages[normal(url)]?.status})`);

console.log(`${origin}: ${sitemapUrls.length} sitemap URLs, ${Object.keys(pages).length} URLs crawled`);
console.log('status codes:', Object.fromEntries(Object.entries(byStatus).map(([s, l]) => [s, l.length])));
for (const [status, list] of Object.entries(byStatus)) if (status !== '200') console.log(`  ${status}: ${list.slice(0, 12).join(' | ')}`);
for (const [kind, list] of Object.entries(issues)) {
  console.log(`\n${kind} (${list.length})`);
  for (const line of list.slice(0, 15)) console.log(`  ${line}`);
}
