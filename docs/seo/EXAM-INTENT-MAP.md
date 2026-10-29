# Exams and search intents

Last reviewed: 29 October 2026. Product facts come from the exam configurations (`src/lib/exams/configs`), the question bank (`content/questions`) and the registry (`src/lib/exams/registry.ts`) as they stand on the release branch, which is what production serves today. Demand notes are **qualitative**: Search Console's performance report had no usable data when this was written and no keyword tool was used, so nothing here is a search-volume or difficulty estimate.

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
| PoliTo TIL-I, Engineering (`polito-til-i`) | Politecnico di Torino | Bachelor's | 50 | English | Four sections | Yes (approximation) | 2026-09-29, **2026/27 cycle only** |
| PoliTo TIL-A, Architecture (`polito-til-a`) | Politecnico di Torino | Bachelor's | 60 | English | Five sections | Yes (approximation) | 2026-09-29, **2026/27 cycle only** |
| CISIA TOLC-E, Economics (`tolc-e`) | CISIA | Bachelor's | 79 | English and Italian | Logic, Verbal, Maths | Yes (approximation) | 2026-09-29, **calendar year 2026** |
| CISIA TOLC-F, Pharmacy (`tolc-f`) | CISIA | Bachelor's | 100 | English and Italian | Five sections | Yes (approximation) | 2026-09-29, **calendar year 2026** |
| CISIA TOLC-I, Engineering (`tolc-i`) | CISIA | Bachelor's | 80 | English and Italian | Four sections | Yes (approximation) | 2026-10-11, **calendar year 2026** |

Not supported, and not to be claimed: IMAT (draft config, not routed), the SAA School of Management route (draft hub), Politecnico di Milano's admission routes, other TOLC variants (TOLC-S, TOLC-SU, TOLC-B, TOLC-AV, TOLC-PSI, TOLC-LP) and CEnT-S.

Access today: payments are not switched on in production, so every open format is free (the pricing page says so). The paid model under development keeps the free diagnostic and the public guides free.

Interface languages: the whole interface is in English, Italian, Turkish, Spanish and Polish. Fully translated public pages are the home page, the exam directory, the Bocconi Bachelor & Law hub, the guide index, pricing, and the about pages. Every other exam hub, every format guide and every guide article is English inside a translated frame; their language versions now point to the English page as canonical (`isEnglishOnlyPath` in `src/i18n/alternates.ts`).

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
| CISIA TOLC (E, F, I) | "TOLC-E", "test TOLC simulazione", "TOLC-I esercizi" | `/exams/cisia-tolc` | **Gap**: the audience searches in Italian, the questions exist in Italian, but the hub body is English. |
| PoliTo TIL | "TIL Politecnico Torino", "test TIL-I" | `/exams/politecnico-di-torino-til` | **Gap**: same as TOLC; facts are for 2026/27 only. |
| Digital SAT | "digital SAT practice", "SAT score from practice test" | `/exams/digital-sat`; score question → `/guides/why-practice-tests-cannot-give-you-a-real-sat-score` | English; very competitive intent, low priority for content. |
| Enhanced ACT, LSAT, GMAT, GRE | "enhanced ACT changes", "LSAT without logic games" | Their hubs; LSAT change → `/guides/lsat-without-logic-games` | English; competitive; keep accurate, do not expand first. |
| Choosing between exams | "Bocconi test or SAT" | Bocconi hub's "other routes" section | Covered on the hub; no separate page needed now. |

## 3. Priorities

Ordered by relevance to what the product does well, the likely audience (Italian admissions), and effort. Re-order once Search Console shows real queries (see MEASUREMENT-PLAN.md).

1. **TOLC in Italian.** Translate the TOLC hub and format guide into Italian, reviewed by a fluent reader against CISIA's Italian pages, then move `cisia-tolc` into `TRANSLATED_HUBS`. The questions are already in Italian, so the product delivers what the page would promise.
2. **TOLC-E sample questions**, built like the Bocconi article (`samples` in `src/lib/content/guides.ts`), from new questions kept out of the bank, in English and Italian. Publish the Italian version only once the questions and explanations have been reviewed in Italian.
3. **Re-verify TIL for 2027/28** before any TIL content work: the configs describe the 2026/27 call only.
4. **Bocconi master's test**: a short guide on choosing between the Bocconi graduate test, GMAT and GRE, from the existing verified facts.
5. **Italian Bocconi sample questions**, once the English page shows impressions in Search Console and a reviewer can check the Italian.

Do not create: pages per misspelling, per city, or per year without year-specific content; separate pages for each Bocconi programme; any page about UniExames or uniexam.net.
