# Redesign — Phase 1: assessment, direction and plan

Phase 1 of the "Academic Avant-Garde" redesign. Nothing in the application has
changed yet. This file records what the product does today (measured, not
assumed), the proposed visual direction and design system, which proposed
features already have backend support, and the staged plan.

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
  `1{,}700`. There are 10 occurrences in SAT and GMAT content.
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

- **Display and interface: Bricolage Grotesque**, variable (opsz, wdth, wght),
  OFL. Display sizes use 84–86% width and weights 700–740. Interface text uses
  the text optical size.
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
- **Learner (registered, or a guest with a session):** Home (the dashboard) ·
  Practice · Mistakes · Plan, plus an exam switcher and Account, or "Keep your
  progress" for guests. Readiness becomes a section of Plan rather than a
  fifth top-level item. On mobile: the same disclosure pattern.
- **In a session:** a minimal bar with exam and section, timer, save status
  and Exit. Timed sections say plainly that leaving does not stop the clock.
- **Exam context:** the chosen exam is stored in a first-party, non-sensitive
  cookie. It is read on the server by the header, homepage and dashboard, so
  nothing flickers. Pages that read it are already dynamic and are never
  shared-cached.
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
- Switching exams fetches `GET /api/samples/[exam]`. The route is public and
  read-only, serves only the curated ids, and is cacheable because it holds no
  personal data. Without JavaScript the selector falls back to `/?exam=gre`
  links. The card reserves height so switching does not move the page, and
  focus stays on the selector.
- Checking the answer is client-side against the sample's own key and is never
  stored.
- The six sample items are **excluded from diagnostic and timed selection**,
  and a test asserts that no currently open format closes as a result. SAT
  Reading and Writing (26/27), LSAT Logical Reasoning (23/24) and the GRE
  diagnostic (16/17) are each one question short, so samples are chosen from
  domains with slack.
- First visit defaults to SAT (a verbal item readable without maths). Later
  visits use the remembered exam.

**Phase 2 budgets (lab, same method as §2):** homepage JS ≤ 118 KB transfer
(+12 KB), fonts ≤ 90 KB, throttled-mobile LCP ≤ 1.5 s, CLS ≤ 0.02.

## 9. Decisions needed from the owner

1. **Describing the question pipeline.** Should the trust copy describe an
   AI-drafted, AI-blind-solved and mechanically compared pipeline as such, or
   is there human review that the records don't show? Until then the
   homepage uses neutral wording that is true either way: "Written for Examer,
   AI-assisted in drafting, and solved blind — without the answer key — before
   publication."
2. **Answer changes after feedback.** Recommended: lock an item once its key
   has been shown (a server rule in `canAnswerAt`, enforced in the API). The
   alternative is to keep changes but score the first answer. Either changes
   assessment behaviour and its tests.
3. **Sample items and pools.** Confirm excluding the six homepage samples from
   diagnostic and timed selection (recommended), or allow them everywhere.

## 10. Staged plan

| Phase | Scope | Backend work |
| --- | --- | --- |
| **2** | Tokens and fonts; shared components; public and learner header and footer (mobile menu, active states, exam-context cookie, guest "keep your progress"); the homepage; the display-name layer; a favicon; and four small defects on the homepage-to-practice path: header overflow, preset skill shown with length clamped to what's available, the study-plan `?domain=` fix, and the KaTeX separators | Sample map and public sample route |
| 3 | Dashboard answering "what next, and why": resume across exams with expiry and last position, one primary recommendation with its basis, a domain-level skill landscape with tally evidence and a table equivalent, and every empty and error state | Resume query; evidence-capped signals |
| 4 | Results (verdict, where you struggled, evidence, next step, review on its own page) and the mistake notebook (your answer → why it's wrong → worked explanation → retry or related practice) | Integrity rule (§9.2); retry kind; optional mistake labels (migration); strict unseen filter |
| 5 | Practice setup (clear format kinds, visible configuration, no silent changes) and the player (focus mode, split passage at ≥ 1024 px, fixed controls, visible save states, persisted offline queue, debounced text input, 44 px navigator) | Queue persistence; debounce |
| 6 | Remaining routes: hubs, format guides, guides, auth, account, study plan and readiness restyle, admin | Plan persistence and missed-session recovery (if approved) |
| 7 | Validation: axe-core in CI, keyboard and screen-reader passes, performance budgets, full journeys at 390 / 768 / 1440 and 200% zoom | — |
