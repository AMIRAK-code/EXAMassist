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
3. **Priority pages**, each with Page filter "URL is exactly": `/exams/cisia-tolc`, `/it/exams/cisia-tolc`, `/exams/politecnico-di-torino-til`, `/exams/bocconi-online-test`, `/guides/bocconi-test-preparation-plan`, `/guides/bocconi-admission-test-sample-questions`, `/`. For each: clicks, impressions, CTR, position, and the top five queries marked branded/non-branded and by intent (EXAM-INTENT-MAP.md §2a).
4. **Italian vs English**: Page filter "URL contains" `/it/`, then "Doesn't contain" `/it/` (and the other prefixes).
5. **URL Inspection** for the same seven URLs: indexed or not, Google-selected canonical vs user-declared, last crawl date. Expected after this release: `/it/exams/cisia-tolc` is its own canonical; `/tr/`, `/es/`, `/pl/` versions of the TOLC hub are "Alternate page with proper canonical tag".
6. **Sitemaps**: status, last read, discovered URLs (74 on this release: one more than before, the Italian TOLC hub).

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
