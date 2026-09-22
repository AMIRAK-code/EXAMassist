# Discrepancy register — the supplied brief versus verified official sources

**Compiled:** 2026-09-21 · **All findings verified:** 2026-09-18 · **Records audited:** 8

## Important note on what was actually supplied

**The repository contained no separate question attachment.** The only supplied document is the
brief itself — `researcxh context.md` — which is a coordinator prompt, not a per-exam fact sheet
and not a question bank. `content/questions/` is empty.

So this register audits two things and only two things:

1. **The brief's own claims** about how each exam is structured, scored and delivered, and the
   assumptions baked into its engine specification (response types, adaptivity, navigation,
   calculator policy, thresholds).
2. **The brief's explicit investigation list** — the seven risks it told us to go and check.

**There were no supplied questions to quarantine, and none are claimed to have been.** Any
statement elsewhere that items were reviewed, repaired or quarantined would be false. The brief's
rule — *"Do not silently repair ambiguous questions by guessing the intended answer. Quarantine
them and create clearly labeled original replacements"* — is honoured here by construction: there
is nothing supplied to repair, and the editorial validator described in subsection 7 below makes
an ambiguous item unpublishable rather than silently fixable.

Where a row's "Claim or risk raised in the brief" reads `n/a`, the row records an inconsistency
**between two official pages of the same test maker** rather than a brief error. Those are kept in
the register because they have the same effect on the build: we have to choose a reading and
disclose that we chose it.

---

## Register

64 rows, drawn from the `briefDiscrepancies[]` array of all eight verified records.

| ID | Exam | Claim or risk raised in the brief | Verified finding | Official source | Verified on | Consequence for the build |
| --- | --- | --- | --- | --- | --- | --- |
| LSAT-01 | LSAT | LSAT includes an Analytical Reasoning / 'logic games' section (flagged in the brief as a risk of outdated material). | Confirmed outdated. LSAC states the logic games were sunset after the June 2024 test and were replaced by a second Logical Reasoning section; from August 2024 the test is two scored LR sections, one scored RC section, plus one unscored section. | <https://www.lsac.org/blog/what-to-expect-starting-with-august-2024-lsat> | 2026-09-18 | Purge all Analytical Reasoning content, all game-board / diagramming UI, and any AR taxonomy nodes from the question bank and engine. Do not ship an 'LSAT Logic Games' practice mode. If legacy AR items exist, quarantine them behind a clearly labelled 'retired format (pre-August 2024)' flag, off by default. |
| LSAT-02 | LSAT | Implied stable delivery modality (test taker chooses remote or test center). | Two official LSAC pages conflict. The LSAT FAQ still says most test takers choose between live remote proctoring and a Prometric center. LSAC's announcement pages say in-person testing is required starting with the August 2026 LSAT, with limited exceptions. The FAQ appears to be stale relative to the 2026-27 cycle. | <https://www.lsac.org/blog/registration-open-2026-2027-lsat-testing-cycle-plus-update-return-person-testing> | 2026-09-18 | Do not present 'choose your modality' as current guidance for the 2026-27 cycle. Surface in-center as the default with documented exceptions, and cite the announcement pages rather than the FAQ. Add a content-review flag to re-verify the FAQ before each cycle. |
| LSAT-03 | LSAT | Test structure and item counts can be specified exactly for an exam-accurate simulation. | LSAC publishes section count, section type and 35-minute timing, but does NOT publish questions per Logical Reasoning section or total scored questions. Only Reading Comprehension has an official anchor (four sets of five to eight questions). | <https://www.lsac.org/lsat/register-lsat/accommodations/specifications-lsat-and-lsat-argumentative-writing> | 2026-09-18 | Make LR item count a configuration value, not a documented fact. Never render a 'X of 75' progress indicator as if it were the official count; use 'X of N' driven by the actual generated form. |
| LSAT-04 | LSAT | LSAT Writing is part of the test day. | LSAT Argumentative Writing is a separate, remotely proctored, unscored session available starting eight days before the multiple-choice administration, with its own 15+35 minute structure, and physical scratch paper is not permitted for it. | <https://www.lsac.org/lsat/about/lsat-argumentative-writing> | 2026-09-18 | Model Writing as a distinct assessment entity, not a fifth section of the test-day timer. Do not include it in the 120-180 score computation. Model the score-release gate as a separate completion requirement. |
| LSAT-05 | LSAT | A published raw-score-to-scaled-score table can be used to report an LSAT score. | LSAC equates each form individually; the correct-answer count needed for a given scaled score varies by form (LSAC's own example: 56 correct for a 160 on one form, 57 on another). No advance conversion table is published. | <https://www.lsac.org/podcast/keeping-data-may-2025> | 2026-09-18 | Any 120-180 number the app shows must be labelled an estimate with an explicit disclaimer. Do not present it as an official or predicted LSAT score, and do not claim the conversion mirrors a real form. |
| LSAT-06 | LSAT | An older LSAC candidate information sheet PDF describing the test is usable as a source. | LSAC's candidate-info-sheet.pdf, still live on lsac.org, describes five 35-minute sections, a 15-minute break after section 3, paper test books and No. 2 pencils. It is a stale artifact of the paper LSAT and contradicts every current page. | <https://www.lsac.org/docs/default-source/jd-docs/candidate-info-sheet.pdf> | 2026-09-18 | Blocklist this PDF (and the 2018-era Digital LSAT Screen Layouts PDF, which still depicts an Analytical Reasoning screen) from any content-sourcing pipeline. 'Hosted on lsac.org' is not sufficient provenance; content must also be dated to the current format. |
| ACT-01 | ACT (Enhanced) | The brief flags as a known problem: 'ACT totals that do not match the listed section counts.' | ACT's own totals are internally consistent once you distinguish ADMINISTERED items from SCORED items — the mismatch in third-party material comes from mixing the two. Verified per-section administered/scored/field-test: English 50/40/10, Math 45/41/4, Reading 36/27/9, Science 40/34/6. Core totals: 131 administered = 108 scored + 23 field-test, in 125 minutes. With Science: 171 administered = 142 scored + 29 field-test, in 165 minutes. ACT's published totals row states exactly these figures, and ACT's enhanced scoring key independently confirms maximum raw scores of English 40, Mathematics 41, Reading 27, Science 34. | <https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf> | 2026-09-18 | The exam config must carry TWO counts per section (administeredCount and scoredCount) and a per-item scored flag. Progress UI, section headers and 'question X of Y' must use the administered count; raw score, reporting-category subscores and any scale estimate must use only scored items. Never display 131 or 171 as a scored total. |
| ACT-02 | ACT (Enhanced) | The brief's list of response types to support includes multiple-select, numeric entry, quantitative comparison, data sufficiency and structured data interpretation. | The Enhanced ACT uses none of these. Every multiple-choice item in all four sections is a four-option single-select item (math was reduced from five options to four; English/Reading/Science were already four). The only non-multiple-choice response is the optional Writing essay. 'Structured data interpretation' on the ACT is a stimulus format (tables, graphs, figures inside Science and Reading passage groups), not a response type. | <https://www.act.org/content/dam/act/unsecured/documents/act-enhancements-educator-guide.pdf> | 2026-09-18 | For examKey enhanced-act, restrict supportedResponseTypes to single_select, passage_group and essay. Set optionsPerItem = 4 for all four multiple-choice sections. Authoring/QA must reject any five-option ACT math item as stale legacy content. Quantitative-comparison and data-sufficiency renderers belong to the GRE/GMAT configs only and must not be reachable from the ACT config. |
| ACT-03 | ACT (Enhanced) | The brief treats adaptive behaviour and 'adaptive routing decisions' as a general engine capability to persist per attempt, and warns against 'unsupported claims about proprietary adaptive scoring.' | The ACT is explicitly and deliberately non-adaptive in every mode: 'While the ACT can be taken online, it is not a computer-adaptive test.' ACT states that adaptive testing was ruled out because it 'would make paper and online modes not equivalent.' | <https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf> | 2026-09-18 | Set adaptive: none in the enhanced-act exam config and hard-disable any routing UI, stage indicator or 'module 2 difficulty' messaging on ACT simulations. Any adaptive drill mode we offer for ACT practice must be labelled as our own study feature, explicitly NOT an ACT behaviour, in both the UI and the public exam-format page. |
| ACT-04 | ACT (Enhanced) | The brief implicitly treats Science as one of the exam's standard sections (it lists Science alongside English, Math and Reading without noting optionality) and does not state which sections form the Composite. | Science is optional and is EXCLUDED from the Composite. 'With the enhanced ACT, the Composite score is now calculated from the English, math, and reading scores.' Science yields a separate 1-36 section score and a STEM score (average of Math and Science) only if taken. ACT defines exactly four legitimate section combinations: (1) English, math, reading; (2) + science; (3) + writing; (4) + science and writing. For state/district testing the science decision belongs to the state or district, not the individual student. | <https://www.act.org/content/dam/act/unsecured/documents/act-enhancements-educator-guide.pdf> | 2026-09-18 | Model the ACT as one exam config with four selectable section bundles rather than a single fixed blueprint. Composite computation must average exactly three scale scores and must not be blocked or altered when Science is absent. STEM requires Math AND Science; ELA requires English AND Reading AND Writing — gate both on section presence. Results pages must not show an empty or zeroed Science score for core-only attempts. |
| ACT-05 | ACT (Enhanced) | The brief asks for 'timed practice and exam simulations' with verified timing, navigation and break rules, implying a fully exam-accurate simulation is achievable from published sources. | Section timing and within-section navigation are fully verifiable, but break structure is not. ACT's February 2026 design framework describes a short break after Reading before the optional sections, while ACT's own online student tutorial still states 'A 15-minute break after the mathematics test and a 5-minute break after the science test' — the legacy pattern. No official source gives the enhanced-format break durations. | <https://www.act.org/content/dam/act/unsecured/documents/CBT-StudentTutorial-June.pdf> | 2026-09-18 | Ship the ACT simulation with exam-accurate section timers and navigation, but mark break timing as UNVERIFIED: either omit timed breaks or render them as untimed pauses with a visible note that ACT has not published enhanced-format break durations. Do not label the simulation 'exam-accurate' end to end; scope that claim to timing and navigation. |
| ACT-06 | ACT (Enhanced) | The brief directs that 'Answers save and results calculate correctly' and that results should distinguish official facts from practice approximations, but does not identify which ACT scoring step is unreproducible. | Raw scoring is fully reproducible (count of correct answers, no wrong-answer penalty, scored items only). Raw-to-scale conversion is NOT: ACT publishes conversion tables only for specific released practice forms, and the equating methodology and item parameters are proprietary. | <https://www.act.org/content/dam/act/unsecured/documents/ACT-Ntl-Enhancements-Scoring-Key-and-Conversion-Tables.pdf> | 2026-09-18 | Report raw score, per-reporting-category accuracy and timing as authoritative. Do NOT report a 1-36 scale score or Composite for attempts built from our original question bank unless we attach a documented, clearly-labelled approximation method. Any 1-36 number shown must carry an 'estimate, not an ACT score' disclosure adjacent to it, and percentiles must be suppressed entirely. |
| SAT-01 | SAT (Digital) | The coordinator brief instructs: 'Investigate specifically: ... SAT claims about unscored questions', implying the supplied per-exam attachment makes a suspect or unsupported claim about unscored SAT questions. | College Board DOES publish this, precisely. Two pretest (unscored) questions are embedded in EVERY module — 2 x 4 modules = 8 per test — and the operational/pretest split is published as 25+2 per Reading and Writing module and 20+2 per Math module. So 90 of 98 administered questions are scored. The claim is verifiable, not unsupported. What is NOT published is where the pretest items sit within a module. | <https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated> | 2026-09-18 | Exam config must distinguish administered count (54/44) from operational count (50/40). Domain distribution percentages are stated over OPERATIONAL questions, so a 54-question Reading and Writing blueprint built on 28%/26%/26%/20% of 54 produces wrong counts. Blueprint against 50 and 40, then add 2 unscored per module if we choose to simulate them. |
| SAT-02 | SAT (Digital) | The brief lists 'Unsupported claims about proprietary adaptive scoring' as something to investigate, and separately warns 'Do not claim to reproduce proprietary SAT, GMAT, or GRE scoring algorithms.' | The adaptive design itself is real, official, and well documented — but only qualitatively. The routing threshold, the IRT parameters, and the scale-score transformation are all unpublished. Any product claiming to reproduce SAT scaled scores is fabricating. | <https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf> | 2026-09-18 | The brief's warning is correct and must be enforced for the SAT. Ship raw accuracy, per-domain accuracy, and timing. Do NOT ship a 400-1600 estimate unless we publish a documented methodology page and label it an approximation everywhere it appears. |
| SAT-03 | SAT (Digital) | The brief's engine spec requires each exam configuration to carry 'Raw-scoring rules' and lists a generic raw-to-scale path. | For the Digital SAT a raw-count-to-scale model is factually wrong. College Board states that two students with the same number of correct answers can receive different section scores, because scoring is IRT ability estimation over the specific items administered. | <https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated> | 2026-09-18 | The exam config schema needs a scoringModel discriminator, not just raw rules. For digital-sat set scoringModel = 'raw_only_reporting' with scaledScoreReporting = false, and surface a UI note explaining why we do not show a 1600-scale score. |
| SAT-04 | SAT (Digital) | The brief requires the engine to support 'Quantitative comparison' and 'Data sufficiency and structured data interpretation' response types among the verified exams. | Neither exists on the Digital SAT. The SAT uses exactly two response types: four-option single-select multiple choice, and student-produced response (numeric entry). Quantitative comparison is GRE; data sufficiency is GMAT. | <https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf> | 2026-09-18 | The digital-sat config must whitelist only single_select and numeric_entry. Authoring UI should refuse to create QC or DS items tagged digital-sat. |
| SAT-05 | SAT (Digital) | The brief requires support for 'Shared passage or stimulus groups' as a response/grouping type across exams. | The Digital SAT has NO passage sets. Every question is discrete and standalone; each Reading and Writing question carries its own 25-150 word passage or passage pair. This was a deliberate design change from the paper SAT. | <https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf> | 2026-09-18 | Do not model SAT Reading and Writing items as members of a passage group. Attach the stimulus 1:1 to the item. Passage-group support is still needed for LSAT/GMAT/GRE but must be disabled for digital-sat, otherwise adaptive item selection and the easiest-to-hardest ordering break. |
| SAT-06 | SAT (Digital) | The brief treats 'adaptive routing where implemented' as a testable engine behaviour for the SAT. | Module-level routing is real and can be simulated structurally (two prebuilt second modules, one harder, one easier). But the actual decision rule is not public — College Board says only that the break point sits around the median section score. | <https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf> | 2026-09-18 | We can and should implement and persist a two-stage routing decision (it is structurally faithful and affects the learner experience), but the threshold is ours, must be stored with the attempt, and must be labelled in the results screen as 'our approximation'. Tests should assert routing is deterministic and persisted, not that it matches College Board. |
| SAT-07 | SAT (Digital) | The brief's generic model assumes a per-exam 'navigation and answer-review permissions' setting. | The SAT needs TWO distinct navigation scopes, not one: unrestricted within a module (back/forward, change answers, skip, mark for review, jump via question menu) and hard-locked between modules ('Once you move on from any module, you cannot return to it'). Auto-advance on timer expiry is mandatory. | <https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf> | 2026-09-18 | Navigation permissions must be modelled at module granularity with a one-way module lock enforced SERVER-side, not just by hiding a button. A resumed attempt must not be able to re-enter a submitted module. |
| SAT-08 | SAT (Digital) | Not in the brief, but a very common third-party error worth recording: that the Digital SAT has a no-calculator Math portion, as the paper SAT did. | False for the Digital SAT. 'Use of a calculator is permitted for all questions' in both Math modules, with an embedded Desmos graphing/scientific calculator plus the option of an approved non-CAS handheld. No calculator on Reading and Writing. | <https://satsuite.collegeboard.org/sat/whats-on-the-test/math/calculator-use> | 2026-09-18 | calculatorPolicy for digital-sat is uniform across both Math modules: {graphing: true, scientific: true, allowed: true}; Reading and Writing modules: {allowed: false}. Do not build a per-module calculator toggle for the SAT. |
| SAT-09 | SAT (Digital) | Two official College Board documents disagree on the SPR character limit. | The Assessment Framework (section 5.1.15) says 'Math SPR questions require students to enter answers of up to six characters, the first of which may be a negative sign.' The Fall 2026 Bluebook Test Directions say 'You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.' The operational directions are narrower for positive answers and are the current, administration-year-specific source. | <https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf> | 2026-09-18 | Implement the Fall 2026 operational rule: max 5 characters if no leading minus, max 6 if the first character is a minus. Flag this in content-authoring docs so item writers do not author positive answers needing 6 characters. |
| SAT-10 | SAT (Digital) | The supplied brief file in this repo ('researcxh context.md') is the coordinator prompt, not a per-exam fact sheet. | The repository contains only the orchestration brief. The referenced attachment carrying specific per-exam factual claims (SAT unscored questions, ACT totals, LSAT logic games, Bocconi thresholds) is NOT present in the working directory, so its individual SAT claims could not be compared line by line. | <https://satsuite.collegeboard.org/sat/whats-on-the-test/structure> | 2026-09-18 | The discrepancy register above is built against the brief's own investigation prompts and against the SAT errors those prompts imply. If the original attachment is supplied, re-run this comparison; the verified claim set here is sufficient to adjudicate any SAT claim in it. |
| GRE-01 | GRE General | The GRE General Test has 'no unscored/research section'. | Correct for the current format, but the live ETS test-structure page still displays 'Unscored' and 'Research' table rows with footnotes 1 and 2 — these belong exclusively to the 'Test sections and timing before September 22, 2023' table further down the same page. The current-format table lists only Analytical Writing, Verbal and Quantitative. The Information Bulletin confirms this split: the unscored-section sentence sits under 'Test Structure Prior to September 22, 2023', while 'Test Structure Beginning September 22, 2023' has no such sentence. | <https://www.ets.org/gre/test-takers/general-test/prepare/test-structure.html> | 2026-09-18 | Configure zero unscored/research sections. Critically: any automated scraper or LLM summarizer pointed at this ETS page will very likely lift the unscored/research footnotes into the current spec — I reproduced exactly that failure twice in this session before pulling the raw HTML. Pin the extraction to the 'beginning September 22, 2023' table and add a regression test asserting the engine's GRE config contains no unscored section. |
| GRE-02 | GRE General | Sections are 'Analytical Writing (Analyze an Issue), two Verbal Reasoning sections, two Quantitative Reasoning sections', implying that fixed sequence. | Analytical Writing is always first, but the four Verbal and Quantitative sections 'may appear in any order after the Analytical Writing section'. The brief's ordering is one possible delivery, not the specified one. ETS does not say whether the two sections of a measure must be adjacent. | <https://www.ets.org/gre/test-takers/general-test/prepare/test-structure.html> | 2026-09-18 | Do not hard-code AW-V1-V2-Q1-Q2. Model section order as: AW pinned to position 1, then a permutation of the V and Q sections subject to the constraint that section 1 of a measure precedes section 2 of that measure. Because full interleaving is unverified, ship the adjacent-pairs ordering as the default and do not advertise the order as exam-accurate. |
| GRE-03 | GRE General | The brief's responseTypesNeeded enum offers 'data_sufficiency' and 'two_part' as candidate types. | Data Sufficiency is not a GRE question type at all (it belongs to the GMAT); ETS publishes exactly four Quantitative types and three Verbal types, none of which is Data Sufficiency. 'two_part' has no GRE equivalent either, but the closest structural need is Text Completion, which has up to THREE independent blanks, not two. | <https://www.ets.org/gre/test-takers/general-test/prepare/content/quantitative-reasoning.html> | 2026-09-18 | Never emit data_sufficiency items into the GRE bank. Generalize the two_part renderer to an n-blank type supporting 1, 2 or 3 blanks with per-blank choice counts (5 choices when there is one blank, 3 choices per blank when there are two or three) and all-or-nothing scoring. Also note the enum has no value for Select-in-Passage, which GRE genuinely requires — a new response type is needed. |
| GRE-04 | GRE General | Test duration is 'about 1h58m'. | Confirmed, and it reconciles exactly: 30 + 18 + 23 + 21 + 26 = 118 minutes. ETS states 'about 1 hour and 58 minutes' on the structure page and 'Total testing time is 1 hour and 58 minutes' in the Information Bulletin. | <https://www.ets.org/content/dam/ets-india/pdfs/gre/gre-info-bulletin.pdf> | 2026-09-18 | Use 118 minutes as the sum of independently timed sections rather than a single global countdown; there is no shared time pool across sections. |
| GRE-05 | GRE General | The 'Analyze an Argument' task was removed. | Confirmed. The current Analytical Writing measure 'consists of a 30-minute "Analyze an Issue" task'. The Analyze an Argument task appears only in the pre-September-2023 table. ETS publishes the full Issue topic pool. | <https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing.html> | 2026-09-18 | Retire any Analyze an Argument prompts and their scoring rubric from the active GRE config. Keep only the Issue rubric and the Issue score-level descriptions. |
| GRE-06 | GRE General | Brief implies the app should record 'the fact that the raw-to-scaled equating is not published' as a single scoring caveat. | Accurate but understated. ETS publishes no conversion table, no equating model, no IRT parameters, no routing thresholds and no e-rater weights. That is five separate blockers, not one, and together they mean no component of a 130-170 or 0-6 score can be reproduced exam-accurately. | <https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html> | 2026-09-18 | Gate all GRE score display behind a clearly labelled estimate. Report raw correct counts and percent-correct as the primary feedback, and if a 130-170 figure is shown at all, label it an unofficial estimate with a visible disclaimer. Do not build a percentile lookup implying ETS equivalence. |
| GRE-07 | GRE General | Navigation: 'within a section the taker may move back, change answers, and use mark/review'. | Confirmed verbatim on two official pages, including the review screen that lists all questions in the current section with answered and marked-for-review state. However, ETS never states the converse — that a finished section cannot be re-entered. | <https://www.ets.org/gre/test-takers/general-test/prepare/strategies-tips.html> | 2026-09-18 | Implement intra-section free navigation, Mark/Review flags and a section review screen. Implement the cross-section lock as a product decision (it is required for section-level adaptive routing to work) but do not label it 'per ETS rules' in learner-facing copy. |
| GMAT-01 | GMAT Exam | The brief lists the exam as 'GMAT — current format; accommodate searches using "Focus Edition"' without stating what the exam is actually called today. | GMAC's current branding is plain 'GMAT Exam'. The August 2026 Policies & Procedures contains no occurrence of 'Focus Edition' at all, and the main exam pages say 'The GMAT Exam'. However 'GMAT Exam (Focus Edition)' is still used on the scores/percentile pages, and the pre-2024 exam is now officially named 'GMAT Exam (10th Edition)' (sunset 31 Jan 2024, replaced 1 Feb 2024). | <https://www.mba.com/exams/gmat-exam/faqs> | 2026-09-18 | Canonical exam name = 'GMAT Exam'. Store aliases ['GMAT Focus Edition','GMAT Focus','GMAT Exam (Focus Edition)'] for search and SEO, plus a distinct disambiguation alias 'GMAT Exam (10th Edition)' that must resolve to a 'this exam was retired' page, NOT to our current GMAT content. Note in content QA that mba.com is itself internally inconsistent on the name. |
| GMAT-02 | GMAT Exam | The brief's generic response-type list for the assessment engine includes quantitative comparison, numeric entry and essay responses. | The current GMAT uses none of these. GMAC states all questions are multiple choice, there is no essay requirement, and there is no quantitative-comparison or numeric-entry format in any section. | <https://www.gmac.com/resources/learners/how-to-apply/exams-preparation/new-gmat-exam-details> | 2026-09-18 | The GMAT exam config must declare supportedResponseTypes = [single_select, multi_select, data_sufficiency, passage_group, two_part] and explicitly exclude essay, numeric_entry and quantitative_comparison. Quantitative comparison belongs to the GRE, not the GMAT — do not let a shared question bank leak QC items into GMAT drills. |
| GMAT-03 | GMAT Exam | The brief treats adaptive exams generically and (via the SAT/ACT work) assumes module- or stage-based adaptive routing. | The GMAT is question-level adaptive in all three sections, with no modules and no between-module routing. | <https://www.mba.com/exams-and-exam-prep/gmat-exam/what-to-expect-during-gmat> | 2026-09-18 | The exam-config schema needs an adaptivity field with at least two values ('question_level' for GMAT, 'module_routing' for the Digital SAT). A single module-routing implementation cannot express GMAT behaviour. Persist per-question routing decisions so a refresh cannot regenerate the sequence. |
| GMAT-04 | GMAT Exam | The brief asks for 'navigation and answer-review permissions' as a generic config field. | GMAT's rule is unusually specific and cannot be expressed as a simple boolean: unlimited bookmarking, unlimited review, a hard cap of exactly three answer edits per section, a review screen reachable only after all questions are answered AND only if section time remains, with review time charged to the section clock. | <https://www.mba.com/exams/gmat-exam/about/exam-structure> | 2026-09-18 | Model review permissions as a structured object: {backNavigationDuringSection: false, bookmarkLimit: null, reviewLimit: null, answerEditsPerSection: 3, reviewScreenRequiresAllAnswered: true, reviewScreenRequiresTimeRemaining: true, reviewTimeCountsAgainstSectionClock: true}. A boolean 'canReview' flag would silently mis-simulate the GMAT. |
| GMAT-05 | GMAT Exam | The brief assumes calculator policy can be set at exam level ('Calculator rules' as a single item). | GMAT calculator availability is per section: none in Quantitative Reasoning (explicitly prohibited), none in Verbal, on-screen calculator in Data Insights only. | <https://www.mba.com/exams/gmat-exam/about/exam-content> | 2026-09-18 | Calculator availability must be a per-section (and for the Digital SAT, per-module) config field, not an exam-level field. Ship the GMAT calculator only inside Data Insights, and label it an approximation since GMAC does not publish its feature set. |
| GMAT-06 | GMAT Exam | The brief warns against 'unsupported claims about proprietary adaptive scoring' but does not say what GMAT scoring can legitimately be reported. | GMAC publishes the scales (60–90 per section, 205–805 total, equal weighting) and percentile tables, but publishes no routing algorithm, no IRT parameters and no raw-to-scaled conversion. | <https://www.mba.com/exams/gmat-exam/scores/understanding-your-score> | 2026-09-18 | We may display the official scales and cite official percentile tables as reference information. We must NOT output an estimated 205–805 score or an estimated percentile from our own practice attempts. Results screens report raw accuracy, per-domain accuracy, per-question-type accuracy and pacing only. |
| GMAT-07 | GMAT Exam | The brief's initial content target is '20 reviewed original questions per exam' covering each major domain. | The GMAT has 8 distinct question-type domains across three sections (Problem Solving; Reading Comprehension; Critical Reasoning; Data Sufficiency; Multi-Source Reasoning; Table Analysis; Graphics Interpretation; Two-Part Analysis), four of which need non-trivial interactive widgets (sortable table, tabbed multi-source stimulus, drop-down-in-chart, two-column response grid). | <https://www.mba.com/exams/gmat-exam/prep-for-the-exam/prep-strategies/data-insights> | 2026-09-18 | 20 questions cannot cover 8 domains meaningfully. Either raise the GMAT target to ~40 (5 per domain) or scope the initial release to Problem Solving, Reading Comprehension, Critical Reasoning and Data Sufficiency, and mark the four interactive Data Insights types as 'not yet implemented' rather than shipping them thin. |
| GMAT-08 | GMAT Exam | The brief lists 'Data sufficiency and structured data interpretation' among response types without saying where Data Sufficiency sits. | Data Sufficiency has moved out of Quantitative Reasoning and now sits in Data Insights. Any legacy tagging that files DS under Quant is wrong for the current exam. | <https://www.mba.com/exams/gmat-exam/about/exam-content> | 2026-09-18 | Question-bank tags must place data_sufficiency under section=data-insights, domainSlug=di-data-sufficiency. Add a content-audit rule that rejects any GMAT DS item tagged to Quantitative Reasoning, and quarantine any imported item carrying the legacy tag. |
| GMAT-09 | GMAT Exam | The brief implies break behaviour is a simple 'breaks' config value. | GMAT's break is a single optional 10-minute break whose POSITION the candidate chooses at runtime (after section 1 or after section 2), which is forfeited if used early, and whose overrun is deducted from the next section. | <https://www.mba.com/-/media/files/mba2/the-gmat-exam/files/register/gmat-policies-and-procedures_aug-2026.pdf> | 2026-09-18 | Breaks need a 'candidate-elected, single-use, position-choosable' mode, not a fixed schedule. The engine must track breakUsed state and offer the break only at eligible boundaries, and must implement server-side overrun deduction from the following section's deadline. |
| BOC-UG-01 | Bocconi Online Test | The brief lists 'Bocconi Online Test — undergraduate and law' as if undergraduate and law were two distinct exams to be modelled separately. | They are two variants of the SAME product sharing identical delivery, duration (75 minutes), item count (50), navigation and scoring rules. They differ only in content mix: the standard variant is Mathematics 24 / Reading 11 / Numerical reasoning 6 / Critical thinking 9; the Law variant is Mathematics 5 / Reading 11 / Numerical reasoning 6 / Logics and critical thinking 18 / Verbal reasoning 10. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Model them as ONE exam family with two content blueprints sharing a single timing/navigation/scoring config, not two independent exam configurations. This halves config duplication and keeps the two in sync when rules change. |
| BOC-UG-02 | Bocconi Online Test | The brief flags 'Bocconi navigation' as something to verify, without asserting a rule. | Navigation is strictly forward-only across screens of 3 questions: 'going back to the previous one will no longer be possible'. There is no flag-for-review, no backward review, and no cross-section navigation. | <https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf> | 2026-09-18 | The engine must support a 'forward_only_paged' navigation mode with a configurable page size of 3 and a hard lock on backward movement. Any generic 'review and flag' UI must be suppressed for this exam. If the platform cannot lock backward navigation, do not label the mode 'exam-accurate'. |
| BOC-UG-03 | Bocconi Online Test | The brief flags 'Bocconi penalties' as something to verify, without asserting a rule. | Negative marking is real and published: +1 correct, 0 omitted, −0.2 wrong, and −0.33 for critical thinking items with three answer options. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Raw scoring must be per-item, not a simple correct-count. Store a per-item penalty value on the item record (−0.2 default, −0.33 for three-option critical thinking items) rather than a single exam-level constant. Score arithmetic must use decimals, not integers, and the UI should teach that omitting beats blind guessing. |
| BOC-UG-04 | Bocconi Online Test | The brief flags 'Bocconi eligibility thresholds' as something to verify, and separately warns against 'Claims presenting competitive admissions scores as official thresholds'. | Bocconi publishes genuine EXCLUSION floors: total below 17 (penalties included) is not considered; 11/24 Mathematics for the AI bachelor; SAT below 1040 total or below 520 per section; ACT composite below 19. It publishes NO admission cut-off. Admission is by ranking (test 55% + GPA 45%). Third-party sites circulate 'competitive' figures (e.g. SAT 1450+) that have no official status. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Model two distinct data types: officialEligibilityFloor (renderable as a hard rule with citation) and historicalObservation (absent in the initial release, since no official historical distribution was found). Never render a target score. Score-report copy must say 'below 17 you are not considered' and must NOT say 'you need X to get in'. |
| BOC-UG-05 | Bocconi Online Test | The brief flags 'program-specific requirements' for Bocconi as something to verify. | One programme-specific rule exists and applies across all three test routes: the Bachelor in Mathematical and Computing Sciences for Artificial Intelligence requires 11/24 Mathematics on the Bocconi test, 600/800 Math on the SAT, or 25/36 Math on the ACT. The Law variant is restricted to Law and Global Law. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act> | 2026-09-18 | Eligibility rules must be expressible per programme AND per section subscore, not just per exam total. The engine needs a subscore-threshold rule type keyed to (programme, route, section). |
| BOC-UG-06 | Bocconi Online Test | The brief asks every exam config to carry 'Adaptive-practice policies' and warns against 'Unsupported claims about proprietary adaptive scoring'. | The Bocconi test is NOT adaptive. It is a fixed linear form in which questions are 'distributed within the test in a mixed way both by difficulty level and by topic'. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Set adaptive.enabled = false for this exam and hide any adaptive-routing UI. Adaptive logic may still drive private topic DRILLS, but the exam simulation must be a fixed form, and marketing copy must not imply adaptivity. |
| BOC-UG-07 | Bocconi Online Test | The brief's generic exam-config schema includes 'Calculator availability' as a per-exam or per-section setting. | Calculators are prohibited for the entire Bocconi test, along with notes, formula sheets, headphones, second monitors and any additional internet-capable device. Only a pen, two blank A4 sheets and an ID are allowed. | <https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf> | 2026-09-18 | calculator = 'none' for all sections. Do NOT surface an on-screen calculator, and do not offer a digital scratchpad as 'exam-accurate' since Bocconi provides only physical paper. A neutral scratch-paper reminder is acceptable. |
| BOC-UG-08 | Bocconi Online Test | The brief's schema implies 'Sections and modules' with per-section timing and breaks, as for the SAT/GRE/GMAT. | Bocconi's four (or five) named areas are CONTENT categories, not delivered sections. There is one 75-minute block, no per-area timing, no breaks, and items from different areas are interleaved. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | The config schema must allow a single-module exam whose taxonomy domains are reporting categories independent of delivery structure. Do not render section headers, section timers or section transitions during a Bocconi simulation; do report per-area subscores afterwards, since the real score report does. |
| BOC-UG-09 | Bocconi Online Test | The brief groups Bocconi with SAT/ACT/LSAT/GMAT/GRE as a test the learner simply 'takes', without noting route substitution. | The Bocconi test is only one of three or four accepted routes into the same ranking: SAT and ACT for Undergraduate School, plus LSAT and the Bocconi Law test for Law School. IGCSE, IB and A-levels are NOT accepted admission tests; IGCSE English appears only in the separate English-language requirement for enrollment. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions> | 2026-09-18 | The Bocconi guide pages should cross-link SAT, ACT and LSAT as equivalent routes, and the study planner should let a Bocconi applicant choose a route. Do not build any IB/IGCSE/A-level 'admission test' content. Keep the English-certificate requirement on a separate page clearly labelled 'for enrollment, not admission'. |
| BOC-UG-10 | Bocconi Online Test | The brief treats each exam as having a single current version and admissions cycle. | Bocconi's own site currently mixes cycles: the test and admissions pages describe AY 2027-28, while the timeline and results pages still render AY 2025-26 dates, and the newest downloadable rules PDF is AY 2026-27. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/timeline> | 2026-09-18 | Every Bocconi fact stored must carry its own cycle label and source URL, not inherit one exam-level cycle. Date-sensitive content (rounds, deadlines) needs a shorter review interval than rule content (navigation, scoring), and stale-date detection should flag any Bocconi page whose cycle label falls behind the current one. |
| BOC-LAW-01 | Bocconi Online Test - Law | The brief treats Bocconi as a single exam family, 'Bocconi Online Test — undergraduate and law', implying one test with two variants or one shared configuration. | Bocconi publishes two separate, separately purchasable test types with different content blueprints and different downstream eligibility. Choosing the Law test locks the candidate out of all Undergraduate School programmes. Attempts are counted per test type (four each). | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Model bocconi-online-test-law as its own exam configuration with its own examKey, blueprint, question bank tags and taxonomy — not as a 'mode' flag on the undergraduate config. Do not share domain slugs between the two; the Mathematics domain in particular has a radically different weight (5 vs 24 items) and a much narrower syllabus. |
| BOC-LAW-02 | Bocconi Online Test - Law | The brief lists response types the engine must support including quantitative comparison, data sufficiency, numeric entry, multi-select and essay. | None of these are needed for the Bocconi Online Test - Law. Every published item description is a multiple-choice item with one correct answer; reading comprehension items hang off shared passages. There is no writing/essay component anywhere in the Bocconi Law selection, and motivational writing is explicitly excluded from assessment. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions> | 2026-09-18 | This exam config declares supportedResponseTypes = [single_select, passage_group] only. Do not surface numeric-entry or essay UI in this exam's practice or simulation players. The 'data propositions' item type is a single-select judgement item, NOT GMAT-style data sufficiency — tag it as a skill, not a response type. |
| BOC-LAW-03 | Bocconi Online Test - Law | The brief directs investigation of 'Bocconi navigation, penalties, eligibility thresholds, and program-specific requirements' as open questions. | All four are now officially documented for the 2027-28 cycle: navigation is forward-only in 3-question screens; penalties are -0.2 (-0.33 for three-option critical-thinking items); the eligibility floor is 17/50; Law-specific requirements are the separate Law test, the 2-preference cap, the LSAT alternative at 147/180, and Italian-language instruction for the Law LMG/01 programme. | <https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf> | 2026-09-18 | Bocconi Law can ship a genuinely exam-accurate simulation for timing, navigation lock, penalty scoring and the 17-point eligibility flag. Only option-count rendering needs a documented approximation disclaimer. |
| BOC-LAW-04 | Bocconi Online Test - Law | The brief asks about 'Claims presenting "competitive" admissions scores as official thresholds.' | Bocconi publishes exactly one Bocconi-test threshold (17/50) and it is an eligibility floor, not an admission cut-off. No admission cut-off score is published for Law or Global Law. Selection is a ranking on 55% test + 45% GPA against ~240 Law and ~80 Global Law places. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions> | 2026-09-18 | The app must present 17 as 'minimum to be considered', never as 'the score you need'. Do not display any target score, admission probability, or 'competitive range' for Bocconi Law. Disable any score-goal feature for this exam. |
| BOC-LAW-05 | Bocconi Online Test - Law | The brief asks to investigate 'Outdated LSAT Analytical Reasoning / logic-games material.' | Bocconi's own SAT and ACT page — which is the official page documenting the LSAT route into Bocconi Law — still describes the LSAT as containing an 'Analytical Reasoning' section measuring the ability 'to understand a structure of relationships'. This description was not cross-checked against LSAC in this session, so the exact nature of the discrepancy is not confirmed here. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act> | 2026-09-18 | Do not source LSAT content specifications from Bocconi's page. Bocconi is authoritative only for the acceptance rule and the 147/180 minimum; the LSAT exam spec must come from LSAC (Agent A's LSAT workstream). Flag this so the two workstreams do not silently contradict each other on the public LSAT guide page. |
| BOC-LAW-06 | Bocconi Online Test - Law | The brief assumes exam configurations may need 'adaptive-practice policies' and warns against 'unsupported claims about proprietary adaptive scoring.' | The Bocconi Online Test - Law is explicitly non-adaptive: one fixed 75-minute form with difficulty and topic mixed throughout. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Set adaptive=false in this exam config and hide any adaptive-routing UI. Our own adaptive DRILL policy may still be used in practice mode, but it must be labelled 'our educational approximation' and must never be described as mirroring the real test. |
| BOC-LAW-07 | Bocconi Online Test - Law | n/a — this is an internal inconsistency found between two official Bocconi pages, recorded per instruction 4. | The English test page lists 'Reading comprehension : 11 questions' while the Italian page lists 'Comprensione del testo : 11 brani' (11 passages). The five Law areas sum to 50 only if the figure is 11 QUESTIONS (5+11+6+18+10=50), so the Italian 'brani' wording appears to be an error. | <https://www.unibocconi.it/it/entrare-bocconi/corsi-di-laurea-triennale-e-giurisprudenza/ammissione/test-online-bocconi> | 2026-09-18 | Configure 11 reading-comprehension QUESTIONS drawn from a smaller number of passages, since the arithmetic only closes that way. Record the discrepancy in the public exam-format guide rather than silently picking one reading; do not publish a passage count, because Bocconi does not state one. |
| BOC-LAW-08 | Bocconi Online Test - Law | n/a — second cross-page inconsistency. | The English page says items are distributed 'in a mixed way' by difficulty and topic; the Italian page says 'in modo casuale' (randomly). 'Mixed' and 'random' are not the same claim about form assembly. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | Our simulation should interleave areas and difficulties but must not claim to replicate Bocconi's assembly rule. Public copy should say 'items from all five areas are interleaved rather than grouped', which both pages support. |
| BOC-LAW-09 | Bocconi Online Test - Law | n/a — third inconsistency, within a single official page. | The Admissions page states in one place that applicants 'must have already taken a selection test (Bocconi online test/Bocconi online test - Law, SAT/LSAT or ACT)' and later, under 'How to apply', that they 'must have already taken a selection test (Bocconi online test, SAT or ACT)' — omitting the Law test and LSAT. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions> | 2026-09-18 | Treat the fuller enumeration (which is repeated twice and matches the SAT/ACT page and the test page) as correct. Our admissions guide should list all four Law-eligible routes and note that one paragraph on the official page is abbreviated, rather than propagating the omission. |
| BOC-ADM-01 | Bocconi admissions | The brief treats the platform's Bocconi coverage as 'Bocconi Online Test - undergraduate and law', implying two test variants. | There are THREE distinct Online Bocconi test variants with different blueprints, penalties and eligibility floors: undergraduate (4 areas, -0.2/-0.33, floor 17, 4 attempts), law (5 areas including a Verbal reasoning area absent from the undergraduate form, floor 17, 4 attempts), and an International Graduate variant (3 areas - Verbal reasoning / Data insight / Quantitative reasoning, -0.25/-0.33, floor 15, 3 attempts). | <https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/online-bocconi-test-international-graduate-applicants> | 2026-09-18 | The exam config registry needs three separate versioned Bocconi configs, not two. The graduate variant must not inherit the undergraduate penalty constant (-0.2 vs -0.25) or the attempt cap (4 vs 3), or scoring will be wrong for every graduate attempt. |
| BOC-ADM-02 | Bocconi admissions | The brief flags 'Claims presenting competitive admissions scores as official thresholds' as a risk to investigate. | Confirmed and material. Every Bocconi number verified is an eligibility floor phrased 'will not be considered' (SAT 1040/520, ACT 19, LSAT 147, Bocconi test 17, graduate Bocconi test 15, GMAT 500 / Focus 485). Bocconi publishes no average, median or competitive admitted score on any page verified. Third-party sites circulate figures such as 'Bocconi SAT 1450+' which have no official basis. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act> | 2026-09-18 | Every score value in the content model must carry a mandatory enum field scoreClass: 'official-requirement' | 'historical-statistic'. The UI must render official-requirement values as 'minimum to be considered' and must refuse to render any historical-statistic without a visible non-official attribution. No admission-probability calculator, no 'your chances' widget, no score-to-likelihood mapping. |
| BOC-ADM-03 | Bocconi admissions | The brief flags 'Bocconi navigation, penalties, eligibility thresholds, and program-specific requirements' as needing investigation. | All four verified. Navigation is strictly forward-only in screens of three questions with no return. Penalties are -0.2 (or -0.33 for three-option critical-thinking items) with zero for omissions. The eligibility floor is 17/50 including penalties. A program-specific requirement exists: Mathematical and Computing Sciences for AI additionally requires SAT Math 600/800 or ACT Math 25/36. | <https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf> | 2026-09-18 | The navigation model needs a 'blockForwardOnly' mode with blockSize=3 that is genuinely irreversible - not merely a hidden Back button. Because omissions cost nothing while wrong answers cost 0.2, the results screen must report omitted and incorrect counts separately and must not present raw percent-correct as the headline metric. |
| BOC-ADM-04 | Bocconi admissions | The brief lists 'GMAT - current format; accommodate searches using Focus Edition', implying Focus Edition is a search-alias for one current exam. | For Bocconi admissions purposes these are two separately-scored exams that coexist: the GMAT Exam is scored out of 800 with a Bocconi minimum of 500, and the GMAT Focus Edition is scored out of 805 with a Bocconi minimum of 485. Both are simultaneously valid under the five-year score-validity rule. | <https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/gmat-and-gre-test> | 2026-09-18 | The Bocconi MSc requirements page must present two GMAT rows with different scales, not one. Treating Focus Edition as a synonym would produce a wrong eligibility check for anyone with a legacy 800-scale score. |
| BOC-ADM-05 | Bocconi admissions | The brief asks to 'keep undergraduate, law, and graduate admissions requirements clearly separated' but does not specify the axis of separation. | The correct axis is SCHOOL, not just level. Bocconi builds separate rankings for the Undergraduate School and the Law School, and the accepted test set differs by school (LSAT and Online Bocconi test - Law are law-only, and the law test cannot be used for non-law programs). Graduate is a third, entirely separate track with different tests, a different document set, and four rounds instead of two. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions> | 2026-09-18 | Model the requirements entity keyed by (school, cycle) rather than by (level). A shared 'Bocconi undergraduate requirements' page that mixes law would state a false accepted-test list in both directions. |
| BOC-ADM-06 | Bocconi admissions | The brief implicitly assumes one current admissions cycle per exam. | Two cycles are live simultaneously on unibocconi.it as of 2026-09-18. The Admissions page and MSc pages describe a.y. 2027-28 (Early Session open 2-29 September 2026), while the Timeline page and the Results and Enrollment page still describe a.y. 2026-27 (deadlines in 2025-2026, enrollment English deadline 30 June 2026). The rules-of-conduct PDF exists only in its 2026-27 edition. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/timeline> | 2026-09-18 | Every Bocconi fact record needs an explicit admissionsCycle field and a sourcePageCycle field, plus a verificationDate. The UI must label which cycle a deadline belongs to, otherwise learners will see a 2026 deadline presented as current. Build a staleness check that flags any Bocconi record whose cycle label is older than the currently-open application cycle. |
| BOC-ADM-07 | Bocconi admissions | The brief lists broad response-type support including quantitative comparison, data sufficiency, numeric entry, essay and two-part. | For Bocconi specifically, all three test variants are described solely as multiple-choice, and no essay, numeric-entry, quantitative-comparison or data-sufficiency response type is documented on any Bocconi page verified. Bocconi's undergraduate test is described as 'SAT-oriented' but that is a design-influence statement, not an adoption of SAT response types. | <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> | 2026-09-18 | The Bocconi exam configs should enable only single_select (plus passage_group for the reading-comprehension items that share a stimulus). Those other response types are needed for other exams in the platform, not for Bocconi, and enabling them in a Bocconi config would produce content that does not resemble the real test. |

---

## The brief's explicit investigation list

The brief named seven things to investigate. Each gets its own verdict below, with the official
source it rests on. Cross-references in square brackets point at register row IDs above.

### 1. Outdated LSAT Analytical Reasoning / logic-games material

**Verdict: confirmed. The risk is real, and stale material is still being served by lsac.org
itself and by one other official site in our own source set.**

LSAC sunset Analytical Reasoning after the **June 2024** administration and replaced it with a
second Logical Reasoning section. From August 2024 the multiple-choice test is two scored Logical
Reasoning sections, one scored Reading Comprehension section, and one unscored variable section.
Source: <https://www.lsac.org/blog/what-to-expect-starting-with-august-2024-lsat> (verified
2026-09-18) [LSAT-01].

Two compounding findings:

- **lsac.org still hosts contradicting artifacts.** `candidate-info-sheet.pdf` is live and
  describes five 35-minute sections, a 15-minute break after section 3, paper test books and No. 2
  pencils; the 2018-era Digital LSAT Screen Layouts PDF still depicts an Analytical Reasoning
  screen. Source: <https://www.lsac.org/docs/default-source/jd-docs/candidate-info-sheet.pdf>
  [LSAT-06]. "Hosted on lsac.org" is therefore **not** sufficient provenance — content must also be
  dated to the current format, and both PDFs are blocklisted from any content-sourcing pipeline.
- **A second official site repeats the stale description.** Bocconi's own SAT and ACT page — the
  official page documenting the LSAT route into Bocconi Law — still describes the LSAT as
  containing an "Analytical Reasoning" section measuring the ability "to understand a structure of
  relationships". Source:
  <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act>
  [BOC-LAW-05]. Bocconi is authoritative for the acceptance rule and the 147/180 minimum only; the
  LSAT content specification must come from LSAC, and the two workstreams must not silently
  contradict each other on the public LSAT guide page.

**Consequence for the build:** purge all Analytical Reasoning content, all game-board and
diagramming UI, and all AR taxonomy nodes. Do not ship an "LSAT Logic Games" practice mode. If
legacy AR items are ever imported, they enter `state: 'quarantined'` behind a clearly labelled
"retired format (pre-August 2024)" flag, off by default.

### 2. ACT totals that do not match the listed section counts

**Verdict: explained, and it is not an ACT error. The mismatch in circulating material comes from
mixing administered items with scored items.**

ACT's own figures are internally consistent once the two counts are kept apart. Verified
per-section administered / scored / field-test: **English 50 / 40 / 10, Mathematics 45 / 41 / 4,
Reading 36 / 27 / 9, Science 40 / 34 / 6.** Core test (English + Math + Reading): **131
administered = 108 scored + 23 field-test, in 125 minutes.** With Science: **171 administered =
142 scored + 29 field-test, in 165 minutes.** ACT's published totals row states exactly these
figures, and ACT's enhanced scoring key independently confirms maximum raw scores of English 40,
Mathematics 41, Reading 27, Science 34. Source:
<https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf>
(verified 2026-09-18) [ACT-01].

A second arithmetic trap sits next to this one: **Science is optional and is excluded from the
Composite.** The enhanced Composite is the average of English, Mathematics and Reading only;
Science yields its own 1-36 section score and feeds a STEM score, and ACT defines exactly four
legitimate section bundles. Source:
<https://www.act.org/content/dam/act/unsecured/documents/act-enhancements-educator-guide.pdf>
[ACT-04].

**Consequence for the build:** every ACT section carries `administeredCount` **and** `scoredCount`
plus a per-item `isScored` flag. Progress UI, section headers and "question X of Y" use the
administered count; raw score, reporting-category subscores and any scale estimate use only scored
items. **131 and 171 must never be displayed as a scored total.** Composite averages exactly three
scale scores and must not be blocked or altered when Science is absent.

### 3. SAT claims about unscored questions

**Verdict: the claim is true and College Board publishes it precisely. The suspicion is misplaced.
What is genuinely unpublished is *where* the unscored items sit.**

Two pretest (unscored) questions are embedded in **every** module — 2 × 4 modules = **8 per test**
— and the operational/pretest split is published as **25 + 2 per Reading and Writing module** and
**20 + 2 per Math module**. So **90 of 98 administered questions are scored.** Source:
<https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated> (verified
2026-09-18) [SAT-01].

The unpublished part: the positions of the two pretest questions within each module, and whether
placement is fixed or randomised. That is recorded as unverifiable and it disables any claim to
replicate "indistinguishable unscored items" authentically.

**Consequence for the build:** the exam config must distinguish administered count (54 / 44) from
operational count (50 / 40). Domain distribution percentages are stated over **operational**
questions, so a 54-question Reading and Writing blueprint built on 28% / 26% / 26% / 20% of 54
produces wrong counts — blueprint against 50 and 40, then add two unscored per module only if we
choose to simulate them, with disclosure.

### 4. Bocconi navigation, penalties, eligibility thresholds, and program-specific requirements

**Verdict: all four are officially documented and verified. A fifth thing the brief did not ask
about turned out to be wrong in the brief: there are three test variants, not two.**

- **Navigation.** Strictly forward-only in screens of three questions: "going back to the previous
  one will no longer be possible". No flag-for-review, no backward review, no cross-section
  navigation. Sources:
  <https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf> and, for
  the 2027-28 cycle,
  <https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf>
  [BOC-UG-02, BOC-LAW-03, BOC-ADM-03].
- **Penalties.** +1 correct, **0 for an omission**, **−0.2 wrong**, **−0.33** for critical-thinking
  items with three answer options. The international graduate variant uses **−0.25** rather than
  −0.2. Source:
  <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test>
  [BOC-UG-03, BOC-ADM-01].
- **Eligibility thresholds.** All exclusion floors, all phrased "will not be considered": Bocconi
  test **17/50** (undergraduate and law) and **15/50** (international graduate); SAT **1040** total
  and **520** per section; ACT composite **19**; LSAT **147/180**; GMAT Exam **500/800**; GMAT
  Focus Edition **485/805**. No admission cut-off is published for any programme or round. Source:
  <https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act>
  [BOC-UG-04, BOC-ADM-02].
- **Program-specific requirements.** The Bachelor in Mathematical and Computing Sciences for
  Artificial Intelligence requires **11/24 Mathematics** on the Bocconi test, **600/800 Math** on
  the SAT, or **25/36 Math** on the ACT. The Law variant is valid only for Law and Global Law, and
  the LSAT route is law-only. Source: same SAT and ACT page [BOC-UG-05, BOC-LAW-03].

**The brief undercounted the variants.** There are **three** Online Bocconi test forms with
different blueprints, penalty constants, eligibility floors and attempt caps: undergraduate (4
areas, −0.2 / −0.33, floor 17, 4 attempts), law (5 areas including a Verbal reasoning area absent
from the undergraduate form, floor 17, 4 attempts), and **International Graduate** (3 areas —
Verbal reasoning / Data insight / Quantitative reasoning, −0.25 / −0.33, floor 15, 3 attempts).
Source:
<https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/online-bocconi-test-international-graduate-applicants>
[BOC-ADM-01]. The graduate variant must not inherit the undergraduate penalty constant or attempt
cap, or scoring will be wrong for every graduate attempt.

**Consequence for the build:** a `forward_only_paged` navigation mode with `pageSize = 3` and a
server-side irreversible commit — not a hidden Back button. Per-item penalty values, decimal score
arithmetic, and a results screen that reports omitted and incorrect counts **separately** (because
omitting costs nothing while a wrong answer costs 0.2, raw percent-correct is a misleading
headline). Requirements modelled by **(school, cycle)**, not by level. Every Bocconi fact carries
its own `admissionsCycle`, `sourcePageCycle` and `verificationDate`, because two cycles are live on
unibocconi.it simultaneously [BOC-ADM-06, BOC-UG-10].

**Still unresolved** (see the disabled-features section below): the number of answer options per
item for every area except three-option critical-thinking items; whether the −0.33 rule reaches
inside the Law test's "Logic and critical thinking" area; whether per-area sub-thresholds exist;
and whether the pre-submission summary page allows any edit.

### 5. Unsupported claims about proprietary adaptive scoring

**Verdict: confirmed as a real and pervasive risk. It is enforced by switching scaled-score
reporting off, not by adding a disclaimer.**

Adaptivity is real on three exams and explicitly absent on three, and **on every one of the six
the scoring machinery is unpublished**:

| Exam | Adaptivity | What is published | What is not |
| --- | --- | --- | --- |
| SAT | Module-level, two-stage | The design, and that the break point sits "around the median section score" | Routing threshold, IRT parameters, theta-to-scale transformation, any raw-to-scaled table |
| GMAT | Question-level, all three sections | Scales (60–90 section, 205–805 total, equal weighting) and percentile tables | Item-selection rule, stopping rule, IRT parameters, raw-to-scale, the Total Score formula, the magnitude of the unanswered-question penalty |
| GRE | Section-level, per measure | That section 2 difficulty depends on performance on section 1 | The routing statistic, the cut thresholds, the number of difficulty tiers, conversion tables, e-rater weights |
| ACT | **None** — "not a computer-adaptive test" | Raw scoring is fully reproducible: count of correct answers, no wrong-answer penalty, scored items only | Raw-to-scale equating; conversion tables exist only for specific released practice forms |
| LSAT | **None** | 120–180 scale, no deduction for wrong answers, all items weighted equally | Per-form equating — LSAC's own example: 56 correct = 160 on one form, 57 on another |
| Bocconi | **None** — fixed linear form | The full raw rule (+1 / 0 / −0.2 / −0.33) and the 17-or-15 floor | The 55%-test / 45%-GPA normalisation, and the "internal conversion system" equating Bocconi scores with SAT, ACT and LSAT |

Sources, in the same order, all verified 2026-09-18:
<https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf> [SAT-02];
<https://www.mba.com/exams/gmat-exam/scores/understanding-your-score> [GMAT-06];
<https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html> [GRE-06];
<https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf> [ACT-03];
<https://www.lsac.org/podcast/keeping-data-may-2025> [LSAT-05];
<https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test> [BOC-UG-06, BOC-LAW-06].

One specific correction to the brief's engine spec: **a raw-count-to-scale model is factually wrong
for the Digital SAT.** College Board states that two students with the same number of correct
answers can receive different section scores, because scoring is IRT ability estimation over the
specific items administered [SAT-03].

**Consequence for the build:** adaptivity is an **enum**, not a boolean — at minimum
`question_level` (GMAT), `module_routing` (SAT), `section_level` (GRE) and `none` (ACT, LSAT,
Bocconi); a single module-routing implementation cannot express GMAT behaviour. Any routing we ship
is **our** heuristic: deterministic, persisted with the attempt so a refresh cannot regenerate the
sequence, and labelled "our approximation" in the results screen. Tests assert that routing is
deterministic and persisted, **not** that it matches the test maker. Scaled-score reporting is off:
no estimated 400–1600, 1–36, 120–180, 205–805 or 130–170 figure is presented as a score. Results
report raw accuracy, per-domain accuracy, per-question-type accuracy and pacing. Percentiles are
suppressed entirely. Any adaptive drill mode we offer is labelled our own study feature, explicitly
not the real exam's behaviour, in both the UI and the public exam-format page.

### 6. Claims presenting "competitive" admissions scores as official thresholds

**Verdict: confirmed and material.**

Every number Bocconi publishes is an **eligibility floor** phrased "will not be considered", never
a competitive or expected admitted score. Bocconi publishes **no average, median, percentile,
admitted-score distribution or acceptance rate** on any page verified. Admission is a ranking on
55% test score + 45% GPA against a fixed number of places (approximately 240 Law and 80 Global
Law), so the actual cut-off is a consequence of applicant volume and places available and is not
published in advance. Third-party sites circulate figures such as "Bocconi SAT 1450+" that have no
official basis. Source:
<https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act>
(verified 2026-09-18) [BOC-ADM-02, BOC-UG-04, BOC-LAW-04].

The same discipline applies to the five test makers. ACT percentile ranks and national norms for
the enhanced Composite, SAT percentile ranks and conditional standard error of measurement by score
point for 2026-27, and LSAC percentile tables for the 2026-27 testing year are all either
unpublished or published on a lag, so none can be shown against our own attempts. GMAC and ETS do
publish percentile tables, but only for real scores — which we do not produce.

**Consequence for the build:** every score value in the content model carries a mandatory enum
`scoreClass: 'official-requirement' | 'historical-statistic'`. The UI renders
`official-requirement` values as **"minimum to be considered"** and refuses to render any
`historical-statistic` without a visible non-official attribution. **No admission-probability
calculator. No "your chances" widget. No score-to-likelihood mapping. No target score or
"competitive range" for any Bocconi programme, and score-goal features are disabled for those
exams.** Score-report copy says "below 17 you are not considered" and never "you need X to get in".

### 7. Missing equations, charts, passages or answer choices / questions with duplicate equivalent answers or multiple valid solutions

**Verdict: not applicable to any supplied content. No question bank was supplied, so nothing could
be audited and nothing was quarantined. These checks are instead enforced prospectively, on
everything we author.**

To be precise about what that means: `content/questions/` is empty, the brief carried no attached
items, and no claim is made anywhere in this repository that supplied questions were reviewed,
repaired or quarantined. The brief's two content-integrity risks are therefore handled as a **build
requirement** rather than an audit finding.

The editorial validator lives in **`src/lib/content/question-schema.ts`** — `validateQuestion()`
plus the Zod `questionSchema` and `stimulusSchema` contracts. Errors block publication; warnings are
reported and do not fail the build. It covers exactly the failure modes the brief named:

| Risk named in the brief | Enforcement in `question-schema.ts` | Error code |
| --- | --- | --- |
| Duplicate / equivalent answer choices | `normaliseChoiceText()` normalises casing, whitespace, `$` and `,`, and resolves fractions to decimals, so `0.50`, `.5` and `1/2` collide. Any two options that normalise identically are an error: *"More than one choice would be defensible."* | `equivalent-options` |
| Multiple valid solutions / no single defensible key | A published item requires an **independent-solve record**: a second party who solved it without seeing the proposed key, agreed with it, and explicitly checked uniqueness. A missing record, a disagreement, or unchecked uniqueness each block publication. | `missing-independent-solve`, `solve-disagrees`, `uniqueness-unchecked` |
| Missing answer choices | Choice-type items must carry at least two options, and option ids must be unique. | `missing-options`, `duplicate-option-id` |
| An answer key that does not resolve | The key must reference options that exist, its type must match `responseType`, a select-all key covering every option is rejected, and numeric ranges and tolerances are range-checked. | `key-missing-option`, `key-type-mismatch`, `key-selects-all`, `bad-range`, `bad-tolerance` |
| Missing equations, charts, passages | A `stimulusRef` pointing at a stimulus that does not exist is an error. `stimulusSchema` requires `accessibilityText`, and chart and table stimuli must carry the underlying `data` (columns, rows, caption) so an accessible table can be rendered instead of an image. | `missing-stimulus` |
| Unexplained wrong answers | Every distractor needs a meaningful rationale of at least 15 characters — a warning while drafting, an **error** at `state: 'published'`. Explanations must be at least 40 characters: *"explanations must actually explain."* | `missing-distractor-rationale` |
| Silent repair of an ambiguous item | `quarantined` is a first-class publication state, a quarantined item must record **why**, and `quarantine.replacedBy` links the clearly labelled original replacement. | `missing-quarantine-reason` |
| Unsupported difficulty calibration | `difficultyBasis` stays `'editorial'` until real response data exists; marking an item `'empirical'` at publication warns. | `unsupported-calibration` |

Publication additionally requires a named reviewer who is **not** the author, plus a review date
(`unreviewed-publication`, `self-review`, `missing-review-date`). Provenance is locked at the schema
level: `origin` is the literal `'original'` and `rightsStatus` is the literal `'original-owned'`, so
no official test-maker item can pass validation at all. Essay items warn that they are never
auto-scored, so results copy must say so.

**Two honest caveats about the current state of the repository.** First, `package.json` wires
`content:validate` to `tsx scripts/validate-content.ts` and folds it into `npm run verify`, but
**`scripts/validate-content.ts` does not yet exist** — the schema and the validator function are
written, the runner that walks `content/questions/**` and calls them is still to be built. Second,
because the question bank is empty, none of these rules has yet been exercised against real
content. Both are outstanding build tasks, not research findings.

---

## Rules we could not verify → features disabled

Drawn from each record's `unverifiable[]` array, grouped per exam. Each item disables a dependent
"exam-accurate" behaviour. The standing policy from the brief applies: *if a rule cannot be
verified, identify the uncertainty and disable the affected functionality, then continue building
the verified parts.*

### LSAT — `lsat`

Verified on 2026-09-18. 11 rules could not be verified.

- Number of questions per Logical Reasoning section — no official LSAC page fetched in this session states it. Do not hard-code 25 or 26; make it configurable and label it as an estimate in the UI, or build LR sections to a configured count without claiming it matches the real exam.
- Total number of scored questions and total questions on the test — not stated on any official page fetched.
- Whether the testing UI shows a time warning (e.g. a 5-minute warning) before a section ends, and what form it takes.
- Whether an end-of-section review screen is presented before the section locks, or whether sections simply auto-advance at time expiry.
- Whether the on-screen timer can be hidden/collapsed by the test taker.
- Whether unanswered questions are visually distinguished in the question bar in the 2026-27 UI (the 2019-era digital-LSAT description mentions moving to unanswered questions, but that document predates the current platform).
- Exact raw-to-scaled conversion for any form — must not be simulated as authoritative.
- Exact score-band width. Do not display '+/- 3 points' or a 7-point band as official; LSAC's current page does not state a number.
- The exact verbatim LSAC wording prohibiting calculators (the dos-and-donts page was fetched and lists calculators among devices that must be removed, but a verbatim sentence was not captured). The substantive fact — no calculator on the LSAT — is not in doubt, since no LSAT section requires computation.
- Accommodated timing multipliers (e.g. 50% or 100% extra time) and accommodated break structures — LSAC's accommodations pages describe the request process, not a published table of standard time multipliers.
- Whether the unscored variable section's position is randomized per test taker or fixed per form.

### ACT (Enhanced) — `enhanced-act`

Verified on 2026-09-18. 10 rules could not be verified.

- Exact duration of the 'short break' between Reading and the optional Science/Writing sections on national test dates, and whether any break exists between Math and Reading under the enhanced format. ACT's own online student tutorial still describes the legacy pattern (15-minute break after mathematics, 5-minute break after science), which contradicts the enhanced-format description in the February 2026 design framework. DISABLE exam-accurate break timing; present breaks as untimed or clearly labelled as an approximation.
- Whether the paper (offline) administration permits the same free within-section navigation and review as TestNav. The navigation rules verified here come from the online TestNav tutorial. Paper testing almost certainly allows free navigation within a section, but no official statement was located. Do not present navigation rules as mode-specific.
- The exact split of English items between short and long passages, and the number of passages per English form. ACT states the enhanced English test 'will now feature a mix of short and long essays' but does not publish the counts.
- Number of Reading passages per form. ACT confirms passage lengths (two ~750 standard words, one ~650) and the presence of a paired/synthesis element, but the official reading description page does not state a fixed passage count for the enhanced form.
- Number of Science passages per form and the enhanced-format split across Data Representation / Research Summaries / Conflicting Viewpoints. Percentages found on ACT's science description page (25-35% / 45-60% / 15-20%) are not re-stated in the February 2026 enhanced design framework and may be legacy figures.
- Placement of the 'Visual and Quantitative Information' reading skill area under a specific reporting category. The PDF table columns could not be read unambiguously; ACT's reading description page implies Craft and Structure / Integration of Knowledge and Ideas but does not assign it explicitly.
- Whether Science can be selected or deselected after registration, and the precise registration-time mechanics for choosing Science/Writing on national test dates.
- Percentile ranks and national norms for the enhanced Composite.
- Accommodation timing multipliers (50%/100% extended time) under the enhanced format — not verified in this session.
- Whether international (non-US) test dates in the 2026-2027 cycle are offered in both paper and online modes, and what the February 2026 'additional enhancements for international test takers' consist of.

### SAT (Digital) — `digital-sat`

Verified on 2026-09-18. 11 rules could not be verified.

- The exact routing threshold between the higher- and lower-difficulty second-stage modules. Only 'set around the median section score' and 'roughly half each way' are published. => The engine MUST NOT claim exam-accurate routing. Either disable routing entirely and deliver a fixed second module, or route on a clearly labelled house heuristic (e.g. percent correct on the routing module) marked 'our approximation, not College Board's algorithm'.
- IRT item parameters and the theta-to-scale-score transformation. => The engine MUST NOT report an estimated 400-1600 or 200-800 score as if it were exam-accurate. Disable scaled-score reporting, or gate it behind an explicit, documented, clearly labelled approximation.
- Any raw-to-scaled conversion table for any Digital SAT form. None exists publicly because scoring is not raw-count based. => No 'your raw 42/54 = 680' feature.
- The difficulty mix (proportion easy/medium/hard) of the routing module and each second-stage module. => Cannot build blueprint-accurate adaptive panels. Any adaptive practice panel must be labelled as an approximation.
- The positions of the 2 pretest questions within each module, and whether they are fixed or randomised. => Cannot replicate 'indistinguishable unscored items' authentically. Recommend either omitting unscored items from simulations (and disclosing the difference) or inserting them at random positions with a clear disclosure.
- The exact score range attainable from the lower-difficulty second-stage path, and the overlap region between paths. => No 'your ceiling is X because you were routed down' messaging.
- Percentile ranks and conditional standard error of measurement by score point for 2026-27. => No percentile display, no score-confidence-interval display.
- Per-module minute allocations under accommodated timing (+50%, +100%, >+100%) and extended-break schedules. => Extended-time modes must be built as a generic multiplier and labelled as such, not as an exam-accurate accommodation replica.
- Whether the Bluebook Question Menu's scope is strictly the current module (College Board's tools page says 'any question in the section', which conflicts in wording with the hard module-lock rule). => Implement the review panel as module-scoped, which is the conservative reading consistent with the explicit no-return rule.
- The exact SPR answer-matching tolerance College Board applies (e.g. whether .6666 and .6667 are both accepted for 2/3 — the published example table implies yes, but the general tolerance rule is not stated). => Author each SPR item with an explicit accepted-answer set rather than relying on a global tolerance rule.
- Bluebook's precise autosave interval and reconnect-recovery mechanics. => Design our own autosave contract; do not claim it matches Bluebook.

### GRE General — `gre-general`

Verified on 2026-09-18. 12 rules could not be verified.

- Whether a completed section is permanently locked. ETS documents free navigation WITHIN a section but never states that the taker cannot return to a prior section. Cross-section locking is implied by section-level adaptation but is not quotable — do not present a 'sections are locked' rule to learners as an ETS fact.
- Whether the two sections of a measure are delivered adjacently. ETS says only that Verbal and Quantitative sections 'may appear in any order after the Analytical Writing section'. It is not published whether an order such as V1, Q1, V2, Q2 can occur, so a simulator must not claim a canonical AW-V-V-Q-Q order.
- The section-level adaptive routing algorithm: the statistic computed from section 1, the number of distinct difficulty levels available for section 2, and the cut thresholds. Disable any feature that claims to reproduce real GRE routing.
- IRT item parameters and the item pool calibration. No exam-accurate difficulty estimate can be attached to a bank item.
- Raw-to-scaled conversion tables for 130-170. No accurate scaled score can be produced; any 130-170 number the app shows is an estimate, not an ETS score.
- How raw count and delivered-section difficulty are combined into the scaled score.
- e-rater feature weights, the human/e-rater adjudication rule and the discrepancy threshold for Analytical Writing. Automated 0-6 essay scoring cannot be made exam-accurate.
- Whether any scheduled break exists in the current five-section format. Evidenced by absence (the only 'break' text on the ETS structure page belongs to the pre-September-2023 format), but never stated affirmatively by ETS.
- Whether a paper-delivered GRE General Test is still offered in 2026. The ETS Verbal Reasoning page still refers to a 'paper-delivered test' when explaining Select-in-Passage; this appears to be legacy text and was not confirmed elsewhere.
- The exact per-section mix of question types (how many Reading Comprehension vs Text Completion vs Sentence Equivalence items in a 12- or 15-question Verbal section; how many Quantitative Comparison vs Data Interpretation items in a Quantitative section). ETS publishes only that 'about half' of Verbal is passage-based.
- Whether the on-screen calculator is technically unavailable in Verbal and Analytical Writing. ETS scopes it to Quantitative but never states it is blocked elsewhere.
- Character or word limits for the Analytical Writing response, and whether the word processor displays a word count.

### GMAT Exam — `gmat-focus`

Verified on 2026-09-18. 12 rules could not be verified.

- The adaptive routing algorithm and item-selection rule. DISABLE any claim of exam-accurate adaptive routing; a practice engine may adapt difficulty but must be labelled as our own educational approximation, not a GMAT simulation.
- IRT item parameters and the ability-estimation method. DISABLE any calibrated ability estimate or 'estimated GMAT score' feature.
- Raw-to-scaled conversion for the 60–90 section scales and the formula mapping section scores to the 205–805 Total Score. DISABLE scaled-score reporting entirely; report raw accuracy, per-domain accuracy and pacing instead.
- The exact magnitude of the unanswered-question penalty. Our scoring must not model a specific penalty.
- How answer changes made in Question Review & Edit are re-scored against an already-fixed adaptive path. Implement the edit cap as a UI/navigation rule only; do not model any scoring consequence beyond replacing the stored response.
- The enumerated official Content Domain list and Fundamental Skills list used in the Official Score Report. Our taxonomy below is built from the public Exam Content page; tag it internally as 'derived from official exam content descriptions', NOT as GMAC's score-report taxonomy.
- Whether the exam includes unscored / pretest items, and how many. Do not implement an unscored-item feature for GMAT.
- The exact feature set of the Data Insights on-screen calculator (memory, roots, exponents). Provide a basic four-function calculator and label it an approximation.
- The number of Reading Comprehension passages per section and the number of questions per passage; likewise the number of questions per Multi-Source Reasoning set. Our simulation must fix these editorially and disclose that the real exam's distribution is not published.
- The number of Table Analysis statement rows and Graphics Interpretation drop-down blanks per item. Fix editorially and disclose.
- Accommodation configurations (extended time multipliers, extra/longer breaks). GMAC references pre-approved time-based accommodations but publishes no multipliers on the pages reviewed. Do not ship accommodation presets for GMAT.
- Whether the section-order choice affects scoring or item selection in any way. Assume no effect; do not model one.

### Bocconi Online Test — `bocconi-online-test-undergraduate`

Verified on 2026-09-18. 12 rules could not be verified.

- Number of answer options per question. Only an indirect signal exists (some critical thinking items have three options, attracting a −0.33 penalty). The option count for Mathematics, Reading comprehension, Numerical reasoning and Verbal reasoning items is NOT published. Do not render a fixed 4- or 5-option layout as 'exam-accurate'.
- Whether the end-of-test summary page permits answering previously unanswered questions or editing answers, or is purely a view-only confirmation screen before 'Submit all and finish'.
- Whether answers can be changed among the three questions on the CURRENT screen before pressing Next. Only backward navigation across screens is explicitly forbidden.
- What the on-screen 'test navigation' box actually does — whether it merely shows progress or permits jumping forward to a later screen.
- Number of reading passages, their length, and how many of the 11 Reading comprehension questions attach to each passage. Passage grouping is implied but its shape is not published.
- The exact interleaving order of the content areas across the 17 screens. Bocconi says topics are 'mixed', so a simulation cannot reproduce the real ordering.
- Whether a countdown timer is displayed to the candidate during the test, and whether any per-screen time limit exists.
- Whether the four permitted attempts draw from equated forms of comparable difficulty, and whether the Italian and English versions are equated.
- The amount of additional time granted to candidates with certified disabilities or specific learning disorders (decided case by case; no published multiplier).
- The theoretical minimum score, i.e. whether the reported total is floored at zero or can be negative when penalties exceed correct answers.
- Whether the AY 2027-28 rules differ from the AY 2026-27 rules on navigation, conduct or attempt limits — the 2027-28 Instructions and Rules of Conduct PDF was not retrievable (HTTP 403 on the guessed URL, absent from search).
- Whether a Spring session formally exists for the AY 2027-28 international cycle. The admissions page lists only Early and Winter for 2027-28, but the test page allows Italian applicants to book until 20 April 2027, and the results page shows a Spring session in its (2025-26) structure.

### Bocconi Online Test - Law — `bocconi-online-test-law`

Verified on 2026-09-18. 12 rules could not be verified.

- Number of answer options per item. Bocconi only discloses that SOME 'critical thinking' items have three options. The option count for Mathematics, Reading comprehension, Numerical reasoning, Verbal reasoning and the remaining logic items is not published. An 'exam-accurate' option count must therefore not be asserted.
- Whether the -0.33 three-option penalty applies inside the Law test. The rule is worded for the '"critical thinking" area'; the Law test's area is named 'Logic and critical thinking'. Bocconi does not state the mapping explicitly, and the rule sits in a scoring block shared by both test types.
- The exact interleaving pattern of the 50 items — which three items share a screen, and whether subject areas appear in any fixed order. Only 'mixed by difficulty and topic' is published.
- Whether a visible countdown timer is displayed during the live test. A timer is confirmed only for Bocconi's practice simulation.
- Whether answers can still be changed from the pre-submission summary page, or whether that page is view-only.
- Whether the reading-comprehension passage stays visible across screen boundaries when its questions span more than one 3-question screen.
- Item pool size, form randomisation per candidate, and whether any items are unscored pretest items.
- The exact amount of additional time granted as an SLD/disability accommodation (no percentage or minute figure published).
- Any admission cut-off score for Law or Global Law. Only the 17/50 eligibility floor is official.
- Per-subject-area score reporting scale on the Test Score Report (raw points assumed, but the report format is not published).
- Whether the Law test uses the same item-writing/difficulty calibration as the standard test.
- Autosave, reconnect and resume behaviour during a live attempt (Bocconi documents only that answers are saved on time expiry and that technical failures may void the attempt).

### Bocconi admissions — `bocconi-admissions-requirements`

Verified on 2026-09-18. 10 rules could not be verified.

- The exact GRE combined Verbal+Quantitative eligibility threshold values for MSc admission. Bocconi states no minimum individual section score is set and refers to a combined-score table, but the table values could not be captured verbatim. Do NOT display any GRE cut-off number until re-verified.
- The full verbatim English certificate score table beyond the IELTS B2 line (TOEFL iBT, Cambridge CAE/CPE/FCE, Duolingo, Trinity ISE values). Display the B2/B1 level requirement, not the per-certificate numbers.
- The a.y. 2027-28 rules-of-conduct document. Only the 2026-2027 edition exists as of 2026-09-18, so navigation, calculator, materials, proctoring and attempt rules for the open cycle are inferred from the prior cycle's document.
- The exact time of day and timezone for the four MSc round deadlines (the Bachelor/Law deadlines are explicitly 3:00pm Italian time; the MSc ones were not captured with a time).
- The GRE institution code (cited on the page as 1517) - re-verify before presenting as actionable.
- Whether the a.y. 2027-28 Bachelor/Law cycle will add a Spring session. The 2027-28 admissions page lists only Early and Winter; the closed 2026-27 cycle had three sessions including Spring.
- Whether the Online Bocconi test draws items per candidate from a pool, and any form-equating across the four permitted attempts.
- Per-area sub-thresholds on the Online Bocconi test. Bocconi publishes only a single total-score floor (17, or 15 for graduate); no evidence of area minimums was found, but their absence was not positively stated either.
- Whether the end-of-test summary screen permits any answer change. The forward-only rule implies it does not, but the rules document does not state this explicitly for the summary page.
- Any admitted-student score distribution, percentile or acceptance rate. Bocconi does not publish these; the platform must not compute or imply admission probabilities.

---

_Every row and every disabled feature above is carried from the eight verified records in
`content/exam-specs/_raw/*.draft.json`. The per-exam detail behind them lives in the generated
records in `docs/research/` — see `docs/research/README.md` for the index and the refresh
procedure._
