# Exam research records

Verified specifications for every exam the platform covers, compiled from the test makers' own
published pages. Each record carries numbered sources, a verification date, and an explicit list of
things the test maker does **not** publish — because the rule for this project is that where a fact
cannot be verified, the dependent "exam-accurate" feature gets disabled rather than estimated.

**All eight records were verified on 2026-09-18.**

## Index

| Exam | Version covered | Verified on | Full simulation justified by verified rules? | Record |
| --- | --- | --- | --- | --- |
| SAT (Digital SAT) | Digital SAT, Bluebook two-stage adaptive — 2026-27 testing year | 2026-09-18 | **Yes, with two carve-outs.** Module timing, within-module navigation and the one-way module lock are fully documented. The routing threshold and the scaled score are not: routing runs on our own labelled heuristic and no 400–1600 score is reported. | [digital-sat.md](./digital-sat.md) |
| The ACT (Enhanced ACT) | Enhanced ACT — 2026-2027 administration year, national online and paper | 2026-09-18 | **Yes for timing and navigation; no for breaks.** Per-section timing and free within-section navigation are verified. ACT has not published enhanced-format break durations, so breaks ship untimed and labelled. No 1–36 or Composite score is reported. | [enhanced-act.md](./enhanced-act.md) |
| GRE General Test | Shorter GRE General Test — format effective 2023-09-22, verified for 2026-27 | 2026-09-18 | **Yes for timing and navigation; the section order is ours.** The five section timings reconcile exactly to 118 minutes and intra-section navigation is documented. Section ordering beyond "Analytical Writing first" is not, and neither is the routing rule, so both are shipped as clearly labelled defaults. | [gre-general.md](./gre-general.md) |
| GMAT Exam | Current version, formerly "Focus Edition" — 2026 administration; Policies & Procedures 2026-08-12 | 2026-09-18 | **Yes, and unusually faithfully.** Section timing, the six section orders, the three-edit Question Review & Edit cap and the candidate-elected break are all documented precisely enough to reproduce. Question-level adaptive routing and the 205–805 scale are not, so both are off. | [gmat-focus.md](./gmat-focus.md) |
| Law School Admission Test (LSAT) | Post-August-2024 format, no Analytical Reasoning — 2026-2027 testing cycle | 2026-09-18 | **Partly.** Section count, section types, 35-minute timing and the 10-minute intermission are verified. LSAC does not publish questions per Logical Reasoning section or any total, so item counts are configuration, never presented as official, and no 120–180 score is reported. | [lsat.md](./lsat.md) |
| Online Bocconi Test (Bachelor / Law programs) | AY 2027-28 admissions cycle; conduct rules from the AY 2026-27 Instructions and Rules of Conduct PDF | 2026-09-18 | **Yes — the most reproducible exam in the set.** The 75-minute deadline, forward-only three-question paging, and the full raw-scoring rule (+1 / 0 / −0.2 / −0.33) are all published. Only the per-item answer-option count is unpublished, so option layout carries a documented approximation note. | [bocconi-online-test-undergraduate.md](./bocconi-online-test-undergraduate.md) |
| Bocconi Online Test — Law | AY 2027-28 admissions cycle; booking window 2026-07-13 to 2027-04-20 | 2026-09-18 | **Yes, same basis as the standard variant.** Separate blueprint (5 areas, Mathematics down to 5 items, Verbal reasoning added), same timing, navigation, penalty and 17/50 floor. Option counts and whether the −0.33 rule reaches this variant's "Logic and critical thinking" area remain open. | [bocconi-online-test-law.md](./bocconi-online-test-law.md) |
| Bocconi admissions requirements (Undergraduate / Law / MSc) | a.y. 2027-28 cycle primary, a.y. 2026-27 retained where still live | 2026-09-18 | **Not applicable — this is a requirements reference, not an exam.** It carries no simulation. It defines the eligibility floors, the accepted-test routes per school, and the three-variant split that the two test records above depend on. | [bocconi-admissions-requirements.md](./bocconi-admissions-requirements.md) |

### Companion documents

| Document | What it is |
| --- | --- |
| [DISCREPANCY-REGISTER.md](./DISCREPANCY-REGISTER.md) | The audit of the supplied brief: 64 rows of claim-versus-verified-finding, a verdict on each of the brief's seven named investigation items, and the per-exam list of unverifiable rules mapped to the features they disable. |
| [seo-and-crawler-policy.md](./seo-and-crawler-policy.md) | Crawler tiering and policy, search-indexing guidance, the structured-data types we will and will not ship, an annotated `robots.txt`, and the claims-policy gate. |

---

## How to refresh this research

**The eight per-exam markdown files in this directory are generated. Do not edit them by hand — any
edit will be overwritten.**

The source of truth is `content/exam-specs/_raw/<examKey>.draft.json`. Each of those records holds
the verified claims, sources, taxonomy, unverifiable list and brief discrepancies for one exam.
`scripts/build-research-docs.mjs` is a pure transformation over them, deliberately so: the
documentation can never assert anything the research record does not already contain.

### Procedure

1. **Edit the record, not the document.** Change
   `content/exam-specs/_raw/<examKey>.draft.json`. When you add or change a fact, add or update its
   entry in that record's `sources[]` (with `publisher`, `isOfficial`, a `quote` and `fetchedOk`),
   point the claim's `sourceUrl` at it, and move the record's `verificationDate` forward.
2. **Regenerate.** From the repository root:

   ```sh
   node scripts/build-research-docs.mjs
   ```

   It reads every `*.draft.json` in `content/exam-specs/_raw/` except the `seo`-prefixed one, writes
   `docs/research/<examKey>.md` for each, and prints what it wrote. It is idempotent — re-running it
   with no record changes produces no diff.
3. **Commit the record and the generated document together,** so the diff shows the fact change and
   its rendered form in one place.
4. **Update the three hand-maintained documents when the records move.** `README.md` (this file),
   `DISCREPANCY-REGISTER.md` and `seo-and-crawler-policy.md` are **not** generated by the script.
   If you change a `briefDiscrepancies[]` or `unverifiable[]` entry, the register's table and its
   disabled-features section need updating to match; if you change a `verificationDate` or
   `versionLabel`, the index table above needs updating.
5. **If a rule becomes verifiable, re-enable the feature deliberately.** Remove the item from
   `unverifiable[]`, add the claim and its source, regenerate, then remove the matching row from the
   register's disabled-features section and open the work to turn the feature back on. The reverse
   also applies: if a source goes stale or a page changes, the feature goes back off before the
   document is updated.

### Review cadence

- **Date-sensitive facts** (application rounds, deadlines, test dates, cycle labels) need a shorter
  review interval than rule facts. Bocconi in particular currently has two admissions cycles live on
  its own site simultaneously, so every Bocconi record carries its own cycle label.
- **Rule facts** (timing, navigation, scoring, calculator policy) can be reviewed per administration
  year — but re-verify before any release that changes simulation behaviour.
- **`seo-and-crawler-policy.md` needs re-verification before every major release.** Four of the
  structured-data types the brief assumed were viable were deprecated between November 2024 and June
  2026; an annual review is too slow for that area.

### Related validation

- `scripts/validate-configs.ts` validates the exam configuration layer.
- `src/lib/content/question-schema.ts` holds the question-bank contract and the editorial validator
  (`validateQuestion()`) that enforces equivalent-option detection, answer-key resolution, required
  distractor reasoning and the independent-solve record. `package.json` wires
  `npm run content:validate` to `scripts/validate-content.ts`, which is not yet present in the
  repository — see the closing note in section 7 of the discrepancy register.
