# Measuring discovery and useful outcomes

Written 29 October 2026. The site promises one cookie (the session) and no third-party analytics (privacy notice), so measurement uses two sources only: the search consoles, and first-party daily totals that identify nobody. Do not add a tracking script, pixel or tag manager to answer any of the questions below.

## What is measured, and where

| Question | Source | Notes |
| --- | --- | --- |
| Which queries and pages get impressions and clicks, by country, device and search appearance | Google Search Console → Performance; Bing Webmaster Tools → Search Performance | Branded vs non-branded: filter queries with the regex `uni ?examer\|examer` (Google: "Custom (regex)"; Bing: export and filter). Language: filter pages by `/it/`, `/tr/`, `/es/`, `/pl/` prefixes; English has no prefix. |
| Which URLs are indexed, and which canonical Google chose | Search Console → Pages and URL Inspection | Expect the localized copies of English-only pages (every guide, every format guide, every hub except Bocconi) to show "Alternate page with proper canonical tag". That is intended. |
| Exam-page views by coarse source (search, AI assistant, this site, other site, none) | `funnel_counts`, event `landing_view` | /admin/funnel. Static pages report their own view from the browser. |
| Guide views, and clicks from a guide to an exam page or into practice | `funnel_counts`, events `guide_view` and `guide_click` (since 2026-10-29) | Subject is the guide slug; /admin/funnel shows them per exam. |
| Free tests started and finished | `attempts` (free-test sessions) | Read from the sessions themselves, so never double-counted. |
| Plans page views, checkouts started, purchases from an exam | `funnel_counts` (`pricing_view`, `checkout_start`, `purchase`) | Only meaningful once payments are switched on. |
| Accounts created | `users.created_at` where `is_guest = 0` | Not attributable to a page or a search; read it as a site-wide trend only. |

Organic search versus other channels: `landing_view` and `guide_view` carry a coarse source, so "search" is the organic share for those pages. Nothing downstream (free test, purchase) knows the source of the visit, by design. Conversion from organic search can therefore only be inferred from trends, never attributed per visit; say so whenever reporting it.

Practice starts from guides: `guide_click` counts the click, not the session that may follow. Report it as "clicks into practice", not "practice starts".

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
- Re-run the live crawl (`node crawl.mjs https://uniexamer.com`; the script is described in REPORT-2026-10-29.md) and compare with the 2026-10-29 baseline.

## Baseline on 29 October 2026

- Search Console and Bing performance data: not read in this pass. The built-in browser was not signed in to Google, and Bing's reports said they were still processing on 27 October (output/seo-audit-2026-10-27.md). **The first task after release is to record the baseline numbers here.**
- Bing results (read 2026-10-29, Italy, English interface): "uniexamer" → uniexamer.com first; "uni examer" → uniexamer.com second, behind the unrelated uniexam.net. Both showed the pre-release title.
- Live crawl of the production sitemap: 155 URLs, all 200; see REPORT-2026-10-29.md for the issues found.
