# Exams and search intents

Last reviewed: 2 November 2026 (section 2a, the TIL and TOLC rows and section 3 rewritten; see [REPORT-2026-11-02.md](REPORT-2026-11-02.md)). First written 29 October 2026. Product facts come from the exam configurations (`src/lib/exams/configs`), the question bank (`content/questions`) and the registry (`src/lib/exams/registry.ts`) as they stand on the release branch, which is what production serves today. Demand notes are **qualitative**: Search Console's performance report had no usable data when this was written and no keyword tool was used, so nothing here is a search-volume or difficulty estimate.

## 1. What the product supports

"Formats" are the blueprints a learner can start. Every exam has untimed topic practice and a diagnostic; the table shows what else exists. Question counts are published items in the bank on the release branch.

| Exam (config) | Provider | Applicant level | Questions | Question languages | Timed sections | Full simulation | Facts verified |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| Online Bocconi Test, standard (`bocconi-undergraduate`) | Università Bocconi | Bachelor's | 124 | English | One 50-question timed set | Yes (approximation: areas interleaving not published) | 2026-10-07; key facts re-read 2026-10-29 |
| Online Bocconi Test – Law (`bocconi-law`) | Università Bocconi | Law (Integrated MA in Law, Global Law) | 83 | English | One 50-question timed set | Yes (approximation) | 2026-10-07; re-read 2026-10-29 |
| Online Bocconi Test, graduate (`bocconi-graduate`) | Università Bocconi | MSc and MA | 33 | English | One timed set | No | 2026-09-18 |
| Digital SAT (`digital-sat`) | College Board | Undergraduate | 151 | English | Four modules | Yes (approximation; no scaled score) | 2026-09-18 |
| Enhanced ACT (`enhanced-act`) | ACT | Undergraduate | 47 | English | English, Math, Reading, Science, Writing | No | 2026-09-18 |
| LSAT (`lsat`) | LSAC | Law (JD) | 46 | English | LR ×2, RC, Writing | No | 2026-09-18 |
| GMAT Exam (`gmat`) | GMAC | Graduate management | 37 | English | Quant, Verbal, Data Insights | No | 2026-09-18 |
| GRE General Test (`gre`) | ETS | Graduate | 73 | English | AW, Verbal ×2, Quant ×2 | No | 2026-09-18 |
| PoliTo TIL-I, Engineering (`polito-til-i`) | Politecnico di Torino | Bachelor's | 50 | English | Four sections | Yes (approximation) | 2026-09-29, **2026/27 only: the last TIL cycle** |
| PoliTo TIL-A, Architecture (`polito-til-a`) | Politecnico di Torino | Bachelor's | 60 | English | Five sections | Yes (approximation) | 2026-09-29, **2026/27 only: the last TIL cycle** |
| CISIA TOLC-E, Economics (`tolc-e`) | CISIA | Bachelor's | 79 | English and Italian | Logic, Verbal, Maths | Yes (approximation) | 2026-09-29, **calendar year 2026** |
| CISIA TOLC-F, Pharmacy (`tolc-f`) | CISIA | Bachelor's | 100 | English and Italian | Five sections | Yes (approximation) | 2026-09-29, **calendar year 2026** |
| CISIA TOLC-I, Engineering (`tolc-i`) | CISIA | Bachelor's | 80 | English and Italian | Four sections | Yes (approximation) | 2026-10-11, **calendar year 2026** |

Not supported, and not to be claimed: IMAT (draft config, not routed), the SAA School of Management route (draft hub), Politecnico di Milano's admission routes, other TOLC variants (TOLC-S, TOLC-SU, TOLC-B, TOLC-AV, TOLC-PSI, TOLC-LP) and CEnT-S.

**Changes found on 2 November 2026 that reshape the TIL and TOLC intents:**

- PoliTo joins CISIA from 2027/28: "TOLC per i candidati nazionali e CeNT-S per quelli internazionali" (news item, 23 July 2026), in person only (TOLC@UNI, CEnT@UNI). Its admission test page no longer describes the TIL; the 2027/28 calls are "being finalized". So the TIL is a 2026/27-only test, and a 2027/28 PoliTo applicant needs the TOLC (which one per programme is not published) or the CEnT-S, which we do not cover.
- The English TOLC-E, TOLC-I and TOLC-F were replaced by the CEnT-S from November 2025 (CISIA's CEnT page). The TOLC is an Italian-language test. Many university pages that rank for "TOLC-E in English" are stale on this.
- No 2027 TOLC calendar or regulation is published; CISIA announces structural changes by 31 December.

Access today (corrected 2 November 2026): payments **are** switched on in production. Guides, worked samples, the diagnostic for each exam that has one open (with an account) and official-score tracking are free; practice, timed sections and simulations need a Single Exam Pass or Plus (docs/seo/PUBLIC-INFO-AUDIT-2026-11-02.md).

Interface languages: the whole interface is in English, Italian, Turkish, Spanish and Polish. Fully translated public pages are the home page, the exam directory, the Bocconi Bachelor & Law hub, the guide index, pricing, and the about pages; the CISIA TOLC hub is also translated into Italian (since 2 November 2026, awaiting a fluent reviewer), with its own canonical and hreflang. Every other exam hub, every format guide and every guide article is English inside a translated frame; their language versions now point to the English page as canonical (`isEnglishOnlyPath` in `src/i18n/alternates.ts`).

## 2a. Priority exams: intent type to page (2 November 2026)

Four intent types: **practice** (questions to try, simulations), **format** (structure, timing, scoring, calculator), **study plan** (how to prepare, what to study), **official** (the organiser's own site, dates, calls, registration). For an official intent the right result is the organiser's page; our page should answer what the searcher needs next and link straight to the official source, not compete with it. Evidence: Search Console 26–31 October (the owner's figures in REPORT-2026-11-02.md §1; a small sample, no query data), US-based web searches on 2 November (rough signal only), and the official pages. No keyword volumes were used or estimated.

| Exam | Intent | Example phrasing (qualitative) | Page that answers it | What the page gives that others don't |
| --- | --- | --- | --- | --- |
| PoliTo | Official / what test now | "Politecnico di Torino admission test", "test TIL Politecnico" | `/exams/politecnico-di-torino-til` | The 2027/28 switch to CISIA, split into confirmed and not yet published, with PoliTo's own links; only one ranking page explained the switch on 2 November |
| PoliTo | Format | "TIL-I format", "TIL-I punteggio" | `/exams/politecnico-di-torino-til/format` (2026/27 rules, labelled as the last TIL cycle) | Sourced 2026/27 rules, with the 2027/28 status above them |
| PoliTo | Practice | "TIL-I simulazione" | TIL practice stays on the hub; 2027/28 Engineering applicants are sent to TOLC-I samples and practice on `/exams/cisia-tolc#tolc-i-samples` | Honest routing: TOLC-I is CISIA's engineering test, but PoliTo has not confirmed it per programme |
| CISIA TOLC | Format | "TOLC-E struttura", "TOLC-I how many questions", "CISIA TOLC test" | `/exams/cisia-tolc` (overview, all three types) and `/exams/cisia-tolc/format` (every rule with its source) | E, I and F side by side; the 2026 rules marked as 2026's; 2027 status |
| CISIA TOLC | Practice | "TOLC-E simulazione", "TOLC-I esercizi" | `/exams/cisia-tolc#samples` (5 worked items), then practice formats on the same page | Worked explanations of every wrong option; CISIA's own practice is behind registration and in Italian |
| CISIA TOLC | English-language | "TOLC-E in English", "English TOLC" | `/exams/cisia-tolc` lead | States that English TOLCs became the CEnT-S (Nov 2025); we do not offer CEnT-S practice |
| CISIA TOLC | Official | "calendario TOLC 2027", "iscrizione TOLC" | CISIA's own pages, linked from the hub's status block | Says plainly that 2027 dates are not published yet |
| Bocconi | Practice | "Bocconi test sample questions" | `/guides/bocconi-admission-test-sample-questions` | 11 worked items, one per question type |
| Bocconi | Format | "Bocconi test format", "Bocconi negative marking" | `/exams/bocconi-online-test/format`; guessing → `/guides/bocconi-test-negative-marking-when-to-guess` | Sourced rules; the guessing arithmetic |
| Bocconi | Study plan | "how to prepare for Bocconi test", "Bocconi test preparation" | `/guides/bocconi-test-preparation-plan` (position ~48 in late October) | Week-by-week plan from the published rules; since 2 November also the official topic list by area and links to the worked samples |
| Bocconi | Official / which test | "Bocconi admission test", "Bocconi law test vs online test" | `/exams/bocconi-online-test` (translated) and `/guides/bocconi-undergraduate-vs-law-test` | Bachelor vs Law vs master's, with sessions and thresholds |
| Bocconi master's | Format / official | "Bocconi master admission test" | `/exams/bocconi-master` | Graduate test vs GMAT/GRE thresholds |

## 2. Intents and the one page that answers each

One primary page per intent. A second page may link to it, but must not compete for it.

| Intent | Examples of phrasing (qualitative) | Primary page | Status |
| --- | --- | --- | --- |
| Brand: find the site | "uniexamer", "uni examer", "examer" | `/` | Bing ranks `/` first for "uniexamer" and second for "uni examer" (behind uniexam.net, unrelated). Google not checked (robot check); use Search Console. |
| Bocconi undergraduate/Law: what the test is, how to prepare | "Bocconi admission test", "test ammissione Bocconi", "Bocconi test preparation" | `/exams/bocconi-online-test` and its 4 translations | Translated in full; strongest page. |
| Bocconi: sample questions with answers | "Bocconi test sample questions", "domande test Bocconi esempi" | `/guides/bocconi-admission-test-sample-questions` | Rewritten 2026-10-29 (11 questions). English only. |
| Bocconi: format, timing, scoring, negative marking | "Bocconi test format", "Bocconi test scoring", "penalità test Bocconi" | `/exams/bocconi-online-test/format`; guessing decision → `/guides/bocconi-test-negative-marking-when-to-guess` | English only. |
| Bocconi: which test to take | "Bocconi law test vs online test" | `/guides/bocconi-undergraduate-vs-law-test` | English only. |
| Bocconi: study plan | "how to prepare for Bocconi test", "Bocconi test study plan" | `/guides/bocconi-test-preparation-plan` | English only. |
| Bocconi master's test | "Bocconi master admission test", "Bocconi graduate test" | `/exams/bocconi-master` | No guide or samples yet. |
| CISIA TOLC (E, F, I) | "TOLC-E", "test TOLC simulazione", "TOLC-I esercizi" | `/exams/cisia-tolc` and `/it/exams/cisia-tolc` | Lead, 2027 status, eight worked samples (TOLC-I, TOLC-E with a passage, TOLC-F) and a six-week plan; Italian version since 2026-11-02, awaiting a fluent reviewer. The format guide is still English only. |
| PoliTo admission (TIL until 2026/27, CISIA from 2027/28) | "TIL Politecnico Torino", "test TIL-I", "Politecnico di Torino admission test" | `/exams/politecnico-di-torino-til` | Rewritten around the 2027/28 switch on 2026-11-02. Re-check PoliTo every two weeks until the calls appear. |
| Digital SAT | "digital SAT practice", "SAT score from practice test" | `/exams/digital-sat`; score question → `/guides/why-practice-tests-cannot-give-you-a-real-sat-score` | English; very competitive intent, low priority for content. |
| Enhanced ACT, LSAT, GMAT, GRE | "enhanced ACT changes", "LSAT without logic games" | Their hubs; LSAT change → `/guides/lsat-without-logic-games` | English; competitive; keep accurate, do not expand first. |
| Choosing between exams | "Bocconi test or SAT" | Bocconi hub's "other routes" section | Covered on the hub; no separate page needed now. |

## 3. Priorities

Ordered by relevance to what the product does well, the likely audience (Italian admissions), and effort. Re-order once Search Console shows real queries (see MEASUREMENT-PLAN.md).

Re-ordered 2 November 2026. Items 2 and 3 of the 29 October list are done (TOLC samples on the hub; TIL re-verified, which found the switch to CISIA).

1. **PoliTo 2027/28 calls.** Check PoliTo every two weeks; when the calls appear, rewrite the hub's status and routes (which TOLC per programme, thresholds, dates, SAT, Architecture) and decide with the owners whether TIL practice stays open. If PoliTo confirms TOLC-I for Engineering, add PoliTo to the TOLC hub's lead.
2. **TOLC in Italian.** Done for the hub on 2 November 2026 (`HUB_TRANSLATIONS` in `src/lib/exams/hub-content.ts`; its own canonical in Italian only). Remaining: a fluent reviewer's check (docs/review/README.md), then remove the page's "awaiting review" note; the format guide `/exams/cisia-tolc/format` is still English only.
3. **A dedicated TOLC-E sample-questions guide** (10–12 items across Logic, Verbal comprehension and Mathematics, including a passage), only if Search Console shows sample-question queries reaching `/exams/cisia-tolc`. Follow the overlap rule in CONTENT-MAINTENANCE.md.
4. **Bocconi master's test**: a short guide on choosing between the Bocconi graduate test, GMAT and GRE, from the existing verified facts.
5. **Italian Bocconi sample questions**, once the English page shows impressions in Search Console and a reviewer can check the Italian.

Considered and not done: a CEnT-S page (we have no CEnT-S practice, and a page about a test we cannot help with would be thin); a separate "PoliTo 2027/28" page (the existing TIL URL already ranks for the intent and now answers it).

Do not create: pages per misspelling, per city, or per year without year-specific content; separate pages for each Bocconi programme; any page about UniExames or uniexam.net.
