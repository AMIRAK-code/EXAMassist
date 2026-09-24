# Redesign — Phases 1 and 2: assessment, direction, plan and delivery

The "Academic Avant-Garde" redesign. Sections 1–8 are the Phase 1 assessment
and proposal, written before anything changed; where Phase 2 built something
differently, the text says so in place ("as built", "as shipped"). Section 9
records the decisions agreed for Phase 2, section 10 reconciles the phase
numbering with the master brief, and section 11 reports what Phase 2 delivered,
how it was checked, the before-and-after measurements and what is deferred.
Section 12 is the Phase 2 closeout: the explanation correction, the actual
cause of the mobile slowdown, the database state and the acceptance verdict.
Where it corrects §11, §11 says so in place. Section 13 is the closeout's
second pass: the independent check of the remaining 180 explanations, the
leaner homepage, the final measurements and the final acceptance verdict.

The homepage concept (desktop, mobile and design-system artboards, with a
working sample question per exam) is published as a private canvas:
<https://claude.ai/artifact/7eAHjALDTnQML5Kyui5hgE>.

---

## 1. How this was assessed

- Read the README, `docs/*`, `globals.css`, every page and component, the
  assessment engine, the learning modules and the migrations.
- Built production (`npm run build`) and ran it from an isolated copy with a
  freshly seeded database, so test sessions did not touch the working database.
- Walked the journeys as a guest in Chrome (via the project's Playwright) at
  1440×900 and 390×844, and repeated the key failures by hand.
- Lab performance only. There are no analytics and no field data.

## 2. Measured baseline

Lab numbers from a local production server. "Throttled" means 4× CPU slowdown,
1.6 Mbps down and 150 ms RTT on a 390 px mobile viewport.

| Route | LCP desktop | LCP throttled mobile | CLS | JS transfer | CSS | Web fonts |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 172 ms | 1,076 ms | 0 | 106 KB | 11 KB | 0 KB |
| `/exams/digital-sat` | 172 ms | 1,052 ms | 0 | 106 KB | 11 KB | 0 KB |
| `/practice/digital-sat` | 168 ms | 1,048 ms | 0 | 108 KB | 11 KB | 0 KB |
| `/exams/digital-sat/format` | 224 ms | 1,104 ms | 0 | 106 KB | 11 KB | 0 KB |

Build output: 102–103 kB shared first-load JS, homepage 106 kB, player 114 kB.
TTFB is about 20–30 ms locally, even though the homepage runs `examCoverage()`
(a full pool query) for all seven configurations on every request.

**Implication:** the site is already fast because it ships system fonts and
very little JavaScript. The redesign cannot claim a speed improvement; the job
is to add identity without regressing. Phase 2 budgets are in §8.

## 3. Journey findings

Severity: **H** breaks a journey or misreports; **M** slows or confuses;
**L** polish.

### First visit → choose exam → begin practice

- **M** The homepage explains the product's honesty well but offers nothing
  to do. Reaching a first question takes four steps and three page loads:
  home → exams → hub → setup → start.
- **M** The setup page opens with a ~160-word paragraph of exam facts before
  the form.
- **M** Exam names are inconsistent across screens: "Bocconi Online Test",
  "Online Bocconi Test (standard variant)", "Bocconi Online Test - Law" and
  "Bocconi Test"; "Digital SAT" and "SAT (Digital SAT)"; "Enhanced ACT" and
  "The ACT (Enhanced ACT)". Config `name` fields cannot simply be edited,
  because that changes the config hash and trips the seed's immutability
  warning. A display-name layer belongs in the registry.
- **L** The header does not update after a guest is created, because the
  root layout persists across client navigation. The player still shows the
  signed-out nav.
- **L** There is no favicon, so every page logs a 404.

### Returning student → resume

- **M** Resume looks only at the last ten attempts for the exam in focus.
  Expiry is lazy, so a timed attempt past its deadline shows as "in progress"
  until it is opened.
- **M** Resume lands on question 1, not where the learner left off.
- **M** The dashboard's exam cannot be switched. "Practising something else?"
  links to practice setup, not to that exam's dashboard.
- **M** Guest sessions last seven days and nothing tells a guest their history
  will go. The header offers "Sign in" rather than a way to keep progress.

### Complete → results → review mistakes → practise again

- **H — "Practise this skill" is a dead end almost everywhere.** Skills hold a
  median of 1–2 reviewed questions: 28 of 28 SAT skills have fewer than 5, and
  only one skill in the whole bank has 10. The setup form defaults to 10
  questions and its smallest option is 5. Opening
  `/practice/digital-sat?skill=words-in-context` and starting fails with
  "2 available, 10 needed", while the form displays "Focus: Everything
  (50 questions)" because a preset skill is never shown. The same links come
  from results ("What to work on next"), dashboard `weak_skill` and
  `slow_skill` recommendations, and the notebook's "Practise these again"
  (which silently falls back to the setup page).
- **H — The key can be seen and the answer then changed.** In
  immediate-feedback practice, `canAnswerAt` allows re-answering an answered
  item and the input is never disabled. Scoring uses the final answer, so a
  miss can be recorded as correct in results and never reach the review queue.
  This is an assessment-behaviour decision; see §9.
- **M** Results lead with seven stat cards, three of which repeat the others,
  then a long methodology card, then skills, then every question inline. The
  mobile results page is 35,854 px tall.
- **M** The results skill table labels ≥80% as "strong" (screen-reader text
  and colour) even for 1 of 1, which contradicts the product's own evidence
  rule.
- **M** Straight after a session with 7 wrong and 3 blank, the dashboard says
  "0 waiting in your mistake notebook". Misses only become *due* a day later,
  but the label reads as "no mistakes".
- **L** Time only accumulates when an answer is saved, so skipped questions
  count 0 s towards "time spent".

### Set a study plan → return to the next activity

- **H** An SAT guest with one session gets six weeks × six sessions, all
  "Practise Expression of Ideas", and **all 36 links fail**.
  `buildStudyPlan` passes untouched *domains* as `?skill=<domainSlug>`
  (`src/lib/learning/recommend.ts:293-297, 319-321`), which matches nothing.
  Dashboard and readiness correctly use `?domain=`.
- **M** The plan is computed on every read, not stored. There are no session
  dates, no completion tracking and no missed-session handling. The
  `study_plans` table is never written, and there are two date sources
  (`users.target_date` and `exam_targets.target_date`).
- **M** Readiness caps the overall band by evidence, but the individual
  signals are not capped. With 10 answers it showed "Pace: Strong — 0.01× the
  exam's pace (median 0 s)" and "Topic coverage: Consistent".

### Read exam information → understand practice formats

- Hubs and format guides are the product's strongest pages: sourced, dated and
  explicit about what is unverified.
- **M** Availability appears only on the setup page, as seven stacked cards.
  The four kinds of format (topic practice, diagnostic, approximate timed
  section, exam-accurate) collapse into three fidelity badges. Diagnostics wear
  the same "Study practice, not a simulation" badge as topic practice, and no
  configuration uses `exam_accurate`.

### Cross-cutting

- **H (mobile)** Once any session exists, guest or registered, the header nav
  measures 451 px on a 390 px screen. "Readiness" is clipped and "Sign in" is
  pushed off-screen. The whole page scrolls sideways.
- **M** In the question navigator, answered and unanswered differ only by fill
  colour, and targets are 36 px.
- **M** Save state is visible only to screen readers unless something fails.
  The offline message says answers are "saved on this device", but they are
  held in memory and lost on refresh. Numeric and essay inputs POST on every
  keystroke, with no debounce.
- **M** The difficulty radios are `sr-only` inside labels, so keyboard focus
  on them is invisible.
- **M** The player carries the full marketing header and footer. Its controls
  sit below the content, so they move with explanation length.
- **L** KaTeX renders thousands separators as "1, 700": `$1,700$` needs
  `1{,}700`. *Corrected in Phase 2:* a precise scan found one affected
  question (the four options of `digital-sat-math-ratios-rates-050`), not the
  10 occurrences first reported; that count came from a regex matching across
  neighbouring maths spans.
- **Trust copy vs provenance.** The site says questions are "written by our
  editorial team" and that each record "names the person who authored it".
  All 288 records have `aiAssisted: true`, and the author and reviewer fields
  hold role ids such as `digital-sat-wave3-author`. See §9.

## 4. Backend support for the proposed features

| Feature | Status | Where it lives | Missing work |
| --- | --- | --- | --- |
| Homepage sample question | Partial | `getQuestionVersion` + `toReviewable` (`content/repository.ts`) can render a question with its explanation server-side; `toPresented` strips keys for attempts | Curated sample map; public sample route; keep samples out of measurement pools without closing formats |
| Live format availability | Yes | `blueprintAvailability()` | Nothing (could be cached) |
| Resume unfinished session | Partial | Dashboard query; `expireIfDue` is lazy | Cross-exam in-progress list, expiry on list, last position |
| Next-activity recommendation | Yes | `buildRecommendations` with reason strings; `readiness.nextActions` | Skill links must fall back to domains when a skill is thin |
| Skill landscape | Mostly | `skillPerformance` (answered, correct, omitted, median time, `lastSeenAt`); `domainPerformance` | Merge zero-evidence skills; the median-time query ignores attempt status |
| Results | Yes | `attempt_results` with per-part, section, domain and skill breakdown; methodology block | Per-item `timeMs` is dropped by the view model |
| Mistake notebook, spaced review | Yes | `review_queue` (miss count, streak, `due_at`) | "Mark reviewed" action; due/pending distinction in copy |
| Mistake labels (concept gap and so on) | No | — | Migration, API, UI; editable |
| Retry the exact missed question | No | Overrides cannot pin question ids | Retry attempt kind that never touches the original result |
| Strictly unseen follow-up | Partial | Selection *prefers* questions unseen in 30 days | Strict "unseen in this domain" filter plus an honest "none left" state |
| Bookmarks | Yes | `bookmarks` table and API | Notes column unused |
| Study plan | Partial | `buildStudyPlan`, computed on read | Persisted sessions, dates, completion, missed-session recovery, domain-link bug |
| Readiness and targets | Yes | `exam_targets`, `buildReadiness`, Bocconi projection | Evidence caps on individual signals |
| Practice setup validation | Yes | 409 `insufficient-content` with per-part counts | Difficulty-aware check; show preset; clamp length; unknown exam returns 500 |
| Autosave, offline | Partial | Per-change POST; offline retry queue in memory | Debounce; persist the queue (for example `sessionStorage`); visible saved state |
| Pause | No | `deadlineAfterResume` is never called | Only where an exam's rules allow it (none today) |
| Guest to account | Yes | Sign-up converts the guest in place | Signing in to an existing account does not merge guest history |
| Analytics | No | `attempt_events` is an audit trail only | Nothing added without authorisation |

## 5. Direction: Academic Avant-Garde

One identity in three registers:

- **Editorial (public pages): expressive.** Oversized condensed display type,
  an asymmetric 12-column grid, 1.5 px ink rules, and one hard offset-shadow
  object per view (the sample card). One highlighter mark per view. A dark ink
  band for the demonstration and a yellow band for the final call to action.
- **Study (inside a session): calm.** No marketing header or footer, no
  display type and no yellow. Blue only for actions and current position.
  Motion ≤ 120 ms. A 68ch measure, and split passage/question at ≥ 1024 px.
- **Report (results, dashboard, plan): clear.** A plain-language verdict first,
  then evidence. Denominators are made literal with **tally marks** (one mark
  per question) and every figure has a table equivalent.

The visual language comes from annotation: highlight, bracket label, margin
note, connector arrow and tally. Each mark has a job. The honesty the product
already practises becomes a visible feature: the live availability matrix,
"not enough evidence yet" and "not offered, and why".

## 6. Design system

### Colour (measured against WCAG 2.2)

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `ivory` | `#F7F5EF` | Page background | — |
| `paper` | `#FFFDF8` | Raised surfaces | — |
| `sunken` | `#EEEBE2` | Wells, disabled fills | — |
| `ink` | `#151923` | Primary text, rules | 16.1:1 on ivory |
| `ink-2` | `#454A57` | Secondary text | 8.1:1 |
| `ink-3` | `#5E6371` | Captions | 5.5:1 (5.0 on sunken) |
| `rule` | `#DAD6CB` | Decorative hairlines only | 1.3:1, never a boundary |
| `control` | `#8C897F` | Input and option borders | 3.2:1 |
| `blue` | `#3155E7` | Actions, links, focus ring | 5.4:1; white on it 5.9:1 |
| `blue-press` | `#2443C4` | Hover, active | White on it 7.9:1 |
| `blue-soft` / `blue-ink` | `#E7ECFD` / `#1F3BB3` | Selected fill, text on it | 7.6:1 |
| `highlight` | `#E5F58A` | Emphasis, ink text only | Ink on it 14.9:1; **1.08:1 vs ivory, so never the only signal** |
| `success` | `#1D7349` / ink `#17613D` on `#E4F2EA` | Correct, saved | 5.4:1 / 6.5:1 |
| `error` | `#B42318` / ink `#9E1F15` on `#FCEBE8` | Incorrect, failed | 6.0:1 / 6.8:1 |
| `warning` | ink `#7A4F00` on `#FBF0D3` | Caution | 6.3:1 |

Existing token names (`paper`, `surface`, `ink-muted`, `accent`, `positive`
and so on) are retuned in place first, as the last refresh did, so components
change only when they are restyled on purpose.

### Type

- **Display and interface: Bricolage Grotesque**, OFL. *As shipped:* the
  weight axis only (41 KB Latin woff2). The optical-size and width axes would
  each have roughly doubled the file (77–78 KB, or 132 KB for all axes) and
  broken the 90 KB budget, so the condensed 84% width in the concept is gone;
  display sizes get their character from weight 730–750 and tight tracking.
- **Accent: Instrument Serif Italic**, OFL. A few words per headline only.
- **Reading passages: the system serif** (Charter, Iowan Old Style, Georgia,
  Cambria). 0 KB and already proven comfortable in the product.
- Both web fonts are self-hosted with `next/font/local`, from the
  `@fontsource-variable` packages or vendored woff2. Latin subset (covers
  "Università"), `display: swap`, `adjustFontFallback`, and only the display
  face preloaded. **Budget: ≤ 90 KB of font on the homepage.**
- Tabular figures for counts and timers. Phase 2 verifies Bricolage's `tnum`
  support; if it is missing, tables and timers use the system UI face.
- Fluid scale: Display XL `clamp(3.25rem, 1.4rem + 7vw, 6.75rem)` at 0.9;
  Display L `clamp(2.5rem, 1.6rem + 3.4vw, 4rem)`; H1
  `clamp(2rem, 1.6rem + 1.4vw, 2.75rem)`; H2 1.875rem; H3 1.375rem; question
  stem 1.1875rem at 1.55; body 1.0625rem at 1.6; small 0.875rem; label
  0.75rem in caps at 0.1em.

### Space, shape, depth, motion

- 4 px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Public sections breathe at
  64–128 px.
- Radii by role: editorial surfaces 2–4 px, controls 10 px, chips full.
- Elevation: none by default; one soft raise; one **offset ink shadow**
  (`8px 8px 0 ink`) reserved for the homepage sample card.
- Focus: 2 px `blue` outline, 3 px offset, on every interactive element.
- Motion: 120 ms state changes, 180 ms reveals, and nothing at all under
  `prefers-reduced-motion`.
- Targets: ≥ 44×44 px for primary controls; answer options ≥ 52 px tall.

### Components (states in the canvas's "Design system" artboard)

Button (primary, ink, outline, text; hover, focus, active, disabled, loading),
ExamSelector (native radio group: arrow keys, focus stays put, selection shown
by fill and a marker), AnswerOption (default, selected, correct, your wrong
answer, locked), QuestionNavigator (current, answered, unanswered, flagged,
each with a distinct shape), SaveStatus (saved, saving, offline, failed),
StatusBadge (Open, Not yet, Not offered, Untimed, Timed, fidelity labels,
Illustrative), Field (default, focus, error with recovery text, disabled),
Alert (four tones), Tally, annotation primitives, EmptyState.

## 7. Navigation and information architecture

- **Public:** Exams · Guides · How scoring works | Sign in | **Start
  practising**. On mobile: wordmark, Start and a Menu disclosure.
- **Learner (registered, or a guest with a session):** *as built in Phase 2:*
  Dashboard · Exams · Mistake notebook · Study plan · Readiness, plus Account,
  or "Keep your progress" (to sign-up, which converts the guest in place) and
  "Sign in" for guests. Readiness stays a top-level item until the plan and
  readiness pages are merged (Phase 6). On mobile: one Menu disclosure.
- **In a session:** a minimal bar with exam and section, timer, save status
  and Exit. Timed sections say plainly that leaving does not stop the clock.
- **Exam context:** *not built.* A persistent preference cookie raises
  consent questions a strictly necessary session cookie does not, so the
  homepage keeps the choice in the address (`?exam=`) only. Deferred.
- `aria-current="page"` on active items everywhere.

## 8. Homepage concept (see the canvas)

Sections: (1) hero with headline, exam selector, destination and a working
sample question; (2) how practice works; (3) the mistake-notebook
demonstration on a real SAT item; (4) the live availability matrix; (5) an
illustrative progress preview, labelled as not real data; (6) credibility;
(7) final call to action and footer.

How the sample question works:

- A curated map of exam → reviewed question id. A unit test asserts that each
  sample is published and single-select, and has an explanation and
  rationales.
- The selected exam's sample is server-rendered with the product's own
  Markdown/KaTeX pipeline, including its key and explanation. It is public
  content, and it never touches attempts or assessment endpoints.
- Switching exams fetches `GET /api/samples/[hub]`. The route is public and
  read-only, serves only the curated ids, and is cacheable because it holds no
  personal data. *As built:* `?exam=` deep links are server-rendered, but there
  is no JavaScript-free way to switch exams on the page itself. The card has a
  minimum height, and focus stays on the selector.
- Checking the answer is client-side against the sample's own key and is never
  stored; no session is created.
- *As built:* five hub samples plus one demonstration item
  (`src/lib/content/public-samples.ts`), all excluded from diagnostic, timed
  and simulation selection. The LSAT sample was withheld in §11 and restored
  in the closeout once its explanation had a reviewed correction (§12.1).
- First visit defaults to SAT (a verbal item readable without maths).

**Phase 2 budgets (lab, same method as §2):** homepage JS ≤ 118 KB transfer
(+12 KB), fonts ≤ 90 KB, throttled-mobile LCP ≤ 1.5 s, CLS ≤ 0.02.

## 9. Decisions (agreed 24 September 2026)

1. **Editorial wording.** Public copy says: "AI-assisted practice questions
   with worked explanations. See our editorial standards for how questions are
   created and checked." Blind-review claims appear only because the records
   support them. All 285 published questions have an independent-solve record
   from a reviewer id distinct from the author, agreeing with the key and
   uniqueness-checked, and `scripts/export-review-batch.ts` strips keys,
   explanations and distractor notes and checks for leaks. The records name
   agent roles only; no human reviewer appears, so the copy says the blind
   solve is done by a separate AI reviewer and that no per-question human
   review is recorded.
2. **Answer locking.** Answers can change freely until the learner checks
   them. Checking persists the answer and the release of feedback in one
   guarded write, and the server refuses any later change. Timed and
   diagnostic editing rules are unchanged. Historical results are untouched.
3. **Public samples.** A fixed set, excluded from newly created diagnostic,
   timed and simulation sessions. Existing assignments are kept, and
   availability and session creation share one eligibility rule. A sample
   that would close an open format must be replaced, never accommodated by
   weakening a rule.
4. **Practice setup.** Counts combine exam, topic, skill and difficulty.
   Short drills are allowed when that is all the bank holds, a preset skill is
   shown, length adjustments are explained, and broader practice is an
   explicit choice. Server validation is retained.
5. **Guests and offline.** "Keep your progress" goes to sign-up, which keeps
   guest history. Sign-in is not promised to merge it. The offline message
   describes the in-memory queue as it is.

## 10. Phase plan, reconciled

The master brief lists eight implementation stages. Phases here map onto them
as follows. Phase 2 combined brief stages 2 and 3.

| Phase | Brief stage | Scope | Status |
| --- | --- | --- | --- |
| 1 | 1 | Inspect the product; direction, system, plan | Done |
| 2 | 2 + 3 | Tokens, typography, shared components; header, footer, mobile navigation; homepage; plus the decisions in §9 | Built (§11), closed out in §12 and §13. Content and function are done; the LCP and CLS budgets are not met (§13.7) |
| 3 | 4 | Dashboard: resume, one next action with its basis, domain-level skill landscape, all empty and error states | Next, after the budget decision in §13.7 |
| 4 | 5 | Results and mistake notebook: verdict first, evidence, review on its own page, retry flow, optional mistake labels | — |
| 5 | 6 | Practice setup formats and the player: focus mode, split passage, visible save states, persisted offline queue, debounced input | — |
| 6 | 7 | Remaining routes: hubs, guides, auth, account, study plan and readiness, admin | — |
| 7 | 8 | Validation: axe-core in CI, screen-reader pass, performance budgets, 200% zoom | — |

## 11. Phase 2: what was delivered

### Assessment integrity (behaviour changes)

- **Answer lock after feedback.** Migration `003_feedback_release.sql` adds
  `attempt_items.feedback_released_at`. `recordResponse` takes an explicit
  `reveal`, and `persistResponse` writes the answer and the release in one
  `UPDATE … WHERE feedback_released_at IS NULL` inside an IMMEDIATE
  transaction. A stale request, another tab or another process cannot
  overwrite a checked answer; the refusal is 409 `response-locked`. Repeating
  the stored answer is an idempotent success. Reveals are refused (409) in
  formats without feedback. Draft answers no longer release the key; the old
  rule released it on any saved answer. Reloaded feedback now shows
  correct/incorrect properly; before, it read `is_correct`, which is null
  until scoring. The migration backfills a release time only for answered
  items in in-progress immediate-feedback attempts, which had already shown
  their keys. Submitted attempts and `attempt_results` are untouched.
- **Public samples out of measurement formats.** `src/lib/attempts/eligibility.ts`
  is used by `startAttempt`, the adaptive reroute, `blueprintAvailability`
  and the content report.
- **Strict difficulty.** A learner's chosen level is a filter
  (`SelectionConstraint.difficulties`), no longer a mix padded with other
  levels. Configs are unchanged.
- **Unknown exam** in `POST /api/attempts` now returns 404 rather than a 500.

### Content and copy

- `digital-sat-math-ratios-rates-050` is now v2 (options `$1{,}700$` and so on).
  Seeding adds a new version row, and existing attempts stay pinned to v1
  (verified on a database with such an attempt).
- Editorial standards now describe who does what, updated 24 September 2026.
  Copy was also corrected in the independence notice, publisher name
  ("Examer"), hub page, practice page, account export and admin wording.

### Practice and study plan

- `src/lib/attempts/facets.ts`: eligible counts for any filter combination,
  tested equal to the server's check for every combination in the real bank.
- The setup form shows a preset skill, per-level counts, lengths down to one
  question, an explained adjustment and explicit "broaden" buttons. Legacy
  `?skill=<domain>` links open that topic, and unknown filters are ignored
  with a notice.
- The notebook sizes "Practise these again" from the same counts and states
  the length. Its copy no longer promises different questions.
- Study-plan untouched topics now link with `?domain=`. **This fixes the
  links only:** the plan still repeats sessions, is not stored and has no
  missed-session recovery.

### Visual system and public experience

- Tokens retuned in place, with semantic additions. Bricolage Grotesque
  (weight axis, 41 KB) and Instrument Serif Italic (22 KB) are self-hosted
  under `src/app/_fonts` with their OFL texts. The accent italic is scoped to
  the homepage. Tabular figures are verified in Bricolage.
- Shared components: buttons (with loading), badges, tone-iconed alerts,
  shape-coded status marks, cards, page headers, spinner.
- Header and footer: public and learner navigation, a mobile Menu disclosure
  (Escape returns focus), active states, and guest messaging tied to the real
  7-day session length (a test enforces it). Includes a favicon, and scroll
  padding so focus is never hidden under the sticky header.
- Homepage: hero with exam selector and a working sample; how it works; a
  mistake-notebook demonstration on a real verbal SAT item; a live
  availability table (one table that reflows on phones); an illustrative
  progress preview; credibility; final call to action.

### Checks run

- `npm run verify`: typecheck clean, content 0 errors and 0 warnings, 227
  unit and integration tests (193 before; new: `feedback-lock`,
  `eligibility`, `study-plan`, `copy-claims`).
- Playwright, both device projects, against a production build on system
  Chrome: 69 passed and 1 skipped (the existing desktop-only keyboard test).
  New `tests/e2e/phase-2.spec.ts` covers:
  - the homepage exam selector, focus and URL;
  - the sample reveal with no session created;
  - the sample endpoint;
  - phone-width overflow;
  - guest navigation, active state, the Escape key and the favicon;
  - preset skills, broadening and legacy links;
  - answer locking in the UI and through the API.
- `tests/e2e/helpers.ts` clears rate-limit counters in the disposable e2e
  database between tests. A full two-project run otherwise exceeds the
  production guest limit from 127.0.0.1. The limit itself is unchanged.
- Site sweep of 23 routes at 360 and 1440 px, as visitor and as a guest with a
  finished session: no horizontal overflow, no console errors, no error
  statuses. It found and fixed one real bug: visually hidden text inside a
  non-positioned scroll wrapper widened `/readiness` on phones, so every
  `overflow-x-auto` wrapper is now `relative`.

### Measurements (lab only; no field data exists)

Method as in §2: local production servers, cold cache; desktop 1440 px
unthrottled; mobile 390 px with 4× CPU, 1.6 Mbps and 150 ms RTT. Both builds
were served side by side and measured interleaved, 5 runs each, medians shown.
The baseline is the committed Phase 1 code built today. Transfer figures are
compressed response bodies (`encodedBodySize`; gzip from `next start`),
headers excluded.

| Route | LCP desktop (before → after) | LCP throttled mobile | JS | Fonts at load | HTML | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 212 → 656 ms | 1,328 → 2,524 ms | 104 → 112 KB | 0 → 62 KB | 14.6 → 32.2 KB | 0 → 0.004–0.007 |
| `/exams/digital-sat` | 160 → 276 ms | 1,176 → 1,964 ms | 104 → 108 KB | 0 → 40 KB | 12.2 → 14.2 KB | 0 → 0.006 |
| `/practice/digital-sat` | 168 → 268 ms | 1,388 → 2,152 ms | 107 → 111 KB | 0 → 40 KB | 14.6 → 17.7 KB | 0 → 0.003 |
| `/exams/digital-sat/format` | 232 → 296 ms | 1,492 → 2,040 ms | 104 → 108 KB | 0 → 40 KB | 22.3 → 24.4 KB | 0 → 0.005 |

Switching exams on the homepage: 56 ms desktop, 128 ms throttled (longest
event duration; a lab proxy for INP).

Against the proposed budgets:

- **Met:** homepage JavaScript +8.3 KB (budget +12 KB); fonts 62 KB at load
  (budget 90 KB); CLS at most 0.007; interaction under 200 ms.
- **Not met:** throttled-mobile LCP. The homepage is at 2.5 s (budget 1.5 s),
  and other pages are 0.55–0.8 s slower than before. This run of the baseline
  itself measured 1.2–1.5 s, and 1.1 s in Phase 1.

Diagnosis so far:

- First paint equals LCP everywhere, so first paint itself is late.
- Traces show the extra time is main-thread layout before first paint:
  - **Homepage:** about 1.7 s of layout, against 0.7 s for the baseline. It
    has about 630 elements against 220 and a hydration payload that repeats
    the server markup. This was reduced from 300 KB and about 2,100 elements
    by moving the demonstration to a non-maths item, drawing status marks in
    CSS and rendering the availability table once.
  - **Other pages:** layout takes about 1.0–1.1 s against 0.4–0.55 s on a
    similar element count.
- Blocking the web fonts, forcing the old system font stack, disabling
  `text-wrap` balancing and making the header static each left that unchanged.
  `content-visibility: auto` on later sections did not help either.
  *Closeout correction:* these stylesheet experiments were invalid. The
  injected `<style>` was added before the parser built the document and was
  discarded, so none of them applied. See §12.2 for the real cause.
- The per-page layout cost is **not yet explained**. It needs a DevTools
  layout profile, which is listed below. *Explained in §12.2.*

### Deferred, with reasons

1. **Throttled-mobile LCP over budget**, as above. Next step: a DevTools
   layout profile of `/exams/digital-sat`, before and after; then reduce the
   homepage's below-the-fold content or hydration payload. *Closeout: cause
   found and fixed for the exam pages; the homepage is still over budget
   (§12.2).*
2. *Closeout: resolved, see §12.1. The counts below were an undercount.*
   **Stale option letters in explanations.** `normalise-option-order.ts`
   reordered 188 of 285 published questions after review. It remapped keys
   and rationale ids but not letters written in explanation or rationale
   text. 92 of those name option letters. Fifteen explicitly name the wrong
   answer letter; for example, `digital-sat-rw-boundaries-infrared-011`
   ends "Choice B." while the key is C. This needs a reviewed, versioned
   correction pass. Until then the **LSAT homepage sample is withheld**
   (`WITHHELD_SAMPLES`): every LSAT explanation names letters, and the
   candidates checked were wrong. A test keeps any public sample from
   naming letters.
3. **Sample exclusion costs:** formats that were already closed move further
   from opening. SAT Reading and Writing modules go from 1 short to 3 (two
   public items are Reading and Writing), the SAT simulation from 48 to 50
   short, and GMAT Quantitative from 5 to 6. LSAT is unaffected while its
   sample is withheld. No open format closed (`tests/unit/eligibility.test.ts`).
   *Closeout: the restored LSAT sample closes no LSAT format either.*
4. Remembered exam across visits (needs a consent decision); switching exams
   without JavaScript.
5. The player's visible save status, a persisted offline queue and debounced
   typing (Phase 5). The offline message is accurate now; the behaviour is
   unchanged.
6. The study plan's repetition, persistence and missed-session recovery;
   readiness per-signal evidence caps; the notebook's due-versus-missed
   wording (Phases 3, 4 and 6).
7. Signing in to an existing account does not merge guest history. The copy
   says so; merging would be new backend work.
8. The practice page still opens with the exam's long summary paragraph
   (Phase 5).

## 12. Phase 2 closeout (24 September 2026)

Three things were open at the end of §11: stale option letters in
explanations, the throttled-mobile LCP regression, and the database and commit
state. This section reports what was checked, what changed and what is still
not met.

### 12.1 Content: stale option letters (resolved)

**What was checked.** All 189 questions that `normalise-option-order.ts` had
reordered (188 published, 1 quarantined), not only the 92 that the §11 pattern
caught. Five audit agents matched every letter or positional reference in
explanations and distractor notes to the option whose content it describes,
and inferred each item's old order. A script then checked their work:

- every edit changes only letters, or a listed phrase;
- every changed letter follows the item's inferred old-to-new mapping;
- the mapping agrees with an independent signal. Distractor notes were written
  in option order and the reorder kept their key order, so they record the old
  order of the wrong options. All 115 items where both could be compared
  agreed; none disagreed.

Not every letter was wrong: in 10 items the letters happened to be right.

| Finding | Items |
| --- | --- |
| The explanation pointed to a wrong option as the answer, or walked through the answer under a wrong letter | 91 published, 1 quarantined |
| Only wrong options were mislabelled | 13 |
| Letters already correct, or no option references | 84 |

Along the way, 11 false statements about options in 10 items were found and
fixed: five by the auditors and six by the reference check described below.
They were not letter problems:

- `bocconi-law-logic-lecture-week-035`: option C read "Family is delivered on
  Friday", which holds exactly when D does, so its note and the explanation
  were false. C now reads "Family is delivered on Thursday", the mirror-image
  option the note describes.
- `moot-rounds-032`: the sentence saying which draw rules out which option was
  wrong under any lettering.
- `permit-deducible-049`, `course-enrolment-033`, `appeal-outcomes-022`,
  `applications-per-place-021`, `bikeshare-036` ("doubled" should be
  "tripled"), `power-quotient-030`, `logexp-difference-041` and
  `equivalent-expressions-047`: a wrong pair, figure or described error.

**How it was corrected.** Every fix is a new version; v1 stays attached to
earlier attempts. The 105 published items moved to `in_review`, which removes
them from new sessions. While they were withheld, nine open formats closed:

- the SAT diagnostic and both timed maths modules;
- the ACT, LSAT and Bocconi law diagnostics;
- Bocconi law practice;
- GRE timed verbal 2.

Two checks followed. A separate AI reviewer, given the corrected text,
re-checked every option reference against the option text. Every reference in
all 106 items pointed at the right option, but six items made false claims
about options, and those were fixed before publication.

Then came a new blind solve through the existing pipeline:

- `export-review-batch.ts`, whose leak check passed;
- seven fresh solver agents, which saw no key, explanation or note;
- `apply-review.ts`.

It agreed with the key on 105 of 105, with uniqueness confirmed, so nothing was
quarantined. The records carry solver ids `closeout-blind-solver-s1` to `s7`
and a dated note saying what changed. After republication the bank is back to
285 published questions, and every format's availability is exactly as it was
before the closeout. *Second pass correction:* restoring the LSAT sample
afterwards took one Logical Reasoning item out of timed formats, so LSAT timed
LR 1 and LR 2 went from 1 to 2 questions short. Both were already closed.

**Guards against a repeat:**

- The validator now rejects an explanation that explicitly presents a non-key
  option as the answer (`explanation-names-wrong-answer`). It reads explicit
  statements only. On the old bank it flags 35 of the 91 published answer
  defects; on the corrected bank it flags none.
- `normalise-option-order.ts` leaves alone any item whose prose names option
  letters, and lists it for hand editing.
- `tests/unit/explanation-letters.test.ts` covers the rule. The public-sample
  test now requires audited letters rather than forbidding letters outright.
- The editorial standards page lists the check and records the correction.

**LSAT sample restored.** `lsat-lr-compost-supported-127` v2 is the LSAT
homepage sample. Excluding it from measurement formats closes no LSAT format.

**Still open:**

- The other 179 published explanations have had no independent check of
  their claims about options. *Second pass: the figure is 180 (285 published
  minus the 105 re-solved), and they were checked; see §13.* That check found six false claims in the 106
  corrected items, so the rest very likely contains some. This is the same
  gap the editorial page already states: explanations are not independently
  re-read.
- One solver concern did not affect the answer.
  `digital-sat-math-two-variable-data-021` says "weeks since the first
  measurement" but labels the weeks 1 to 6.
- `enhanced-act-read-time-use-table-023` stays quarantined for its second
  defensible answer; its letters are fixed.

### 12.2 Performance: what the regression was

**Two flaws in the §11 method, found and removed:**

- The stylesheet experiments in §11 appended a `<style>` to the document
  before the parser replaced it, so none of them applied.
- Requests served through Playwright's route interception skip Chrome's
  network emulation, so timings from such runs are not comparable. They are
  used below only for counts and CPU time.

Every comparison below uses real builds served side by side, with no
interception.

**Cause.** A trace with Chrome's font categories, of one throttled load of
`/exams/digital-sat`:

- First paint waits for a single layout pass: 509 ms in Phase 1 and 1,064 ms in
  Phase 2, for about the same 250 objects.
- Inside that pass, Chrome created 19 typefaces, against 4 in Phase 1, and 15
  of them were re-parses of the 1 MB Arial file. That file backs the
  `local("Arial")` face that next/font generates for `adjustFontFallback`,
  which Chrome rebuilds for every size and weight.
- Removing that face alone left 12 typefaces from 7 files. The system-UI stack
  behind it loads one Segoe UI file per weight, and the design uses weights
  300 to 800.
- Next's font manifest comes out empty on Windows, so Windows builds emit no
  font preload. `NextFontManifestPlugin` matches `'/next-font-loader/index.js?'`
  with forward slashes. Linux builds emit the preload, so both cases were
  measured. *Second pass: the cause is now verified in a build (§13.4); that
  Linux builds preload is inferred from the code, not observed.*

**Fix** (`src/app/_fonts`, `globals.css`): no metric-adjusted fallback face,
and Bricolage falls back to `Arial, sans-serif` rather than the system-UI
stack. On the exam page the first layout now creates 6 typefaces from 3
files, and its CPU time fell from 784 ms (system stack) to 506 ms, about
Phase 1's level. The design is unchanged once the web font arrives; only the
brief fallback differs.

**Results.** Lab only, on mains power, fresh context per load, 390 px, 4× CPU,
1.6 Mbps and 150 ms RTT. The builds were interleaved, 7 runs each, and medians
are shown. The two closeout columns are the fixed font configuration as a
Windows build emits it (no preload) and as a Linux build does (with preload).
They differ from the final code only in the question text and in where the font
is declared. A rerun of the final build itself was interrupted when the laptop
switched to battery, which made every build, the baseline included, about 2.5×
slower; those numbers are discarded.

| Throttled-mobile LCP | Phase 1 | Phase 2 as committed | Closeout, no preload | Closeout, with preload |
| --- | --- | --- | --- | --- |
| `/` | 1,444 ms | 2,740 ms | 2,116 ms | 2,256 ms |
| `/exams/digital-sat` | 1,168 ms | 1,888 ms | 1,436 ms | 1,456 ms |
| CLS, highest run (`/`, exam page) | 0, 0 | 0.0008, 0.0001 | 0.0008, 0.0199 | 0, 0 |

JavaScript (112 KB on the homepage), fonts (62 KB) and CSS (13 KB) are
unchanged. The exam-page CLS maximum of 0.0199 was one run in seven, when the
font swapped after the first paint; the median was 0. That is within the 0.02
budget, but only just, and only for builds without the preload.

This laptop's speed drifts between batches: the same Phase 1 homepage
measured between 1.1 and 1.6 s across today's batches. Compare columns within
a row, not against other sections.

The final build itself was then checked on battery, for the ratio only. Every
build ran about 2.5× slower, so the absolute figures are not comparable.
Interleaved with the baseline on the exam page, LCP was 1.05× Phase 1's
(1.09× with the preload), and CLS again peaked at 0.0199 in one run without
the preload and at 0 with it.

**Against the budget (1.5 s):** the exam page now meets it in this batch,
0.27 s slower than Phase 1 instead of 0.72 s. **The homepage does not: 2.1 s.**
The practice and format pages were not re-measured on mains power. They share
the exam page's font setup and element count, so the same fix applies, but no
closeout figure exists for them.

**Why the homepage is still slow.** Hiding everything below the hero
(diagnostic only) brings the homepage to 1.27–1.44 s, Phase 1's level. The
cause is layout of the below-the-fold content: 393 of its 622 elements, plus
the footer, all laid out before the first paint. No single section dominates.
`content-visibility: auto` recovers only 0.1–0.2 s, because Chrome lays such
elements out on the first frame, before it knows they are off-screen. The
remaining options change the design or the rendering approach, so they are
left for a decision (§12.6).

### 12.3 Database

- **Backups** (git-ignored `tmp/backups/`; `npm run db:reset` does not touch
  them, `git clean -x` would):
  - `examer-2026-09-24-before-closeout-seed.db`: an online SQLite backup taken
    while the dev server was running. Integrity check ok, and its row counts
    are identical to the source.
  - `examer-2026-09-24-before-migration-003.db`: moved there from the
    temporary scratch location where §11 left it.
- **Seed.** Adds the 106 corrected versions and the Phase 2 maths v2: 395
  version rows, 285 published. The dev database holds 1 user, 9 attempts, 81
  attempt items and 3 results. All 81 items and 3 results are identical before
  and after, and all stay on v1, including the 20 corrected questions that
  appear in those attempts.

### 12.4 Checks run in the closeout

- `npm run verify`: typecheck clean, content 0 errors and 0 warnings, 231
  tests (4 new).
- Playwright, both device projects, against a production build of the final
  code with its own disposable database: 69 passed, 1 skipped (the existing
  desktop-only keyboard test), none failed.
- Site sweep of the same 23 routes as §11, at 360 and 1440 px, as a visitor and
  as a guest: no horizontal overflow, no console errors, no error statuses.
- The restored LSAT sample answered wrongly and revealed, on the final build:
  the verdict names D, and the explanation now says "That is (D)."
- Content: the letter audit, the mechanical cross-check, the reference check
  and the blind solve, as in §12.1.

### 12.5 Commits

- `a4c87ae` (committed by the user during the closeout) contains all the
  closeout content and performance changes together. Its message,
  "feat(dashboard): …", does not describe them. It also contains two
  unrelated archives, `profile-redesign.zip` and `profile-starchaser.zip`,
  and an empty `trace-detail.mjs` that a failed command of mine created.
- On `FronDesign`, a documentation commit on top of `a4c87ae` adds this
  section and removes the empty file.
- Branch `phase2-closeout-split`, from `2c58e82`, holds the same changes as
  separate commits: `1c09712` content corrections, `bce92a5` the LSAT sample,
  `e9efe67` the font fix, then documentation and the homepage line break. It
  leaves out the archives and the empty file. Nothing has been rewritten or
  pushed; adopting it is the user's choice.

### 12.6 Acceptance

**Met:**

- Content defects: the confirmed misleading explanations are corrected,
  re-reviewed and republished through the versioning process.
- Historical attempts are untouched, and the LSAT sample is restored.
- Assessment behaviour is unchanged.
- Budgets for JavaScript, fonts and CLS, and LCP on the exam hub page. The
  interaction figure is §11's (128 ms throttled); the closeout did not change
  any script.

*Superseded by §13.7, which reports the final state after the second pass.*

**Not met:** throttled-mobile LCP on the homepage, 2.1 s against 1.5 s.
Phase 2 is therefore **not fully complete**. The choices are:

1. Trim the homepage's below-the-fold content. This is a design change.
2. Defer rendering of the below-the-fold sections until after the first paint.
   This relies on script, and costs a frame of hidden content and some
   anchor-link care.
3. Keep the design and set a homepage budget that matches it.

Phase 3 can start once that choice is made. The other open items, §11's
deferred list and §12.1's "still open", belong to later phases or are recorded
as known gaps; none of them blocks Phase 3.

## 13. Phase 2 closeout, second pass (24 September 2026)

Decisions given for this pass:

- Make the homepage leaner without JavaScript-deferred content, keeping the
  hero, exam selector and interactive sample.
- Verify performance on the exact final build and on mains power.
- Check the remaining explanations independently.
- Fix the SAT chart.
- Keep the ACT item quarantined.
- Keep `FronDesign`'s history.
- Leave the budgets unchanged.

### 13.1 Question sets, reconciled

Earlier sections used several counts. This is what each one refers to.

| Set | Questions |
| --- | --- |
| The bank | 288: 285 published, 3 quarantined |
| Reordered by `normalise-option-order.ts` after review | 189: 188 published, 1 quarantined |
| First pass: letter audit, inspected | all 189 |
| First pass: stale letters that pointed to a wrong answer, or walked through the answer under a wrong letter | 92: 91 published, 1 quarantined |
| First pass: stale letters that only mislabelled wrong options | 13, all published |
| First pass: new versions | 106: the 105 above, plus `logexp-difference-041` for a misleading check |
| First pass: re-checked independently and blind-solved again | the 105 published of those 106 |
| Second pass: checked independently for every claim about the options | 180, the rest of the published bank (285 − 105): 83 reordered but unchanged, 97 never reordered |
| Second pass: corrected as new versions | 37 from that check, plus `digital-sat-math-two-variable-data-021` for its chart |
| Second pass: re-checked and blind-solved again | those 38 |
| Published questions with no independent check of their option claims | none |
| Quarantined questions checked | none; the 3 are not served |

Two counts in §11, "92 name option letters" and "15 name the wrong answer",
came from text patterns and are superseded by the audit above. The "104
published explanations" in §12 and on the editorial page are the 91 and 13 in
the table. The "179" in §12.1 was an arithmetic slip for 180.

The two checks were not identical:

- **First pass (the 105):** looked at option references and at any false
  statement about the options.
- **Second pass (the 180):** also re-solved every item and redid every
  computation.

### 13.2 Content

**The check.** Six reviewer agents took the 180 questions. They had not seen
this work before, and each got every option and the key. They solved each
item, then tested every claim the explanation and the distractor notes make
about the options.

**Result:**

- Every key was confirmed correct, and no text pointed to a wrong option as
  the answer.
- 27 items made 31 false statements, for example:
  - a note describing an error that does not produce its option;
  - "the three options at or below 84" where there are two;
  - "175 tickets already exceeds the 180 sold";
  - the jetty placed in a sentence that never mentions it.
- 22 findings were marked imprecise.

I checked every finding against the stored question before editing: the
arithmetic redone, the passage or table read. All 27 were confirmed. The 22
"imprecise" findings split three ways:

- 10, in 10 further items, were false on inspection and were corrected: for
  example "subscripts" where there are none, "three words long" for four
  words, and "the passage never says" where it does;
- 6 sat in items already being corrected and were fixed with them;
- 6 were loose but true and were left, as listed below.

That gives 37 items and 47 edits.

**Left unchanged, because the wording is loose but true:**

- `lsat-cr-expert-instance-112`, the note on C;
- `lsat-rc-language-inference-109`, the note on C;
- `bocconi-ug-geo-trapezoid-area-037`: its 14 × 5 bound is valid, if not the
  tightest;
- `enhanced-act-read-slack-water-relationship-018`;
- `enhanced-act-sci-germination-interpolate-032`: it rests on interpolation;
- `gre-verbal-se-hedged-recommendations-022`.

The re-check below added six more of the same kind, in items already
corrected: `codification-implicit-005` note B, `bakery-018` note D,
`word-meaning-017` note A, the explanations of `insulation-criteria-038` and
`average-removed-crate-202`, and "spread by factors of two" in
`estimation-006`.

**The SAT chart.** `digital-sat-math-two-variable-data-021` defined w as
"weeks since the first measurement", but its data labelled that measurement
week 1. The line h = 7.2w + 4.8 was fitted to those labels, and option A's note
relied on w = 0 being the first measurement.

- The chart, now stimulus v2, counts weeks from 0.
- The line is refitted by least squares: slope 7.2, intercept 12, which is the
  measured height at w = 0. The fit was checked in code.
- The explanation, the notes on A and B and the screen-reader description use
  the new line.
- Earlier versions keep stimulus v1.

**Process.** The existing process was used:

- Every fix is a new version, and earlier attempts keep their versions.
- The 38 moved to `in_review`, and that state was also seeded into the dev
  database, so they were withheld from new sessions.
- A separate AI reviewer re-checked every claim in the corrected text: 38 of
  38 correct, with 6 imprecise notes, listed above.
- A new blind solve went through `export-review-batch.ts` (leak check passed)
  and `apply-review.ts`: 38 of 38 agreed, uniqueness confirmed, none
  quarantined.
- The 38 were republished.

**Availability:**

- **While withheld:** SAT timed maths modules 1 and 2 and the Bocconi law
  diagnostic closed, and the GMAT homepage sample (`units-digit-cycles-204`,
  one of the 38) was hidden.
- **Permanent change:** none. All 47 format entries match the committed state
  from before the pass.

**Still quarantined:** `enhanced-act-read-time-use-table-023`, for a second
defensible answer. It needs a rewrite and a new review; its letters were fixed
in the first pass.

### 13.3 Homepage

**Kept:** the hero with its display headline, the exam selector and the
interactive sample, "How it works", the credibility section and the yellow
closing band.

**Consolidated:**

- **The mistake-notebook demonstration.** It was a second worked question
  directly after the hero's own. Its one unique line, that a distractor note
  is written in advance and is not a claim about how the learner reasoned, now
  appears under "Why X doesn't work" in the sample. "Retrying never changes the
  original session's result" joins step 04.
- **The seven-exam availability table.** It is now a per-exam summary: what is
  open, what needs more questions, and what is not offered because its rules
  are unverified. The summary keeps the limits note and links to the full
  table, which moved to `/exams#formats`. Practice pages still state each
  format's limits before a session starts.
- **The illustrative progress table.** It moved to How scoring works, as "What
  accuracy by topic looks like", beside the reporting rules it illustrates.
  The four-answer threshold now comes from `MIN_ATTEMPTS_FOR_SIGNAL`, and the
  page's updated date is 24 September 2026.

**Result:**

- Elements went from 622 to 338 (Phase 1: 217), and below the fold from 393
  to 123.
- Compressed HTML went from 32.3 to 18.7 KB.
- There is no horizontal overflow at 360 px.
- No content depends on script, and there is no `content-visibility`: Chrome
  lays such content out on the first frame anyway (§12.2).
- The demonstration item stays out of measurement formats, because its answer
  has been public.

### 13.4 Performance

**Metrics:**

- **LCP:** the `startTime` of the last `largest-contentful-paint` entry.
- **FCP:** the `first-contentful-paint` entry.
- **CLS:** the sum of layout-shift values without recent input, observed until
  the fonts were ready plus 1.5 s.

In this pass's measurements, LCP and FCP were identical in every reported
statistic: the largest element is painted in the first frame.

**Method:**

- **Builds:** the exact final code (`5d32b0f`) and the committed Phase 1 code,
  each run with `next start`, with no request interception.
- **Browser:** Chrome 153.
- **Loads:** a fresh context each time (cold HTTP cache), with the build order
  alternating.
- **Mobile:** 390 × 844 at DPR 2, 4× CPU, 1.6 Mbps down, 750 kbps up and 150 ms
  RTT; 9 runs per route.
- **Desktop:** 1440 × 900, unthrottled; 5 runs.
- **Conditions:** mains power throughout. Nothing else was running except the
  idle dev server and other desktop applications, at about 20–35% CPU.
- **Sizes:** compressed bodies (`encodedBodySize`, gzip from `next start`),
  headers excluded.

**Throttled mobile, final batch:**

| Route | LCP Phase 1, median (IQR) | LCP final, median (IQR, range) | CLS final, highest run |
| --- | --- | --- | --- |
| `/` | 1,400 (1,384–1,464) | 1,972 (1,904–2,024; 1,776–2,152) | 0.0008 |
| `/exams/digital-sat` | 1,368 (1,352–1,376) | 1,644 (1,572–1,664; 1,496–1,672) | 0.0199 |
| `/practice/digital-sat` | 1,496 (1,472–1,508) | 1,668 (1,612–1,676; 1,560–1,740) | 0.0004 |
| `/exams/digital-sat/format` | 1,540 (1,452–1,572) | 1,672 (1,592–1,684; 1,556–1,712) | 0.0296 |

The same effective build measured an hour earlier gave these differences over
Phase 1: +388, +184, +264 and +184 ms. So the gap is +0.39–0.57 s on the
homepage and +0.13–0.28 s elsewhere. Phase 1 CLS was 0 on every route.

**Desktop, final batch, LCP median:**

| Route | Phase 1 | Final | CLS final |
| --- | --- | --- | --- |
| `/` | 192 | 276 | 0.0122 |
| `/exams/digital-sat` | 180 | 204 | 0.0005 |
| `/practice/digital-sat` | 180 | 216 | 0.0562 |
| `/exams/digital-sat/format` | 196 | 216 | 0.0028 |

Sizes on the homepage: JavaScript 104 → 112.3 KB, CSS 10.6 → 13.4 KB, fonts
0 → 62 KB. On the other pages, fonts are 40.4 KB.

**Against the budgets:**

- **Met:** JavaScript, +8.3 KB against the +12 KB budget. Fonts, 62 KB against
  90 KB.
- **Not met:** throttled-mobile LCP of 1.5 s, on all four routes. Phase 1
  itself misses it on the format guide in this batch: this machine now
  measures the Phase 1 code at 1.37–1.54 s, where Phase 1 measured
  1.05–1.10 s.
- **Not met:** CLS of 0.02, on the mobile format guide (0.0296) and the desktop
  practice page (0.0562).

**The font preload, verified.** A build probe printed the request string that
Next's `NextFontManifestPlugin` tests:

- The request reads `…\loaders\next-font-loader\index.js??ruleSet…`.
- The plugin looks for `'/next-font-loader/index.js?'`.
- With backslashes the test fails; with forward slashes it passes.

So on Windows the font manifest is empty and nothing is preloaded, which is
what the built pages deliver. Linux builds would preload; that is inferred
from the code, not observed.

A same-batch comparison then showed that the preload hurts here. The 41 KB
font competes with the stylesheet on the slow link, and first paint moved from
1,876 to 2,064 ms on the homepage and from 1,640 to 2,172 ms on the practice
page. The preload did remove the mobile shift, but it did not fix the desktop
one. Both fonts now set `preload: false`, so every build behaves as measured.
An intermediate attempt that served Bricolage from `public/` with a manual
preload was measured and reverted for the same reason.

**The remaining layout shift, verified.** The cause is the web font swapping
in about 70 ms after the first paint, once the main thread is past hydration.
Text rewraps by a line: on the practice page, the long summary paragraph
pushes the grid down 30 px. With the font request blocked, the shift is zero.
Arial is within 1–5% of Bricolage's widths. Trebuchet MS is marginally closer
(1–3%), not enough to stop the rewrap, and Verdana, Tahoma, Segoe UI and
Calibri are further off. The trade-offs:

1. **Metric-adjusted fallback (`adjustFontFallback`).** Removes most of the
   swap shift. In §12, taking it out alone saved 0.36–0.55 s of mobile first
   paint on Windows Chrome, so it costs roughly that.
2. **Preload.** Removes the mobile shift and costs 0.19–0.53 s of mobile first
   paint. It leaves the desktop shift.
3. **`font-display: optional`.** No shift and no cost. But a slow first visit
   keeps Arial for the whole session, because navigation stays in one
   document.
4. **Shorter opening paragraphs** on the practice and format pages. §11's
   deferred item 8 already asks for this. It reduces what rewraps, without
   touching the fonts.

**The homepage's remaining 0.4–0.6 s.** Content below the hero is down to 123
elements. What remains relative to Phase 1:

- the hero itself (84 elements, with the exam selector and a full sample
  question, which Phase 1's hero did not have);
- a larger header;
- two web fonts, their fallback files and the swap.

Closing it needs a design change:

- a lighter first view, for example a sample question that shows its options
  only once an exam is chosen;
- system fonts on the homepage, which gives up the identity typeface;
- or a homepage budget that fits the agreed design.

None was applied, as instructed.

### 13.5 Repository

- `FronDesign` keeps its history.
- **Commits this pass:**
  - `2ec2652` stops tracking `profile-redesign.zip` and
    `profile-starchaser.zip`. They are GitHub profile README packages,
    unrelated to Examer. The local copies are kept and listed in
    `.git/info/exclude`, so they cannot be swept in again.
  - `100efa1`: the content corrections, 38 questions and 1 stimulus.
  - `9f79bdc`: the leaner homepage.
  - `5d32b0f`: the font preload setting.
  - A copy commit adding the second check to the editorial-standards
    corrections note.
  - A documentation commit with this section.
- `phase2-closeout-split` is kept as a reference and not merged.
- Nothing is pushed.

### 13.6 Database and checks

- **Backup:** `tmp/backups/examer-2026-09-24-before-closeout2-seed.db`, an
  online backup with integrity ok and identical counts.
- **Seeding:** the dev database was seeded twice, first with the 38 withheld,
  then with them published.
- **Now:** 433 version rows and 285 published. All 38 corrected items are
  current and match their files, and their previous versions are intact. The
  1 user's 81 attempt items and 3 results are identical before and after, and
  all still point at v1.
- `npm run verify`: typecheck clean, content 0 errors and 0 warnings, 231
  tests.
- **Playwright** on the final build: 71 passed, 1 skipped (the existing
  desktop-only keyboard test). The new test covers the homepage summary and
  its link to the full table.
- **Site sweep:** 23 routes at 360 and 1440 px, as a visitor and as a guest.
  No overflow, no console errors, no error statuses.

### 13.7 Acceptance

**Completed:**

- Every published question has had an independent check of its claims about
  the options.
- Every confirmed defect is corrected, re-checked, blind-solved and
  republished through versioning. Historical attempts are untouched, and there
  is no permanent change to availability.
- The SAT chart is fixed and the LSAT sample restored.
- The homepage is consolidated with its identity intact, and the detail moved
  to `/exams` and the scoring page.
- The preload behaviour is verified and made consistent.
- The repository is cleaned up and the database backed up.

**Deferred features, unchanged:**

- remembered exam, and switching exams without JavaScript;
- the player's save status and a persisted offline queue;
- study-plan persistence, repetition and recovery;
- guest-history merge on sign-in;
- the practice page's long opening paragraph;
- a rewrite of the quarantined ACT item;
- the 12 loose-but-true wordings in §13.2.

**Unresolved acceptance criteria:**

- **Throttled-mobile LCP ≤ 1.5 s:** missed on all four routes. The homepage
  is at about 2.0 s.
- **CLS ≤ 0.02:** missed on the mobile format guide (0.0296) and the desktop
  practice page (0.0562).

**Recommendation.** Close Phase 2's content and functional work. Keep only the
two budgets open, and decide them before Phase 3.

- **CLS:** the least costly fix that keeps the design is trade-off 4, shorter
  opening paragraphs, pulled forward from Phase 5, then a re-measure.
- **LCP:** the absolute 1.5 s is out of reach on this machine even for the
  Phase 1 code on one route. Either choose one of the design changes in §13.4,
  or restate the budget relative to Phase 1 measured in the same batch. The
  current gap is +0.4–0.6 s on the homepage and +0.13–0.28 s elsewhere.
