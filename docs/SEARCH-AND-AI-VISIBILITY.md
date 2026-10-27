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

Cloudflare, uniexamer.com zone (Moein's account):

1. **SSL/TLS → Edge Certificates → Always Use HTTPS: on.** Until then
   `http://uniexamer.com` serves pages over plain HTTP, where sign-in cannot set
   its secure cookie.
2. **Security → Bots, and AI Crawl Control:** new zones block AI crawlers by
   default. Make sure nothing blocks them, or robots.txt's permissions never
   reach them. This could not be checked from here: the API token has no
   access to zone settings, and a request that only borrows a crawler's name
   is not what Cloudflare matches on.
3. **Managed robots.txt: off.** `https://uniexamer.com/robots.txt` was the
   site's own file on 2026-10-27; check again after changing bot settings.
4. Optional: **Caching → Configuration → Crawler Hints** sends IndexNow pings
   on its own.

Google Search Console ([`GOOGLE_SEARCH_CONSOLE_SETUP.md`](GOOGLE_SEARCH_CONSOLE_SETUP.md)):

5. Add a Domain property for uniexamer.com (TXT record `@` in the zone) and
   submit `sitemap.xml`.
6. If exam.assist365.app was ever verified: Change of address from it to
   uniexamer.com. Keep the old property and the redirects for at least 180 days.

Bing Webmaster Tools:

7. Import the site from Search Console, submit the sitemap, and if
   exam.assist365.app was registered there, use Bing's site move tool for it.
   Copilot answers come from Bing's index.

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
