Faraz:
You are the lead product architect, engineering manager, and multi-agent coordinator responsible for building a web-based exam practice platform.
Your task is to coordinate specialized agents, implement the product, verify it, and deliver a working application. Continue beyond planning into implementation and testing.
1. Product objective
Build a trustworthy, polished exam preparation platform covering:
Bocconi Online Test — undergraduate and law.
Digital SAT.
Enhanced ACT.
LSAT.
GMAT — current format; accommodate searches using “Focus Edition.”
GRE — current shorter format.
The initial audience is international students preparing for university admissions, including Bocconi applicants. Keep undergraduate, law, and graduate admissions requirements clearly separated.
The platform must support:
Original practice questions with reliable explanations.
Topic drills and diagnostic assessments.
Timed practice and exam simulations.
Personalized study recommendations.
Progress tracking and mistake review.
Public educational content discoverable through traditional search engines and AI-assisted search.
Use the attached document as a starting brief, not an authoritative specification.
2. Operating principles
Inspect the existing repository and environment before choosing implementation details.
Preserve useful existing work.
Make reasonable, reversible decisions without repeatedly asking for confirmation.
Ask only when a missing decision materially affects scope, cost, credentials, legal rights, or an irreversible action.
Continue independent work while a dependency is blocked.
Never invent research, agent activity, test results, citations, integrations, or completed features.
Do not purchase services or publish publicly without authorization.
If deployment credentials are unavailable, deliver a working local application and deployment instructions.
Prefer a complete, dependable learning experience over a broad collection of unfinished screens.
Defaults unless I specify otherwise:
English-first interface, structured for later Italian localization.
Responsive web application.
Free access for the initial release.
Neutral working brand that is easy to rename.
Original educational content.
No advertising or payment integration in the initial release.
All six exams represented through verified guides and functioning practice; full simulation availability depends on verified rules and sufficient reviewed content.
3. Coordinate specialized agents
If your environment supports actual subagents, use them. Otherwise, execute the same responsibilities sequentially and explicitly state that you are operating without parallel agents.
Create these roles:
Agent A — Exam research and content quality
Owns official-source research, exam specifications, question taxonomy, content validation, and admissions fact-checking.
Agent B — Product and learning design
Owns user journeys, information architecture, accessible interaction design, study workflows, and interface copy.
Agent C — Frontend
Owns public pages, learner dashboard, practice interface, exam screens, and responsive presentation.
Agent D — Backend and assessment engine
Owns data models, authentication, permissions, attempt persistence, timers, scoring, exam configuration, and analytics calculations.
Agent E — Search and editorial
Owns public content structure, technical SEO, structured data, internal linking, and AI-search discoverability.
Agent F — Independent quality assurance
Owns acceptance tests, scoring verification, security checks, accessibility testing, content audits, and release readiness.
You, the coordinating agent, own architecture, shared contracts, integration, scope decisions, and final acceptance.
For every delegated task, specify:
Objective and concrete deliverable.
Inputs and dependencies.
Owned files or directories.
Shared interfaces it must follow.
Acceptance criteria.
Expected verification evidence.
Blockers and handoff requirements.
Maintain a shared task board with task ID, owner, dependencies, status, affected files, and acceptance evidence.

Faraz:
Parallelize independent work. Avoid simultaneous edits to shared files. Assign one owner to shared schemas, configuration, and migrations. Have agents propose changes to shared contracts before integration.
Require independent review of scoring logic and published question answers. An agent’s self-reported completion does not constitute acceptance.
4. Verify the exam brief before implementation
Create a source-backed specification for each exam and relevant administration version.
Prefer official sources:
Bocconi University.
College Board.
ACT.
LSAC.
GMAC / mba.com.
ETS.
Record:
Exam name and version.
Applicable region, delivery mode, and admissions cycle.
Sections and skill domains.
Question counts and question types.
Timing, breaks, navigation, and review rules.
Calculator rules.
Adaptive behavior.
Scoring rules and publicly documented limitations.
Official source URL and verification date.
Create a discrepancy register showing the attachment’s claim, verified finding, source, and implementation consequence.
Investigate specifically:
Outdated LSAT Analytical Reasoning / logic-games material.
ACT totals that do not match the listed section counts.
SAT claims about unscored questions.
Bocconi navigation, penalties, eligibility thresholds, and program-specific requirements.
Unsupported claims about proprietary adaptive scoring.
Claims presenting “competitive” admissions scores as official thresholds.
Missing equations, charts, passages, or answer choices.
Questions with duplicate equivalent answers or multiple valid solutions.
Do not silently repair ambiguous questions by guessing the intended answer. Quarantine them and create clearly labeled original replacements.
Keep official eligibility requirements separate from historical observations and study advice. Do not calculate admission probabilities from unsupported assumptions.
If a rule cannot be verified, identify the uncertainty and disable the affected “exam-accurate” functionality. Continue building verified functionality.
5. Architecture and assessment design
Use the existing stack if appropriate. For a new repository, a reasonable default is:
Next.js with TypeScript.
Accessible component primitives and Tailwind CSS.
PostgreSQL with a typed data layer.
Established authentication.
Server-rendered or statically generated public educational pages.
Unit tests for scoring and assessment rules.
Browser tests for core learner journeys.
Confirm current compatibility before installing dependencies. Keep the architecture simple enough for a small team to maintain.
Build a configuration-driven assessment engine. Do not hardcode one exam’s behavior across the application.
Version exam configurations containing:
Sections and modules.
Question-selection constraints.
Timing and breaks.
Navigation and answer-review permissions.
Calculator availability.
Supported response types.
Raw-scoring rules.
Adaptive-practice policies.
Accommodation settings where supported.
Pin each attempt to immutable versions of its exam configuration and questions so later edits cannot change historical results.
Support the response types needed by the verified exams, including:
Single-select.
Multiple-select where applicable.
Numeric entry.
Shared passage or stimulus groups.
Quantitative comparison.
Data sufficiency and structured data interpretation.
Essay responses where applicable.
Persist question order and adaptive routing decisions. Refreshing an attempt must not regenerate the exam.
Use server-authoritative deadlines for timed assessments. Implement autosave, reconnect recovery, idempotent submissions, expiration, and protection against duplicate attempts caused by repeated requests.
Define pause and interruption behavior explicitly for each mode.
Separate:
Officially documented exam behavior.
Our educational approximation.
Features not yet implemented.
Do not claim to reproduce proprietary SAT, GMAT, or GRE scoring algorithms. Any estimated scaled score must have a documented defensible methodology and clear limitations. Otherwise, report raw accuracy, timing, and skill performance.

Faraz:
Do not fabricate percentiles, calibrated ability estimates, or official score equivalence.
6. Essential learner experience
Implement these connected journeys:
Discover
A visitor finds an exam guide or worked example, understands the platform, and starts a free practice session.
Diagnose
A learner selects an exam, completes a diagnostic, and sees a skill breakdown with practical next steps.
Practice
A learner chooses a domain, difficulty, and session length, answers questions, and receives explanations.
Simulate
A learner starts an available simulation with the correct verified timing and navigation rules.
Review
A learner revisits incorrect answers, bookmarks difficult questions, and retries them after a suitable interval.
Improve
A learner sees progress and receives a manageable study plan based on performance, available study time, and target date.
Required screens:
Homepage.
Exam directory and individual exam hubs.
Exam format and scoring guides.
Sample questions and topic lessons.
Onboarding.
Learner dashboard.
Diagnostic and practice setup.
Practice player.
Timed assessment player.
Results and skill breakdown.
Mistake notebook and bookmarks.
Study plan.
Account settings.
Protected content administration.
Use restrained academic styling, readable typography, clear mathematical notation, and accessible charts. Design useful loading, empty, error, expired-session, and reconnect states.
Target WCAG 2.2 AA. Test keyboard navigation, focus management, contrast, labels, screen-reader announcements, and mobile layouts.
7. Question bank and editorial controls
Define a question schema containing:
Stable ID and version.
Exam and domain.
Skill and subskill.
Response type.
Difficulty label and whether it is editorial or empirically calibrated.
Stem, options, and correct response.
Explanation and distractor reasoning.
Estimated time.
Passage, chart, or stimulus reference.
Accessibility text.
Content provenance and rights status.
Author/reviewer status and review date.
Publication state.
Use original questions. Do not copy protected official question banks without permission or licensing.
For each published question:
Solve it independently.
Check answer uniqueness.
Verify arithmetic, units, assumptions, and notation.
Confirm all required stimulus material is present.
Explain the correct answer clearly.
Explain meaningful distractor errors.
Check alignment with the intended skill and current exam.
For charts, store underlying data and provide an accessible table where appropriate.
Provide draft → review → published → retired states, with audit history. AI-generated material enters draft status.
Initial content target:
At least 20 reviewed original questions per exam.
Coverage of each major domain supported in the initial release.
At least one useful public worked example per major domain.
A short diagnostic using the available reviewed bank.
This is a starter library, not a complete preparation course. Report gaps honestly.
A full-length simulation may be offered only when there are enough reviewed items to satisfy its blueprint without unintended duplication. For adaptive practice, provide enough items for the supported routes. If that condition is unmet, present shorter practice explicitly as practice.
8. Personalized learning and optional AI tutoring
Start with transparent recommendations based on:
Accuracy by skill.
Time per question.
Repeated mistake patterns.
Recent practice.
Remaining time before the target exam.
Avoid claiming psychometric calibration without sufficient validated response data.
If an AI tutor is implemented:
Keep it optional.
Restrict it to learning and review modes.
Ground explanations in the question and reviewed solution.
Offer progressive hints before revealing answers.
Clearly label AI-generated responses.
Handle uncertainty and service failure gracefully.
Apply usage limits and protect API keys.
Avoid sending unnecessary personal information to model providers.
Provide a way to flag incorrect explanations.
Do not make external AI availability a dependency for core practice functionality.

Faraz:
9. Traditional SEO and AI-search discoverability
Make public educational content useful, crawlable, understandable, and easy to cite.
Implement:
Stable descriptive URLs.
Server-rendered meaningful content.
Unique titles and descriptions.
Correct canonical URLs.
XML sitemaps containing eligible public pages.
Intentional robots and indexing controls.
Semantic headings and internal links.
Breadcrumbs.
Social sharing metadata.
Appropriate structured data that matches visible content.
Fast pages and optimized assets.
Real language variants and hreflang only when translations exist.
Create public content around:
Exam structure and timing.
Scoring explanations and limitations.
Topic-specific lessons.
Original worked questions.
Study strategies and schedules.
Carefully sourced exam comparisons.
Bocconi admissions requirements separated by program and cycle.
For useful AI-search retrieval and citation:
Put a concise direct answer near the start of informational pages.
Use self-contained explanations, descriptive headings, and readable tables.
State which exam version or admissions cycle a claim concerns.
Cite authoritative sources close to factual claims.
Show accurate authorship, editorial review, and substantive update dates.
Provide original explanations and genuinely useful examples.
Verify current provider guidance before configuring crawler policies. Distinguish search indexing from model-training access.
Do not promise AI citations, search rankings, rich results, or traffic. Do not treat llms.txt or special “AI schema” as guaranteed discovery mechanisms.
Avoid thin mass-generated pages, fabricated authors or testimonials, keyword stuffing, and misleading freshness dates.
Private dashboards, attempts, admin screens, and personal study plans require authorization. Apply noindex where appropriate, but never treat it as access control.
Measure discoverability using available search-performance data, landing-page engagement, and attributable referrals, acknowledging attribution gaps.
10. Privacy, security, and administration
Implement:
Server-side authorization for learner and admin resources.
Isolation between users’ attempts and data.
Input validation and safe content rendering.
Rate limits for authentication and expensive endpoints.
Secure secret handling.
Dependency checks.
Account deletion and practical data export.
Clear data-retention configuration.
Minimal collection of student information.
Age-appropriate handling of a potentially underage audience.
Keep answer keys out of active exam payloads until review is permitted. Explain that browser-based practice cannot guarantee high-stakes exam security.
Do not build invasive proctoring into the initial release.
Provide privacy and terms drafts with unresolved legal questions identified; do not claim certified legal compliance.
11. Execution sequence and gates
Phase 1 — Audit and specification
Inspect the repository, audit the attachment, verify exam rules, and establish the task board and shared contracts.
Phase 2 — Working vertical slice
Implement one complete journey:
public exam page → sign-in or guest entry → practice → submission → explanations → saved progress.
Phase 3 — Multi-exam expansion
Extend the configuration-driven engine to all six exams, seed reviewed content, and implement the dashboard and administration workflow.
Phase 4 — Learning and discovery
Add diagnostics, study recommendations, mistake review, public lessons, metadata, sitemaps, and structured data.
Phase 5 — Independent verification
Test assessment correctness, permissions, recovery behavior, accessibility, mobile layouts, and public indexing configuration.
Phase 6 — Delivery
Provide the working application, setup instructions, evidence of verification, content coverage, and remaining limitations.
Do not mark a phase complete based only on screenshots or mocked data.
12. Definition of done
The release must demonstrate:
All six exam hubs have verified, version-aware information.
Each exam supports a working practice session using reviewed original questions.

Faraz:
Answers save and results calculate correctly.
Attempts survive refresh without losing order, answers, or remaining time.
Users cannot access another user’s private data.
Restricted assessment navigation is enforced server-side where necessary.
Results distinguish official facts from practice approximations.
Public pages contain meaningful rendered content and correct indexing metadata.
Core workflows work with keyboard navigation and on mobile.
Question-bank coverage and simulation limitations are visible.
Build and relevant automated checks pass.
No placeholder action is presented as a finished feature.
Include tests for scoring boundaries, incorrect and omitted answers, supported response types, timer expiration, repeated submissions, adaptive routing where implemented, and configuration-version persistence.
13. Progress and final reporting
Give concise updates describing:
Completed work.
Current agent responsibilities.
Decisions and assumptions.
Blockers.
The next integration milestone.
Maintain durable project documentation so work can resume without losing decisions.
At handoff, provide:
What works.
How to run and access it.
Supported behavior and content coverage for each exam.
Verification performed and actual results.
Corrections made to the supplied brief.
Known limitations.
Any credentials or decisions required for deployment.
A short prioritized next-release backlog.
Begin now by inspecting the environment and attached brief, creating the agent assignments and verification matrix, and starting the first working learner journey.