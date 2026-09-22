# SEO, crawler and structured-data policy

**Verified on:** 2026-09-18 · **Compiled:** 2026-09-21 · **Source record:**
`content/exam-specs/_raw/seo-crawler-policy.draft.json`

> **One source could not be verified.** Bing's own Webmaster Guidelines page
> (`bing.com/webmasters/help/webmaster-guidelines-30fba23a`) is a client-side-rendered shell and
> returned only a page title, twice. Every Bing-specific statement below therefore rests on the
> fetchable Bing Webmaster Blog alone and is flagged. Do not quote that URL as though we read it.

## Headline findings

Verification pass run 2026-09-18 against first-party provider documentation only (Google Search Central, OpenAI developers.openai.com, Anthropic support.claude.com, Perplexity docs, Apple support, Bing blog, schema.org). Headline findings: (1) The robots.txt-vs-noindex distinction is confirmed verbatim — Disallow blocks crawling but a disallowed URL "can still be indexed if linked to from other sites", while noindex only works if the page is NOT blocked by robots.txt; Google also does not support a noindex field in robots.txt (only user-agent, allow, disallow, sitemap; crawl-delay is unsupported). Neither is access control — Google tells you to password-protect private files. (2) AI crawlers must be split three ways: model-training (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended), AI-search grounding/indexing (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot, Googlebot, bingbot), and user-triggered fetch (ChatGPT-User, Claude-User, Perplexity-User). Blocking a training bot does NOT remove you from that vendor's AI search, and ChatGPT-User and Perplexity-User are documented as not bound by robots.txt. (3) Structured data has changed materially and several types our brief assumed are dead: FAQ rich results were restricted to government/health sites in 2023 and are no longer shown at all (changelog May 2026); practice-problems markup documentation was removed January 2026; Course info was removed September 2025; sitelinks searchbox (WebSite + SearchAction) was deprecated November 2024. What survives and fits this product: BreadcrumbList, Organization, Course (course list carousel, min. 3 courses), and Quiz/education Q&A flashcards. (4) Google states in writing that no machine-readable AI file, llms.txt, or special schema is used by Google Search, and that indexing and serving are never guaranteed — so guaranteed-citation and guaranteed-ranking claims are unsupportable. Two sources could not be verified: developers.google.com/search/docs/crawling-indexing/google-common-crawlers answered on Google-Extended and the crawler roster but Bing's own Webmaster Guidelines page (bing.com/webmasters/help/webmaster-guidelines-30fba23a) is a JS shell and returned no text, so Bing guidance here rests on the fetchable Bing Webmaster Blog only and is marked accordingly.

---

## 1. Crawler policy

The single most important structural point: **AI crawlers split three ways, and the tiers are
controlled by different tokens.** Blocking a vendor's *training* crawler does **not** remove you
from that vendor's *AI search*, and a blanket "block all AI bots" rule destroys discovery while
buying no training protection at all.

- **Model training** — `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`
- **AI-search grounding and indexing** — `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`,
  `Applebot`, `Googlebot`, `bingbot`
- **User-triggered fetch** — `ChatGPT-User`, `Claude-User`, `Perplexity-User`

Two of the user-triggered fetchers are documented as **not bound by robots.txt**, which is direct
evidence for the principle that runs through this whole document: crawler directives are requests,
not enforcement.

| User-agent | Operator | Purpose | Obeys robots.txt | Our policy | Source |
| --- | --- | --- | --- | --- | --- |
| `Googlebot` | Google | search-indexing | Yes — Google's common crawlers documentation states they always obey robots.txt when crawling automatically. | **Allow** — Primary organic discovery channel for the public exam guides, lessons and worked examples. Must be allowed on all public routes; blocked only from private/app routes. Note that blocking Googlebot from a path also blocks it from seeing any noindex on that path. | <https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers> |
| `Google-Extended` | Google | model-training | Yes — documented as a robots.txt-controllable token; it is a control signal only, not a distinct fetching crawler. | **Allow — decision required** — Controls whether crawled content may train future Gemini models and ground answers in Gemini apps / Vertex AI. Google states explicitly it does NOT affect Search inclusion or ranking, so disallowing it is safe for SEO — but it also forfeits grounding visibility in Gemini surfaces. This is a business call, not a technical one: allow it if we want Gemini-surface presence for our free public guides, disallow it if leadership wants original question banks kept out of foundation-model training. Flag for an explicit decision; do not let it default silently. | <https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers> |
| `GoogleOther` | Google | mixed | Yes — covered by the same statement that Google's common crawlers always obey robots.txt. | **Allow** — A generic token used by various Google teams for one-off crawls and R&D fetches. Documented in the common-crawlers roster; no evidence it affects Search. No reason to block it for a public educational site, and blocking yields no SEO benefit. | <https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers> |
| `GPTBot` | OpenAI | model-training | Yes — OpenAI documents GPTBot as obeying robots.txt, and disallowing it is the documented training opt-out. | **Disallow** — This is the training crawler, and OpenAI documents that blocking it is how you signal training opt-out. Crucially, blocking GPTBot does NOT remove us from ChatGPT search — that is governed separately by OAI-SearchBot. So we can withhold our original question banks and explanations from foundation-model training while keeping full ChatGPT-search visibility. Recommend disallow as the default for an original-content exam-prep business. | <https://developers.openai.com/api/docs/bots> |
| `OAI-SearchBot` | OpenAI | ai-search-grounding | Yes — documented as obeying robots.txt; disallowing it removes the site from ChatGPT search answers. | **Allow** — This is the crawler that makes us appear and be linked in ChatGPT's search features. For a discovery-dependent exam-prep site this is a channel we want. Must be explicitly allowed and must NOT be lumped into a blanket AI-bot block — that is the single most common self-inflicted mistake in this area. | <https://developers.openai.com/api/docs/bots> |
| `ChatGPT-User` | OpenAI | user-triggered-fetch | Not reliably — OpenAI documents it as not an automatic crawler and says robots.txt rules may not apply, since a human requested the fetch. | **Allow** — Fires when a real user or a Custom GPT opens one of our pages during a conversation — effectively a referred visitor. Blocking it is both undesirable (it is genuine user demand for our guides) and unreliable (OpenAI states robots.txt may not apply). Any real protection for learner data must come from server-side auth, not robots.txt. | <https://developers.openai.com/api/docs/bots> |
| `OAI-AdsBot` | OpenAI | unknown | Yes — documented as obeying robots.txt. | **Allow** — Validates ad safety and relevance; OpenAI states the data is not used to train foundation models. We run no advertising in the initial release, so this is informational only — no action needed, and no reason to block. | <https://developers.openai.com/api/docs/bots> |
| `ClaudeBot` | Anthropic | model-training | Yes — Anthropic documents robots.txt compliance and additionally honors the Crawl-delay extension. | **Disallow** — The training-oriented crawler. Same reasoning as GPTBot: disallowing it withholds our original questions and explanations from model training while leaving Claude-SearchBot and Claude-User free to surface and fetch our public pages. Anthropic also supports Crawl-delay if we prefer throttling over blocking. | <https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler> |
| `Claude-SearchBot` | Anthropic | ai-search-grounding | Yes — documented as respecting robots.txt directives. | **Allow** — Indexes pages to improve the relevance and accuracy of Claude's search responses. This is the Anthropic analogue of OAI-SearchBot — an AI-search discovery channel, distinct from training. Allow explicitly. | <https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler> |
| `Claude-User` | Anthropic | user-triggered-fetch | Yes — Anthropic documents this agent as respecting robots.txt, which differs from OpenAI's and Perplexity's user-triggered fetchers. | **Allow** — Fetches a page because a Claude user's question needs it — genuine user-driven demand for our exam guides. Allow. Worth noting internally that Anthropic claims robots.txt compliance here whereas ChatGPT-User and Perplexity-User explicitly do not, so behaviour is not uniform across vendors. | <https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler> |
| `PerplexityBot` | Perplexity | ai-search-grounding | Yes — Perplexity documents it as respecting robots.txt and advises allowing it for visibility. | **Allow** — Perplexity states this bot surfaces and links sites in Perplexity results and is explicitly not used for foundation-model training. It is a pure discovery channel for our public guides — allow. | <https://docs.perplexity.ai/guides/bots> |
| `Perplexity-User` | Perplexity | user-triggered-fetch | No — Perplexity documents that this fetcher generally ignores robots.txt because the fetch was requested by a user. | **Allow** — User-initiated page visit during a Perplexity answer. Allow it — and note the documented robots.txt non-compliance as direct evidence for the policy principle that robots.txt is advisory and never a security boundary for our learner dashboards. | <https://docs.perplexity.ai/guides/bots> |
| `Applebot` | Apple | search-indexing | Yes — controllable via robots.txt. | **Allow** — Powers Spotlight, Siri and Safari search suggestions. A legitimate organic discovery channel for international students on Apple devices — allow on all public routes. | <https://support.apple.com/en-us/119829> |
| `Applebot-Extended` | Apple | model-training | Yes — it is a robots.txt-only control token that modifies how already-crawled Applebot data may be used. | **Disallow** — Pure training opt-out with zero search cost: Apple states pages that disallow Applebot-Extended can still appear in search results. Consistent with our GPTBot/ClaudeBot stance, disallow it. Note the mechanism differs from other vendors — it does not fetch anything itself, it only governs use of Applebot's crawl. | <https://support.apple.com/en-us/119829> |
| `bingbot` | Microsoft | search-indexing | Reported yes by Microsoft, but UNVERIFIED in this session — the statement could not be pulled from Bing's own Webmaster Guidelines page because it renders client-side and returned no body text. | **Allow** — Bing indexing also feeds Microsoft Copilot surfaces, so it is worth allowing on all public routes. The verifiable fact from Bing's own blog is the Chrome/Edge-based user agent and that Bing keeps its renderer on recent stable Edge; the robots.txt-compliance and guideline details remain unverified here and should be re-checked with a JS-capable browser before being quoted to stakeholders. | <https://blogs.bing.com/webmaster/april-2022/Announcing-user-agent-change-for-Bing-crawler-bingbot> |

### The one open business decision

`Google-Extended` is marked **allow-with-note** and must not be allowed to default silently. It
controls whether our crawled content may train future Gemini models and ground answers in Gemini
apps and Vertex AI. Google states explicitly that it **does not affect Search inclusion or
ranking**, so disallowing it is free from an SEO standpoint — but it forfeits grounding visibility
on Gemini surfaces. Allow it if we want that presence for our free public guides; disallow it if
leadership wants original question banks kept out of foundation-model training. Either way,
someone has to decide on the record.

---

## 2. Search-indexing guidance

### Crawlable content and no guarantee of indexing

Google Search Essentials is the baseline: make links crawlable, create helpful people-first content, and meet the technical requirements. Critically, compliance guarantees nothing — plan content strategy around eligibility, never around promised placement.

> "Just because a page meets all of these requirements and best practices, doesn't mean that Google will crawl, index, or serve its content."

Source: <https://developers.google.com/search/docs/essentials>

### JavaScript rendering / Next.js server rendering

Google processes JS apps in three phases (crawling, rendering, indexing) but explicitly still recommends server-side or pre-rendering. For our Next.js public exam guides this means SSG/SSR (App Router server components or static export), not client-only data fetching. Also: do not try to flip a noindex robots meta tag with client JS — Google may skip rendering entirely when it sees noindex in the initial HTML.

> "server-side or pre-rendering is still a great idea because it makes your website faster for users and crawlers"

Source: <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>

### robots.txt limits — Disallow does not deindex

This is the load-bearing correction for our policy. A robots.txt Disallow stops crawling but does not remove the URL from the index; it can still surface (typically URL-only, no snippet) if linked externally. Google's stated alternatives are noindex, password protection, or removing the page.

> "A page that's disallowed in robots.txt can still be indexed if linked to from other sites."

Source: <https://developers.google.com/search/docs/crawling-indexing/robots/intro>

### robots.txt is not access control

Google directs site owners to server-side authentication for anything private. Our learner dashboards, attempts, study plans and admin screens must be protected by session auth and server-side authorization — robots.txt and noindex are discoverability controls, not security controls, and robots.txt is itself a public file that advertises the paths it names.

> "Use other blocking methods, such as password-protecting private files on your server"

Source: <https://developers.google.com/search/docs/crawling-indexing/robots/intro>

### noindex requires the page to be crawlable

The trap: you cannot combine Disallow and noindex on the same URL and expect removal. If the path is disallowed, the crawler never sees the noindex tag or header. To deindex, allow crawling and serve noindex (meta tag or X-Robots-Tag) until the URL drops out.

> "If the page is blocked by a robots.txt file or the crawler can't access the page, the crawler will never see the noindex rule."

Source: <https://developers.google.com/search/docs/crawling-indexing/block-indexing>

### noindex prerequisite, stated affirmatively

Google states the precondition directly for both the meta tag and the X-Robots-Tag header form. For non-HTML assets (PDF worked-example downloads, generated score reports) the X-Robots-Tag HTTP header is the only mechanism, since there is no HTML head to put a meta tag in.

> "the page or resource must not be blocked by a robots.txt file, and it has to be otherwise accessible to the crawler"

Source: <https://developers.google.com/search/docs/crawling-indexing/block-indexing>

### Supported robots.txt fields — no noindex, no crawl-delay (Google)

Google parses only user-agent, allow, disallow and sitemap. A `Noindex:` line in robots.txt is not a thing and must never be shipped. Crawl-delay is ignored by Google (though Anthropic's docs say ClaudeBot honors it), so do not rely on it for rate control — use Search Console crawl-rate tooling and server-side rate limiting instead.

> "Google supports the following fields (other fields such as crawl-delay aren't supported)"

Source: <https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt>

### Canonical URLs

rel=canonical is a strong signal, not a directive — Google may still pick a different canonical. Practical rules for our exam guides: self-referencing canonical on every indexable page, one absolute canonical per URL, and never let the sitemap and the link element disagree. Relevant to us because exam-guide pages will be reachable with tracking params, filter params and trailing-slash variants.

> "Don't specify different URLs as canonical for the same page using different canonicalization techniques."

Source: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>

### Self-referencing canonical is recommended

Google explicitly endorses the self-referential canonical, which is the pattern to implement in the Next.js metadata API (alternates.canonical) on every public page.

> "Do include a rel="canonical" link on the canonical page itself (also known as a self-referential canonical)."

Source: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>

### Sitemaps — discovery aid, not an indexing guarantee

Sitemaps help discovery and are worth generating (Next.js sitemap.ts) for our exam guides, lessons and worked examples. They must list only canonical, indexable, 200-status URLs — never dashboard or admin routes. Do not promise clients that sitemap inclusion equals indexation.

> "A sitemap helps search engines discover URLs on your site, but it doesn't guarantee that all the items in your sitemap will be crawled and indexed."

Source: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview>

### Snippet controls also govern Google's AI features

nosnippet / max-snippet / data-nosnippet are now dual-purpose: they restrict classic snippets AND restrict use of the content as direct input to AI Overviews and AI Mode. Editorial implication — if we ever want to withhold full worked solutions from AI surfaces while staying indexed, data-nosnippet around the solution body is the documented lever. Applying nosnippet sitewide would suppress our snippets, so scope it deliberately.

> "will also prevent the content from being used as a direct input for AI Overviews and AI Mode"

Source: <https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag>

### No special optimization for AI Overviews / AI Mode

Google states there is no separate AI-optimization track: the same technical requirements, policies and helpful-content practices apply. This kills any 'AEO/GEO special sauce' framing in our marketing copy.

> "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."

Source: <https://developers.google.com/search/docs/appearance/ai-features>

### No AI-specific files or schema needed for Google

Google's generative-AI optimization guide states plainly that no machine-readable AI file, Markdown mirror, or special markup is used by Google Search, and that such files neither help nor harm. This is the primary citation against shipping llms.txt as an SEO deliverable.

> "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search."

Source: <https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>

### Structured data is not required for AI search

Google says structured data is not required for generative AI search and there is no special schema for it — but recommends keeping it for rich-result eligibility. So we implement schema for rich results and site understanding, and we do not sell it as an AI-visibility mechanism.

> "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."

Source: <https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>

### Indexing and serving are never guaranteed

Restates the no-guarantee principle in the AI context. Use this line verbatim in our internal claims policy to block any 'we will get you cited/ranked' language.

> "Indexing and serving aren't guaranteed."

Source: <https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>

### Structured data never guarantees a rich result

Valid markup earns eligibility only. Also: do not mark up content that is not visible on the page — for our Quiz/flashcard markup, the question and answer text must actually be rendered to the user on that URL, not hidden behind a JS interaction or a login.

> "Google does not guarantee that your structured data will show up in search results, even if your page is marked up correctly"

Source: <https://developers.google.com/search/docs/appearance/structured-data/sd-policies>

### Bing — bingbot user agent and rendering engine

Bing's official Webmaster Guidelines page could not be verified (see fetchedOk=false entry below). What is verifiable from Bing's own blog: bingbot's current user-agent is Chrome/Edge-based and Bing keeps its rendering engine on a recent stable Edge build, which implies modern JS rendering support — but the server-rendered approach we already require for Google covers Bing too.

> "regularly updating our web page rendering engine to the most recent stable version of Microsoft Edge"

Source: <https://blogs.bing.com/webmaster/april-2022/Announcing-user-agent-change-for-Bing-crawler-bingbot>

### Bing Webmaster Guidelines — UNVERIFIED

UNVERIFIED. bing.com/webmasters/help/webmaster-guidelines-30fba23a is a client-side-rendered SPA and returned only the page title with no documentation body, twice. No Bing guideline text on canonicals, sitemaps, robots.txt or JS rendering is quotable from this session. Treat all Bing-specific guidance as unconfirmed until someone retrieves it with a rendering browser. Do not cite this URL as if we read it.

Source: <https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a> — **could not be fetched; nothing here is quotable**

---

## 3. Structured data

### Types we will use

Required properties are Google's, as of the verification date. "Rich-result eligibility" is stated
per type because several types produce no SERP feature at all — and **valid markup only ever earns
eligibility, never a guaranteed rich result.**

| Type | Use it for | Required properties | Rich-result eligibility as of 2026-09-18 | Source |
| --- | --- | --- | --- | --- |
| `BreadcrumbList` | Every public page below the root — exam hub, section, topic, lesson, worked example. Reinforces the Exam > Section > Topic > Lesson hierarchy and is one of the few genuinely stable rich results left. | `itemListElement`, `itemListElement.position`, `itemListElement.name`, `itemListElement.item (not required on the final item)` | Eligible for a real rich result (the breadcrumb trail in the SERP). The visible on-page breadcrumb must match the markup. Position 1 is the start of the trail; item is omitted on the last element because it is the current page. Rich result still never guaranteed. | <https://developers.google.com/search/docs/appearance/structured-data/breadcrumb> |
| `Organization` | Homepage or a single About page only — our brand name, logo, URL, description and contact details. Helps Google disambiguate a new neutral-brand exam-prep site from established test makers. | _Google states none — add what applies_ | Google states there are NO required properties — add what applies. This is NOT a rich-result feature in the usual sense; it feeds knowledge-panel and entity understanding. Do not repeat it on every page; Google recommends the homepage or a single about-us page. Must never imply affiliation with or endorsement by College Board, ACT, LSAC, GMAC, ETS or Bocconi. | <https://developers.google.com/search/docs/appearance/structured-data/organization> |
| `Course (course list carousel)` | An exam hub page that lists our study tracks — e.g. a Digital SAT hub listing its courses, or a top-level page listing tracks across all six exams. This is the surviving Course feature. | `name`, `description` | Only `name` and `description` are required; `provider` (Organization) is recommended. You must mark up at least three courses and include carousel markup on a summary page or an all-in-one page. Description has a 60-character display limit. Course names may not contain promotional phrases, prices or discounts — relevant because our initial release is free and the temptation to write 'Free!' into the name must be resisted. Important: this is the Course LIST feature; the separate 'Course info' rich result was removed from Google Search in September 2025, so do not build to that spec. | <https://developers.google.com/search/docs/appearance/structured-data/course> |
| `Quiz (education Q&A / flashcards)` | Flashcard-style concept-recall content on public topic pages — vocabulary, formulas, logical-reasoning term definitions. The best-fitting live rich result for an exam-prep product, and still actively expanding (added languages through 2025). | `Quiz.hasPart (Question)`, `Question.eduQuestionType (fixed value: "Flashcard")`, `Question.text`, `Question.acceptedAnswer` | Recommended (not required): Quiz.about, Quiz.about.name, Quiz.educationalAlignment with alignmentType of educationalSubject or educationalLevel, and targetName. Exactly one acceptedAnswer per Question. Two hard constraints for us: (a) Google's structured-data policy forbids marking up content not visible to readers, so the flashcard text must be rendered on the public page, not behind a login or a JS reveal; (b) this must be built from ORIGINAL concept flashcards only — never official test-maker questions, passages or answer keys. Question requirements here differ from QAPage's Question. | <https://developers.google.com/search/docs/appearance/structured-data/education-qa> |
| `Article / BlogPosting` | Editorial exam guides, admissions explainers and strategy posts. Use Article or BlogPosting; NewsArticle does not fit our content. | _Google states none — add what applies_ | Google states there are no required properties — add what applies. Article markup is NOT a prerequisite for any rich result; it exists to help Google understand the page. Recommended properties worth shipping anyway: author (Person or Organization), datePublished, dateModified, headline, image. For an admissions-facts product, an accurate dateModified plus a visible 'last reviewed' date is an editorial trust asset independent of any SEO value. | <https://developers.google.com/search/docs/appearance/structured-data/article> |
| `LearningResource (schema.org, plus teaches / educationalLevel / educationalAlignment)` | Optional semantic enrichment on lesson and worked-example pages, layered onto a primary CreativeWork type. Communicates learning intent, level and skill coverage to consumers other than Google Search. | _Google states none — add what applies_ | This is schema.org vocabulary, NOT a Google rich-result feature — it does not appear in Google's structured data gallery and will produce no SERP enhancement. schema.org says it is expected to be used as an addition to a primary type, and that Quiz and Syllabus are more specific subtypes of it. Ship it only as low-cost machine-readable description; never budget or forecast traffic against it. | <https://schema.org/LearningResource> |

### Types we will not ship — retired, removed or unverified

This is the fastest-moving part of the whole document. **Four features our brief assumed were
viable were deprecated between November 2024 and June 2026.** Any inherited template or older SEO
playbook recommending them is now wrong, and the practice-problem type in particular is the most
tempting trap for an exam-prep product.

| Type | Use it for | Required properties | Rich-result eligibility as of 2026-09-18 | Source |
| --- | --- | --- | --- | --- |
| `FAQPage — DO NOT SHIP` | Nothing. Retired. Any FAQ blocks on our exam guides should be built as good on-page content with no FAQPage markup dependency. | `Question`, `acceptedAnswer`, `name`, `text` | DEAD FEATURE — this is the item our brief flagged as changed, and it changed twice. Restricted in September 2023 to well-known authoritative government and health websites, then the rich result stopped being shown in Google Search entirely per the May 2026 changelog, with the documentation removed in June 2026. FAQPage is also absent from the current structured data gallery. An exam-prep site would never have qualified even under the 2023 restriction. Do not promise FAQ rich results to anyone. | <https://developers.google.com/search/docs/appearance/structured-data/faqpage> |
| `Practice problems (Math solvers / practice-problem markup) — DO NOT SHIP` | Nothing. Removed. Use Quiz / education Q&A flashcard markup for our practice content instead. | _Google states none — add what applies_ | DEAD FEATURE, and the most tempting trap for this specific product. A deprecation notice was posted 5 November 2025, the type was dropped from Search Console reporting and the Rich Result Test in January 2026, and the documentation was removed on 6 January 2026. It does not appear in the current structured data gallery. Any older SEO playbook recommending practice-problem markup for an exam-prep site is now wrong. | <https://developers.google.com/search/docs/appearance/structured-data/practice-problems> |
| `Course info — DO NOT SHIP` | Nothing. Removed. Use the Course list carousel spec above. | _Google states none — add what applies_ | DEAD FEATURE. Deprecation notice added June 2025; documentation removed September 2025 alongside estimated salary, learning video, special announcement and vehicle listing, with Google stating these types are no longer shown in Google Search results. Easy to confuse with the still-live Course list feature — they are different specs. | <https://developers.google.com/search/docs/appearance/structured-data/course-info> |
| `WebSite + SearchAction (sitelinks searchbox) — DO NOT SHIP` | Nothing. Deprecated. A plain WebSite node without SearchAction is harmless but earns nothing. | _Google states none — add what applies_ | DEAD FEATURE. Google announced on 29 November 2024 that the sitelinks search box is no longer available in Google Search results. Our on-site question search should still exist for users — it simply will not surface as a SERP searchbox, so do not let anyone justify search-UI work on this basis. | <https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox> |
| `EducationalOccupationalCredential — NOT VERIFIED, DO NOT SHIP` | Nothing for us. It describes credentials/qualifications (degrees, certifications), not exam-preparation content, and we award no credential. | _Google states none — add what applies_ | UNVERIFIED — I did not fetch a schema.org or Google page for this type in this session, so no property list is asserted. What IS verified is that it does not appear among the features in Google's current structured data gallery, so it carries no rich-result eligibility. It is also a poor semantic fit: we are a preparation platform, not an awarding body, and using credential markup risks implying we confer or are accredited for a qualification. Drop it from the plan. | <https://developers.google.com/search/docs/appearance/structured-data/search-gallery> |

### Two constraints that apply to all of our markup

1. **Never mark up content that is not visible to the reader.** For the Quiz / flashcard markup in
   particular, the question and answer text must actually be rendered on the public URL — not
   behind a login, not behind a JS reveal.
2. **Never imply affiliation with, endorsement by, or official status from** College Board, ACT,
   LSAC, GMAC, ETS or Università Bocconi. This constrains `Organization` markup, page titles and
   any "official" phrasing. It is a legal and trust requirement, not an SEO preference.

---

## 4. `robots.txt` — ready to use

A working file for a site with public guides and private dashboards. Annotated, and written to the
tiering decision above.

> **Read this before editing the file.**
>
> - **`noindex` is not access control, and neither is `Disallow`.** Google's own guidance is to
>   password-protect private files on the server. Our learner dashboards, attempts, study plans and
>   admin screens are protected by session auth and server-side authorization. Crawler directives
>   are discoverability controls only.
> - **`robots.txt` is a public file.** Anyone can fetch it, and it advertises every path it names.
>   Do not list sensitive internal paths in it — rely on auth for anything that must stay private.
> - **`Disallow` does not deindex.** A disallowed URL can still be indexed if another site links to
>   it, typically as a bare URL with no snippet.
> - **`Disallow` + `noindex` on the same URL is self-defeating.** A crawler that cannot fetch the
>   page never sees the `noindex`. To deindex, allow crawling and serve `noindex` until the URL
>   drops out.

```txt
# https://example.com/robots.txt
# Public file. Anything named here is public knowledge. Real protection is server-side auth.
# Last reviewed: 2026-09-18

# ---------------------------------------------------------------------------
# Private paths. Reused verbatim by every group below.
# These are ALSO behind session auth + server-side authorization. This block is
# crawl-budget hygiene, not security.
# NOTE: do not Disallow a path here if the goal is to DEINDEX it. A disallowed
# page can never be crawled, so its noindex header can never be read. For paths
# with existing index history use: auth + X-Robots-Tag noindex, and no Disallow.
# ---------------------------------------------------------------------------

# === Search engines: allow all public content ==============================

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

User-agent: GoogleOther
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

User-agent: bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

# Applebot powers Spotlight, Siri and Safari suggestions. Organic discovery.
User-agent: Applebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

# === AI search + grounding: ALLOW. These are discovery channels. ===========
# Blocking these is the single most common self-inflicted mistake in this area.
# OAI-SearchBot is what makes us appear and be linked in ChatGPT search.
# Claude-SearchBot is Anthropic's equivalent. PerplexityBot is documented as
# NOT being used for foundation-model training.

User-agent: OAI-SearchBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

User-agent: Claude-SearchBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

User-agent: PerplexityBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

# === User-triggered fetchers: ALLOW. This is a real person opening our page. =
# Claude-User is documented as respecting robots.txt.
# ChatGPT-User and Perplexity-User are documented as NOT reliably bound by it,
# so these two groups are a courtesy signal, not a control. Anything that must
# stay private is protected by auth, not by the lines below.

User-agent: ChatGPT-User
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

User-agent: Claude-User
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

User-agent: Perplexity-User
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

# OAI-AdsBot validates ad safety/relevance and is documented as not training
# foundation models. We run no advertising; informational only, no reason to block.
User-agent: OAI-AdsBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

# === Model training: DISALLOW. ============================================
# Keeps our original question banks and explanations out of training corpora.
# Blocking these does NOT remove us from ChatGPT search, Claude search,
# Perplexity or Apple search — those are the separate tokens allowed above.
# Anthropic also honours Crawl-delay if we ever prefer throttling to blocking.

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

# Applebot-Extended fetches nothing itself; it governs how Applebot's existing
# crawl may be used. Apple states pages that disallow it can still appear in
# search results, so this is a training opt-out at zero search cost.
User-agent: Applebot-Extended
Disallow: /

# === Google-Extended: OPEN DECISION — see section 1. ======================
# Controls Gemini training AND Gemini/Vertex grounding. Google states it does
# not affect Search inclusion or ranking either way. Uncomment the Disallow to
# opt out of training, at the cost of Gemini-surface grounding visibility.
#
# User-agent: Google-Extended
# Disallow: /

# === Everything else =======================================================
# A default group so unknown crawlers still get the private-path list.
# Deliberately NOT a blanket "Disallow: /" — that would be the generic
# "block all AI bots" snippet this policy exists to prevent.

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /attempts/
Disallow: /study-plan/
Disallow: /settings/
Disallow: /auth/

# Google parses only: user-agent, allow, disallow, sitemap.
# There is deliberately NO "Noindex:" line here — Google does not support one.
# There is deliberately NO "Crawl-delay:" line for Google — explicitly unsupported.
# (Anthropic does honour Crawl-delay, so it is vendor-specific, never universal.)
# Use Search Console crawl-rate tooling and server-side rate limiting instead.

Sitemap: https://example.com/sitemap.xml
```

---

## 5. Claims we will never make

Reproduced from the source record's `debunked[]` list. This is the claims-policy gate for
editorial, marketing and any client-facing SEO deliverable. Use "eligible for" and "may appear as",
never "will rank" or "will be featured".

- NEVER claim guaranteed or 'ensured' citation in ChatGPT, Claude, Perplexity, Gemini or Google AI Overviews. No provider offers any such guarantee. Google states outright that 'Indexing and serving aren't guaranteed' (developers.google.com/search/docs/fundamentals/ai-optimization-guide) and that meeting every requirement still doesn't mean Google will crawl, index or serve the content (developers.google.com/search/docs/essentials). Allowing OAI-SearchBot, Claude-SearchBot and PerplexityBot buys eligibility to be retrieved, nothing more.
- NEVER claim guaranteed rankings or guaranteed position in organic search. Same two Google citations. Our public marketing and any client-facing SEO deliverable must use 'eligible for' / 'may appear as', never 'will rank' or 'will be featured'.
- NEVER present llms.txt as a supported discovery mechanism. As of 2026-09-18 no major provider has officially adopted it. Google's own generative-AI optimization guide states you don't need to create machine-readable files, AI text files, markup or Markdown to appear in Google Search, and that Google Search itself doesn't use them — and that such files neither help nor harm visibility or rankings (developers.google.com/search/docs/fundamentals/ai-optimization-guide). Secondary reporting (searchenginejournal.com, seroundtable.com — isOfficial=false, located via search only) says Gary Illyes stated Google does not support llms.txt and has no plans to, and that John Mueller likened it to the meta keywords tag. We may ship an llms.txt as a harmless courtesy file if someone insists, but it must never be listed as a deliverable that drives AI visibility.
- NEVER refer to 'AI schema', 'AEO schema', 'GEO markup' or any AI-specific structured-data standard. No such standard exists. Google states 'Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add' (developers.google.com/search/docs/fundamentals/ai-optimization-guide), and 'There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary' (developers.google.com/search/docs/appearance/ai-features). Structured data is justified by rich-result eligibility and machine readability only.
- NEVER claim FAQPage markup will produce FAQ rich results. The feature was restricted to authoritative government and health sites in 2023 and is no longer shown in Google Search at all (developers.google.com/search/docs/appearance/structured-data/faqpage). Any proposal citing FAQ rich results is working from stale guidance.
- NEVER claim practice-problem structured data will surface our practice questions in Search. The type was deprecated in November 2025 and its documentation removed in January 2026 (developers.google.com/search/docs/appearance/structured-data/practice-problems). Use Quiz / education Q&A flashcards instead.
- NEVER claim a sitemap entry causes indexing. Google: a sitemap 'doesn't guarantee that all the items in your sitemap will be crawled and indexed' (developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
- NEVER claim rel=canonical forces Google's URL choice. It is documented as a strong signal, not a directive, and Google may select a different canonical (developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- NEVER claim robots.txt Disallow removes a page from Google's index or protects private data. Google: 'A page that's disallowed in robots.txt can still be indexed if linked to from other sites', and it directs owners to password-protect private files instead (developers.google.com/search/docs/crawling-indexing/robots/intro). robots.txt is a public file that advertises the very paths it names.
- NEVER combine Disallow and noindex on the same URL expecting removal — it is self-defeating. Google: 'If the page is blocked by a robots.txt file or the crawler can't access the page, the crawler will never see the noindex rule' (developers.google.com/search/docs/crawling-indexing/block-indexing).
- NEVER ship a 'Noindex:' or 'Crawl-delay:' line in robots.txt expecting Google to honour it. Google supports only user-agent, allow, disallow and sitemap, and explicitly states crawl-delay isn't supported (developers.google.com/search/docs/crawling-indexing/robots/robots_txt). Anthropic separately does honour Crawl-delay, so it is vendor-specific, not universal.
- NEVER claim that blocking training crawlers protects us from AI systems reading our pages. ChatGPT-User is documented as not an automatic crawler with robots.txt rules that may not apply, and Perplexity-User 'generally ignores robots.txt rules' (developers.openai.com/api/docs/bots, docs.perplexity.ai/guides/bots). Crawler directives are requests, not enforcement.
- NEVER conflate blocking a training crawler with disappearing from that vendor's AI search. Blocking GPTBot does not remove us from ChatGPT search (that is OAI-SearchBot); blocking Google-Extended does not affect Google Search inclusion or ranking; pages disallowing Applebot-Extended can still appear in Apple search results. A blanket 'block all AI bots' rule would silently destroy AI-search discovery for no training-protection gain.
- NEVER imply affiliation with, endorsement by, or official status from College Board, ACT, LSAC, GMAC, ETS or Università Bocconi. We publish independent preparation material with original questions. This is a legal and trust requirement, not an SEO preference, and it constrains Organization markup, page titles, and any 'official' phrasing.

---

## 6. Implementation checklist

1. Render all public exam guides, lessons and worked examples server-side or statically in Next.js (App Router server components / generateStaticParams), never client-only fetch — Google still recommends server-side or pre-rendering, and it also covers bingbot and any non-JS AI fetcher.
2. Ship a self-referencing absolute canonical on every public page via the Next.js metadata API (alternates.canonical). One canonical per URL, and make sure sitemap URLs and canonical tags never disagree.
3. Generate sitemap.xml from the content layer (app/sitemap.ts) containing ONLY canonical, indexable, 200-status public URLs. Explicitly exclude /dashboard, /attempts, /study-plan, /admin, /api and all auth routes. Reference the sitemap from robots.txt with an absolute URL.
4. robots.txt — search engines: allow crawling of all public content; Disallow: /api/, /admin/, /dashboard/, /attempts/, /study-plan/, /settings/, /auth/ and any query-parameter trap paths. Do NOT add a Noindex: or Crawl-delay: line for Google (unsupported).
5. robots.txt — AI crawler tiering, the core policy decision. ALLOW the AI-search/grounding tier (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot) and the user-triggered tier (ChatGPT-User, Claude-User, Perplexity-User) on public paths — these are discovery channels. DISALLOW the training tier (GPTBot, ClaudeBot, Applebot-Extended) if leadership wants original question banks kept out of foundation-model training. Escalate Google-Extended as an explicit product decision (training + Gemini grounding; zero Search cost either way). Apply the same private-path Disallow list to every AI user-agent group.
6. Never write a blanket 'User-agent: * Disallow' AI block or copy a generic 'block all AI bots' snippet. It would remove us from ChatGPT search, Claude search and Perplexity while buying nothing, because training access is governed by separate tokens.
7. Treat robots.txt as public documentation of our URL structure. Do not name sensitive internal paths in it; rely on auth for anything that must stay private.
8. Enforce real access control on every private surface: server-side session checks plus authorization on dashboards, attempts, study plans and admin screens, and on the API routes behind them. Return 401/403 or redirect for unauthenticated requests. noindex is NOT access control — state this explicitly in the engineering acceptance criteria.
9. Serve X-Robots-Tag: noindex, nofollow (or the meta robots equivalent) on authenticated app routes, and CRUCIALLY do not also Disallow those exact paths in robots.txt if the goal is deindexing — a crawler that cannot fetch the page can never read the noindex. Decide per path: auth + noindex (crawlable, deindexable) for anything that may already be indexed; auth + Disallow for crawl-budget control on paths with no index history.
10. Use X-Robots-Tag HTTP headers (not meta tags) for non-HTML assets such as downloadable PDF worked examples and generated score reports, since those have no HTML head.
11. Add noindex to thin, duplicative or utility pages: internal search results, paginated filter permutations, tag pages with no unique content, and any preview/staging environment (protect staging with HTTP auth as well — noindex alone has leaked before).
12. Implement BreadcrumbList on every public page below the root, mirroring a visible on-page breadcrumb (Exam > Section > Topic > Lesson).
13. Implement Organization on the homepage or a single About page only — name, url, logo, description, contact. Do not duplicate it sitewide. Wording must make our independence from the test makers unmistakable.
14. Implement Course (course list carousel) on exam hub pages listing study tracks: at least three courses, name + description required (60-char display limit on description), provider recommended, no promotional language in course names.
15. Implement Quiz / education Q&A flashcard markup on public concept-recall pages: Quiz.hasPart > Question with eduQuestionType fixed to 'Flashcard', Question.text and exactly one acceptedAnswer; add Quiz.about.name and educationalAlignment (educationalSubject / educationalLevel) as recommended enrichment. The flashcard content must be visibly rendered on the page — no login wall, no hidden-until-JS reveal.
16. Implement Article or BlogPosting on editorial guides with author, datePublished, dateModified, headline and image, plus a visible 'last reviewed' date — an admissions-facts product lives or dies on freshness signalling.
17. Remove or never build: FAQPage markup, practice-problem markup, Course info markup, and WebSite+SearchAction sitelinks searchbox. All four are retired features. Audit any inherited templates for them.
18. Optionally layer schema.org LearningResource properties (teaches, educationalLevel, educationalAlignment) onto lesson pages as machine-readable description only — with the explicit internal note that it produces no Google rich result.
19. Do NOT ship llms.txt as an SEO deliverable. If it is shipped for goodwill, document internally that Google states it is not used and that it neither helps nor harms, so nobody forecasts traffic against it.
20. Scope snippet controls deliberately: consider data-nosnippet around full worked-solution bodies if we want to stay indexed while limiting verbatim reuse as direct input to AI Overviews and AI Mode. Do not apply nosnippet sitewide — it would suppress our ordinary search snippets too.
21. Add a claims-policy gate to the editorial and marketing review: ban 'guaranteed ranking', 'guaranteed AI citation', 'AI schema', 'llms.txt for AI visibility', and any implied affiliation with College Board, ACT, LSAC, GMAC, ETS or Bocconi. Use 'eligible for' / 'may appear as' phrasing throughout.
22. Follow-up needed before Bing guidance is quoted anywhere: re-retrieve bing.com/webmasters/help/webmaster-guidelines-30fba23a with a JS-rendering browser. It returned only a page title in this session and is recorded as fetchedOk=false; nothing Bing-specific beyond the blog-confirmed bingbot user agent and Edge-based renderer is verified.
23. Re-verify this entire structured-data section before each major release. Four of the types our brief assumed were viable were deprecated between November 2024 and June 2026 — this area is moving fast enough that a fixed annual review is too slow.

---

_Compiled from `content/exam-specs/_raw/seo-crawler-policy.draft.json`, verified 2026-09-18.
**Re-verify the structured-data section before every major release** — four of the types the brief
assumed were viable died inside an eighteen-month window, so a fixed annual review is too slow._
