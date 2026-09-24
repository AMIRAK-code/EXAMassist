# Redesign — Phases 1 and 2: assessment, direction, plan and delivery

The "Academic Avant-Garde" redesign. Sections 1–8 are the Phase 1 assessment
and proposal, written before anything changed; where Phase 2 built something
differently, the text says so in place ("as built", "as shipped"). Section 9
records the decisions agreed for Phase 2, section 10 reconciles the phase
numbering with the master brief, and section 11 reports what Phase 2 delivered,
how it was checked, the before-and-after measurements and what is deferred.

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
  and simulation selection. The LSAT sample is **withheld**: see §11.
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
| 2 | 2 + 3 | Tokens, typography, shared components; header, footer, mobile navigation; homepage; plus the decisions in §9 | Done (see §11) |
| 3 | 4 | Dashboard: resume, one next action with its basis, domain-level skill landscape, all empty and error states | Next |
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
- The per-page layout cost is **not yet explained**. It needs a DevTools
  layout profile, which is listed below.

### Deferred, with reasons

1. **Throttled-mobile LCP over budget**, as above. Next step: a DevTools
   layout profile of `/exams/digital-sat`, before and after; then reduce the
   homepage's below-the-fold content or hydration payload.
2. **Stale option letters in explanations.** `normalise-option-order.ts`
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
