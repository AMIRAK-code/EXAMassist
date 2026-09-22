# Agent roles and what each actually did

This project was built by a coordinating agent directing specialised subagents.
This file records the assignments as given, and — more usefully — what each role
actually produced, including where an agent's work had to be corrected.

The coordinating agent owned architecture, shared contracts, integration, scope
decisions and final acceptance. **No agent's self-report was accepted as
evidence.** Every claim below was checked against the repository.

## Roles

| Role | Owns | Files owned |
| --- | --- | --- |
| **A — Exam research & content quality** | Official-source research, exam specifications, question taxonomy, content authoring, admissions fact-checking | `content/exam-specs/_raw/`, `docs/research/`, `content/questions/`, `content/stimuli/` |
| **B — Product & learning design** | User journeys, information architecture, interface copy | Merged into the coordinating agent's work; see `docs/ARCHITECTURE.md` |
| **C — Frontend** | Public pages, dashboard, practice and exam screens | `src/app/**`, `src/components/**` |
| **D — Backend & assessment engine** | Data models, auth, permissions, attempt persistence, timers, scoring, exam configuration | `src/lib/**`, `db/migrations/**` |
| **E — Search & editorial** | Public content structure, technical SEO, structured data, crawler policy | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/components/seo/`, `docs/research/seo-and-crawler-policy.md` |
| **F — Independent QA** | Acceptance tests, scoring verification, security checks, accessibility, content audits | `tests/**`, the blind-review pipeline |

## Delegation contract

Each delegated task specified: objective and concrete deliverable; inputs and
dependencies; owned files; shared interfaces to follow; acceptance criteria;
required verification evidence; and what to do when blocked. Agents were
required to run a verifier and paste its output verbatim, and to report concerns
rather than work around a shared file.

Shared contracts had exactly one owner (the coordinating agent): the assessment
types, the database migrations, the question schema, and the UI primitives. No
subagent was permitted to edit them; several correctly raised concerns instead,
and those are recorded below.

## What each agent produced, and what had to be corrected

### Agent A — research (8 agents, one per exam/topic)

Produced source-backed specifications for the Digital SAT, Enhanced ACT, LSAT,
GMAT, GRE, the Bocconi undergraduate and law tests, and Bocconi admissions
requirements, plus a crawler and structured-data policy. All sources are
official domains; the records are in `content/exam-specs/_raw/`.

Quality was high and appropriately hedged — the LSAT record refuses to assert
per-section question counts because LSAC does not publish them, which is exactly
right.

**Coordinator corrections:**

- The adversarial fact-check stage never ran (the session hit its usage limit),
  so the coordinating agent re-verified the load-bearing numbers first-hand
  against College Board, ACT, LSAC, GMAC, ETS and Bocconi. All matched. See
  `docs/VERIFICATION.md`.
- Two research agents reached **opposite conclusions about Bocconi navigation**
  from what appeared to be the same document. The coordinating agent resolved it
  by fetching the 2027/28 rules PDF directly and extracting section 3.2
  verbatim. The law agent was right that a summary page exists; the
  undergraduate agent was right that answer-changing is not documented as
  permitted after a screen is committed. Both configs were rewritten to the
  verified rule.

### Agent A — content authoring

Wrote the original question bank against the official taxonomies. Items enter as
`in_review` and cannot publish themselves.

**Coordinator corrections:** a mis-tagged GMAT skill slug was fixed
(`qps-logic-analytical-reasoning` → `qps-arithmetic`), and answer-position bias
was removed across the bank (see Agent F).

### Agent D — exam configurations (7 agents, one per config)

Produced seven versioned `ExamConfig` files from the research records, each
validating against the shared schema with zero errors.

Judgement was good: the GMAT config correctly marks adaptive routing
unavailable because the algorithm is proprietary; the ACT config refuses a
full-length simulation because two official ACT documents contradict each other
on break durations; the LSAT config records that its own item counts are our
editorial choice, not LSAC's rule.

**Coordinator corrections:**

- Bocconi navigation, as above.
- Bocconi undergraduate `fullSimulation` was unavailable for a reason that the
  newer rules PDF had made stale; it was re-enabled with an honest note and a
  matching simulation blueprint added.
- The engine gained `NavigationPolicy.pageSize` and `reviewScreenEditable`,
  because no config could express "three questions per screen, committed on
  Next, with a read-only summary page" — the actual Bocconi rule.
- The SAT agent flagged that `selection.sectionKey` could not express
  "draw from the whole exam" and that domains are tagged to one module although
  they appear in both. Both were real. They became `ANY_SECTION` and
  `SectionConfig.poolSectionKey`. Without the latter, no SAT module-2 or GRE
  section-2 blueprint could ever have drawn a question.

### Agent E — search and editorial

Verified current crawler guidance from first-party documentation and produced
`docs/research/seo-and-crawler-policy.md`. It found that several assumptions in
the brief were out of date: FAQ rich results were withdrawn, practice-problem
markup was deprecated, and no provider has adopted `llms.txt`. It also
established the three-way split between model-training crawlers, AI-search
crawlers and user-triggered fetchers that `src/app/robots.ts` now encodes.

### Agent F — independent QA

Ran the blind independent solve over the whole bank. Its most valuable finding
was not a wrong answer but a **structural defect**: correct answers clustered on
the first option, to the point that answering "A" to every ACT mathematics item
would have scored 9 out of 9 without reading them. That set was unusable as a
measurement instrument.

**Coordinator action:** `scripts/normalise-option-order.ts` now sorts numeric
choice sets ascending and deterministically shuffles the rest, remapping the
answer key, distractor notes and audit record with them.

## Where the multi-agent approach was abandoned

Several stages were done directly by the coordinating agent rather than
delegated, deliberately:

- **Shared contracts** (assessment types, migrations, question schema, UI
  primitives) — single ownership was the point.
- **The scoring, navigation, timing and selection engine** — the correctness
  core, and the thing everything else is judged against.
- **Verification of exam facts** — an agent's citation is a claim; the
  coordinating agent fetched the sources.
- **The blind-review comparison** — done in code
  (`scripts/apply-review.ts`), not by a model, so agreement is mechanical rather
  than a matter of opinion.

Four sessions hit usage limits mid-run. Work survived because agents wrote files
incrementally and because results were recoverable from the workflow journal;
where a stage died, the coordinating agent either completed it directly or
re-ran a narrower version. `docs/TASK-BOARD.md` records which.
