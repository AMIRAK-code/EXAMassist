# Seven SEO priorities: status, 2 November 2026

Branch `seo/seven-priorities`, from `main` at 48eff40. **Not deployed, not merged, nothing submitted to a search engine, no message sent.** Companion documents: [PUBLIC-INFO-AUDIT-2026-11-02.md](PUBLIC-INFO-AUDIT-2026-11-02.md), [OUTREACH-PLAN.md](OUTREACH-PLAN.md), [MEASUREMENT-PLAN.md](MEASUREMENT-PLAN.md) (28-day procedure), [../review/README.md](../review/README.md) (human review), [EXAM-INTENT-MAP.md](EXAM-INTENT-MAP.md). The work already on `main` from earlier today (REPORT-2026-11-02.md: TOLC samples, PoliTo rewrite, lighter pages, robots in every language, `practice_click`) is kept as it was.

## Update, 3 November 2026 (owners' instructions)

- **Human review: done, per the owners.** The pages no longer say the samples are unreviewed, and the Italian TOLC page no longer carries the "awaiting review" note. They name no reviewer either: no names, credentials or consent were provided, so none are on the site. To show them, record them in `content/reviews/editorial-samples.json` first (docs/review/README.md); the tests still refuse a review claim without that record.
- **"Everything is free": skipped** at the owners' request. The fixes to "a diagnostic for every exam" and the home guest line stay, since they are separate claims.
- **New free samples.** The Bocconi Master's page (`/exams/bocconi-master`) now has three worked samples, one per area (verbal reasoning, data insight, quantitative reasoning), plus a lead built from Bocconi's graduate test page, re-read today: 50 questions in 75 minutes, +1/0/−0.25 or −0.33, the 15/50 floor, 3 attempts. Its title is unchanged, since it already has impressions. A new guide, `/guides/imat-sample-questions`, has five worked IMAT questions, one per area, plus the 2026/27 rules read first-hand from the MUR decree (D.M. 6 August 2026, n. 1005): 60 questions, five options, 100 minutes; Reading 4, Logic 5, Biology 23, Chemistry 15, Physics and maths 13; +1.5/−0.4/0; a 20-point threshold for EU and resident candidates. The guide says plainly that UniExamer offers no IMAT practice sessions; the IMAT configuration stays a draft. Every new sample was checked against the bank by wording (automated) and by set-up (by hand).
- **Search Console through Claude in Chrome: not possible today.** No Chrome browser is connected to the extension (`list_connected_browsers` returned none, and two connection attempts failed). Nothing was read; no figures are estimated. To do it: open Chrome with the Claude extension signed in to the same account, then ask again.

## 1. Italian TOLC content

**Done.** `/it/exams/cisia-tolc` is now a full Italian page: lead, 2027 status, the eight worked samples (every option, working and lesson), the six-week plan, the sources list, and the exam details that came from the English configurations (exam names, summaries, version and cycle lines, section names, scale labels and every practice format's label and description). It carries its own canonical, `hreflang` en/it/x-default (reciprocal on the English page), `lang="it"`, an Italian title and description, Italian breadcrumbs and `inLanguage: it` in its Article data, and a sitemap entry. The `/tr`, `/es` and `/pl` versions still name the English page as canonical. A visible note at the top says the translation awaits a fluent reviewer. The format guide (`/exams/cisia-tolc/format`) stays English only.

How: a hub can now be translated into some languages only (`contentLocales` in `src/i18n/alternates.ts`, driven by `HUB_TRANSLATIONS` in `src/lib/exams/hub-content.ts`); Italian text in `src/lib/exams/hub-content-it.ts` and `src/lib/exams/hub-details-it.ts`.

Facts re-checked on CISIA's Italian pages and PDF on 2 November 2026 (session notes `cisia-facts-2026-11-02.md`): section counts and times for TOLC-E, TOLC-I and TOLC-F; +1/0/−0.25 (Regolamento 2026 art. 1.5); no calculator (4.1.5); once a month; €35 (3.2); changes announced by 31 December (1.2); no 2027 calendar or regulation (the 2027 PDF is 404); English TOLCs replaced by CEnT-S; PoliTo's 2027/28 calls not yet published. The Italian page uses CISIA's terms ("Comprensione verbale", "sillabo", "prova di conoscenza della lingua inglese") and links CISIA's Italian pages. Note for the facts file: CISIA's structure pages moved to `…/struttura-della-prova-e-sillabo`; the English `…/structure-and-syllabus` pages the configurations cite still load.

**Evidence:** `tests/unit/hub-translations.test.ts` (every section, format, name and scale translated; same sample ids, keys, numeric options and dates as English; note present), `tests/unit/seo.test.ts` (canonical and hreflang per language, sitemap), `tests/unit/guides.test.ts` (links and official sources in the Italian text). Local production build: `/it/exams/cisia-tolc` 200 with the tags above; no element left with `lang="en"`, no English line in the body, 48 KaTeX formulas and no KaTeX error, no horizontal overflow at 375 px; the answers open. **Blocked on people:** a fluent Italian reviewer (package ready, item 2). **Next:** deploy; request indexing for `/it/exams/cisia-tolc`; when a reviewer approves the translation, remove `translationNote`.

## 2. Human review and credibility

**Done.** The remote branch `feature/human-approval-and-official-scores` is fully merged into `main` (no commit of its own is missing): bank questions already need a named, authorised reviewer's approval of an exact fingerprinted version (`reviewers`, `question_reviews`). What was missing was any record for the **public worked samples**, which are not in the bank, and for Italian text. Added: a version-controlled ledger `content/reviews/editorial-samples.json` with a schema for reviewer, public credentials line, how the qualification was checked (a reference), written consent (date, where kept, consent to be named, withdrawal), review date, outcome, the four checks plus translation, and the SHA-256 fingerprint of the exact text (`src/lib/content/sample-review.ts`). Tests fail if an approval no longer matches the text, if a reviewer lacks consent, or if a page stops saying "no human subject expert has reviewed them" before every sample on it is approved. A review package for all 27 Bocconi and TOLC samples, with declaration, checklist and decisions table: [../review/packages/2026-11-02-bocconi-tolc-samples.md](../review/packages/2026-11-02-bocconi-tolc-samples.md) (regenerate with `npx tsx scripts/sample-review-package.ts`).

**The ledger is empty: no reviewer, credential, consent or review was invented, and every public page still says no human expert has reviewed its samples.** **Blocked on people:** recruiting qualified reviewers (a maths/logic teacher; a fluent Italian reader for the Italian page), the owners' wording for the privacy notice's reviewer section, and the bank's rollout decision (docs/HUMAN-APPROVAL-ROLLOUT.md). **Next:** follow docs/review/README.md steps 1–6.

## 3. Consistent public information

**Done on our site** (all five languages): "a diagnostic for every exam" now says "for every exam that has one open" (the GRE diagnostic is "Not yet") on pricing, home, terms and account pages; the IMAT mention in the interface messages shipped with every page is removed; `llms.txt` promises a reply "within one business day", from the same constant as the support page; the home line "Free to start, no account needed", wrong while payments are on, now says the sample question needs no account and a free account opens the diagnostic.

**Classified** in PUBLIC-INFO-AUDIT-2026-11-02.md. Stale search-engine copies: the Bing/DuckDuckGo pricing snippet with old plans and prices ("All access for €39.00 a month…"), and old `/it` and `/es` titles. The "everything is free" description is not on the live site and not in any snippet found: it is the pricing page's notice for a deployment with payments off, and the Hashnode article repeats the idea. External text the owners must edit: Trustpilot (lists IMAT, "exact test-day conditions"), Hashnode (payments off, "1,000+", "two blind solves", old plan names), Instagram, the GitHub repository's homepage (`exa-massist.vercel.app`, 500) and a directory that copied it. Exact replacement copy is in the audit, section 2. **Owner decision:** whether pricing should note that TIL passes are for 2026/27 only. **Next:** after the deploy, request recrawls (audit §3) and paste the profile copy.

## 4. Stronger Bocconi and TOLC resources

**Done, on existing pages only** (no new URL). TOLC hub: three new worked samples, so all three TOLC types are covered: a TOLC-E Verbal comprehension passage (inference), a TOLC-F Biology question (water released forming a polypeptide) and a TOLC-F Chemistry question (percentage by mass in CaCO₃), each with every wrong option explained; a six-week study plan built from CISIA's rules (bando first, syllabus and MOOCs, timed sections, two full simulations, the −0.25 guessing arithmetic, CISIA's practice area, the once-a-month rule) with links into TOLC-E, TOLC-I and TOLC-F practice. Bocconi preparation plan: links into standard and Law practice for the diagnostic and the full simulation, and an accurate line on what is free. The new samples passed the bank-stem check and a manual check of the bank by set-up (no percentage-composition, peptide-count or library passage items exist); no score prediction, no affiliation claim, no question markup.

**Evidence:** `tests/unit/guides.test.ts` (one key, every wrong option explained, anchors, links, no bank stem), maths re-derived by hand (polypeptide: n − 1 = 9; CaCO₃: 48/100 = 48%; guessing: 1/5 − 4/5 × 0.25 = 0 and 1/4 − 3/4 × 0.25 = 0.0625). **Blocked on people:** expert review (item 2). **Next:** after 28 days, compare the hub's search click rate into practice (MEASUREMENT-PLAN.md) before writing more.

## 5. Clearer homepage

**Done.** The `<h1>` is now "University admission test practice, with *worked explanations.*" and its translations (it, tr, es, pl); the slogan "Big ambitions. A clearer next step." stays below it as supporting copy, in each language; the lede names the tests and says accurately what is free: "Guides, worked sample questions and a diagnostic for every exam that has one open are free." Design kept (same fonts, accent and highlight; the heading uses the existing `display-l` size because the sentence is longer than the old two-word lines). **Evidence:** server HTML in all five languages shows the new heading; 375 px and 1024 px checked in the browser, no overflow; e2e assertion updated. **Next:** none beyond the deploy.

## 6. Relevant independent mentions

**Plan written, nothing sent:** [OUTREACH-PLAN.md](OUTREACH-PLAN.md). Twelve verified destinations: PoliTo's school orientation project (the first cohort sitting CISIA tests), liceo TOLC courses, Unimi's orientation page, five pages with stale English-TOLC or TIL claims (Sapienza I3S, Unibo Pharmacy Rimini, Milano-Bicocca, College Council, Your Dream School, Testbusters, Futura), and forums where we should only answer real questions. Each has why it helps, which page, the contact route and the rules; drafted messages disclose the affiliation, AI assistance, the lack of expert review and the paid plans, and ask for nothing. Reddit could not be loaded and is listed as unchecked. Teachers' names and addresses are kept out of the public repository. **Blocked on people:** an owner to approve and send each message from their own mailbox, after the deploy. **Next:** send #1 and #3–#5 in the week after the deploy; #2 in early 2027.

## 7. Measurement

**Search Console: no access from this session.** The built-in browser is not signed in to Google (Search Console redirects to its public page), and I did not use the owner's own browser or enter any credentials. So URL Inspection, Google-selected canonicals, sitemap processing and query data were **not read**, and no number in this branch is estimated. The last owner-read baseline (26–31 October) is in MEASUREMENT-PLAN.md.

**Done:** a documented 28-day procedure (MEASUREMENT-PLAN.md, "The 28-day report"): fixed windows, the branded regex `uni ?examer|examer` and its "doesn't match" twin, the seven priority URLs, URL Inspection, the language split, and how to read clicks against completed sessions. A read-only script, `npx tsx scripts/seo-report.ts --to=YYYY-MM-DD`, prints the first-party half for the same windows: views and clicks into practice by coarse source per exam page and guide, against the previous 28 days, and, in a separate table, practice sessions started and completed per exam, labelled as not attributable to search. No tracking, cookie, script or consent change was added: it reads the daily totals the privacy notice already describes. **Evidence:** `tests/unit/organic-report.test.ts`; in the browser, a click from the Italian page's study plan into TOLC-E practice stored one `practice_click` for `cisia-tolc` in the local database, and the script reported it. **Blocked on people:** the owner signed in to Search Console (or granting this account access), and someone who can reach the production database to run the script. **Next:** on deploy day + 31, produce `report-28d-…md` with both halves.

## Validation in this branch

- `npm run verify`: typecheck and content validation clean; 55 test files, 880 tests, all passing on the final run (3 November; two tests that required "not reviewed" wording were removed on the owners' instruction). The first run had one failure (a test requires every `common.guest` string to state the guest lifetime), fixed by moving the new home line into the `home` catalogue.
- `npm run build` (Next.js production build, on Windows: the Cloudflare bundle was **not** built here and must not be).
- Local production server (`next start`, local SQLite seeded from the repository, no production data): every changed page answers 200 in the languages checked, with no "Application error", missing message or IMAT string; Italian hub checks as in item 1; home in five languages; pricing and llms.txt copy; sitemap 74 URLs (one more than before: the Italian TOLC hub), and the deploy snapshot list is unchanged at 166 paths (every language of every sitemap page was already saved).
- Not run: Playwright e2e and accessibility suites, Rich Results Test, a Cloudflare preview deploy.

## Release checklist (to prevent Cloudflare 1102)

Error 1102 is the Worker exceeding its CPU limit (10 ms on the Free plan). Public pages avoid it only because `npm run cf:deploy` saves them as static files that Cloudflare serves without running the Worker (docs/SEARCH-AND-AI-VISIBILITY.md). Every step below protects that.

**Before**

- [ ] PR reviewed and merged into `main`; deploy from a clean checkout of `main` on **WSL or Linux**, never Windows (a Windows-built OpenNext bundle fails with "Unexpected loadManifest"; one once made every URL 500).
- [ ] `npm ci`, `npm run verify`, `npm run build` pass on that machine.
- [ ] No migration, secret or Worker variable changes in this release (none are needed). Do not touch `BREVO_API_KEY` or other secrets.
- [ ] `grep -rn "sample-review\|organic-report" src/app src/components` is empty: those modules are for tests and scripts, not pages.
- [ ] Workers plan still as expected (Free): the snapshot is what keeps public pages under the limit.

**Deploy (only `npm run cf:deploy`, never `wrangler deploy` directly)**

- [ ] The upload prints a preview URL (new version, no traffic yet).
- [ ] The snapshot step saves **171** paths with no error (166 before this release, plus the IMAT guide in five languages); `/it/exams/cisia-tolc`, `/exams/cisia-tolc`, `/exams/bocconi-master`, `/guides/imat-sample-questions` and `/` are among them. If any page fails, the script stops before the final deploy and visitors stay on the current version: fix, then `npm run cf:snapshot` in the same folder.
- [ ] Only then does the final deploy run.

**After (within 15 minutes)**

- [ ] For `/`, `/it`, `/exams/cisia-tolc`, `/it/exams/cisia-tolc`, `/exams/bocconi-online-test`, `/exams/bocconi-master`, `/guides/imat-sample-questions`, `/guides/bocconi-test-preparation-plan`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`: request each six times in a row; every answer is 200, never 503/1102, and the pages are served as static files: `curl -sI` shows `Cache-Control: public, max-age=0, must-revalidate` (a page the Worker rendered shows `private, no-cache, no-store`, as `/pricing` does by design). Checked on the live site on 2 November 2026: `/exams/cisia-tolc` static, `/pricing` Worker.
- [ ] `/pricing` (dynamic by design, runs the Worker): six requests, all 200. If 1102 appears there, it predates this release; note it.
- [ ] `/it/exams/cisia-tolc`: canonical is itself; hreflang en, it, x-default; Italian heading. `/tr/exams/cisia-tolc`: canonical is the English page.
- [ ] `sitemap.xml` lists 75 URLs including `/it/exams/cisia-tolc` and `/guides/imat-sample-questions`.
- [ ] Home heading reads "University admission test practice, with worked explanations." in English and translated in `/it`, `/tr`, `/es`, `/pl`.
- [ ] Sign-in, practice start and checkout still behave as before (one quick pass as a test account; no billing or auth code changed).
- [ ] If anything above fails: roll back to the previous Worker version in the Cloudflare dashboard (Workers → examer → Deployments), then investigate.

**Then**

- [ ] Search Console: request indexing for the URLs in PUBLIC-INFO-AUDIT §3; check URL Inspection a few days later.
- [ ] `npm run seo:indexnow` for Bing.
- [ ] Paste the external-profile copy (audit §2); send approved outreach messages (OUTREACH-PLAN.md).
- [ ] Day 31: first 28-day report (MEASUREMENT-PLAN.md).
