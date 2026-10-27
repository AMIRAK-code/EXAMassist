# Google Search Console setup for exam.assist365.app

Audited 2026-10-07 on branch `bocconi-landing`. Search Console itself was not
touched: it needs the site owner's Google account, and DNS verification needs
the Cloudflare account that holds assist365.app. Nothing here guarantees that
Google crawls, indexes or ranks any page.

> **Before you start:** the live site still runs the old build, which tells
> search engines to index nothing (`noindex` on every page, `Disallow: /` and an
> empty sitemap). Deploy this branch first (release order in
> [`BOCCONI-SEARCH.md`](BOCCONI-SEARCH.md#release-steps-in-order-need-production-access)),
> then check the URLs below before submitting anything to Google.

## 1. Production environment

| Variable | Production value | When it is read | Where it is set |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://exam.assist365.app` (no trailing slash; one is stripped anyway) | **At build time**: inlined into the bundle | `vars` in `wrangler.jsonc` (already set), and the build environment |
| `SEARCH_INDEXING_ENABLED` | `true` | **Per request**, on every page, `robots.txt` and `sitemap.xml` | `vars` in `wrangler.jsonc` (set to `"true"` on this branch) |
| `GOOGLE_SITE_VERIFICATION` | the token from Search Console, only for HTML-tag verification | Per request, on the home page | a Worker var, or the `GOOGLE_SITE_VERIFICATION_TOKEN` constant in `src/lib/site.ts` |

Notes:

- Any value of `SEARCH_INDEXING_ENABLED` other than `true` gives `noindex` on
  every page, a `robots.txt` that disallows everything and an empty sitemap.
  Keep it unset on previews and on the Vercel backup (`exa-massist.vercel.app`),
  whose canonicals point at its own host.
- Checked 2026-10-07: a build made with indexing on but served with it off
  answered `noindex` on every page, so the Worker var alone decides indexing.
  Only the site URL is fixed by the build.
- The verification token is public by design. It accepts the bare token or the
  whole `<meta …>` tag Search Console shows, ignores anything that is not
  token-shaped, and is only emitted when indexing is on.

## 2. Live URLs to check after deploying

| URL | Expect |
| --- | --- |
| https://exam.assist365.app/robots.txt | `User-Agent: *` / `Allow: /` with the private paths disallowed, and `Sitemap: https://exam.assist365.app/sitemap.xml` |
| https://exam.assist365.app/sitemap.xml | 29 `<url>` entries, all on `https://exam.assist365.app`, each with `<lastmod>` |
| https://exam.assist365.app/ | `<meta name="robots" content="index, follow">`, canonical `https://exam.assist365.app`, and the verification tag if a token is set |

```bash
curl -s https://exam.assist365.app/robots.txt
```

```bash
curl -s https://exam.assist365.app/sitemap.xml | grep -c "<loc>"
```

```bash
curl -s https://exam.assist365.app/ | grep -o '<meta name="robots"[^>]*>\|<link rel="canonical"[^>]*>\|<meta name="google-site-verification"[^>]*>'
```

## 3. Verify ownership

**Option A, recommended: a Domain property** for `exam.assist365.app`.

1. Search Console → *Add property* → *Domain* → enter `exam.assist365.app`.
2. Copy the `google-site-verification=…` TXT value.
3. In the Cloudflare account that holds assist365.app (Moein's), DNS → add a
   **TXT** record named `exam` with that value.
4. Back in Search Console → *Verify*. DNS can take a few minutes. Keep the
   record: removing it unverifies the property.

**Option B: a URL-prefix property with the HTML tag**, if DNS access is not available.

1. Search Console → *Add property* → *URL prefix* → `https://exam.assist365.app/`.
2. Choose *HTML tag* and copy the `content` value (or the whole tag).
3. Set it as `GOOGLE_SITE_VERIFICATION` in the Worker's vars (or in
   `GOOGLE_SITE_VERIFICATION_TOKEN` in `src/lib/site.ts`) and deploy.
4. Confirm the tag is on the home page (third command above), then *Verify*.
   Keep the tag in place afterwards.

## 4. Submit the sitemap

1. In the verified property: *Indexing* → *Sitemaps*.
2. Enter `sitemap.xml` (the full address is `https://exam.assist365.app/sitemap.xml`) → *Submit*.
3. Status should become *Success* with 29 discovered URLs. *Couldn't fetch*
   usually means the deploy has not happened or indexing is off: check the
   sitemap URL in a browser.

`robots.txt` also announces the sitemap, so other engines find it too. For
Bing, use *Import from Google Search Console* in Bing Webmaster Tools.

## 5. URL Inspection and first indexing requests

Inspect these first, most important first, and request indexing for each one
that is not yet on Google:

1. `https://exam.assist365.app/`
2. `https://exam.assist365.app/exams/bocconi-online-test`
3. `https://exam.assist365.app/exams`
4. `https://exam.assist365.app/exams/bocconi-online-test/format`
5. `https://exam.assist365.app/guides/bocconi-undergraduate-vs-law-test`
6. `https://exam.assist365.app/guides/bocconi-test-preparation-plan`
7. `https://exam.assist365.app/guides/bocconi-test-negative-marking-when-to-guess`
8. The other exam hubs (`/exams/digital-sat`, `/exams/enhanced-act`, `/exams/lsat`,
   `/exams/gmat`, `/exams/gre`, `/exams/politecnico-di-torino-til`, `/exams/cisia-tolc`)

For each one:

- Paste the URL into the inspection bar at the top of Search Console.
- *Test live URL* first. Check *Crawl allowed? Yes*, *Page fetch: Successful*,
  *Indexing allowed? Yes*, and that *User-declared canonical* is the URL itself.
- *Request indexing*. There is a daily quota, so do not request the same URL
  twice; the sitemap covers the rest.
- Days later, check that the *Google-selected canonical* matches the
  user-declared one. If it differs, Google treats another URL as the original;
  look for duplicate content before changing anything.

Indexing usually takes days to weeks for a new site, and Google may choose not
to index some pages. That is expected and not a configuration error.

## 6. What should be indexed, and what should not

### Indexed (in the sitemap; `index, follow`; self-referencing canonical)

| Group | URLs |
| --- | --- |
| Home and listings | `/`, `/exams`, `/guides` |
| Plans | `/premium` |
| About | `/about/editorial-standards`, `/about/how-scoring-works`, `/about/privacy`, `/about/terms` |
| Exam pages (8) | `/exams/bocconi-online-test`, `/exams/digital-sat`, `/exams/enhanced-act`, `/exams/lsat`, `/exams/gmat`, `/exams/gre`, `/exams/politecnico-di-torino-til`, `/exams/cisia-tolc` |
| Format guides (8) | each exam page + `/format` |
| Guides (5) | `/guides/bocconi-test-negative-marking-when-to-guess`, `/guides/bocconi-undergraduate-vs-law-test`, `/guides/bocconi-test-preparation-plan`, `/guides/lsat-without-logic-games`, `/guides/why-practice-tests-cannot-give-you-a-real-sat-score` |

`/premium?exam=…` and `/?exam=…` are variants of the same pages; their
canonical points to the plain URL, so they should not be indexed separately.

### Deliberately excluded

| Route | How it is excluded | Expected Search Console status |
| --- | --- | --- |
| `/api/` | robots.txt | Blocked by robots.txt (if ever discovered) |
| `/dashboard`, `/account`, `/review`, `/study-plan`, `/admin` | robots.txt and `noindex` | Blocked by robots.txt |
| `/attempt/…` (sessions and results) | robots.txt and `noindex` | Blocked by robots.txt |
| `/practice/…`, `/start/…`, `/free-test/…` | robots.txt and `noindex` | Blocked by robots.txt |
| `/sign-in`, `/sign-in/code`, `/sign-up` | robots.txt and `noindex` | Blocked by robots.txt |
| `/premium/welcome` (after checkout) | robots.txt and `noindex` | Blocked by robots.txt |
| `/forgot-password`, `/verify-email` | `noindex` (404 when email codes are off) | Excluded by 'noindex' tag, or Not found (404) |
| `/report-question` | `noindex, follow` | Excluded by 'noindex' tag |
| Unknown URLs | 404 with `noindex` | Not found (404) |

robots.txt keeps crawlers away from private routes; it is not what keeps them
private. That is done by sign-in and server-side checks. A blocked URL that
other sites link to can occasionally appear as "Indexed, though blocked by
robots.txt" with no content; it holds no private data.

## 7. robots.txt rules, as audited

- Googlebot and bingbot have no group of their own, so they follow `*`:
  everything is allowed except the private paths above. `/`, `/exams/*`,
  `/guides/*`, `/about/*` and `/premium` are all reachable.
- AI search and user-triggered fetchers (OAI-SearchBot, Claude-SearchBot,
  PerplexityBot, ChatGPT-User, Claude-User) get the same rules as `*`.
- Training crawlers are disallowed everywhere: GPTBot, ClaudeBot,
  Google-Extended (this does not affect Google Search, AI Overviews or AI Mode),
  Applebot-Extended, Meta-ExternalAgent and MistralAI-Training.
- The `Host:` line Next.js adds is ignored by Google and harmless.

## 8. Canonicals and structured data, as audited

- `metadataBase` in `src/app/layout.tsx` is the site URL, and every public
  page sets an absolute, self-referencing canonical (`alternates.canonical`).
- JSON-LD on each page matches what the page shows:

| Page | Types |
| --- | --- |
| `/` | Organization (with logo and an explicit independence statement), WebSite |
| `/exams`, `/guides`, `/premium`, `/about/terms` | BreadcrumbList |
| Exam pages, except Bocconi | BreadcrumbList, Article |
| `/exams/bocconi-online-test` | BreadcrumbList, WebPage |
| Format guides, guides, editorial standards, how scoring works, privacy | BreadcrumbList, Article |

- Not used on purpose: FAQPage (Google stopped showing FAQ rich results in May
  2026), ratings or reviews (none are collected), Product or Offer for the
  subscription, Course, and hreflang (no translated pages exist).
- Check any page with Google's Rich Results Test
  (https://search.google.com/test/rich-results). In Search Console, breadcrumbs
  appear under *Enhancements* once pages are indexed; Google currently shows
  breadcrumb rich results on desktop only.

## 9. Audit results, 2026-10-07

Run against a production build of this branch with
`NEXT_PUBLIC_SITE_URL=https://exam.assist365.app`, indexing on and a dummy
verification token:

- `robots.txt`: 200, rules as in section 7, Sitemap line on the production domain.
- `sitemap.xml`: 200, 29 URLs, all on the production domain, all with
  `lastmod` (the date the content last changed, never the request date).
- All 29 sitemap URLs: status 200, `index, follow`, a canonical equal to the
  sitemap URL, exactly one `<h1>`, and JSON-LD as in section 8. The
  verification tag is on the home page only.
- 17 private and functional routes: all `noindex`; all but `/forgot-password`,
  `/verify-email` and `/report-question` are also disallowed in `robots.txt`.
- `tests/unit/seo.test.ts` keeps this true: private paths are disallowed and
  public ones are not, training crawlers are blocked, the sitemap holds exactly
  the public pages with real dates, and both files close everything when
  indexing is off.

Changes made by this audit: `lastmod` for the nine fixed pages that had none
(from `src/lib/content/page-dates.ts`, which the pages also display), a
BreadcrumbList on `/premium`, and support for the verification token.

## 10. After setup

- *Indexing → Pages*: watch for sitemap URLs that are not indexed, and the reason.
- *Sitemaps*: the discovered count should stay at the number of public pages.
- *Performance*: queries and pages. For Bocconi searches and whether they
  convert, see [`BOCCONI-SEARCH.md`](BOCCONI-SEARCH.md).
