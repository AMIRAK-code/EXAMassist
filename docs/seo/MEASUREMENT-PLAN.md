# Measuring discovery and useful outcomes

Written 29 October 2026. The site promises one cookie (the session) and no third-party analytics (privacy notice), so measurement uses two sources only: the search consoles, and first-party daily totals that identify nobody. Do not add a tracking script, pixel or tag manager to answer any of the questions below.

## What is measured, and where

| Question | Source | Notes |
| --- | --- | --- |
| Which queries and pages get impressions and clicks, by country, device and search appearance | Google Search Console → Performance; Bing Webmaster Tools → Search Performance | Branded vs non-branded: filter queries with the regex `uni ?examer\|examer` (Google: "Custom (regex)"; Bing: export and filter). Language: filter pages by `/it/`, `/tr/`, `/es/`, `/pl/` prefixes; English has no prefix. |
| Which URLs are indexed, and which canonical Google chose | Search Console → Pages and URL Inspection | Expect the localized copies of English-only pages (every guide, every format guide, every hub except Bocconi) to show "Alternate page with proper canonical tag". That is intended. |
| Exam-page views by coarse source (search, AI assistant, this site, other site, none) | `funnel_counts`, event `landing_view` | /admin/funnel. Static pages report their own view from the browser. |
| Guide views, and clicks from a guide to an exam page or into practice | `funnel_counts`, events `guide_view` and `guide_click` (since 2026-10-29) | Subject is the guide slug; /admin/funnel shows them per exam. |
| Clicks from an exam page into practice, onboarding or the free test, by the coarse source of the exam-page visit | `funnel_counts`, event `practice_click` (added 2026-11-02, live once deployed) | Subject is the hub slug; /admin/funnel shows the total and the search-engine share against search-engine views. This is the closest the site gets to "organic visitors who went on to practise" without tracking anyone. |
| Free tests started and finished | `attempts` (free-test sessions) | Read from the sessions themselves, so never double-counted. |
| Plans page views, checkouts started, purchases from an exam | `funnel_counts` (`pricing_view`, `checkout_start`, `purchase`) | Only meaningful once payments are switched on. |
| Accounts created | `users.created_at` where `is_guest = 0` | Not attributable to a page or a search; read it as a site-wide trend only. |

Organic search versus other channels: `landing_view`, `guide_view` and `practice_click` carry a coarse source, so "search" is the organic share for those steps. Nothing after the click (onboarding, sign-up, free test, purchase) knows the source of the visit, by design. Conversion from organic search can therefore only be inferred from trends, never attributed per visit; say so whenever reporting it.

Practice starts from guides: `guide_click` counts the click, not the session that may follow. Report it as "clicks into practice", not "practice starts".

## The 28-day report (added 2 November 2026)

One report every 28 days, always the same windows and the same filters, so each number can be compared with the last. Day 0 is the day this branch is deployed; the first report covers days 1–28 against the 28 days before day 1. Search Console data lags 2–3 days, so run each report on day 31, 59, 87… for the window ending three days earlier. Keep each report as a dated file next to this one (`docs/seo/report-28d-YYYY-MM-DD.md`) and never edit an old one.

**A. Search Console (owner, signed in to Google).** Property `sc-domain:uniexamer.com` (or the URL-prefix property in use). Performance → Search results, date range "Compare → custom": the 28 days ending on the report date vs the 28 days before.

1. **Branded**: Query filter → Custom (regex) → `uni ?examer|examer`. Record clicks, impressions, CTR, average position.
2. **Non-branded**: Query filter → Custom (regex) → *Doesn't match regex* → `uni ?examer|examer`. Record the same four. Never add (1) and (2) to compare with the total: Google omits anonymised queries from query-filtered views, so (1) + (2) is less than the total; record the total separately.
3. **Priority pages** (nine), each with Page filter "URL is exactly": `/exams/cisia-tolc`, `/it/exams/cisia-tolc`, `/exams/politecnico-di-torino-til`, `/exams/bocconi-online-test`, `/guides/bocconi-test-preparation-plan`, `/guides/bocconi-admission-test-sample-questions`, `/exams/bocconi-master`, `/guides/imat-sample-questions`, `/`. For each: clicks, impressions, CTR, position, and the top five queries marked branded/non-branded and by intent (EXAM-INTENT-MAP.md §2a).
4. **Italian vs English**: Page filter "URL contains" `/it/`, then "Doesn't contain" `/it/` (and the other prefixes).
5. **URL Inspection** for the same nine URLs: indexed or not, Google-selected canonical vs user-declared, last crawl date. Expected after this release: `/it/exams/cisia-tolc` is its own canonical; `/tr/`, `/es/`, `/pl/` versions of the TOLC hub are "Alternate page with proper canonical tag".
6. **Sitemaps**: status, last read, discovered URLs (75 on this release: the Italian TOLC hub and the IMAT sample-questions guide are new).

**B. First-party counts (no tracking added).** On a machine that can reach the production database, with its read-only settings: `npx tsx scripts/seo-report.ts --to=YYYY-MM-DD` (same end date as A). It prints, per exam page and guide, views and clicks into practice by coarse source, search share and click rate, against the previous 28 days, and, separately, practice sessions started and completed per exam. Paste it into the report file. `/admin/funnel` shows the same counts for one exam at a time.

**C. How to read them together.**

- Report clicks from search (A) and clicks into practice from search visits (B) as two different steps. Report completed practice sessions (B, second table) as a site-wide total: nothing links a session to the visit it came from, by design, so never present "organic visitors who completed a session".
- A first-party "search" view is any search engine and both branded and non-branded queries; only Search Console can split by query.
- The first-party counts do not separate `/exams/cisia-tolc` from `/it/exams/cisia-tolc` (the subject is the hub); use A.4 for the language split.
- Bocconi's Winter session (25 November 2026 – 26 January 2027), PoliTo's coming 2027/28 calls and CISIA's 2027 calendar (by 31 December) move demand on their own. Note them beside any change.
- If access to Search Console is missing at a checkpoint, write "not read" in the report. Never estimate a number.

## 30 / 60 / 90 days from the release

Search data lags 2–3 days, the sample is small, and admissions demand is seasonal (Bocconi's Winter session runs 25 November 2026 to 26 January 2027; TOLC sessions run through the year). Compare like periods and do not attribute a change to SEO work without a matching change in the pages concerned.

**By day 30**
- Indexing: the home page, the Bocconi hub (all five languages), the rewritten sample-questions guide and the exam directory are indexed with the declared canonical. Localized copies of English-only pages are "Alternate page with proper canonical tag", not "Duplicate without user-selected canonical".
- Sitemap: submitted count matches the sitemap (73 URLs on this release; it was 155, because the localized copies of English-only pages are no longer listed), with no "Couldn't fetch".
- Brand: impressions for branded queries; the result title shows "UniExamer". Note whether Google shows "UniExamer" as the site name.
- Funnel: guide views and guide clicks are being recorded (non-zero), and bots are not inflating them (compare with Search Console clicks to the guide).

**By day 60**
- Queries: list the top non-branded queries per exam page. For pages with impressions but a CTR well below the site's average at a similar position, rewrite the title or description once, and note the date.
- Content: the Bocconi sample-questions guide has impressions for sample-question queries; compare its guide-click rate with the other Bocconi guides.
- Decide the next content item from EXAM-INTENT-MAP.md §3 using actual Italian-language impressions (TOLC, TIL) rather than the qualitative order.

**By day 90**
- Landing pages: impressions, clicks, CTR and average position per exam hub and guide, by language prefix and country.
- Outcomes: free tests started per 100 exam-page views (site-wide trend), and guide-click rate per guide.
- Retire or merge any guide with no impressions after 90 days only if it also has no internal value (do not delete the sourced exam facts).
- Re-run the live crawl (`node scripts/seo-crawl.mjs https://uniexamer.com`) and compare with the 2026-10-29 baseline in REPORT-2026-10-29.md.

## Baseline on 3 November 2026 (Search Console, read in the owner's Chrome)

Read through Claude in Chrome on 3 November 2026, read-only (no indexing request, sitemap submission or setting change). Property `sc-domain:uniexamer.com`. The report's data ends on **31 October**, so "28 days" covers only 26–31 October, the days the property has data for. Nothing below is estimated.

**Totals (web search):** 10 clicks, 312 impressions, CTR 3.2%, average position 33.

| Slice | Clicks | Impressions | Avg. position | Note |
| --- | ---: | ---: | ---: | --- |
| Branded (regex `uni ?examer\|examer`) | 0 | 3 | 20.3 | Only query: "examer" |
| Non-branded (doesn't match the regex) | 0 | 143 | 55.1 | 78 queries |
| Anonymised (total minus both) | 10 | 166 | – | Google withholds these queries; every click so far is in this group |

**Top non-branded queries by impressions:** "bocconi test preparation" (11, position 63.7), "gre test" (6, 34.3), "bocconi preparation" (5, 51.2), "gre exam" (5, 66.2), "digital sat format time" (4), "old gmat format" (4), "cisia" (3, position 10.0), "bocconi test preparation centre" (3, 13.3), "bocconi test prep centre" (3, 15.3). TOLC queries are small but close: "til-a" (2, 9.0), "tolc@uni" (1, 8.0), "cisia tolc-e" (1, 9.0), "cisia tolc economia" (1, 10.0), "si può usare la calcolatrice al tolc" (1, 27.0). Several Greek and Polish Bocconi and GRE queries appear.

**Pages with clicks:** `/` 3 (49 impressions, position 2.7), `/it` 3 (4, 2.0), `/premium` 1 (29, 6.1: now a permanent redirect, 308, to `/pricing`), `/about/how-scoring-works` 1 (19), `/exams/bocconi-master` 1 (11, 21.6), `/exams/politecnico-di-torino-til/format` 1 (5). Priority pages without clicks: `/exams/politecnico-di-torino-til` 48 impressions at 6.5, `/guides/bocconi-test-preparation-plan` 40 at 47.6, `/exams/cisia-tolc` 37 at 6.2, `/it/exams/cisia-tolc` 21 at 55.1, `/exams/bocconi-online-test` 11 at 66.9. 59 pages had impressions, including `http://` and `www.` addresses (redirected).

**Sitemap:** `https://uniexamer.com/sitemap.xml`, submitted 27 October, last read 2 November, Success, 73 pages discovered. **Page indexing report:** still "Processing data".

**URL Inspection:**

| URL | Indexed | Google-selected canonical | Last crawl |
| --- | --- | --- | --- |
| `/` | Yes | Same as declared | 3 Nov 2026 |
| `/exams` | Yes | (not expanded) | – |
| `/exams/cisia-tolc` | **No**: "Duplicate, Google chose different canonical than user" | **`https://exam.assist365.app/exams/cisia-tolc`** (the old address, which now answers 301 to uniexamer.com) | 3 Nov 2026 |
| `/it/exams/cisia-tolc` | Yes | Same as declared (self) | 29 Oct 2026 |
| `/exams/politecnico-di-torino-til` | Yes | Same as declared | 29 Oct 2026 (before the 2 November rewrite) |
| `/exams/bocconi-online-test` | Yes | Same as declared | 3 Nov 2026 |
| `/exams/bocconi-master` | Yes | Same as declared | 2 Nov 2026 |
| `/guides/bocconi-test-preparation-plan` | Yes | Same as declared | – |
| `/guides/bocconi-admission-test-sample-questions` | Yes | Same as declared | 29 Oct 2026 |

**What this means.** The site moved from `exam.assist365.app` on about 27 October; the old address answers 301 to the same path on uniexamer.com, but **no Change of address has been filed** in the `exam.assist365.app` property (its form shows no new site selected). Google still treats the old address as the original of at least the English TOLC hub, so that page cannot rank as uniexamer.com. Filing the change of address (old property → Settings → Change of address → uniexamer.com → Validate & update) is the fix docs/GOOGLE_SEARCH_CONSOLE_SETUP.md already describes; keep the redirects for at least 180 days. Re-inspect `/exams/cisia-tolc` a week after filing.

**Filed on 3 November 2026** (owner-approved, through Claude in Chrome): `exam.assist365.app` → `uniexamer.com`. Validation passed the required checks (301 from the homepage, both sites verified). The recommended sample-page check found redirects on three pages and "couldn't fetch" two (`/` and `/guides/bocconi-test-preparation-plan`). Both answer 301 to the same path on uniexamer.com, also for a Googlebot user agent (checked with curl the same minute), so that was a fetch problem on Google's side. Search Console now shows "This site is currently moving", started 3 November 2026. Keep the redirects and the old property for at least 180 days (to May 2027), and do not press "Cancel move".

## Baseline on 2 November 2026 (Search Console, read by the owner)

The three-month report held data for 26–31 October only: 10 clicks, 312 impressions, 3.2% CTR, average position 33. Sitemap: success, 73 URLs discovered, last read 31 October. The sitewide indexing report was still processing. Pages:

| Page | Impressions | Clicks | Avg. position | Changed on 2 November |
| --- | ---: | ---: | ---: | --- |
| `/exams/politecnico-di-torino-til` (indexed, valid breadcrumbs) | 48 | 0 | 6.5 | Rewritten around the 2027/28 switch to CISIA; new title and description |
| `/guides/bocconi-test-preparation-plan` | 40 | 0 | 47.6 | Topic list by area, links to the worked samples |
| `/exams/cisia-tolc` | 37 | 0 | 6.2 | Lead, 2027 status, five worked samples; new title and description |
| `/exams/bocconi-master` | 11 | 1 | 21.6 | Not changed |

Six days of data cannot show a trend or a CTR problem: 48 impressions with no click at position 6.5 is within what chance allows. Query-level data was not read (the session's browser is not signed in to Google). Compare like with like: from the deploy date, 28 days against the 28 days before, per page, and note that Bocconi's Winter session (25 November–26 January) and PoliTo's coming calls will change demand on their own.

**What to read at each checkpoint for the three priority pages**

- Search Console → Pages → URL inspection for the TIL hub, the TOLC hub and the plan guide: indexed, Google-selected canonical = declared, last crawl after the deploy.
- Performance → filter page = each URL → Queries tab: list the queries, split them by the intent types in EXAM-INTENT-MAP.md §2a, and check whether the TIL page now gets "2027/28", "TOLC" or "CISIA" queries.
- Performance → Search appearance: none is expected (no rich-result markup is used for questions; FAQ and practice-problem results are retired).
- /admin/funnel for `politecnico-di-torino-til` and `cisia-tolc`: landing views by source, and practice clicks against search-engine views.

## Baseline on 29 October 2026

- Search Console and Bing performance data: not read in this pass. The built-in browser was not signed in to Google, and Bing's reports said they were still processing on 27 October (output/seo-audit-2026-10-27.md). **The first task after release is to record the baseline numbers here.**
- Bing results (read 2026-10-29, Italy, English interface): "uniexamer" → uniexamer.com first; "uni examer" → uniexamer.com second, behind the unrelated uniexam.net. Both showed the pre-release title.
- Live crawl of the production sitemap: 155 URLs, all 200; see REPORT-2026-10-29.md for the issues found.
