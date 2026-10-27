# Search and AI visibility (SEO and GEO) for uniexamer.com

Written 2026-10-27, after the move from exam.assist365.app. What the site does
for search engines and AI assistants, what to run after a deploy, and what can
only be done in the owners' accounts. Nothing here guarantees indexing,
rankings, rich results or citations in AI answers.

## What the code does

| Area | Where | What it does |
| --- | --- | --- |
| Address | `wrangler.jsonc`, `next.config.ts` | uniexamer.com is the only address that serves pages. exam.assist365.app and www.uniexamer.com answer 301 to the same path and query. |
| Indexing switch | `SEARCH_INDEXING_ENABLED` | Only production says `index, follow`; previews get `noindex`, a closed robots.txt, an empty sitemap and no llms.txt. |
| robots.txt | `src/app/robots.ts` | `*` and three named AI groups (search, user-triggered, training) may read public pages; practice, attempts, accounts, admin and the API are disallowed for all. Training crawlers were allowed on 2026-10-27 at the owner's request, so models learn the exams and the brand, and Google-Extended lets Gemini ground answers in the pages. |
| Sitemap | `src/app/sitemap.ts` | Every public page once, with the date its content last changed. |
| Canonicals | each page's metadata | Absolute and self-referencing, on uniexamer.com. |
| Structured data | `src/components/seo/json-ld.tsx` | Organization and WebSite on the home page, with `alternateName` UniExamer and uniexamer.com, so Google can name the site and searches for either find it. BreadcrumbList, Article and WebPage elsewhere. Only what the page visibly says. |
| Share images | `public/og/*.png`, `src/lib/seo/share-cards.ts` | A 1200 × 630 card for the site, each exam and each guide, with the logo, the title and "Independent · not affiliated with …". Format guides use their exam's card; listings and about pages use the site card. |
| Apple touch icon | `src/app/apple-icon.png` | The brand symbol, 180 × 180. |
| llms.txt | `src/app/llms.txt/route.ts` | A Markdown map of the public pages, built from the same data as the sitemap. Google says it uses no such file and that one neither helps nor harms; some other AI tools read it. |
| IndexNow | `src/lib/seo/indexnow.ts`, `public/<key>.txt` | Tells Bing (and so Copilot), Yandex, Seznam, Naver and the other participants about new and changed pages. |

The pages were already written for answer engines before this: each exam page
opens with a direct summary, a facts table and the date the facts were checked
against the test maker, and each guide opens with its answer and lists its
sources.

## After a deploy

- **Pages added or changed:** `npm run seo:indexnow` (or `-- --dry-run` to see
  the list first). It reads the live sitemap and refuses to submit if the key
  file is not live yet.
- **A guide or exam added, or a title changed:** `npm run seo:og-images`, then
  commit `public/og/`. `tests/unit/seo-assets.test.ts` fails while a card is
  missing. A changed image keeps its file name, and X, LinkedIn and WhatsApp
  cache previews for days, so an old preview can linger.

## In the owners' accounts (not possible from the code)

Done on 2026-10-27 in the owners' browser sessions, unless marked otherwise.

Cloudflare, uniexamer.com zone (Moein's account):

1. **SSL/TLS → Edge Certificates → Always Use HTTPS: on.** `http://` now
   answers 301 to the same `https://` address. Before, it served pages over
   plain HTTP, where sign-in cannot set its secure cookie.
2. **Security → Settings → Bot traffic:** Bot Fight Mode and AI Labyrinth are
   off. **AI Crawl Control → Security** blocks no crawler. In the previous
   7 days it had let through Googlebot (102 requests), BingBot, GPTBot,
   OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User,
   PerplexityBot, Applebot, Amazonbot, CCBot and DuckAssistBot.
3. **Bot Preference Sync (managed robots.txt): off**, so robots.txt is the
   site's own file. Check again after changing bot settings.
4. **Crawler Hints: left off.** Turning it on means accepting Cloudflare's
   supplemental terms, and it works from cache changes, which these uncached
   pages never produce. `npm run seo:indexnow` does the same job.
5. **Workers plan: still Free** at the end of the day. See the 1102 section
   below: the failures come and go, and Workers Paid is the fix.

Google Search Console, signed in as farazhaghgoo1@gmail.com
([`GOOGLE_SEARCH_CONSOLE_SETUP.md`](GOOGLE_SEARCH_CONSOLE_SETUP.md)):

6. **Domain property `uniexamer.com`, verified** by the TXT record `@`
   `google-site-verification=VDiCIeo-…` in the zone. Removing that record
   unverifies the property.
7. **`https://uniexamer.com/sitemap.xml` submitted:** Success, 29 pages
   discovered.
8. **Indexing requested** for 11 pages: `/`, `/exams`,
   `/exams/bocconi-online-test` and its `/format`, the three Bocconi guides,
   and `/exams/` digital-sat, cisia-tolc, politecnico-di-torino-til and lsat.
   The daily quota then ran out. Still to request, one day at a time:
   `/exams/gmat`, `/exams/gre`, `/exams/enhanced-act`, `/guides`, and the two
   remaining guides. The sitemap covers them anyway.
9. No change of address was needed: exam.assist365.app was never a property
   in this account.

Bing Webmaster Tools, same Google sign-in:

10. **`https://uniexamer.com/` imported from Search Console** (Bing reads it
    with the read-only `webmasters.readonly` scope), the sitemap submitted,
    and all 29 public URLs sent through URL Submission (quota 100 a day).
    exam.assist365.app was never registered there, so no site move is needed.
    Copilot answers come from Bing's index.

Still open:

11. **Workers Paid** (Workers & Pages → Workers plans → Paid, $5 a month).
12. **Deploy** the commits since 06f7397 (share images, llms.txt, the IndexNow
    key file, robots.txt opening the training crawlers, HSTS), then run
    `npm run seo:indexnow`.

## Known gap: pages fail under the Free Workers CPU limit

Measured on 2026-10-27: fetching the 29 sitemap pages one after another, 9 to
15 answered **503 with Cloudflare error 1102** ("Worker exceeded resource
limits"), and the same page alternated between 200 and 1102 when fetched six
times in a row. The Worker is on the Free plan, which allows 10 ms of CPU per
request, and rendering a page can take longer. The failures came from
back-to-back requests, which is how Googlebot and bingbot crawl.

About an hour later, still on the Free plan, two repeat crawls of all 29
pages and eight back-to-back fetches of `/exams/gmat` all answered 200. So
the failures are intermittent. Cloudflare applies the 10 ms with some leeway,
and a render's CPU time varies (a freshly started isolate costs more), so
whether a page goes over changes from one moment to the next. The cause has
not gone away.

A crawler that keeps getting 503s lowers its crawl rate, and a page that
keeps failing is eventually dropped. The two fixes are:

1. **Workers Paid** ($5 a month in the account that holds the Worker): the CPU
   limit becomes 30 s per request. This is the immediate fix, and sign-in's
   scrypt needs it anyway.
2. Serving public pages from a cache (next section), so most requests do not
   render at all.

Check after either fix (expect only 200s):

```bash
for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w "%{http_code} " https://uniexamer.com/exams/gmat; done
```

## Known gap: speed

Measured on 2026-10-27 from Italy, time to first byte on uniexamer.com varied
from 0.2 s to 4.6 s for the same page (home 0.3–4.4 s, Bocconi page 0.6–3.7 s).
Every public page is rendered per request, because the root layout reads the
session, and is sent as `private, no-store`, so nothing is cached at the edge.
A cold Worker on a site with little traffic then pays the start-up and
database cost again. Slow first bytes cost Core Web Vitals and can make AI
fetchers give up. The fix is to serve public pages from a cache and leave only
the signed-in parts dynamic, best done after the move to Next.js 16.

## Measuring

- Search Console → Performance: queries, pages, clicks, by country.
- `/admin/funnel`: daily page views by coarse source, including `ai` (ChatGPT,
  Perplexity, Gemini, Copilot and similar referrers) and `search`.
- Assistants rarely pass a referrer, so AI visibility is undercounted there;
  asking the assistants directly ("best Bocconi test practice", "Bocconi
  online test negative marking") is the only first-hand check.
