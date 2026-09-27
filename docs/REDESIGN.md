# Redesign — Phases 1 to 5: assessment, direction, plan and delivery

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
Section 14 records the revised budgets and the layout-stability pass, gives
the final measurements and acceptance, and proposes the scope of Phase 3.
Section 15 reports Phase 3: resume, the dashboard and the homepage's way back
in for returning learners, with its tests, measurements and acceptance.
Section 16 reports Phase 4: results, a question on its own page, the mistake
notebook, labels, retries and new-question practice. Section 17 reports
Phase 5: the notebook's pages, question typography, saving and recovery in
the player, focus mode, and new questions only in setup, with the
measurements, the performance closeout, the revised budget for maths review
pages and the final acceptance (§17.15).

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
*Revised on 25 September 2026 (§14.1):* the throttled-mobile median LCP
budget is ≤ 2.2 s on the homepage and ≤ 1.8 s on the exam hub, practice
setup and format guide. These are local regression budgets. The others are
unchanged.

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
| 2 | 2 + 3 | Tokens, typography, shared components; header, footer, mobile navigation; homepage; plus the decisions in §9 | **Complete** (26 September 2026). Built in §11, closed out in §12–§14, and accepted against the revised budgets (§14.8) |
| 3 | 4 | Dashboard: resume, one next action with its basis, domain-level skill landscape, all empty and error states | **Complete** (26 September 2026, §15), with learner navigation back in from the homepage |
| 4 | 5 | Results and mistake notebook: verdict first, evidence, review on its own page, retry flow, optional mistake labels | **Complete** (26 September 2026, §16), accepted functionally; its open issues are recorded in §17.1 |
| 5 | 6 | Practice setup formats and the player: focus mode, split passage, visible save states, persisted offline queue, debounced input | **Complete** (27 September 2026, §17), accepted against the revised budgets of §17.15. Outstanding release check: the player's sticky bars on a real phone |
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
   (Phase 5). *Resolved in §14: a one-line lead, with the summary after the
   formats.*

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

*Decided in §14: the design and its measured cost are accepted, the LCP
budgets are revised, and the CLS pass is done.*

## 14. Layout-stability pass and revised budgets (25–26 September 2026)

Decisions given after §13:

- Keep the visual identity, the branded fonts, the exam selector and the
  interactive homepage sample. The measured design and performance trade-off
  in §13.4 is accepted.
- Revise the LCP budgets (§14.1). Keep the JavaScript and font budgets.
- Do one focused layout-stability pass on the practice setup and the format
  guide, keeping CLS at 0.02. Inspect what actually moves, and do not assume
  shorter copy alone fixes it. No broad font or homepage change.
- Keep the ACT item quarantined and track its correction separately. It is now
  open item 5 in `docs/TASK-BOARD.md`.
- Do not start Phase 3; present its scope.

### 14.1 Budgets, as revised

| Metric | Budget | Statistic |
| --- | --- | --- |
| Throttled-mobile LCP, homepage | ≤ 2.2 s | median of 9 runs |
| Throttled-mobile LCP, exam hub, practice setup, format guide | ≤ 1.8 s | median of 9 runs |
| Throttled-mobile LCP, question review pages without maths *(proposed in Phase 4, §16.10; kept in Phase 5, §17)* | ≤ 1.8 s | median of 9 runs |
| Throttled-mobile LCP, question review pages with maths *(revised 27 September 2026, §17.15: accepts the cost of showing maths explanations in full; they failed 1.8 s)* | ≤ 2.2 s | median of 9 runs |
| CLS, each measured route, mobile and desktop | ≤ 0.02 | highest run |
| Homepage JavaScript | ≤ 118 KB (Phase 1 plus 12 KB) | compressed transfer |
| Web fonts on the homepage | ≤ 90 KB | compressed transfer |

The conditions are §13.4's, unchanged:

- the exact final build and the committed Phase 1 build, both under
  `next start`;
- Chrome 153, a cold context for every load, and the two builds interleaved;
- throttled mobile at 390 × 844, DPR 2, 4× CPU, 1.6 Mbps down, 750 kbps up
  and 150 ms RTT, 9 runs per route;
- desktop at 1440 × 900, unthrottled, 5 runs;
- mains power.

These are **local regression budgets** for this machine and method. They are
not claims about field performance, for which no data exists.

### 14.2 What was moving

This was measured, not assumed, in three ways:

- **Chrome's trace.** The `LayoutShift` events give each shift's score and
  the farthest distance anything moved.
- **Blocked font.** With the web-font request failing, the shift is zero on
  every route, so the only cause is the font swap.
- **A deterministic reproduction.** The page loads with the font blocked, so
  it lays out in Arial as on a slow first visit. Bricolage is then added
  through the FontFace API under the page's own family name, and every
  element and text line is compared before and after. This reproduced the
  lab's scores exactly: 0.0562, 0.0296, 0.0199, 0.0004 and 0.0028.

**How a shift is scored**, which decides the fix: the area of everything that
moved, multiplied by the farthest any one thing moved, as a fraction of the
viewport's longer side. Moves under 3 px are ignored. A small fragment that
jumps a long way therefore multiplies an ordinary one-line push of a whole
block.

| Page and width | Before | What moved |
| --- | --- | --- |
| Practice setup, 1440 | 0.0562 | The lead, which was the exam's whole summary, gained a line and pushed the card grid down 30 px. The "How questions are checked" link at the end of a wrapped sentence jumped 250 px to the next line, and that jump set the distance. |
| Format guide, 390 | 0.0296 | "In short" gained a line, a 25 px push. The date in "…Verified 18 September 2026." jumped 45 px. |
| Format guides at other widths | up to 0.3053 (GRE, 414) | The breadcrumb trail fitted on one line in Arial and wrapped in Bricolage: the last crumb jumped 237 px and the page moved down 24 px. The date jumped up to 333 px, and the "· 2026–27" after the version label up to 325 px. |
| The header, every page | about 0.0004 on its own | The wordmark gets narrower, so the navigation moves 4–11 px. |

The lab measures two widths. The same reproduction was therefore run for
every exam's practice setup, format guide and hub at 360, 375, 390, 414, 768,
1024, 1280 and 1440 px. It found **29 page and width combinations over 0.02**,
not two.

**Shorter copy alone made some cases worse.** With only the lead shortened,
the form came into view. The session summary above the Start button is about
ten separate text fragments, and when it rewrapped, one of them (the bank
count) jumped 679 px at 1440 px. The practice pages rose to 0.042 at 768 px.

### 14.3 What changed (`2913262`)

**Practice setup:**

- The lead is now "Practise by topic, untimed, or choose another format
  below."
- The exam's summary is kept in full in a new "About this exam" section after
  the formats, with a link to the format guide.
- The "Topic practice" instructions are unchanged, word for word.
- The editorial-standards link has a line of its own. The bank count and the
  session summary are each one text run.
- The unknown-filter notice is shorter: "The link named a topic or skill the
  SAT does not have, so no filter has been applied."

**Format guide:**

- Under the heading: "Verified 18 September 2026 from College Board’s
  published pages." The date starts the line, and the rest is one text run.
- The version and admissions cycle are a two-item list after each summary,
  not a line joined with "·" under the heading.
- The provenance note moved to each Sources list: "Compiled by Examer from
  College Board’s published pages. Each source shows the date it was checked."
- The note replaced says "Every fact below is followed by the source it came
  from". That was not true: the sources are listed at the end of each section,
  not after each fact.
- "In short" is unchanged.

**Every page:** breadcrumbs stay on one line. Where the current page's label
does not fit, it is cut short with an ellipsis. The heading repeats the label,
screen readers read it in full, and focus outlines stay clear of the clip.

**Not changed:** the fonts and how they load, the homepage, colours, spacing
and the hub pages.

### 14.4 Worst-case swap shift, before and after

The highest score in each group at each width, from the reproduction above.
This is the worst case. In a real load the font often arrives before the
first paint, and then nothing moves at all.

| Group | 360 | 375 | 390 | 414 | 768 | 1024 | 1280 | 1440 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Practice setup, 7 exams, before | 0.0007 | 0.0006 | 0.0006 | 0.0038 | 0.0223 | 0.0774 | 0.0590 | 0.0562 |
| Practice setup, after | 0.0007 | 0.0007 | 0.0006 | 0.0026 | 0.0102 | 0.0007 | 0.0006 | 0.0007 |
| Format guides, 6 hubs, before | 0.1139 | 0.1137 | 0.2060 | 0.3053 | 0.2127 | 0.0817 | 0.0564 | 0.0654 |
| Format guides, after | 0.0148 | 0.0162 | 0.0182 | 0.0168 | 0.0154 | 0.0063 | 0.0047 | 0.0048 |
| Exam hubs, 6, unchanged | 0.0189 | 0.0189 | 0.0199 | 0.0195 | 0.0150 | 0.0072 | 0.0057 | 0.0055 |

- **Over 0.02:** 29 combinations before, none after.
- **Other practice states:** the preset-skill view peaks at 0.0184 (414 px),
  and the unknown-filter view at 0.0109.

`tests/e2e/layout-stability.spec.ts` performs the same swap on the SAT
practice setup and the SAT and GRE format guides, at 390 and 1440 px, and
fails above 0.02.

### 14.5 Lab measurements

**Builds:** `2913262` against the committed Phase 1 build, each route warmed
with one request first. The method is §14.1's. LCP and FCP were identical in
every run, so only LCP is shown.

**Conditions of the acceptance batch** (26 September 2026, 17:39–17:46):

- **Power:** on AC and charging, with the battery going from 20% to 24%.
  Windows reported power online, and the plan was HP Optimized.
- **Processor:** an Intel Core i5-10210U, base 1.6 GHz. Before the run, a
  one-thread load held 175–188% of base clock, so the processor was boosting,
  not held back.
- **Background load:** 12–29% total CPU at idle, from desktop applications.
  That includes an extension process in the user's own Chrome, at about half a
  core. §13.4 recorded 20–35%. No builds, tests or other measurements ran.
- **During the run:** a sampler logged the clock every 10 s. In the mobile
  batch it never fell below 121% of base, with a median of 167%. In the
  desktop batch, five samples read 41–53%, each at 15–18% utilisation. That is
  idle downclocking between the short unthrottled loads, and the desktop
  figures match §13.4's to within 16 ms.

**Throttled mobile, 9 runs per route:**

| Route | Phase 1, median (IQR) | Final, median (IQR; range) | Budget | CLS final, highest run |
| --- | --- | --- | --- | --- |
| `/` | 1,308 (1,276–1,396) | 1,840 (1,804–1,880; 1,584–1,952) | ≤ 2,200: met | 0.0008 |
| `/exams/digital-sat` | 1,328 (1,296–1,340) | 1,528 (1,520–1,552; 1,428–1,620) | ≤ 1,800: met | 0.0199 |
| `/practice/digital-sat` | 1,368 (1,328–1,388) | 1,588 (1,552–1,652; 1,488–1,696) | ≤ 1,800: met | 0.0006 |
| `/exams/digital-sat/format` | 1,484 (1,448–1,536) | 1,636 (1,560–1,696; 1,488–1,744) | ≤ 1,800: met | 0.0148 |

- **Every run is inside its budget,** not only the medians. The slowest were
  1,952 ms on the homepage and 1,744 ms on the format guide.
- **The gap over Phase 1** is +532, +200, +220 and +152 ms. §13.4's two
  batches gave +388 to +572, +184 to +276, +172 to +264 and +132 to +184 ms,
  so the layout changes cost nothing measurable.

**Desktop, 5 runs:**

| Route | LCP, Phase 1 → final | CLS final, highest run |
| --- | --- | --- |
| `/` | 188 → 268 | 0.0114 |
| `/exams/digital-sat` | 172 → 208 | 0.0005 |
| `/practice/digital-sat` | 188 → 208 | 0.0006, down from 0.0562 in §13.4 |
| `/exams/digital-sat/format` | 200 → 232 | 0.0004 |

**Sizes:**

- Homepage JavaScript: 112.3 KB, within the 118 KB budget.
- Homepage CSS: 13.4 KB.
- Web fonts: 62 KB on the homepage, within the 90 KB budget, and 40.4 KB
  elsewhere.

**Batch 1, not used for acceptance** (26 September, about 17:19–17:27). It
ran minutes after the laptop was plugged in, at 4% charge.

| Route | Phase 1, median (IQR) | Final, median (IQR; range) |
| --- | --- | --- |
| `/` | 1,500 (1,412–1,620) | 2,160 (1,976–2,296; 1,844–2,848) |
| `/exams/digital-sat` | 1,484 (1,396–1,652) | 1,744 (1,736–1,788; 1,452–2,440) |
| `/practice/digital-sat` | 1,760 (1,512–1,892) | 2,052 (1,832–2,260; 1,612–2,360) |
| `/exams/digital-sat/format` | 1,696 (1,676–1,752) | 1,768 (1,744–1,924; 1,612–2,036) |

- **Why it was set aside:** the Phase 1 code itself measured 1,484–1,760 ms,
  with interquartile ranges up to 380 ms. In batch 2 it measured
  1,308–1,484 ms, with none wider than 120 ms.
- **The clock readings do not prove it:** the readings taken just after
  batch 1 (48–85% of base) were at about 15% utilisation, and idle cores
  downclock too. The evidence is the unstable baseline. That is why batch 2
  also checked the clock under load and logged it throughout.
- **Its practice-setup median** of 2,052 ms would miss 1.8 s. It is recorded
  here and not used.

### 14.6 Checks

- `npm run verify`: typecheck clean, content 0 errors and 0 warnings, 231
  tests.
- **Playwright** on the final build: 77 passed, 1 skipped (the existing
  desktop-only keyboard test). This includes the new layout-stability spec,
  6 tests across the two device projects, which measured 0.0004–0.0182.
- **Site sweep:** 34 routes at 360 and 1440 px, as a visitor and as a guest
  with a finished session. It adds every exam's practice setup and format
  guide to §13's list. No overflow, no console errors and no error statuses.
- **Swap matrix** on the final build: 21 routes at 8 widths, identical to the
  run on the build before the last wording change, and none over 0.02.

### 14.7 What remains

- **Hubs** are unchanged and outside this pass. Their worst case is
  0.0189–0.0199 at phone widths, where the tagline lead can gain a line. That
  is within the budget, with no margin. The practice page's treatment would
  apply if it is ever needed.
- **"In short"** on the format guide can still gain a line on phones, which
  scores 0.015–0.018 in the worst case.
- **A swap that moves nothing** would need a fallback matched to Bricolage's
  metrics. That is the typography trade-off in §13.4, which cost 0.36–0.55 s
  of mobile first paint on Windows Chrome. The budget does not need it.
- **One machine.** Every number here is from one Windows laptop.

### 14.8 Acceptance

**Phase 2 is complete** (26 September 2026).

**Met:**

- **Throttled-mobile LCP:** the homepage's median is 1,840 ms against 2.2 s;
  the hub, practice setup and format guide are at 1,528–1,636 ms against
  1.8 s.
- **CLS ≤ 0.02:** on every measured route, mobile and desktop, in every run.
  The highest is 0.0199, on the mobile hub.
- **JavaScript and fonts:** 112.3 KB against 118 KB, and 62 KB against 90 KB.
- **Content and function:** as §13.7 records.
- **The layout pass:** no page or width in the worst-case matrix is over
  0.02.

**Carried forward** (none is a Phase 2 acceptance criterion):

- **C-ACT-023:** `enhanced-act-read-time-use-table-023` stays quarantined.
  Its correction is tracked as open item 5 in `docs/TASK-BOARD.md`.
- **Deferred features** from §13.7:
  - the remembered exam, and switching exams without JavaScript;
  - the player's save status and offline queue;
  - study-plan storage and recovery;
  - merging guest history on sign-in;
  - the 12 loose-but-true wordings.
- **The hubs:** their worst-case shift has no margin (§14.7).

### 14.9 Phase 3: dashboard and learner navigation, proposed scope

Not started. The goal: a returning learner lands on one screen that says
where they are, what to do next and on what evidence, and can move between
their exams and learner pages without detours. The items come from §3, §4
and §10 and from the current `src/app/dashboard/page.tsx`.

**1. Resume**

- List every unfinished session the learner has, across exams. Today the
  dashboard looks only at the last ten attempts of the exam in focus.
- Expire overdue timed sessions when listing them. Expiry is lazy today, so a
  session past its deadline shows as "in progress" until it is opened.
- Reopen at the question the learner was on, not question 1.

**2. One next action, with its basis**

- One primary recommendation at the top of the page, with its reason and the
  count it rests on, from `buildRecommendations`. The others follow it.
- A skill link falls back to its topic when the skill holds too few reviewed
  questions for a session. Skills hold a median of 1–2.
- The mistake notebook's count separates "due now" from "coming back later",
  so a session with misses never reads as "0 waiting".

**3. A topic-level skill landscape**

- Skills grouped under their topic, including skills never practised, each
  with its count.
- A percentage only at or above `MIN_ATTEMPTS_FOR_SIGNAL`, as now.
- Untouched topics shown in place, not in a closing sentence.
- Fix the median-time query that ignores attempt status (§4).

**4. Moving between exams and pages**

- Switch the dashboard between the exams the learner has practised or
  targeted. Today "Practising something else?" links to practice setup. The
  default is unchanged: the stated target, else the most recent exam.
- A learner who opens the homepage or the wordmark gets a way back to their
  dashboard and any unfinished session. Today only the header's Dashboard
  link leads there.
- The learner navigation (Dashboard, Exams, Mistake notebook, Study plan,
  Readiness) keeps `aria-current` and the 360 px mobile menu, and gains the
  exam switcher.

**5. Every state**

- no exam chosen;
- an exam with no finished session;
- only an unfinished session;
- an exam whose bank cannot fill a session;
- a guest near the end of the seven days;
- a failed load.

**6. Checks**

- End-to-end tests for each state and for the switcher.
- The layout-stability test and the site sweep extended to the dashboard.
- The dashboard added to the lab set, measured with a seeded learner, under
  the 1.8 s and 0.02 budgets.

**Out of scope:**

- results and the mistake notebook (Phase 4);
- the player and its save states (Phase 5);
- storing the study plan, and merging plan and readiness (Phase 6);
- a remembered-exam cookie, which needs a consent decision;
- merging guest history on sign-in, which is backend work;
- any score prediction.

**Decisions needed before it starts:**

1. **Resume position:** derive it from the saved responses, with no
   migration, or store it, with a migration.
2. **Exam switching:** keep the choice in the address only, or also save it
   as the learner's target.
3. **Homepage for learners:** a slim "continue" strip above the hero, or only
   a changed wordmark destination. The hero stays either way.

*Decided on 26 September 2026 and built in §15: store the position, keep exam
choice in the address, and add the strip.*

## 15. Phase 3: dashboard and learner navigation (26 September 2026)

**Decisions given:**

1. **Store the resume position** through a migration. Validate every update
   and every resume destination against ownership, the attempt's status and
   the exam's navigation rules. Never reopen a locked screen or an expired
   section, and fall back to a permitted place when the stored one is no
   longer valid. A stale request must not overwrite a newer position, and
   saving must not hold up navigation.
2. **Keep the dashboard's exam in the address.** Validate it, scope every
   figure to the learner, and handle an invalid or empty value gracefully.
   Viewing an exam must not change the target. Never widen a skill drill
   silently; offer topic practice explicitly.
3. **A "Continue studying" line above the homepage hero**, rendered on the
   server, only for a learner with history or an unfinished attempt. The
   first-time visitor's homepage stays as it is, and nothing personal may
   reach another user through a shared cache.
4. **Budgets:** the returning-learner homepage at median LCP ≤ 2.2 s, and the
   dashboard with a representative seeded learner at ≤ 1.8 s. Both at
   CLS ≤ 0.02, under §14.1's conditions.

Exam-hub layout stays in Phase 6 unless this phase made it worse, and it did
not (§15.5).

### 15.1 Resume

**Storage.** Migration 004 adds `resume_part_index`, `resume_position`,
`resume_clock` and `resume_saved_at` to `attempts`. It only adds columns. The
development database was backed up first, to
`tmp/backups/examer-2026-09-26-before-migration-004.db` (integrity ok,
identical counts), and every row was unchanged afterwards.

**Writing a position.** Only the navigation endpoint (`POST
/api/attempts/:id/visit`) writes one, and only after the move itself passes
these checks:

- **Ownership:** another learner's attempt is a 404, as if it did not exist.
- **Status:** a finished attempt is refused with `attempt-closed`.
- **The open section:** a section that is not open is refused with
  `wrong-part`. A pending section was not refused before.
- **The section's rules:** `canNavigateTo`, as before, so a move back to a
  committed screen is refused.

**Ordering.** The write is conditional on its clock being ahead of the stored
one, in the same `UPDATE`, so a late request never overwrites a newer
position, whatever the interleaving (slow network, retry, second tab or
device). The clock is the player's: the server's time when the page was
rendered, plus the time elapsed in the browser. So a wrong device clock
cannot reorder moves. A clock more than two minutes ahead of the server's
still counts as a move but is not stored.

**Reading a position.** `resolveResume` checks the stored position again on
every read. It is used only if it is in the open section, inside it and,
where going back is not allowed, on the screen the learner has reached.
Otherwise the attempt reopens at the furthest question reached in the open
section. When a section's clock has run out, the next section is open, so the
resume point moves there.

**The player:**

- It opens at the resolved position.
- Where the rules always allow a move (anywhere in a free section, or within
  the current screen), it moves at once and saves behind the move with
  `keepalive`. A move with the save delayed by 3 s still renders within
  1.5 s.
- It still waits for the server when a move commits a screen, because that
  is the exam's rule and not a save.

**Two defects found and fixed:**

- **The player carried state across sections.** When a section ended,
  the next one opened with the previous section's selections. Removing the
  fix in a scratch copy reproduced it: section 2 opened with question 1
  marked "answered" and an option checked. The player is now keyed by
  section.
- **The first fallback was wrong.** It was the first unanswered question.
  The existing reload test caught that it sent a learner who had answered
  their question without moving one question on. It is now the furthest
  question reached (`18dc2a8`).

### 15.2 Dashboard

Built by `src/lib/learning/dashboard.ts`. Every query filters on the learner,
and the page renders these states:

- **Pick up where you left off:** every unfinished session, across exams,
  newest activity first. Each shows the exam, the format, where it reopens
  ("Section 2 of 4 · Question 5 of 10 · 3 answered · 12 min left") and a
  Continue link. Anything past its deadline is closed first, so it is never
  offered.
- **The exam in view:** from `?exam=` when it names an offered exam, else the
  target, else the latest practice. An unknown value is ignored and the page
  says so, without repeating it. An empty or repeated value falls back
  quietly.
- **Exam switcher:** the exams practised or targeted, with `aria-current`.
  Every other exam opens its own view, not practice setup. None of this
  writes the target.
- **Your next step:** one recommendation with its reason and the count it
  rests on, then "Also worth doing". A skill drill the bank can fill only
  with fewer than 5 questions keeps its skill link; the whole topic is
  offered beside it as an explicit button, with both counts.
- **Counts:** questions scored, answered correctly, and mistakes due now,
  kept apart from those "coming back later" with the next date. A session
  with misses no longer reads as "0 waiting".
- **Accuracy by topic:** every topic, practised or not. Each topic's skills,
  with bank, scored and correct counts, sit in a native disclosure. There is
  no percentage below 4 scored questions.
- **Recent sessions,** and "What this page does not do", as before.

**States:**

- nothing chosen (a chooser);
- no finished session for this exam (start, or continue the unfinished
  one);
- only an unfinished session;
- an exam whose bank holds no reviewed questions;
- a guest in the last two days of the session that holds their practice
  (the date, and "Keep your progress");
- a failed load (`error.tsx`: says so and offers a retry; never an empty
  dashboard).

**Also fixed:**

- The median-time query counted unfinished attempts (§4).
- Exams are named by their hub ("Bocconi Online Test: Law"), not by their
  versioned config names.

### 15.3 Homepage for returning learners

- **When it shows:** `continueStudying` returns a line only when there is an
  unfinished attempt or a finished session. It offers the latest unfinished
  attempt at the question it reopens on, or else the latest exam's dashboard.
  An empty guest session gets nothing, so that homepage is the first-time
  visitor's.
- **Where it renders:** on the server, per request, for the learner the
  session cookie names.
- **Caching:** the page is dynamic and is sent with `Cache-Control: private,
  no-cache, no-store, max-age=0, must-revalidate`, with or without a session.
  A test asserts `private` and `no-store` on the learner's response.
- **Layout:** a fixed height and one truncated line, so the font swap cannot
  change its height. On a phone the "Continue studying" label is read out but
  not shown, leaving the line for the details.

### 15.4 Tests

**Unit: 265, up from 231:**

- **Resume, 16:**
  - the resolver's rules;
  - stale, equal and far-future clocks;
  - another learner's attempt, a finished attempt, a section not yet open;
  - committed Bocconi screens, both the move and a stored value;
  - section expiry and attempt expiry;
  - the cross-exam listing.
- **Dashboard, 14:**
  - exam choice;
  - isolation;
  - the target left unchanged;
  - the short-drill option;
  - priority;
  - due and later counts;
  - every topic and skill;
  - the empty bank, only-unfinished and guest states;
  - the failed-load render.
- **Continue line, 4.**

**Browser: 99 passed and 1 skipped (the existing desktop-only keyboard test),
up from 77.** `tests/e2e/phase-3.spec.ts` runs 11 tests in both device
projects:

- cross-exam resume through the dashboard;
- navigation not waiting for the save;
- a late update;
- a forward-only section: no reopening of a committed screen, and the move
  refused;
- an expired session closed and not offered;
- a new section starting clean;
- isolation between learners;
- the address choosing the exam without touching the target, and an unknown
  exam;
- only-unfinished and guest-expiry states;
- the homepage line and its caching.

**States set in the database.** Some states cannot be reached in a browser in
reasonable time: an expired clock, a guest's last days, a forward-only
section. Those are set in the e2e database (`withE2eDb`, which refuses any
other file) and then exercised through the UI. No open format uses
forward-only rules yet, so that test pins Bocconi's screens-of-three policy
onto a live section. That is where the server reads the rules from.

**Covered by unit tests only:** the empty bank and the failed load. The
current bank cannot produce the first, and forcing the second would need a
test hook in production code.

### 15.5 Measurements

**Method.** §14.1's, with the two budgeted pages loaded as a returning learner.
The learner is seeded over HTTP on each build (the Phase 1 build included) by
the same script:

- 3 finished SAT sessions and 1 finished GMAT session;
- an unfinished GMAT session and an unfinished SAT session, the SAT one moved
  to question 5;
- answers chosen deterministically, not correctly, so the history mixes
  right, wrong and blank.

Each load adds that build's own session cookie to a fresh context. The Phase
1 build has no strip and its older dashboard, which is the comparison the
budget is relative to.

**Conditions** (26 September 2026, 19:11–19:22):

- **Power:** on AC and charging (94% to 97%).
- **Processor:** before the run, a one-thread load held 177–182% of base
  clock. During the mobile runs the clock never fell below 120% of base
  (median 166%).
- **Background load:** 11–19% idle utilisation.
- **The low readings:** these fell only in the desktop runs, at 15–23%
  utilisation. That is idle downclocking between short loads, as in §14.5.
- **Nothing else ran.**

**Throttled mobile, 9 runs per route.** LCP and FCP were identical in every
run.

| Route | Phase 1, median (IQR) | Final, median (IQR; range) | Budget | CLS final, highest run |
| --- | --- | --- | --- | --- |
| `/`, returning learner | 1,396 (1,376–1,424) | 1,892 (1,804–1,956; 1,728–2,160) | ≤ 2,200: met | 0.0005 |
| `/dashboard`, seeded learner | 1,388 (1,352–1,408) | 1,548 (1,520–1,556; 1,396–1,688) | ≤ 1,800: met | 0.0001 |
| `/`, first-time visitor | 1,376 (1,352–1,380) | 1,804 (1,788–1,836; 1,744–1,876) | ≤ 2,200: met | 0.0008 |
| `/exams/digital-sat` | 1,328 (1,320–1,352) | 1,476 (1,464–1,520; 1,412–1,556) | ≤ 1,800: met | 0.0199 |
| `/practice/digital-sat` | 1,412 (1,348–1,416) | 1,616 (1,520–1,632; 1,472–1,740) | ≤ 1,800: met | 0.0006 |
| `/exams/digital-sat/format` | 1,500 (1,484–1,520) | 1,648 (1,596–1,672; 1,488–1,960) | ≤ 1,800: met | 0.0148 |

- **Every run of the two new budgets is inside them.** The slowest were
  2,160 ms on the learner's homepage and 1,688 ms on the dashboard.
- **The format guide's slowest run** was 1,960 ms. The Phase 1 build's
  slowest on the same route in the same batch was 2,360 ms. The budget is
  the median.
- **The strip's cost:** about 90 ms of mobile first paint (1,892 ms against
  1,804 ms for the visitor's homepage in the same batch).

**Desktop, 5 runs:**

| Route | LCP, Phase 1 → final | CLS final, highest run |
| --- | --- | --- |
| `/`, returning learner | 196 → 276 | 0.0110 |
| `/dashboard`, seeded learner | 196 → 228 | 0.0002 |
| `/`, first-time visitor | 192 → 276 | 0.0122 |
| `/exams/digital-sat` | 188 → 212 | 0.0005 |
| `/practice/digital-sat` | 192 → 232 | 0.0006 |
| `/exams/digital-sat/format` | 204 → 212 | 0.0004 |

**Sizes:**

- **Homepage JavaScript:** 112.5 KB as a learner or a visitor, within the
  118 KB budget.
- **Web fonts:** 62 KB on the homepage, within the 90 KB budget.
- **The dashboard:** 108.6 KB of JavaScript, 22.6 KB of HTML and 562
  elements; Phase 1's had 383.

**Worst-case font swap** (§14.4's reproduction, at the same 8 widths):

- **The dashboard:** at most 0.0004.
- **The returning learner's homepage:** at most 0.0171 (768 px).
- **The first-time visitor's homepage,** not in §14.4: at most 0.0189
  (768 px).
- **The practice setup, both format guides measured and the SAT hub:**
  identical to the end of Phase 2 in every cell, so Phase 3 introduced no
  regression.

### 15.6 Commits (on `FronDesign`, not pushed)

- `d4ca804`: persist and validate the resume position (migration 004, the
  resolver, the endpoint's checks, the player).
- `3ac3d2c`: the dashboard.
- `067513c`: the homepage's "Continue studying" line.
- `18dc2a8`: the resume fallback (furthest question reached).
- `9e29c14`: the Phase 3 browser tests.
- A documentation commit with this section.

### 15.7 What remains

- **A save still in flight when the page is reloaded can be lost**, and the
  learner lands one move back. `keepalive` covers leaving the page, not a
  reload that wins the race.
- **Moves made while offline do not store a position.** Answers keep their
  own retry queue; only the resume hint is lost.
- **Ordering across devices** is only as accurate as the time between a
  page's render and its first interaction. A clock more than two minutes
  ahead of the server's is not stored.
- **The hubs** keep their worst case of 0.0199, with no margin (§14.7).
  Unchanged, so it stays in Phase 6.
- **The first-time visitor's homepage** has a worst case of 0.0189 at 768
  px. That is outside the lab's widths and unchanged by this phase.
- **Tested only in unit tests:** the empty-bank and failed-load states
  (§15.4).
- **Still deferred:** guest history is not merged on signing in to an
  existing account. The player's save status and offline queue are Phase 5.
  The study plan and readiness pages are Phase 6.
- **The development database** now has migration 004. Its backup is named in
  §15.1.
- **One machine:** every number is from the same Windows laptop, and the
  budgets are local.

### 15.8 Acceptance

**Phase 3 is complete** (26 September 2026).

- **Resume:**
  - persisted and validated on every write and read;
  - ordered against late requests;
  - never reopens a committed screen or an expired section;
  - does not hold up free navigation.
- **Dashboard:**
  - exam choice in the address;
  - scoped to the learner;
  - the target never changed;
  - one next step with its basis;
  - the short-drill option offered explicitly;
  - every documented state present.
- **The homepage line:**
  - server-rendered;
  - only for a learner with something to continue;
  - never cacheable;
  - the visitor's homepage unchanged.
- **Budgets:**
  - returning-learner homepage 1,892 ms against 2.2 s;
  - dashboard 1,548 ms against 1.8 s;
  - CLS at most 0.0005 on both;
  - the Phase 2 routes still inside theirs.
- **Tests:** 265 unit tests and 99 browser tests pass; the site sweep is
  clean.

*Phase 4 followed; see §16.*

## 16. Phase 4: results and the mistake notebook (26 September 2026)

**Decisions given:**

1. **The journey:** build the whole path from a session's results to
   understanding a mistake, to reviewing its explanation, to choosing useful
   follow-up practice.
2. **Results:** the outcome first, then where attention is needed, the
   evidence and the next action. Fewer repeated figures, and no page that
   renders every long explanation. Missing evidence must read differently
   from weak performance. Keep the evidence threshold and every restriction
   on scores, percentiles and readiness claims.
3. **The notebook:** keep "due now" apart from "later", show the original
   answer, the key and the explanation, and add optional labels chosen by
   the learner. Never infer a learner's reasoning from their answer.
4. **Retries:** separate records for retrying exact questions. Never
   overwrite original answers, scores or results. Keep repeated-question
   practice apart from new evidence, and keep it out of progress figures.
   Use only reviewed, eligible content: a corrected question keeps its
   history but new practice uses the current version, and nothing
   quarantined or withdrawn is offered.
5. **Follow-up practice:** show real availability, keep broader topic
   practice an explicit choice, and do not promise unseen questions unless
   that is enforced.
6. **Quality:** keep the design system, assessment rules, account isolation
   and private-data caching. Design the mobile, keyboard, empty, loading and
   error states. Take baselines before editing, and keep the Phase 2 and
   Phase 3 budgets unchanged.
7. **Out of scope:** durable resume recovery and the player's save and
   offline work (Phase 5), exam-hub layout (Phase 6), and merging guest
   history.

### 16.1 Baselines, taken before any change

The Phase 3 build (`cc583fe`) and its database were frozen into a scratch
copy, used both as this baseline and as the comparison in §16.9.

- **The learner:** §15.5's seeded learner, with 4 finished sessions and 2
  unfinished ones.
- **Conditions:** on AC and charging (98%). The clock was never below 121%
  of base in the mobile runs, and idle utilisation was 4–9%.
- **Method:** §14.1's.

| Page | Throttled mobile LCP, median (IQR) | Desktop LCP | CLS, highest run (mobile / desktop) | HTML, compressed | Elements |
| --- | --- | --- | --- | --- | --- |
| Results, 15 questions | 1,996 (1,936–2,004) | 444 | 0.0001 / 0.0102 | 98.1 KB | 4,997 |
| Results, 10 questions | 1,856 (1,796–1,880) | 404 | 0.0001 / 0.0102 | 75.0 KB | 5,128 |
| Mistake notebook | 2,700 (2,612–2,776) | 704 | 0.0111 / 0.0643 | 282.6 KB | 17,824 |

- **The cause:** both pages rendered every question with its stimulus,
  options, rationales and worked explanation. The notebook's 40 entries were
  2.0 MB of uncompressed HTML.
- **Targets proposed for Phase 4:**
  - each of these pages, and the new question page, at throttled-mobile
    median LCP ≤ 1.8 s (the learner-page budget of §14.1);
  - CLS ≤ 0.02.
- **Other budgets:** the Phase 2 and Phase 3 budgets are unchanged.

### 16.2 Results (`/attempt/:id/results`)

In order:

1. **The outcome,** in one card: "7 of 10 correct", the correct, wrong and
   blank counts, accuracy on the questions answered, raw points with
   penalties where the exam has them (Bocconi), and time spent answering.
   Time is counted from saved answers, and the page says so. This replaces
   seven stat cards, three of which repeated the others. When some questions
   had been shown in an earlier session, the card says how many.
2. **Where you lost marks,** by topic, then by skill with its misses.
   - Accuracy appears only where a topic had at least
     `MIN_ATTEMPTS_FOR_SIGNAL` (4) questions in the session; "needs
     attention" appears only below 60% at that level.
   - Below the threshold a topic reads "Missed 2 of 3 · too few to judge".
     Missing evidence therefore never looks like weakness.
   - The old table labelled 1 of 1 "strong" (§3). That table is gone.
3. **What to do next:**
   - review the first mistake;
   - retry the missed questions (§16.6);
   - practise the skill with the most misses with new questions, with the
     real count ("2 new Rhetorical Synthesis questions"), and the whole topic
     as a separate, secondary button with its own count;
   - when every reviewed question in the skill has been shown, the page says
     so and does not offer the drill;
   - links to set up a session, the dashboard and the notebook.
4. **Every question,** a compact list: number, outcome, skill, topic, the
   learner's labels, and notes ("you marked it", "seen before", "corrected
   since", "being revised"). Each links to its own page.
5. **How to read this:** the official facts, our approximation and what we do
   not provide (no scaled score, no percentiles), with "This page makes no
   readiness or admission judgement." The rules we could not verify sit in a
   disclosure.

A retry's results open with "A retry of questions you had missed", say it
changed nothing about the original and is not counted in accuracy by topic,
and link to the original.

### 16.3 A question on its own page (`/attempt/:id/results/:n`)

- **Content:**
  - the question exactly as it was shown;
  - the learner's answer and the key, stated in words;
  - each option with "Your answer" and "Correct answer" badges and its
    rationale;
  - the worked explanation, and the difficulty basis.
- **Version notices:**
  - **Corrected since you answered it:** shown as it was, the result stands,
    and new practice and retries use the corrected, reviewed version.
  - **Being revised:** shown as it was, and not offered for practice or
    retries.
- **Actions:**
  - optional labels, on a miss only (§16.5);
  - retry this question, when it can be asked again;
  - bookmark;
  - report a problem;
  - previous question, next question, next mistake, and back to results.

### 16.4 The mistake notebook (`/review`)

**Four views, each with its count:**

- **Due now:** from the review schedule, oldest first. This is the
  default.
- **Coming back later:** soonest first, each with its date.
- **All mistakes:** every question missed in a finished session.
- **Bookmarked.**

**How it reads:**

- Each entry is the latest missed encounter of a question: outcome, exam,
  when it is due, topic and skill, a plain-text start of the stem, times
  missed, last seen, and any correction or revision. It links to the
  question's own page instead of inlining 40 explanations.
- An empty "due now" says how many come back later and when the next one
  does.
- A retry per exam covers the misses in view. The learner's own label counts
  are shown.

**Compatibility:** the Phase 2 `?filter=incorrect` still opens the
all-mistakes view.

### 16.5 Mistake labels (migration 005)

- **The labels:**
  - "I did not know how to do it";
  - "I misread the question";
  - "A slip or a calculation error";
  - "I rushed or ran out of time";
  - "I guessed".
- **Rules:**
  - Optional and editable, set only by the learner on one missed question in
    one finished session.
  - Nothing is ever filled in for the learner.
  - Labels change no score, result or review schedule.
  - They are included in the account export.
- **Storage:** `mistake_labels`, keyed by the attempt item, cascading with
  it and with the user. The development database was backed up first, to
  `tmp/backups/examer-2026-09-26-before-migration-005.db` (integrity ok,
  identical counts).
- **The form:** a fieldset of checkboxes, usable with the keyboard, that
  posts without JavaScript and confirms "Labels saved".

### 16.6 Retries and new-question practice

**A retry** (`src/lib/attempts/retry.ts`) is its own attempt in the reserved
`review` mode. No existing format uses that mode.

- **What it accepts:** only questions this learner missed (wrong or blank)
  in a finished session of that exam. Anything else in the request is
  ignored. The source session must be the learner's own.
- **Which version:** each question is asked in its current published version.
  One withdrawn, quarantined or back under review is left out, and the page
  says how many.
- **History:** the source session, its answers and its result are never
  written.
- **Where it counts:**
  - **Excluded from progress figures:** skill and topic performance (and the
    median time with it), readiness's recent accuracies, the study plan's
    covered topics, and the dashboard's count of finished sessions. The
    dashboard lists a retry under recent sessions with a "Retry" badge.
  - **The review schedule does count it:** bringing missed questions back
    is what the schedule is for. Answered correctly, a question moves out.
- **In the player:** it is untimed with the explanation after each answer,
  like topic practice, and is labelled "Retry of questions you missed".

**New questions only** is a practice option (`unseenOnly`), enforced when
the session is built.

- **The rule:** only questions this learner has never been shown are used.
  If too few are left, the session is refused rather than topped up.
- **Where it applies:** timed and diagnostic formats ignore it.
- **What the button says:** a count only when the pool holds that many new
  questions; the form's session is built from them.

### 16.7 States

- **Mobile:** every page was checked at 360–1440 px with no overflow. On the
  phone, the notebook entries and the question page stack.
- **Keyboard:** everything is a link, a button or a checkbox. A browser test
  sets a label with the keyboard.
- **Empty:**
  - no mistakes;
  - nothing due, saying when the next one is;
  - nothing scheduled;
  - no bookmarks;
  - no misses in a session ("Nothing: every question you were asked was
    answered correctly").
- **Loading:** every form's button shows "Starting the retry…",
  "Preparing your session…" or "Saving…" while it posts, and cannot be
  pressed twice. Pages render in one server response. No route
  loading-skeleton was added: on a first load it would stream a
  placeholder that the content then replaces.
- **Error:** results and the notebook have their own error pages. Each says
  the page could not be loaded and offers a retry; neither shows a partial
  result or an empty notebook.
- **Form outcomes:** a status message after the redirect. For example, a
  retry of questions being revised says so; hitting the rate limit says to
  try again later.

### 16.8 The maths-font shift, found and partly fixed (`ee05c07`)

**What the worst-case check found.** §14.4's check flagged the new question
page at 0.05–0.31, but only on questions with maths.

- **Maths question, lab loads:** 0.106 on the phone and 0.131 on desktop.
- **Same page without maths:** 0 and 0.0007.

**The cause:**

- KaTeX declares its 20 fonts `font-display: block`.
- The browser requests them only once maths is being laid out, so they
  arrived after the first paint.
- The formulas then reflowed the stem and pushed the options down.
- Blocking `.woff2` did not hide this, because KaTeX falls back to `.woff`.

**The fix.** On a question page that shows maths, React emits a `Link:
rel=preload` header for KaTeX_Main-Regular and KaTeX_Math-Italic.

- **Detection:** by the renderer's own delimiter rules, tested against it.
- **The files:** the ones the build emitted for the stylesheet, found by
  name. If they cannot be found, nothing is preloaded.

**Measured:**

- **Phone:** the shift is 0 in every run. First paint was 0.25–0.35 s later
  than the same batch's page without maths, because the 42 KB of fonts now
  download before the first paint.
- **Desktop:** the shift remains (0.109). The math fonts arrive at about
  115 ms. Bricolage, not preloaded since §13, arrives just after the first
  paint. The stem rewraps, and its inline formulas jump between lines with
  it (§14.2's mechanism, with the formulas as the fragments).

**Options for the desktop shift, left for a decision:**

1. **Preload Bricolage on question pages.** On the lab's slow link, §13
   measured this at 0.19–0.53 s of first paint.
2. **Set question stems in the reading serif.** This is a design change, and
   it would also reach the player.
3. **Accept it.**

The practice player renders the same stems, so it has the same exposure. It
is a Phase 5 decision.

### 16.9 Tests

- **Unit: 293, up from 265.**
  - **Retries, 8:**
    - a separate attempt, with the original untouched;
    - missed-only, and isolation;
    - a corrected question in its current version;
    - withdrawn and quarantined questions not offered;
    - excluded from every progress figure, while the schedule counts it;
    - new-only built from unseen questions only, refused rather than topped
      up, and ignored by timed formats.
  - **Notebook, labels and results, 13:**
    - due kept apart from later;
    - an entry opening its own review page;
    - isolation;
    - retry groups;
    - the Phase 2 view name;
    - stem previews;
    - labels: learner-only, replaced, changing nothing;
    - labels only on the learner's own misses in finished sessions;
    - evidence thresholds;
    - "seen before";
    - retry framing;
    - no access for another learner or to an unfinished session;
    - the failed-load renders.
  - **Maths detection, 7,** against the renderer.
- **Browser: 115 passed and 1 skipped, up from 99.** `tests/e2e/phase-4.spec.ts`
  runs 8 tests in both device projects:
  - results leading with the outcome and evidence, on a private, uncacheable
    response;
  - a question's own page;
  - labels with the keyboard, and changed;
  - a retry leaving the original result as it was;
  - new-question practice with no question seen before;
  - corrected and withdrawn notices, with a withdrawn question not offered;
  - another learner getting a 404;
  - the notebook keeping due apart from later;
  - a retry from the notebook.

  The one existing expectation that changed on purpose: the results heading
  is now "Where you lost marks".
- **Site sweep:** 40 routes, adding results, both question-page types and
  every notebook view as a guest with history. No overflow, no console errors
  and no error statuses.

### 16.10 Measurements

**Method:** the Phase 4 build against the frozen Phase 3 build of §16.1, run
interleaved under §14.1's method. On both builds the loads come as the same
seeded learner, whose data is identical in the two databases. The question
pages and the "later" view exist only in Phase 4, so they were measured on
that build alone.

**Conditions** (26 September 2026, 20:41–21:06):

- **Power:** on AC and fully charged.
- **Processor:** before the run, a one-thread load held 176–184% of base
  clock. In the mobile runs the median was 164–168%, with one reading of 87%
  at 13% utilisation. The low desktop readings were all at 12–25%
  utilisation, which is idle downclocking.

**Throttled mobile, 9 runs per route.** LCP and FCP were identical in every
run.

| Page | Phase 3 | Phase 4, median (IQR) | Target | CLS, highest run | HTML, compressed | Elements |
| --- | --- | --- | --- | --- | --- | --- |
| Results, 15 questions | 2,820 | 1,512 (1,484–1,564) | ≤ 1,800: met | 0.0026 | 98.1 → 26.6 KB | 4,997 → 449 |
| Results, 10 questions | 2,684 | 1,520 (1,492–1,552) | ≤ 1,800: met | 0.0026 | 75.0 → 22.1 KB | 5,128 → 363 |
| Notebook, all mistakes | 4,092 | 1,452 (1,404–1,488) | ≤ 1,800: met | 0.0002 | 282.7 → 48.9 KB | 17,824 → 785 |
| Notebook, default view | 4,360 | 1,228 (1,164–1,236) | ≤ 1,800: met | 0.0002 | 282.6 → 10.7 KB | 17,824 → 175 |
| Notebook, coming back later | — | 1,488 (1,480–1,492) | ≤ 1,800: met | 0.0091 | 47.7 KB | 767 |
| Question page, no maths | — | 1,476 (1,424–1,492) | ≤ 1,800: met | 0.0012 | 17.7 KB | 290 |
| Question page, maths | — | 1,804 (1,776–1,844) | ≤ 1,800: 4 ms over | 0 | 21.9 KB | 1,004 |

- **The baseline was slower here than in §16.1.** The Phase 3 figures in
  this table are slower than when measured alone (1,996 for the 15-question
  results). The interleaved comparison is what counts.
- **The default notebook view** was "due now", which was empty for this
  learner that evening. In Phase 3 the default was every mistake, with its
  explanation.
- **Question page with maths:** the preload of §16.8 costs about 0.33 s
  against the page without maths in the same batch, and it holds the
  phone's shift at 0.

**Budgets from earlier phases,** in the same batch:

| Route | Phase 3 | Phase 4 | Budget | CLS, highest run |
| --- | --- | --- | --- | --- |
| `/`, first-time visitor | 1,780 | 1,800 | ≤ 2,200: met | 0.0008 |
| `/`, returning learner | 1,820 | 1,856 | ≤ 2,200: met | 0.0009 |
| `/dashboard`, seeded learner | 1,504 | 1,544 | ≤ 1,800: met | 0.0001 |
| `/exams/digital-sat` | 1,424 | 1,492 | ≤ 1,800: met | 0.0199 |
| `/practice/digital-sat` | 1,576 | 1,572 | ≤ 1,800: met | 0.0006 |
| `/exams/digital-sat/format` | 1,544 | 1,472 | ≤ 1,800: met | 0.0148 |

**Desktop, 5 runs:**

| Route | Phase 3 → Phase 4 LCP | CLS, highest run |
| --- | --- | --- |
| Results, 15 questions | 456 → 228 | 0.0102 → 0.0011 |
| Results, 10 questions | 396 → 216 | 0.0102 → 0.0012 |
| Notebook, all mistakes | 684 → 236 | 0.0643 → 0.0002 |
| Question page, no maths | 204 | 0.0007 |
| Question page, maths | 264 | **0.1086**, see §16.8 |
| Earlier phases' routes | within 16 ms of Phase 3 | unchanged |

**Sizes:**

- Homepage JavaScript is still 112.5 KB, within the 118 KB budget.
- Learner pages carry 1 KB more JavaScript (the pending-state button) and
  0.2 KB more CSS.
- Web fonts: 40.4 KB, plus 41.7 KB of KaTeX on maths pages only.

**Worst-case font swap** (§14.4's check at 8 widths):

| Page | Worst case |
| --- | --- |
| Results | 0.0026 |
| Question page without maths | 0.0145 |
| Notebook, due | 0.0007 |
| Notebook, later | 0.0163 |
| Notebook, all mistakes | 0.0088 |
| Question page with maths | 0.052–0.305, the §16.8 mechanism |

### 16.11 Commits (on `FronDesign`, not pushed)

- `c19aee1`: the data layer, for retries, new-question practice, mistake
  labels (migration 005), results and notebook data, and the form actions,
  with unit tests. It also deleted the old skill table, which the Phase 3
  results page still imported, so this commit builds only together with
  the next.
- `ecf3779`: the results, question review and notebook pages, and their
  error states.
- `24af0c2`: the Phase 4 browser tests, and the failed-load render tests.
- `ee05c07`: the KaTeX preload on question pages with maths.
- A documentation commit with this section.

### 16.12 What remains

- **The maths question page on desktop** shifts by about 0.11, and its phone
  median is 1,804 ms against 1.8 s. §16.8 lists the options. The player
  shares the exposure, so this is a Phase 5 decision.
- **The immediate-reload gap from §15.7 still stands.** A position save in
  flight when the page is reloaded can be lost, and the learner lands one
  move back. Durable recovery is Phase 5, with the player's save status and
  offline queue.
- **Repeats in ordinary practice:** only retries are kept out of progress
  figures. Ordinary practice prefers questions not seen for 30 days but can
  repeat them, and those answers still count. Results now say how many
  questions in a session had been shown before, and "new questions only" is
  the enforced alternative.
- **Offered only after a session:** "new questions only" appears on results
  and in the notebook's follow-ups, not on the practice setup page, which is
  Phase 5's.
- **No "mark as reviewed" action:** a retry is how a question is reviewed and
  rescheduled.
- **The notebook shows the first 40 entries** of a view, and says so. There
  is no paging.
- **Labels** are counted in the notebook, but views cannot be filtered by
  label.
- **Unchanged here:** exam-hub layout (Phase 6), merging guest history (out
  of scope), and one machine, with local budgets.
- **The development database** now has migrations 004 and 005, each with a
  backup (§15.1, §16.5).

### 16.13 Acceptance

**Phase 4 is complete** (26 September 2026), with one open decision.

- **The journey works end to end in the browser:**
  1. results;
  2. a question on its own page;
  3. the learner's labels;
  4. a retry that leaves the original as it was;
  5. new-question practice with no repeated questions;
  6. the notebook, with due now kept apart from later.
- **Historical records are preserved.** Retries are separate records and are
  kept out of progress figures. A corrected question keeps its history; a
  withdrawn one is not offered. Missing evidence reads differently from
  weakness, and the restrictions on scores, percentiles and readiness hold.
- **Performance:**
  - results and the notebook went from 1.86–4.36 s to 1.23–1.52 s on the
    throttled phone, and their shift fell to 0.0091 or less;
  - every Phase 2 and Phase 3 budget still passes.
- **Tests:** 293 unit tests and 115 browser tests pass (1 skipped as
  before), and the sweep is clean.
- **Open decision:** the maths question page's desktop shift, and its
  phone median 4 ms over the proposed 1.8 s (§16.8, §16.12).

Phase 5 has not been started.

---

## 17. Phase 5: question typography, reliable saving and the practice player (26–27 September 2026)

**Decisions given:**

1. **Phase 4 is accepted functionally**, with its open acceptance issues
   recorded explicitly (§17.1). A short closeout first: server-backed,
   accessible notebook pages on a stable order, with the view and account
   isolation kept; label filtering may wait. Commit history is kept as it is,
   and `c19aee1`'s dependence on `ecf3779` documented.
2. **Question typography:** the system reading serif for question content,
   on review pages and in the player; branded fonts stay for interface
   headings and controls; maths is unchanged. Start from the conditional
   maths-font preload and measure the combination across short, long,
   maths-heavy and non-maths questions on desktop and phone. Keep the 1.8 s
   median LCP and 0.02 CLS targets for question pages, report variability,
   and do not change the budget over Phase 4's 4 ms miss.
3. **Saving and resume:** visible, accurate saving, saved, offline and
   failed states; durable recovery of pending answers and resume positions;
   sensible retries. Keep server-authoritative timing, locked screens,
   feedback-release rules and answer immutability. Never replay queued
   changes into expired, completed, locked or unauthorised attempts; keep
   locally pending changes apart from server-confirmed saves; never show
   queued data under another account. Do not imply that offline use pauses
   a clock. Test immediate reload, interrupted connections, reconnecting,
   expiry while offline, duplicate requests, stale updates and account
   changes.
4. **The practice experience:** continue the documented player work (§10:
   focus mode, split passage, save states, persisted queue, debounced input)
   and expose the enforced "new questions only" in setup, with honest
   availability and empty states. Broader practice stays an explicit choice.
   Ordinary-practice repeats stay distinguishable from unseen-question
   evidence, and no historical metric is rewritten.
5. Back up the development database before migrations; focused commits;
   test the complete journeys; check for performance regressions. Phase 6,
   pushing and deploying are out of scope.

### 17.1 Phase 4's acceptance, as recorded

Phase 4's functional work is accepted. Its open acceptance issues, and where
each stands after this phase:

| Phase 4 issue (§16.12) | Status |
| --- | --- |
| Maths question page shifted 0.109 on desktop | Resolved: §17.3 |
| Maths question page's phone median 4 ms over 1.8 s | Still over in the acceptance batch, on both builds: §17.12. The budget is unchanged |
| The notebook showed only the first 40 entries | Resolved: pages, below |
| Views cannot be filtered by label | Deferred, as agreed |
| `c19aee1` builds only together with `ecf3779` | Documented; history kept (§16.11, §17.10) |
| A position save racing a reload could be lost | Resolved: §17.4 |
| "New questions only" offered only after a session | Resolved: §17.6 |
| No "mark as reviewed" action | Unchanged: a retry is the review |
| Ordinary-practice repeats count towards progress | Unchanged, by the rule not to rewrite history; setup now says how many matching questions are repeats (§17.6) |

**Notebook pages (`07bf9ad`).**

- **Pages:** every view is served 40 entries a page. Previous, numbered and
  next links are plain links that keep the view. The current page carries
  `aria-current`, the page number is in the title, and returning from a
  bookmark keeps the page.
- **Order:** each view orders on a unique key, its date and then the
  question id. Due and later go by due date, all mistakes by the latest
  miss, bookmarks by the date bookmarked. The latest missed encounter is
  chosen with a tie-breaker too. An unchanged notebook therefore pages
  without repeating or skipping an entry.
- **Out of range:** a page past the end (the view shrank since the link was
  made) redirects to the last page, keeping any notice.
- **Scope:** everything is still scoped to the learner. Another learner's
  page 2 is an empty page 1.
- **Retries** on a page offer that page's questions, and say so.

### 17.2 Baselines, taken before any change

- **The build:** Phase 4 (`982d690`) was built from a clean copy and frozen
  with a copy of the development database. It served both as this baseline
  and as the comparison in §17.8.
- **The fixtures:** measuring question pages needs the same questions on
  both builds, and selection is random. One learner's sessions were created
  over HTTP by the Phase 4 build, with six chosen questions swapped into
  known positions before any answer was saved. That database was then
  copied to the Phase 5 build.
  - **Maths-heavy:** a GMAT problem with 66 formulas, 3 of them display
    maths.
  - **Maths with a table:** a GMAT table-analysis question with a stimulus.
  - **Short maths:** a Bocconi algebra question with a 40-character stem.
  - **Short plain:** a GRE text-completion question.
  - **Long plain stem:** a 649-character LSAT logical-reasoning stem.
  - **Long passage:** a 2,257-character LSAT reading passage.

  Each was measured on its review page (answered wrongly) and at the front
  of an unanswered session in the player.

**Before any change:** see the Phase 4 columns of §17.8, which come from the
same interleaved batch. The worst-case swap check found 15 of 96 cells over
0.02:

- the maths-heavy review page at every width, up to 0.1766;
- the short-maths review page at three;
- the maths-heavy player at three, up to 0.1201;
- the maths-with-a-table player at one.

### 17.3 Question typography (`b6aeb62`, `22d9f74`)

- **What is set in the serif:** on question review pages and in the player,
  stems, passages and their titles, instructions, options, rationales and
  worked explanations use the system reading serif, `--font-serif`
  (Charter, Iowan Old Style, Palatino Linotype, Georgia, Cambria).
  - It needs no download, so a question is laid out once, in its final
    font, and never reflows when the interface font arrives.
  - Interface headings ("Question 3 of 10", "Worked explanation"), labels,
    badges, buttons and the navigator keep Bricolage.
  - Maths is unchanged: KaTeX sizes itself against the surrounding text.
- **Option letters** get a fixed width. Otherwise the interface font
  arriving beside an option changed the width left for its text and
  rewrapped it.
- **Passage titles** were the last source of movement. In the interface
  font, a title that took a second line once the font arrived pushed the
  passage down by 0.0207 at 375 px. It is part of the question, so where a
  question is read it is now set with the passage.
- **Unchanged:** the homepage sample keeps its own typography, as agreed in
  Phase 2.
- **The maths-font preload** now also runs in the player. The two main
  KaTeX faces are preloaded when anything in the open section shows maths.
  The whole section counts, because the player moves between questions
  without a page load, and a formula shown after a move would otherwise wait
  for its fonts and reflow.

### 17.4 Saving and resume (`7622c03`, `005f50b`)

**On the server: ordered answer writes (migration 006).**

- **The clock:** `attempt_items.response_clock` holds the stored answer's
  place among writes to it. It uses the server-anchored clock the player
  already keeps for navigation (§15.1).
- **The rule:** an answer is written only if its clock is ahead of the
  stored one, checked in the same guarded `UPDATE` as the write (inside an
  IMMEDIATE transaction, as for the lock after checking).
  - **A repeat of the stored answer** succeeds without writing, so a
    resent request never counts its time twice.
  - **An older answer arriving after a newer one** changes nothing. The
    reply says it is stale and carries the answer the server holds.
  - **An old draft arriving after the answer was checked** is stale, not a
    violation. A newer, different answer to a checked question is refused
    as before.
- **What still comes first:** ownership, the attempt's status, the open
  section, its clock and navigation rules, and the lock. A clock is never
  evidence of when an answer was made: one made before the deadline but
  delivered after it (plus the existing 3 s grace for requests in flight)
  is refused.
- **Writes without a clock** (older pages, direct API use) are treated as
  the newest, as every write was before, and move the stored clock forward.
  A clock implausibly far ahead of the server's is treated the same way, so
  it cannot freeze the order.
- **Reported back:** attempt state now includes each answer's clock and the
  stored resume position's.

**On the device: nothing is lost before the server confirms it.**

- **Written before sent:** every answer change and every move goes to the
  device's storage (`localStorage`) before its request, and stays there
  until a reply confirms it (`src/lib/player/pending.ts`). A reload, a
  dropped connection or a closed tab therefore loses nothing the server
  would still accept.
- **One record per account and attempt.** It is named by an opaque
  per-account key (a hash of the account id, never the id itself). Two tabs
  of one attempt share it, and the newest change to a question wins, as it
  does on the server.
- **When the player opens,** it sorts what the device kept against the
  server's state:
  - changes newer than the server's are shown as the learner's and sent
    again;
  - changes the server already holds, or has something newer for, are
    forgotten;
  - a move newer than the stored resume position reopens the player there,
    if the rules allow the move from where the server placed the learner.
    The server checks it again.
  - This closes §15.7's immediate-reload gap, and offline moves now keep
    their position too.
- **Never replayed:**
  - into a section that has closed;
  - into a question checked since with a different answer;
  - into another account's attempt.

  What could not be saved is counted and the learner told: in the next
  section's player, or on the results page, which then deletes it from the
  device.
- **Accounts on one device:**
  - When any player opens, every other account's records are deleted, so a
    shared device does not hold one learner's waiting answers while another
    is signed in.
  - Signing out clears them. The response sends `Clear-Site-Data:
    "storage"`, and the page also deletes them itself.
  - A record older than 30 days is deleted unread.
- **Sending:**
  - One request at a time, oldest change first.
  - Typing (numeric and essay answers) is sent once it pauses for 800 ms,
    and at once on leaving the question, submitting or leaving the page.
  - With no reply, the player retries after 2, 4, 8 and 16 s, then every
    30 s. It tries at once on reconnecting or returning to the tab, and a
    server that is busy or failing is retried the same way.
  - A reply that the section closed, that the answer is locked, or that the
    account changed ends that change for good.
  - Leaving the page sends what is waiting with `keepalive`. A resend is
    recognised by the server and ignored.
- **Waiting on the server:**
  - Checking an answer, moving to a screen that commits the current one,
    and submitting a section all wait until every answer is saved, and need
    the connection.
  - A move that commits a screen no longer goes ahead offline. Before, it
    moved the learner on in the page while the server still held them on
    the old screen.
- **When device storage is unavailable** (some private windows, or a full
  device), waiting answers are held only in the page. The status says so,
  and leaving the page asks first.

**Visible states.** The player's header shows one status:

| State | Shown | Meaning |
| --- | --- | --- |
| Before any answer | Saves as you go | Nothing waiting |
| Saving | Saving… | A change is on its way, or typing will be sent when it pauses |
| Saved | ✓ Saved | The server has confirmed every answer |
| Offline | ○ Offline · 2 waiting | No reply. The detail (read to screen readers, and as a tooltip) says the two answers are kept on this device, or on this page only, and in a timed section that the timer keeps running |
| Failed | ! 2 not saved · Retry | The server could not take them yet; retrying, with a button to try now |

- **"Saved"** appears only once the server has confirmed every answer. A
  change kept on the device is never called saved.
- **In the navigator,** a question answered here but not yet confirmed has
  a dotted bar instead of a solid one, a legend while any exist, and
  "not yet saved" in its accessible name.
- **Announcements:** state changes are announced politely, except "Saving",
  which would chatter on every keystroke.
- **The clock:** nothing says or implies that the clock pauses. Offline, a
  timed section's status says it keeps running, and the section's rules say
  that an answer reaching the server after time runs out does not count.
  When the clock reaches zero offline, the player waits for the connection
  before asking the server, rather than showing the browser's offline page.

### 17.5 The player (`005f50b`, `22d9f74`)

- **Focus mode:** inside a session the site header and footer are not
  rendered. This is done in CSS, from a marker in the server-rendered
  player, so they are never painted.
  - **The player's own header** is one row that never wraps: the session's
    name (truncated), the save status, the clock or "Untimed", and "Leave",
    which goes to the exam's dashboard.
  - It removes Phase 1's finding that the player carried the marketing
    header, which also did not update after a guest session was created.
- **Controls** sit in a bar fixed to the bottom of the viewport: Previous,
  Mark, and Next (or Next screen, Review answers, Finish section). They no
  longer move with the question's or the explanation's length. A browser
  test checks the bar's position before and after an explanation appears.
- **Split passage:** from 1024 px a passage sits beside its question and
  scrolls on its own. Below that, it sits above the question.
- **Measure:** a question without a passage keeps a 68-character measure.
- **Navigator:**
  - Targets are 44 px (they were 36).
  - Each state has its own shape as well as colour:
    - unanswered: an outline;
    - answered: filled, with a bar under the number (dotted while not yet
      saved);
    - marked: a corner;
    - current: a heavy ring.
  - On a phone it scrolls sideways in one row rather than stacking.
- **Unchanged:** the rules, the clock display, the end-of-section review
  screen, the check-then-lock flow, and the explanation after checking.
  Focus still moves to the question's heading on each move.

### 17.6 Practice setup: new questions only (`2c1e196`)

- **Who sees it:** a learner who has been shown some of an exam's
  questions gets a "New questions only" checkbox on the setup page. Someone
  who has seen nothing is not offered it, since every question is new to
  them.
- **The counts** come from the questions this learner has never been
  shown, by the rule session creation enforces (`unseenOnly`, §16.6):
  - the label reads, for example, "30 of 37 are new to you";
  - with the box ticked, every count on the form (topics, difficulty
    levels, lengths) is the new-question count.
- **No top-up with repeats.** A new-questions session is shorter when too
  few are left, or cannot start, and says so:
  - "You have been shown every question that matches" when there are none;
  - "Include questions you have seen (37)" is an explicit choice, alongside
    the existing broader options.
- **Unticked,** the form says how many of the matching questions are
  repeats, and that questions seen recently are only avoided, not excluded.
  That keeps ordinary practice honest about its repeats, and no historical
  figure changes.

### 17.7 Tests

- **Unit: 327 pass** (293 before).
  - **Ordered writes** (13): newer stored, older refused as stale, a resend
    saved once with its time counted once, clearing ordered too, unclocked
    writes applied as the newest, an implausible clock unable to fix the
    order, per-question order, the lock (a newer different answer refused,
    an older draft stale, a resent check returning its feedback), and
    refusals that come before order: another learner's attempt, a submitted
    attempt, and an answer made in time but delivered after the deadline.
  - **The device store** (16): the newest change kept, unreported time
    carried only when asked, settling only once the server holds it or
    newer, one record shared by two tabs, a full device reported,
    per-account keys and deletion of other accounts' records, age limits,
    unreadable records, what the player replays, forgets or reports as lost
    when it opens (a closed section, a locked answer), moves newer than the
    stored position, reply classification and back-off.
  - **Notebook pages** (5): every entry exactly once across three pages, in
    the same order each time; ties broken on the question id; bookmarks
    made at the same moment; page bounds; another learner's pages empty;
    parsing the page number.
- **Browser: 149 pass, 1 skipped** (115 before; the skip is the same
  mobile keyboard test as before). That run was on the build before
  `22d9f74`. After it, the specs that commit touches (Phase 4, Phase 5 and
  the learner journey, 92 tests) were run again on the measured build: 91
  pass and the same 1 is skipped. There are 17 new tests, each run on the
  desktop and mobile projects:
  - **Notebook:** every mistake reached once across pages from the
    keyboard, the view and the page kept; another learner's pages empty.
  - **Saving:**
    - saved only once the server has it, in focus mode;
    - an answer and a move made just before a reload, both kept and saved
      after it;
    - offline: held on the device, said, marked in the navigator, and sent
      on reconnecting;
    - a tab closed offline, its answer sent when the session is reopened;
    - an answer made offline in a timed section, refused once time has run
      out, with the results saying so;
    - a repeated request recognised, its time counted once;
    - an older answer from another device never replacing a newer one;
    - a checked answer never changed from either device;
    - nothing sent into a session submitted elsewhere, with one refused
      request and then nothing;
    - another account never shown, and never left with, the first
      account's waiting answers;
    - signing out asking the browser to clear storage.
  - **Layout:** the control bar unmoved when an explanation appears; a
    passage beside its question at 1280 px and above it at phone width, in
    the reading serif.
  - **Setup:** new questions only with honest counts, and a session with
    no question the learner had been shown; not offered to someone who has
    seen nothing.
- **Sweep:** 34 routes at 360 and 1440 px, as a visitor and as a guest,
  including a live session, setup with the new option and a notebook page
  past the end, on the measured build. No horizontal overflow, console
  errors or failed statuses.
- **Typecheck:** clean, including each of this phase's commits checked out
  on its own (so none depends on a later commit, as `c19aee1` does on
  `ecf3779`).

### 17.8 Measurements

**Method:** §14.1's lab method.

- **The comparison:** the final Phase 5 build against the frozen Phase 4
  build of §17.2, run interleaved in alternating order, with every load in a
  cold context. Phone: 390 × 844 at DPR 2, 4× CPU, 1.6 Mbps down / 750 kbps
  up, 150 ms RTT. Desktop: 1440 × 900, unthrottled.
- **The data:** question pages come from the six fixtures, and learner
  pages load as the fixture learner. Both builds serve identical copies of
  one database; only the Phase 5 copy has migration 006, which the Phase 4
  code does not read.
- **Build provenance:** the Phase 5 build was made at 23:27 from source
  identical to `22d9f74` (the working tree was clean). The Phase 4 build was
  made at 21:47 from a clean copy of `982d690`, and has no `question-text`.

**Acceptance batch** (26–27 September, 23:36–00:10):

- **Power:** on AC and fully charged throughout.
- **Processor:** 203 readings. Clock median 166% of base, 10th percentile
  126% (idle readings), 90th percentile 184%. One reading under load fell
  below 120% (118% at 78% utilisation, at 23:46). A one-thread check before
  the batch held 165–182%. Median utilisation 25%.
- **No competing work:** no builds, tests or repository edits during the
  batch. The development server on port 3000 was idle (0 s of CPU over 10 s,
  checked before the start).

**Phone, question pages, 9 runs.** LCP and FCP were equal in every run. The
targets are §17's: median LCP ≤ 1,800 ms and CLS ≤ 0.02 for question review
pages. The player has no LCP budget of its own and is reported for
regression.

| Page | Phase 4 median (IQR) | Phase 5 median (IQR, range) | Change | Target | Worst CLS, Phase 4 → 5 |
| --- | --- | --- | --- | --- | --- |
| Review, maths-heavy | 1,928 (1,872–2,128) | 2,100 (1,964–2,136; 1,852–2,356) | +172 | ≤ 1,800: **missed by 300** | 0 → 0 |
| Review, maths with a table | 2,024 (1,896–2,044) | 2,104 (2,012–2,216; 1,880–2,376) | +80 | ≤ 1,800: **missed by 304** | 0 → 0 |
| Review, short maths | 1,812 (1,780–1,860) | 1,880 (1,840–1,916; 1,788–2,044) | +68 | ≤ 1,800: **missed by 80** | 0 → 0 |
| Review, short, no maths | 1,396 (1,372–1,428) | 1,484 (1,436–1,532; 1,360–1,544) | +88 | ≤ 1,800: met | 0.0002 → 0.0002 |
| Review, long stem, no maths | 1,416 (1,396–1,460) | 1,456 (1,448–1,540; 1,412–1,620) | +40 | ≤ 1,800: met | 0.0016 → 0.0002 |
| Review, long passage, no maths | 1,480 (1,380–1,508) | 1,528 (1,512–1,584; 1,448–1,636) | +48 | ≤ 1,800: met | 0.0002 → 0.0002 |
| Player, maths-heavy | 1,600 (1,304–1,696) | 1,584 (1,420–1,620; 1,264–1,968) | −16 | — | **0.0254 → 0.0001** |
| Player, maths with a table | 1,264 (1,256–1,284) | 1,384 (1,372–1,396; 1,360–1,444) | +120 | — | 0.0014 → 0 |
| Player, short maths | 1,252 (1,204–1,304) | 1,284 (1,252–1,360; 1,240–1,472) | +32 | — | 0.0010 → 0 |
| Player, short, no maths (maths in its section) | 1,056 (1,024–1,112) | 1,164 (1,136–1,192; 1,128–1,228) | +108 | — | 0 → 0.0001 |
| Player, long stem, no maths | 1,104 (1,072–1,144) | 1,044 (1,028–1,064; 988–1,128) | −60 | — | 0 → 0 |
| Player, long passage, no maths | 1,372 (1,320–1,404) | 1,344 (1,276–1,440; 1,012–1,548) | −28 | — | 0.0005 → 0.0001 |

**Phone, the budgets of earlier phases, 7 runs, same batch:**

| Page | Phase 4 | Phase 5 (IQR) | Budget | Worst CLS, Phase 4 → 5 |
| --- | --- | --- | --- | --- |
| `/`, first-time visitor | 1,720 | 1,752 (1,728–1,790) | ≤ 2,200: met | 0.0011 → 0.0008 |
| `/`, returning learner | 1,684 | 1,708 (1,674–1,718) | ≤ 2,200: met | 0.0005 → 0.0009 |
| `/exams/digital-sat` | 1,428 | 1,488 (1,412–1,518) | ≤ 1,800: met | 0.0199 → 0 |
| `/practice/digital-sat` | 1,452 | 1,448 (1,402–1,488) | ≤ 1,800: met | 0 → 0.0006 |
| `/exams/digital-sat/format` | 1,492 | 1,520 (1,500–1,540) | ≤ 1,800: met | 0.0148 → 0.0148 |
| `/dashboard` | 1,440 | 1,432 (1,388–1,468) | ≤ 1,800: met | 0 → 0.0001 |
| Results, a finished session | 1,448 | 1,488 (1,430–1,516) | ≤ 1,800: met | 0.0033 → 0.0033 |
| Notebook, all mistakes | 1,460 | 1,428 (1,418–1,484) | ≤ 1,800: met | 0 → 0 |
| `/practice/lsat`, learner with history (new option shown) | 1,456 | 1,532 (1,462–1,572) | ≤ 1,800: met | 0.0002 → 0.0002 |

**Desktop, 5 runs, same batch:**

- **Review pages:** 200–260 ms median LCP on Phase 5, against 200–304 on
  Phase 4.
- **Player pages:** 168–216 against 188–276.
- **Worst CLS:**
  - maths-heavy review page: 0.0575 → 0.0006;
  - short maths review page: 0.0463 → 0.0002;
  - player pages: from up to 0.0177 to 0;
  - every other page: 0.0006 or less.

**Worst-case font swap** (§14.4's check, eight widths, 360–1440 px, final
build):

- **Before (Phase 4):** 15 of 96 cells over 0.02, from 0.0249 to 0.1766.
- **After:** 0 of 112 cells over 0.02 (the 96 plus the learner homepage and
  the learner setup page).
  - Question and player pages: 0.0029 at most.
  - Learner homepage: 0.0171 at most (768 px).
  - Setup with the new option: 0.0106 at most.

**Sizes (Phase 5):**

- **The player** carries 5.9 KB more JavaScript (125.8 KB against 119.9 KB),
  which is the saving hook and the device store.
- **The results page** carries 1.8 KB more, for the notice about answers
  that never reached the server. Every other route is within 0.4 KB of
  Phase 4.
- **CSS:** 0.6 KB more everywhere (focus mode and `question-text`).
- **The homepage** is at 112.4 KB of JavaScript, within the 118 KB budget,
  with fonts unchanged.
- **Fonts on the player:** a section with maths now loads KaTeX's two faces
  (41.7 KB) at the start, including for its questions without maths.

**What the misses consist of: a diagnostic batch** (00:13–00:21, 7 runs,
phone, interleaved; conditions as above, clock median 172%).

- **What it compared:** the Phase 4 build, the Phase 5 build, and the same
  Phase 5 build twice more with a stylesheet inserted at document start.
  One variant takes the serif out; the other hides the worked explanation
  and the option rationales. Every Phase 5 variant carried the same inserted
  script, so the script's own cost is shared.
- **What it is for:** it decides nothing about acceptance. It shows where
  the time goes.

| Page | Phase 4 | Phase 5 | Phase 5, no serif | Phase 5, explanation and rationales hidden |
| --- | --- | --- | --- | --- |
| Review, maths-heavy | 1,564 (1,518–1,614) | 1,596 (1,578–1,608) | 1,548 (1,534–1,568) | 1,332 (1,296–1,350) |
| Review, maths with a table | 1,584 (1,566–1,624) | 1,668 (1,600–1,676) | 1,536 (1,528–1,568) | 1,404 (1,382–1,440) |
| Review, short maths | 1,464 (1,454–1,788) | 1,548 (1,520–1,678) | 1,544 (1,502–1,556) | 1,352 (1,324–1,410) |
| Review, short, no maths | 1,120 (1,104–1,168) | 1,196 (1,170–1,234) | 1,148 (1,108–1,180) | 1,096 (1,092–1,110) |

- **The serif** costs 4–132 ms on these pages (48 ms on two of the four).
  It is part of what removed the desktop shift.
- **Laying out the worked explanation and the rationales** before the first
  paint costs 196–264 ms on a maths page and 100 ms without maths. On a
  phone that content is entirely below the fold, but Chrome lays it out
  before painting, as §12.2 found for the homepage. This is the largest
  single part of a maths review page's first paint that the page itself
  controls.
- **The same pages ran 20–25% faster in this batch** than in the acceptance
  batch half an hour earlier, on both builds (Phase 4's maths-heavy page:
  1,928 then 1,564). The processor readings in the two windows were the
  same:
  - clock median 172% in both;
  - 159% and 161% at load.

  So they do not explain the difference. This is §14.1's batch-to-batch
  drift, at a larger size than seen before. It is larger than the margin on
  every maths review page, which is why the acceptance batch's result
  stands. The faster batch is not a substitute for it, because choosing the
  batch that passes is exactly what the method rules out.

**Batches not used for acceptance, and why** (kept in the scratch copy with
their processor logs):

1. **Phase 4 alone, before any change** (21:52–22:10): the "before" record
   of §17.2. The notebook files were being edited during it, so the user's
   development server may have recompiled while it ran. It is used only as
   a record of the state before any change, never in a comparison.
2. **Typography diagnostic, desktop and one phone route** (22:17–22:31):
   invalid. Code was being edited in the repository, and the development
   server recompiled on every save, at more than one core (7.3 s of CPU in
   6 s). The phone part was stopped.
3. **Focused phone diagnostic, four routes** (22:32–22:41): no repository
   edits, but long drafts were being written in the Claude app on the same
   machine. The Phase 4 build read 1,596–2,432 ms, against 1,052–1,876 in
   the before record. Kept as a diagnostic only. Its interleaved
   differences were of the same order as the acceptance batch's (+80 to
   +132 ms, against −16 to +108 there).
4. **First acceptance attempt** (23:31–23:36): stopped after one route,
   because the same drafting load was running. It was restarted with the
   machine left alone.

### 17.9 Database

- **The development database** (`tmp/examer.db`) has migration 006,
  applied after an online backup to
  `tmp/backups/examer-2026-09-26-before-migration-006.db` (integrity check
  ok, 81 attempt items, the same as the source). Existing rows are
  unchanged: `response_clock` is NULL until an answer's next write.
- **The end-to-end and scratch databases** are disposable copies. The
  frozen Phase 4 copy has no migration 006.

### 17.10 Commits (on `FronDesign`, not pushed)

- `07bf9ad`: notebook pages, on a stable order (the Phase 4 closeout).
- `7622c03`: ordered answer writes (migration 006), with unit tests.
- `b6aeb62`: question text in the reading serif; the maths-font preload in
  the player.
- `005f50b`: answers kept on the device until confirmed; save states;
  recovery; focus mode, the split passage and the navigator; the Phase 5
  browser tests for saving and layout.
- `2c1e196`: new questions only in practice setup, with its browser tests.
- `22d9f74`: passage titles in the reading serif; a header that cannot wrap;
  Leave at every width.
- A documentation commit with this section.

Each of these was checked out on its own and typechecks. The Phase 4 pair
stays as it was: `c19aee1` deleted the old skill table while the Phase 3
results page still imported it, so it builds only together with the next
commit, `ecf3779` (§16.11). The history was not rewritten.

### 17.11 What remains

- **The maths review pages' phone budget** (§17.12).
- **Time on a question still counts only when an answer is saved.** A
  skipped question counts 0 s (§3).
- **Marking a question for review needs the connection.** It is not kept
  on the device; offline, the player says so and leaves it unmarked.
- **Checking an answer, committing a screen and submitting need the
  connection.** By design, since the server decides each; offline, the
  player says so, and the answers stay on the device.
- **Waiting answers are stored unencrypted in the browser's storage** until
  confirmed. They are deleted on confirmation, when another account opens a
  player, on signing out, and after 30 days. Anyone using the same browser
  profile before then could read them.
- **`Clear-Site-Data: "storage"`** on signing out also clears any other
  storage the site may use in future. Today it holds nothing else.
- **A move replayed after a reload** opens the page at the server's
  position and moves once the page's script starts: a visible jump, only in
  that case.
- **Ordering across devices** is as accurate as the time between a page's
  render and its first interaction (§15.7). A device clock is used only
  through the server-anchored offset.
- **The player's maths-font preload** covers the whole section, so a
  question without maths in a section with maths pays for it (+108 ms on
  the phone, measured).
- **"New questions only"** is for untimed topic practice, where session
  creation enforces it. Timed and diagnostic formats keep their fixed
  selection.
- **Ordinary practice can still repeat questions,** and those answers count
  towards progress, as before (no historical figure was rewritten). Setup
  now says how many matching questions are repeats.
- **One Phase 4 browser test depends on the data** (new-question practice
  from results). It skips when the weakest skill has no unseen questions;
  the Phase 5 setup test covers the same rule deterministically.
- **Not yet seen on a real phone:** the sticky player header and control
  bar. In headless phone emulation, one screenshot taken just after a move
  (the heading taking focus, the page scrolling) showed both about 30 px
  out of place. Hit-testing at that moment found both in place, a plain
  scroll renders correctly, and the browser test that pins the bar to the
  viewport's bottom passes on the phone project. So it looks like a capture
  artifact, but it is unconfirmed on a device.
- **Unchanged:** label filtering in the notebook (deferred), exam hubs
  (Phase 6), merging guest history (out of scope), and one machine with
  local budgets.

### 17.12 Acceptance

**Phase 5 is implemented. Its acceptance is pending,** on one criterion.
The closeout that followed (§17.13) did not change that. *Superseded by
§17.15: accepted against revised budgets, with these failures kept on
record.*

**Met, in the acceptance batch:**

- **CLS:** 0.02 or less on every measured page, phone and desktop, review
  and player, maths and not. The worst-case swap check has no cell over
  0.02.
- **The maths question page's desktop shift** (Phase 4's open issue) is
  0.0006. The maths player's phone shift is 0.0001, from 0.0254.
- **Non-maths review pages:** 1,456–1,528 ms on the phone, against the
  1.8 s target.
- **Every earlier budget holds:** the homepage for visitors and learners,
  hub, setup, format guide, dashboard, results and notebook.
- **The journeys work in a real browser,** on desktop and mobile. Saving,
  recovery and every refusal of §17.4 are covered in §17.7.

**Not met:** median LCP ≤ 1,800 ms on the phone for question review pages
with maths.

| Page | Phase 4, same batch | Phase 5 | Over by |
| --- | --- | --- | --- |
| Maths-heavy (`gmat-ps-remainder-structure-209`) | 1,928 | 2,100 | 300 |
| Maths with a table (`gmat-ta-store-refit-108`) | 2,024 | 2,104 | 304 |
| Short maths (`bocconi-ug-alg-absolute-value-034`) | 1,812 | 1,880 | 80 |

- **Phase 4 misses on all three pages in the same batch too.** Phase 5 adds
  68–172 ms on them, of which the diagnostic attributes 4–132 ms to the
  serif.
- **The budget is unchanged.** The faster diagnostic batch, in which all
  three pass (1,548–1,668), is not used for the verdict.

**Recommended focused fix, since tried (§17.13, insufficient):** defer the layout of the worked
explanation and the option rationales on question review pages until they
approach the viewport. That is `content-visibility: auto` with a size
estimate on the explanation section and the rationale blocks.

- **What stays the same:** nothing on the page changes in content or
  design, and nothing is hidden. The serif stays, because it is what fixed
  the shifts.
- **Upper bound:** hiding that content altogether saved 196–264 ms on the
  maths pages. Phase 2 found `content-visibility` recovered only part of
  such a saving on the homepage (§12.2). So it may bring the short-maths
  page within the budget in a slow batch, and it may not be enough for the
  other two.
- **To accept it:**
  - build it as a variant;
  - measure it interleaved against Phase 4 and this build in two separate
    batches, with the machine left alone, reporting both;
  - accept only if both batches meet 1.8 s;
  - check that the worst-case swap and CLS stay at or below 0.02 when
    scrolling into the deferred content.
- **If that is not enough,** the remaining levers change the design or the
  rendering, and each is a decision to make first:
  - collapse the explanation on phones;
  - render less maths markup (KaTeX's MathML copy is what screen readers
    use);
  - drop the serif from the explanation only.

### 17.13 The performance closeout: deferring the worked explanation (27 September 2026)

**Decision given:** try `content-visibility` on the below-the-fold worked
explanations and option rationales of question review pages. Keep the
reading serif, the design, the content and the budgets. Treat the §17.8
diagnostic saving as an upper bound, not an expectation, and start with a
small interleaved comparison on the three failing pages.

**What was tried.** On the question review page only:

- **The rule:** the worked explanation and each option rationale got
  `content-visibility: auto`, with an estimated block size that `auto`
  replaces with the real size once rendered.
  - Explanation: 900 px on phones, 700 px from 640 px up.
  - Rationale: 110 px and 60 px.
  - The estimates came from the fixture pages' real heights: explanations
    837–1,393 px on a phone and 495–976 on desktop; rationales 60–160 and
    40–80.
- **Printing** would have rendered everything (`content-visibility:
  visible`).
- **Nothing else changed.** The content stayed in the server-rendered page.

It was built as a separate candidate (a third build, beside the frozen
Phase 4 build and `22d9f74`).

**The small comparison** (27 September, 01:00–01:07; phone, 7 runs,
interleaved). Conditions: AC and fully charged; clock median 173% of base,
163% when busy; the development server idle; nothing else running.

| Page | Phase 4 | Phase 5 (`22d9f74`) | Candidate (IQR) | Candidate vs Phase 5 | Worst CLS, candidate |
| --- | --- | --- | --- | --- | --- |
| Maths-heavy | 1,904 | 2,000 | 1,996 (1,946–2,080) | −4 | 0.0002 |
| Maths with a table | 1,972 | 1,928 | 1,712 (1,694–1,740) | −216 | 0 |
| Short maths | 1,732 | 1,872 | 1,844 (1,780–1,872) | −28 | 0 |

**Why it helps only one page.** Chrome's `contentvisibilityautostatechange`
event, recorded on the candidate at 390 × 844, shows which blocks it
skipped at the first render. It skipped a block only when the block started
beyond about 2,100 px, roughly one and a half screens below the fold.

| Page | Where the explanation starts | Skipped at first render |
| --- | --- | --- |
| Maths with a table | 2,304 px | Yes |
| Maths-heavy | 1,350 px | No |
| Short maths | 1,197 px | No |

- **The margin is Chrome's own** and cannot be set from CSS. On the two
  pages that miss, the explanation is inside it and is laid out before the
  first paint whatever the CSS says.
- **The candidate is therefore insufficient:** two of the three pages
  would still miss. It was not taken further. The two acceptance batches
  were not run, and nothing was committed. The change is kept as a patch in
  the scratch copy and is fully described above.

**Where the cost is: explanation or rationales** (01:09–01:15; phone, 7
runs, on `22d9f74`, with stylesheets inserted at document start, as in
§17.8; conditions as above, clock median 172%, 157% when busy). An upper
bound for each part:

| Page | Phase 5 | Explanation hidden | Rationales hidden | Both hidden |
| --- | --- | --- | --- | --- |
| Maths-heavy | 1,824 | 1,568 (−256) | 1,744 (−80) | 1,484 (−340) |
| Short maths | 1,708 | 1,468 (−240) | 1,716 (+8) | 1,460 (−248) |
| Maths with a table | 1,812 | 1,612 (−200) | 1,828 (+16) | 1,588 (−224) |

The worked explanation is the cost. The rationales barely matter.

**The remaining gap.**

- **With the candidate** (small comparison): maths-heavy 196 ms over and
  short maths 44 ms over. Maths with a table is within the budget.
- **Without it** (the acceptance batch of §17.8): 300, 304 and 80 ms over.
- **Even the upper bound may not close it in a slow batch.** Take the
  acceptance batch's figures and the explanation's upper bound. Maths with a
  table would still come to 1,872–1,904 ms (proportional or absolute
  saving) and maths-heavy to 1,805–1,844. Only short maths would clearly
  pass. In batches as fast as the split diagnostic, all three would pass
  (1,468–1,612).

**The smallest design change, previewed only (not made).**

- **What changes:** on phones, the worked explanation starts closed, as a
  native disclosure. Its heading is the control, with "Show" and a chevron.
- **What stays:** the answer summary, each option with its rationale, the
  labels and the actions stay where they are. Opened, the explanation is
  exactly today's content.
- **The preview:** a phone preview (390 px) of now, closed and opened was
  made on the Phase 5 build by rearranging the page in a headless browser.
  It was delivered with this report. A final design would turn the chevron
  up when open.
- **What a native disclosure gives:**
  - it works without JavaScript;
  - it is a focusable control that Enter and Space toggle;
  - its open or closed state is announced;
  - Chrome opens it for a find-in-page match and for a link to something
    inside it. Other browsers vary, and that needs checking.
- **What it needs:** a print rule or a `beforeprint` handler, since a
  closed disclosure prints nothing.
- **To leave desktop as it is,** the server-rendered page would start
  closed (the server cannot know the width), and a small script would open
  it from 640 px up once loaded. The explanation is below the fold on
  desktop, so that cannot shift anything in view.
- **Before any decision:**
  - it changes what a learner sees first on a phone;
  - its measured saving is an upper bound;
  - by that bound it may still leave the table page over 1.8 s in a batch
    as slow as the acceptance batch.

  It is left for a decision.

**Phase 5 acceptance remains pending.** No budget, typography, maths
rendering or explanation was changed.

### 17.14 Offline: what needs the connection, and where waiting answers are kept

**Works offline,** within a session already open:

- choosing and changing answers, including typing;
- moving between questions in a section that allows it, or within the
  current screen;
- reading the question on screen.

Each change is kept on the device and sent when the connection returns. The
clock keeps running throughout.

**Needs the connection:**

- **saving to the server:** nothing is counted until the server confirms
  it;
- **checking an answer** and seeing its explanation;
- **moving to a screen that commits the current one,** where a section
  locks each screen;
- **submitting a section or the session;**
- **marking a question for review;**
- **opening anything new:** a session, a question review page, results,
  the notebook.

Offline, the player says so for each of its own actions and changes
nothing. A page that is not open cannot load at all.

**Where waiting answers are kept:**

- **The key:** the browser's `localStorage`, one record per account and
  attempt, under `examer.pending.v1.<owner>.<attemptId>`. `<owner>` is the
  first 22 characters of a base64url SHA-256 of the account id with a fixed
  prefix, so the key holds no account id.
- **The contents:** plain JSON. It is **not encrypted**. It holds:
  - each waiting answer, with its section, position, ordering clock and
    unreported time;
  - the latest unconfirmed move.

  Anyone who can use that browser profile can read it until it is cleared.
- **When storage cannot be written,** as in some private windows or a full
  device, waiting answers are held only in the page. The status says so,
  and leaving the page asks first.

**When they are cleared:**

- a waiting answer or move, as soon as the server confirms it, or holds
  something newer;
- a change the server refuses for good (the answer is locked, or a rule
  forbids it): at once, and the learner is told;
- changes whose section closed before they reached the server: once the
  next section's player or the results page has told the learner how many
  did not count;
- every other account's records, when any account opens a player on the
  device;
- everything, on signing out. The response sends `Clear-Site-Data:
  "storage"`, and the page also deletes the records itself;
- any record older than 30 days, unread, the next time a player or
  results page opens.

**Still pending:** the sticky player header and control bar have not been
checked on a real phone (§17.11).

### 17.15 Revised budgets for question review pages, and acceptance (27 September 2026)

**Decision given:**

- **Budgets:**
  - Question review pages that show maths: local median LCP ≤ 2.2 s on the
    phone.
  - Question review pages without maths: ≤ 1.8 s, unchanged.
  - CLS ≤ 0.02 everywhere, unchanged.
  - Every other budget unchanged.
- **Unchanged:** worked explanations stay visible. The mobile disclosure is
  not built, and the `content-visibility` experiment is not restored.

**What this revision is.** It explicitly accepts the rendering cost of
showing mathematical explanations in full on a phone. It makes no page
faster.

- **The earlier results stand:** against 1.8 s, the three maths review
  pages failed in the acceptance batch (§17.8, §17.12), and deferring the
  explanation did not fix two of them (§17.13).
- **Why 2.2 s:** it is the homepage's budget (§14.1), and it applies here
  only to question review pages with maths.
- **What it is not:** like every budget here, it is a local regression
  budget for this machine and method, not a field-performance claim.

**The final verification.** One bounded batch on the unchanged committed
application.

- **The builds:** Phase 5 was measured on the build made at 23:27 on 26
  September from source identical to `22d9f74`. That source differs from
  HEAD only in line endings; everything after it is documentation. The
  baseline is the frozen Phase 4 build of §17.2.
- **The method:** §17.8's, interleaved, as the fixture learner:
  - the three maths review pages that failed, and the short non-maths
    review page as the representative without maths;
  - on the phone, 9 runs; on desktop, 5 runs.
- **Conditions** (27 September, 10:04–10:12):
  - **Power:** AC and fully charged throughout.
  - **Before the start:** the development server idle (0.03 s of CPU over
    10 s), and a one-thread check held 150–157% of base clock.
  - **Processor during the batch:** 46 readings. Clock median 155%. Under
    load, median 150%, 10th percentile 129%, lowest 123%. No reading under
    load fell below 120%. Median utilisation 35%.
  - **No competing work,** apart from one progress check that read a few
    files.
- **A first start was stopped after about 70 seconds** (10:02:54–10:04:05)
  and restarted. Its completion watcher had fired at once on the previous
  batch's stop file, and the progress checks that followed ran during its
  first loads. It was stopped for that reason, not for any result: none had
  been produced. Its partial processor log is kept.

**Phone, 9 runs** (medians, IQR and range, ms; every run below):

| Page | Phase 4 | Phase 5 | Budget | Worst CLS, Phase 4 → 5 |
| --- | --- | --- | --- | --- |
| Maths-heavy | 1,664 (1,596–1,736; 1,496–1,920) | 1,984 (1,808–2,028; 1,448–2,288) | ≤ 2,200: **met** | 0 → 0 |
| Maths with a table | 1,968 (1,868–2,068; 1,688–2,212) | 1,928 (1,848–2,112; 1,752–2,336) | ≤ 2,200: **met** | 0 → 0 |
| Short maths | 1,940 (1,904–2,220; 1,480–3,060) | 1,820 (1,688–1,964; 1,508–2,576) | ≤ 2,200: **met** | 0.0358 → 0 |
| Short, no maths | 1,324 (1,244–1,356; 1,156–1,516) | 1,336 (1,312–1,372; 1,192–1,768) | ≤ 1,800: **met** | 0.0002 → 0 |

Every run (LCP, ms):

| Page | Build | Runs |
| --- | --- | --- |
| Maths-heavy | Phase 4 | 1,920 · 1,496 · 1,596 · 1,712 · 1,664 · 1,736 · 1,792 · 1,576 · 1,664 |
| Maths-heavy | Phase 5 | 1,724 · 1,448 · 2,024 · 1,984 · 1,808 · 1,964 · 2,288 · 2,028 · 2,224 |
| Maths with a table | Phase 4 | 2,076 · 1,748 · 1,908 · 2,068 · 1,976 · 1,868 · 1,688 · 2,212 · 1,968 |
| Maths with a table | Phase 5 | 2,204 · 1,892 · 2,336 · 2,112 · 1,804 · 2,000 · 1,848 · 1,928 · 1,752 |
| Short maths | Phase 4 | 1,808 · 1,908 · 1,940 · 2,132 · 2,220 · 3,060 · 2,380 · 1,480 · 1,904 |
| Short maths | Phase 5 | 1,688 · 1,844 · 2,576 · 1,820 · 1,712 · 1,556 · 1,508 · 1,964 · 2,276 |
| Short, no maths | Phase 4 | 1,512 · 1,156 · 1,244 · 1,516 · 1,220 · 1,324 · 1,352 · 1,356 · 1,272 |
| Short, no maths | Phase 5 | 1,768 · 1,372 · 1,328 · 1,312 · 1,212 · 1,192 · 1,528 · 1,336 · 1,348 |

- **LCP and FCP were equal in every run.**
- **CLS:** 0 in every Phase 5 phone run. The Phase 4 build's 0.0358 was a
  single run of the short-maths page, which showed no shift in any of its 32
  earlier phone runs.

**Desktop, 5 runs:**

| Page | Phase 4 LCP → Phase 5 | Worst CLS, Phase 4 → 5 |
| --- | --- | --- |
| Maths-heavy | 240 → 260 | 0.0575 → 0.0006 |
| Maths with a table | 248 → 272 | 0.0002 → 0.0002 |
| Short maths | 236 → 240 | 0.0463 → 0.0002 |
| Short, no maths | 200 → 200 | 0.0011 → 0.0004 |

**Validity.**

- **The criteria:** the batch meets the method's criteria: mains power, no
  competing work, and no low clock under load.
- **The noise:** it is noisier than the acceptance batch of §17.8, and a
  lower clock is not taken to make it conservative or comparable.
  - **Processor:** clock median 150% under load, against 159% while the
    acceptance batch measured the same pages; median utilisation 35%,
    against 25%.
  - **The baseline's own spread:** on the short-maths page, 316 ms against
    80 ms, with one run at 3,060 ms.
  - **The order of builds:** on two maths pages Phase 5 came out faster
    than Phase 4, the reverse of every earlier batch. So this batch alone
    does not measure what Phase 5 costs against Phase 4. §17.8 and §17.13
    do (+68 to +172 ms on these pages).
- **Why the verdict stands anyway:**
  - The Phase 5 medians are 216–380 ms under 2.2 s. On each page the
    margin is larger than half its interquartile range (110–138 ms), and
    each page's third quartile is also under 2.2 s (1,964–2,112).
  - The same verdict holds in every valid Phase 5 batch. The maths review
    pages' Phase 5 medians came to:
    - 1,880–2,104 in the acceptance batch (§17.8), the slowest;
    - 1,872–2,000 in the small comparison (§17.13);
    - 1,708–1,824 and 1,548–1,668 in the two diagnostic batches;
    - 1,820–1,984 here.

    The non-maths review pages' medians came to 1,196–1,528.

  The result is therefore taken as valid, with its variability reported as
  above. It does not depend on choosing a batch.

**Checks.** No application code has changed since the checks of §17.7, so
the suites were not run again. This section adds only documentation.

**Acceptance: Phase 5 is complete** (27 September 2026), **accepted against
the revised budgets** above.

- **Met:**
  - maths review pages ≤ 2.2 s median LCP on the phone;
  - non-maths review pages ≤ 1.8 s;
  - CLS ≤ 0.02 on every measured page, phone and desktop;
  - every other budget, as measured in §17.8.
- **Earlier results kept:** the 1.8 s failures of §17.8 and §17.12 are
  recorded as they were.
- **Outstanding release check:** the player's sticky header and control bar
  have not been checked on a real phone (§17.11). No such check has been
  made.
- **Unchanged and accurate:** the offline behaviour, and plain,
  unencrypted local storage of waiting answers (§17.14).
