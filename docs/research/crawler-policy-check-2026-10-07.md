# Crawler and structured-data guidance re-checked, 7 October 2026

**Checked on:** 2026-10-07. Companion to the generated
`seo-and-crawler-policy.md` (verified 2026-09-18), which is built from
`content/exam-specs/_raw/` and so is not edited by hand.

How this record was made: an AI research agent read each provider's own
documentation on 2026-10-07 and compared it with `src/app/robots.ts`. Quotes
are near-verbatim from fetched pages.

What changed in the code as a result:

- `robots.ts` adds two documented training-only tokens under the existing
  "training crawlers are disallowed" rule: `Meta-ExternalAgent` and
  `MistralAI-Training`. Every search and user-triggered crawler stays allowed;
  every existing training opt-out is unchanged. `CCBot` was left alone: Common
  Crawl does not describe itself as a training crawler, so blocking it is a
  business decision, not a documented training opt-out.
- No FAQPage markup was added: Google stopped showing FAQ rich results on
  2026-05-07. The Bocconi FAQ is visible text only.
- `Organization` markup gained a `logo`.
- No llms.txt: Google says such files "neither harm nor help", and nothing on
  the site claims any file guarantees AI citations.

Drift from the generated policy document (fix in the raw record when it is next
regenerated): Bing's guidelines page is now verified; Google-Extended is
blocked in code (not an open decision) and does not affect AI Overviews or AI
Mode; Applebot data may now also train Apple models; Google's crawler docs moved
to developers.google.com/crawling/; breadcrumbs now show on desktop only.

---

# Crawler, structured-data and Search Console docs: re-verification

**Verified 2026-10-07** against first-party pages (WebFetch; the Bing guidelines page was rendered in a browser because it is client-side only). Quotes are short excerpts. "Updated" is the page's own last-updated stamp where one is shown.

Compared against `src/app/robots.ts` and `docs/research/seo-and-crawler-policy.md` (verified 2026-09-18). Nothing in the repo was edited.

---

## 1. Crawler tokens

### OpenAI: https://developers.openai.com/api/docs/bots (no date shown)
| Token | Purpose | robots.txt | Quote |
|---|---|---|---|
| OAI-SearchBot | ChatGPT search | Yes | "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers" |
| GPTBot | Training | Yes | "Disallowing GPTBot indicates a site's content should not be used in training" |
| ChatGPT-User | User-triggered (ChatGPT, Custom GPTs) | May not apply | "Because these actions are initiated by a user, robots.txt rules may not apply." |
| OAI-AdsBot | Checks ad landing pages | Yes | "Data collected by OAI-AdsBot is not used to train generative AI foundation models" |

- Crawl sharing: "If your site has allowed both bots, we may use the results from just one crawl for both use cases". Because GPTBot is disallowed, this does not apply to us.
- Timing: "it can take ~24 hours from a site's robots.txt update for our systems to adjust."
- No other tokens are documented on this page (no ChatGPT agent or Codex token).

### Anthropic: https://support.claude.com/en/articles/8896518 (dated 2026-04-07)
| Token | Purpose | Quote |
|---|---|---|
| ClaudeBot | Training | "collecting web content that could potentially contribute to their training" |
| Claude-SearchBot | Search quality | "navigates the web to improve search result quality for users"; blocking it "may reduce your site's visibility and accuracy in user search results" |
| Claude-User | User-triggered | "When individuals ask questions to Claude, it may access websites using a Claude-User agent"; blocking it "may reduce your site's visibility for user-directed web search" |

- robots.txt: "Anthropic's Bots respect 'do not crawl' signals by honoring industry standard directives in robots.txt." This is a general statement about all of Anthropic's bots, not a sentence written specifically about Claude-User.
- Crawl-delay: "we support the non-standard Crawl-delay extension to robots.txt."

### Perplexity: https://docs.perplexity.ai/guides/bots
- PerplexityBot (search, not training): "designed to surface and link websites in search results on Perplexity. It is not used to crawl content for AI foundation models". The page also says: "To ensure your site appears in search results, we recommend allowing PerplexityBot".
- Perplexity-User (user-triggered): "Since a user requested the fetch, this fetcher generally ignores robots.txt rules."
- Timing: robots.txt changes "may take up to 24 hours" to take effect.

### Google
Pages:
- https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers (updated 2026-07-14)
- the old URL https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers serves the same content

Google's changelog says crawler documentation moved to the "crawling infrastructure" site on 2025-11-20 and 2025-12-18 (https://developers.google.com/search/updates).

- Tokens listed: Googlebot (and its -Image, -Video and -News variants), Storebot-Google, Google-InspectionTool, GoogleOther (and its -Image and -Video variants), Google-CloudVertexBot, Google-Extended.
- **Google-Extended:**
  - What it controls: whether crawled content "may be used for training future generations of Gemini models", plus grounding in Gemini Apps and the Vertex AI API for Gemini.
  - Effect on Search: it "does not impact a site's inclusion in Google Search nor is it used as a ranking signal."
- **Google-Extended does not control AI Overviews or AI Mode.** Those are part of Search and are controlled by Googlebot plus the snippet controls. Source: https://developers.google.com/search/docs/appearance/ai-features (updated 2025-12-10):
  - "To be eligible to be shown as a supporting link in AI Overviews or AI Mode, a page must be indexed and eligible to be shown in Google Search with a snippet."
  - The page sends readers elsewhere for Google-Extended: "To limit AI training and grounding in some of Google's other systems, read more about Google-Extended."
- GoogleOther: a "generic crawler that may be used by various product teams". It does not affect any specific product.
- Google-CloudVertexBot: crawls "requested by the site owners" for building Vertex AI Agents; it "has no effect on Google Search or other products".

### Apple: https://support.apple.com/en-us/119829 (dated 2026-09-04)
- Applebot powers "Spotlight, Siri, and Safari".
- Change from last time: Apple now states that Applebot data "may also be used to help train Apple foundation models powering generative AI features".
- Opting out of that training: "opt-out from having their content used to train generative foundation models by disallowing Applebot-Extended".
- "Applebot-Extended does not crawl webpages. Webpages that disallow Applebot-Extended can still be included in search results."
- Fallback: "If robots instructions don't mention Applebot but mention Googlebot, the Apple robot will follow Googlebot instructions." Our robots.txt has no Googlebot or Applebot group, so Applebot follows the `*` group.

### Microsoft Bing: https://www.bing.com/webmaster/help/webmaster-guidelines-30fba23a
This page is now verified: it was rendered in a browser on 2026-10-07. The repo doc marked it UNVERIFIED.
- Copilot uses Bing's index: "Bing and Copilot search experiences rely on the same core crawling, indexing, and ranking foundation as traditional search."
- In its list of things to avoid: "Blocking Bingbot in your robots.txt file".
- robots.txt: "robots.txt controls crawl access, not indexing." Use NOINDEX to keep a URL out of "Bing search, Copilot experiences, or grounding API results."
- Archive and cache tags:
  - "NOARCHIVE prevents content from being used in Copilot responses and grounding results."
  - "NOCACHE limits Copilot to using only the URL, title, and snippet".
- Snippet tags: DATA-NOSNIPPET and NOSNIPPET "may limit Copilot citation quality".
- The guidelines recommend IndexNow for adds, updates and removals, sitemaps with "only canonical URLs" and accurate lastmod, and 301 redirects.
- They define GEO and say it "does not guarantee grounding or citations".
- Earlier source, Bing blog of 2023-09-22 (https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat): with NOARCHIVE, "we will not use the content for training Microsoft's generative AI foundation models".
- There is no separate Microsoft AI-training user-agent token. On Bing, training and Copilot use are controlled only by the NOCACHE and NOARCHIVE meta tags.

### Common Crawl CCBot: https://commoncrawl.org/ccbot and https://commoncrawl.org/faq
- Obeys robots.txt and Crawl-delay. To block it: "User-agent: CCBot / Disallow: /".
- Common Crawl also runs an opt-out registry.
- Its own pages describe an "open repository of web crawl data" and **do not call it AI training**. Third parties may train on the dataset, but Common Crawl's own docs do not say so.

### Meta: https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/
- Meta-ExternalAgent: "training foundation AI models or improving products by indexing content directly". Obeys robots.txt.
- Meta-WebIndexer (Meta AI search): "Allowing Meta-WebIndexer in your robots.txt file helps us cite and link to your content in Meta AI's responses."
- Meta-ExternalFetcher (user-triggered): "this crawler may bypass robots.txt rules".
- facebookexternalhit (link previews when a link is shared): may bypass robots.txt.
- Meta-ExternalAds: ads.

### Newer first-party tokens
- **Mistral** (https://docs.mistral.ai/robots):
  - MistralAI-User: user actions in Vibe. Not automatic crawling and not used for training.
  - MistralAI-Index: "indexing purposes only" for Mistral search. Not used for training.
  - MistralAI-Training: "help build datasets for training Mistral generative AI models. Webmasters can disallow this user agent".
- **DuckDuckGo DuckAssistBot** (https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot):
  - Fetches pages for DuckDuckGo's AI-assisted answers.
  - "This data is not used in any way to train AI models".
  - Opting out "does not impact organic search rankings". A disallow takes effect after 72 hours.
- **Google:** Google-CloudVertexBot is documented (see above).
- **OpenAI and Anthropic:** no new tokens beyond those listed above.

---

## 2. Google structured data status

Search gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery (updated 2026-06-15). It lists 31 features, including Article, Breadcrumb, Course list, Education Q&A, Math solver, Organization, Product, Merchant listing, Software app and Subscription/paywalled content. It does not list FAQ, Practice problems, Course info or Sitelinks searchbox.

| Type | Status (2026-10-07) | Key facts | URL |
|---|---|---|---|
| BreadcrumbList | Live, **desktop only** | "This feature is available on desktop in all regions and languages". Required: itemListElement, position, name, item (item not needed on the last crumb). Updated 2026-09-08 | https://developers.google.com/search/docs/appearance/structured-data/breadcrumb |
| Organization | Live (not a classic rich result) | No required properties. Recommended: name, url, logo (min 112x112, crawlable), sameAs, description, contactPoint and more. Place it "on your home page, or a single page that describes your organization". Updated 2026-09-08 | https://developers.google.com/search/docs/appearance/structured-data/organization |
| FAQPage | **No longer shown** | Changelog 2026-05-08: "This feature will no longer appear in Google Search starting May 7, 2026." Docs removed 2026-06-15. Before that (since 2023-09-14) only "well-known, authoritative government and health websites" qualified. No first-party sentence was found either requiring or forbidding leftover markup; it is simply ignored for rich results | https://developers.google.com/search/docs/appearance/structured-data/faqpage , https://developers.google.com/search/updates |
| Course list | Live | Required: `name`, `description` (60-character display limit). `provider` is recommended. "You must mark up at least three courses". Needs ItemList (itemListElement, position, url) on a summary page or all-in-one page. English only. Updated 2026-09-08 | https://developers.google.com/search/docs/appearance/structured-data/course |
| Course info | **Removed** | Docs removed on 2025-09-09 together with estimated salary, learning video, special announcement and vehicle listing | changelog |
| Product / Merchant listing | Live | Merchant listing: "Only pages where a shopper can purchase a product are eligible". Merchant listings "require an Offer". "Product rich results only support pages that focus on a single product". The docs do not say subscriptions or SaaS qualify; they are written around physical products (shipping, returns, apparel). Treat a SaaS subscription as **not a sensible fit** for merchant listings | https://developers.google.com/search/docs/appearance/structured-data/merchant-listing , .../product |
| SoftwareApplication / WebApplication | Live | Required: `name`, `offers.price` (0 if free), and either `aggregateRating` or `review`. WebApplication is supported. Without real ratings or reviews it is **not eligible**; never invent ratings. Updated 2026-09-08 | https://developers.google.com/search/docs/appearance/structured-data/software-app |
| Article | Live | "There are no required properties". Recommended: author, datePublished, dateModified, headline, image. Updated 2026-09-08 | https://developers.google.com/search/docs/appearance/structured-data/article |
| WebSite + SearchAction (sitelinks searchbox) | **Gone** since 2024-11-29 | "The sitelinks search box feature is no longer available in Google Search results". WebSite markup is still used for **site names** (section 3) | https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox |
| Practice problems | **Removed** | Deprecation notice 2025-11-05. Docs removed 2026-01-06: "no longer shown in Google Search results" | https://developers.google.com/search/docs/appearance/structured-data/practice-problems |
| Education Q&A (Quiz flashcards) | Live | Updated 2026-09-08. Languages: English, Portuguese and Vietnamese in all regions; Spanish in Mexico only. Shown for education queries. Required: hasPart > Question with eduQuestionType "Flashcard", text and acceptedAnswer. "Pages that contain other question types are not eligible" | https://developers.google.com/search/docs/appearance/structured-data/education-qa |
| Math solver | Live (listed in the gallery) | Not relevant unless we build a solver tool | gallery |

The repo doc's table is still correct. The only additions are that breadcrumbs show on desktop only, and the Software app and Merchant listing rows above.

Repo code (`src/components/seo/json-ld.tsx`):
- `organizationSchema` emits no `logo` and no `sameAs`, although both are recommended and the brand assets exist in `public/brand`.
- `articleSchema` emits no `image`.

---

## 3. hreflang, canonical, site names

### hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions (updated 2026-09-21)
- Reciprocal and self-referencing: "Each language version must list itself as well as all other language versions." Also: "If two pages don't both point to each other, the tags will be ignored."
- URLs must be fully qualified, including the protocol.
- Cross-domain is allowed: "Alternate URLs do not need to be in the same domain."
- Use hreflang only for real alternate-language or regional versions. If only the template is translated and the main content is not, the pages are not true translations.
- Our site is currently `inLanguage: 'en'` with no hreflang. That is correct: add hreflang only when real translations exist.

### Canonical
Sources:
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls (updated 2026-07-10)
- https://developers.google.com/search/docs/crawling-indexing/canonicalization (updated 2026-08-20)

What they say:
- A canonical "is a hint, not a rule".
- "Use absolute paths rather than relative paths".
- Self-referential canonical is recommended.
- "Don't use the robots.txt file for canonicalization purposes."
- "All pages listed in a sitemap are suggested as canonicals".
- With hreflang: "specify a canonical page in the same language".
- **Cross-subdomain or cross-domain canonical is not addressed in the current pages.** For a host move (e.g. a subdomain moving to the apex domain), Google's site-move guidance and Bing's guidelines both prefer 301 redirects. Bing: "Use redirects instead of canonical tags".

### Site names on subdomains: https://developers.google.com/search/docs/appearance/site-names (updated 2025-12-10)
- Supported: "https://news.example.com (this is a subdomain-level home page)".
- Not supported: "https://example.com/news (this is a subdirectory-level home page)".
- So `exam.assist365.app` **can** get its own site name.
- WebSite structured data must sit on that subdomain's home page. Required: `name` and `url`. `alternateName` is optional.
- "Subdomain names starting with www or m are generally considered as being equivalent."
- The repo's `webSiteSchema` already emits name and url. Make sure it is on the home page of the subdomain.

---

## 4. Google on llms.txt and "AI optimisation"
Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide, "Optimizing your website for generative AI features on Google Search" (updated 2026-07-10)

- "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search".
- On visibility: "neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them".
- On other services: "It's completely fine if you decide to create and maintain LLMS.txt files ... for other services".
- On structured data: "Structured data isn't required for generative AI search, and there's no special schema.org markup".
- The changelog has an llms.txt clarification dated 2026-06-15.

AI features page (https://developers.google.com/search/docs/appearance/ai-features): "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary." AI-feature traffic is "included in overall search traffic in Search Console".

Snippet controls (https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag, updated 2026-03-24):
- nosnippet "will also prevent the content from being used as a direct input for AI Overviews and AI Mode".
- max-snippet "will also limit how much of the content may be used as a direct input for AI Overviews and AI Mode".
- data-nosnippet is listed among the AI-feature controls on the ai-features page.
- noarchive: Google no longer uses it, because the cached link no longer exists. **On Bing, noarchive removes content from Copilot.**

---

## 5. Search Console, Bing Webmaster Tools, IndexNow

### Choosing a property: https://support.google.com/webmasters/answer/34592
- A Domain property can be a subdomain. Google's own example: `fish.example.com` covers http and https on `fish.example.com` and on `support.fish.example.com`.
- A Domain property needs DNS verification only.
- A URL-prefix property (`https://exam.assist365.app/`) covers only that prefix and protocol, and accepts other verification methods.
- Two options for us:
  - A Domain property for `exam.assist365.app`, verified with a DNS TXT record on that host name in the Cloudflare zone of whoever holds assist365.app (Moein's account).
  - A URL-prefix property verified by HTML file or meta tag. This needs no DNS access.

### Verification methods: https://support.google.com/webmasters/answer/9008080
- Methods: HTML file, HTML tag, Google Analytics, Google Tag Manager, domain name provider (TXT or CNAME), Google Sites, Blogger.
- For the TXT record, the host/name field is "blank, or set as '@'". This is at the zone apex. For a subdomain property, put the TXT record on the subdomain's label (`exam`) instead.
- The page does not say whether Cloudflare offers automatic provider verification. Adding the TXT record by hand always works.

### Sitemaps: https://support.google.com/webmasters/answer/7451001
- Submitting a sitemap through the Sitemaps report requires owner permission. Listing it in robots.txt is the alternative.
- URLs must be on the same host and protocol as the sitemap and not above its path.
- Our robots.ts already emits an absolute `Sitemap:` line.

### URL Inspection: https://support.google.com/webmasters/answer/9012289
- Shows index status, the Google-selected canonical and a live test, and lets you request indexing.
- "URL is on Google" means the page is eligible to appear in Search, but "not guaranteed to be there".
- Daily per-property quotas apply. "Indexing typically takes only a day or so".

### Performance report filters: https://support.google.com/webmasters/answer/17011165
- Filter by Query or Page, choose "Custom (regex)", then pick "Matches regex" or "Doesn't match regex".
- "The RE2 syntax is used. Default matching is a 'partial match.'" Matching is case-insensitive unless you prefix the pattern with `(?-i)`.
- Only one comparison at a time.
- Background: https://developers.google.com/search/blog/2021/04/performance-report-data-filtering
- Example: Query matches `(sat|act|lsat|gmat|gre|bocconi)` and Page matches `^https://exam\.assist365\.app/guides/`.

### Bing Webmaster Tools import from GSC: https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools
- Imports verified sites and sitemaps. Sites are "automatically verified".
- Bing "will periodically validate your site ownership status by syncing with your Google Search Console account", so keep the connection in place.

### IndexNow: https://www.bing.com/indexnow/getstarted
- Uses a key file on the host, then a POST to api.indexnow.org.
- "Enable Crawler Hints in your Cloudflare account". IndexNow "does not guarantee that web pages will be crawled or indexed".

### Cloudflare Crawler Hints: https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/ (updated 2026-08-14)
- Sends IndexNow signals based on cache MISS events.
- Available on Free, Pro, Business and Enterprise plans.
- Enabled per zone in the dashboard (Caching > Configuration), so the account that owns assist365.app has to turn it on.
- The Bing guidelines separately recommend IndexNow.

---

## Comparison with the repo

### Where the repo was right
- The three-way split between training, AI search and user-triggered fetchers.
- GPTBot, ClaudeBot, Google-Extended and Applebot-Extended are all still documented as training controls.
- OAI-SearchBot, Claude-SearchBot and PerplexityBot remain search crawlers.
- Statements about FAQ, practice problems, Course info, sitelinks searchbox and llms.txt are all still accurate.

### Where the repo doc has drifted
1. **Bing guidelines are now verifiable.** Section 1 and checklist item 22 can drop the UNVERIFIED flag.
2. **New Bing facts to add:**
   - "Blocking Bingbot" is on the avoid list.
   - NOARCHIVE removes content from Copilot.
   - NOCACHE limits Copilot to URL, title and snippet.
   - There is no separate Microsoft training token.
3. **Google-Extended is inconsistent between the doc and the code.**
   - The doc says it is an "OPEN DECISION" and shows it commented out in section 4.
   - `robots.ts` disallows it.
   - Docs confirm the disallow has no Search, AI Overviews or AI Mode cost. It does remove Gemini app and Vertex grounding.
   - The doc should record that a decision was made.
4. **Applebot now also feeds training.** Apple states Applebot data "may also be used to help train Apple foundation models". The existing Applebot-Extended disallow is the documented opt-out, so it is now more important than before.
5. **Crawler doc URLs moved.** Google's crawler pages now live under `developers.google.com/crawling/...`; the old URLs still serve the content.
6. **Breadcrumb rich results show on desktop only.**
7. **The section 4 robots.txt example uses the wrong paths.** It uses `/attempts/`, `/settings/` and `/auth/`, which differ from the real routes (`/attempt/`, `/account`, `/sign-in` and so on). It is also more verbose than the real file (bingbot, GoogleOther, Applebot, Perplexity-User and OAI-AdsBot groups). Functionally the real file is fine: those agents fall through to `*` with the same rules.

---

## Recommended robots.ts changes (documentation-justified only; existing training opt-outs kept)

**Add (training-only tokens, consistent with the existing policy):**
1. `{ userAgent: 'Meta-ExternalAgent', disallow: '/' }`. Meta documents it as "training foundation AI models". AI-search citation goes through Meta-WebIndexer, which stays allowed via `*`. Caveat: Meta says ExternalAgent is also used for "improving products by indexing content directly".
2. `{ userAgent: 'MistralAI-Training', disallow: '/' }`. Documented as training only. MistralAI-Index and MistralAI-User stay allowed via `*`.

**Optional, a business call rather than a documented training token:**
3. `CCBot`. Common Crawl's own docs describe an open research corpus and do not say "training". Disallow it only if we want to stay out of a public dataset that others train on. It obeys robots.txt.

**Do NOT change:**
- Do not add any bingbot or Googlebot restriction. Bing explicitly lists "Blocking Bingbot" as something to avoid, and Copilot relies on it.
- Do not add noarchive or nocache in production. Either one removes or limits Copilot use. The `nocache` in `layout.tsx` applies only when indexing is off, which is fine.
- Do not add a Microsoft "training" token. None exists. On Bing, training is controlled only by NOARCHIVE or NOCACHE, which would also cost Copilot visibility.
- Keep ChatGPT-User and Claude-User allowed. Groups for Perplexity-User and Meta-ExternalFetcher would be cosmetic only: both are documented as able to bypass robots.txt, and they already get the `*` rules.
- No group is needed for DuckAssistBot, Meta-WebIndexer, MistralAI-Index, GoogleOther or Google-CloudVertexBot. They are allowed via `*`, which matches the "allow AI search" policy.

**Small hygiene points (Google robots.txt spec, updated 2026-08-31: https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec):**
- `host:` is not a supported field ("Other fields such as crawl-delay aren't supported"). Google ignores it, so it is harmless. Removing it is optional.
- Paths are prefix matches: "`/fish` matches ... `/fishheads`". So `/review`, `/account`, `/admin`, `/dashboard`, `/sign-in` and `/sign-up` would also block any future public URL starting with those strings (e.g. `/reviewing-...`). No collision exists today. Use a trailing `/` or a `$` anchor if public routes with those prefixes are added.
- Each crawler obeys only its single most specific group; groups are not combined. Every named group must therefore repeat `privateAreas`, which robots.ts already does.
- Most disallowed paths also carry `noindex` in their page metadata. Per Google, a crawler blocked by robots.txt never sees that noindex. This is fine for paths with no index history; if any of them ever gets indexed, unblock it so the noindex can be read.
