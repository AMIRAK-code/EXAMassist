# Bocconi: search visibility, release steps and measurement

Written 2026-10-07, with the Bocconi landing page work. Nothing here guarantees
indexing, rankings, rich results or citations by AI assistants; these are the
conditions that make them possible, and the way to see what actually happens.

## What the site now does

- **One page for Bocconi preparation:** `https://exam.assist365.app/exams/bocconi-online-test`,
  the established hub URL, now a full landing page: unique title ("Bocconi Test
  Preparation: Practice Questions and a Free Test"), description with the live
  question count, one H1, a self-referencing canonical, and all core content
  server-rendered (no login or script needed to read it).
- **Supporting pages with distinct jobs**, each linking back to it:
  - `/exams/bocconi-online-test/format`: the sourced format, timing and scoring reference.
  - `/guides/bocconi-undergraduate-vs-law-test`: choosing between the two tests.
  - `/guides/bocconi-test-preparation-plan`: a week-by-week plan, labelled as our advice.
  - `/guides/bocconi-test-negative-marking-when-to-guess`: the scoring arithmetic (corrected 2026-10-07).
- **Internal links with descriptive text** from the header ("Bocconi test"),
  the homepage exam directory ("Bocconi Online Test preparation"), the exam
  directory card ("Bocconi test preparation"), the footer and every Bocconi guide.
- **Structured data that matches the visible page:** BreadcrumbList and a plain
  WebPage on the Bocconi page; Organization (now with a logo) and WebSite on the
  homepage. No FAQPage (Google stopped showing FAQ rich results in May 2026),
  no ratings, no Product or Course markup.
- **Crawlers:** search and user-triggered AI crawlers are allowed on public
  pages; training crawlers stay blocked, plus the two training-only tokens
  documented since (`Meta-ExternalAgent`, `MistralAI-Training`). See
  `docs/research/crawler-policy-check-2026-10-07.md`.
- **No hreflang:** there is no Italian version of any page. Add hreflang only
  when a real Italian translation exists, on distinct URLs, with reciprocal tags.

## Release steps, in order (need production access)

1. **Database, once, in the Supabase SQL editor of the Examer project**
   (lhnvuikmyjvizrekqbtq): run `db/postgres/011_funnel_counts.sql`. The site
   tolerates the table being absent (it then records nothing), but
   `npm run db:seed` refuses to run until it exists.
2. **Content and configs to production:** run `npm run db:seed` with
   `DATABASE_URL` pointing at the Examer project, from a machine that can reach
   the Supabase pooler. It adds config version 2026.10 for both Bocconi tests
   and new versions of the 17 corrected questions; earlier attempts keep the
   versions they were shown.
3. **Indexing flag.** `wrangler.jsonc` now sets `SEARCH_INDEXING_ENABLED` to
   `"true"` for the Worker. Every page's robots meta, `robots.txt` and
   `sitemap.xml` read it at request time: no page is prerendered, because the
   root layout reads the session cookie (checked 2026-10-07 by building with
   the flag on and serving with it off, which gave `noindex` everywhere).
   `NEXT_PUBLIC_SITE_URL` is the exception: it is inlined at build time, so the
   build must have `https://exam.assist365.app`.
4. **Deploy** from a clean worktree, as in the README (`npm run cf:deploy`).
5. **Check production** (the first two should show the change; the others should not say noindex):

       curl -s https://exam.assist365.app/robots.txt | head -5
       curl -s https://exam.assist365.app/sitemap.xml | grep -c "<loc>"
       curl -s https://exam.assist365.app/exams/bocconi-online-test | grep -o '<meta name="robots"[^>]*>'
       curl -s https://exam.assist365.app/guides/bocconi-test-preparation-plan | grep -o '<meta name="robots"[^>]*>'

   Expected: `Allow: /` for `*`, 29 sitemap URLs, and `index, follow` on both pages.

Keep `SEARCH_INDEXING_ENABLED` unset or `false` on the Vercel backup
(`exa-massist.vercel.app`): it serves the same pages with its own host as
canonical and must stay out of the index.

## Cloudflare checks (zone owner)

- **AI crawler blocking:** in the assist365.app zone, check Security → Bots /
  AI Crawl Control. If Cloudflare is set to block "AI bots", it blocks search
  crawlers such as OAI-SearchBot, Claude-SearchBot and PerplexityBot at the
  edge, whatever `robots.txt` says. Allow those; keep training crawlers blocked
  if the managed rules allow the distinction.
- **Managed robots.txt:** the apex domain serves Cloudflare's managed
  content-signals robots.txt. After deploying, confirm that
  `exam.assist365.app/robots.txt` is still the site's own file (it was on
  2026-10-07).
- **Crawler Hints (IndexNow):** Caching → Configuration → Crawler Hints. On every
  plan; it notifies Bing and other IndexNow engines when pages change.

## Search Console (needs owner access; not set up from here)

Verification, sitemap submission, URL inspection and the list of indexed and
excluded routes are in [`GOOGLE_SEARCH_CONSOLE_SETUP.md`](GOOGLE_SEARCH_CONSOLE_SETUP.md).
Inspect `https://exam.assist365.app/exams/bocconi-online-test` among the first
URLs, and import the property into Bing Webmaster Tools afterwards: Copilot
answers come from Bing's index.

## Is Bocconi search traffic landing on the Bocconi page?

In Search Console → Performance → Search results:

- Add a **Query** filter → *Custom (regex)* → `(?i)bocconi`, then open the
  **Pages** tab. The Bocconi page should take most clicks and impressions. If
  the homepage, `/exams` or the format guide outranks it for preparation queries
  ("bocconi test prep", "bocconi practice test"), strengthen the landing page's
  answer to that query and link to it from the page that is winning, rather
  than creating a new page for the same query.
- Narrower checks: `(?i)bocconi.*(prep|practice|practise|mock|simulat|question)`
  for preparation intent; `(?i)bocconi.*law|giurisprudenza` for the Law test;
  `(?i)test (online )?bocconi|ammissione` for Italian queries, which our
  English-only pages may not serve well.
- Add a **Page** filter → *URL is exactly* the Bocconi page to see which
  queries it already wins.

In ChatGPT search, Perplexity and Copilot, ask about Bocconi test preparation
now and then and note whether the page is cited. Treat this as anecdote: answers
vary by user, place and time, and no markup or file guarantees a citation.

## Do those visitors convert?

`/admin/funnel?hub=bocconi-online-test` (admins only) shows, for 7, 28 or 90
days:

| Step | Source of the number |
| --- | --- |
| Bocconi page views, split into search engine, AI assistant, this site, another site and no referrer | `funnel_counts` (`landing_view`) |
| Plans page views carrying a Bocconi exam | `funnel_counts` (`pricing_view`) |
| Free Bocconi tests started and finished | the `attempts` table (free-test sessions) |
| Checkouts started from a Bocconi exam | `funnel_counts` (`checkout_start`) |
| Plans bought from a Bocconi exam | `funnel_counts` (`purchase`), and in Stripe as subscription metadata `exam_key` |

All of these are daily totals with no identifier, IP address, cookie or user
agent stored, so no consent banner is needed and the privacy notice says so.
Crawlers and link prefetches are not counted. Referrers are often stripped, so
"no referrer" includes some search and app traffic; search-engine counts here
are a floor, and Search Console's clicks are the better number for search.

A weekly look is enough at this volume: Search Console clicks to the Bocconi
page, then the funnel for the same week. If clicks rise and free-test starts do
not, the page is answering the query but not the next step; if free tests are
finished and few people look at the plans, the results-page offer is the place
to work.

## Known limitations

- English only. Many Bocconi applicants search in Italian ("test bocconi",
  "simulazione test bocconi"); an Italian landing page would need a real
  translation of the page and of the questions, plus reciprocal hreflang.
- The bank is small in places (see the coverage table on the page); full
  simulations start repeating questions after a few sessions.
- No question has a human expert review recorded yet. `docs/EXPERT-REVIEW.md`
  explains how to record one when it happens.
- The page is heavier than other hub pages: about 36 KB of gzipped HTML, mostly
  the rendered sample question, and several database reads per view.
