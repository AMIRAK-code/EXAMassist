import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { loadContent } from '../src/lib/content/loader';
import { EXAM_CONFIGS, getExamConfig, labelsFor } from '../src/lib/exams/registry';
import { checkBlueprintSufficiency, type PoolItem } from '../src/lib/assessment/select';
import { resolveParts } from '../src/lib/attempts/service';
import { eligiblePool, isMeasurementFormat } from '../src/lib/attempts/eligibility';
import { PUBLIC_SAMPLES } from '../src/lib/content/public-samples';
import { contentFromQuestion, reviewFingerprint, standingApproval, type ReviewDecision } from '../src/lib/content/human-review';
import { stimulusFileFor } from '../src/lib/content/seed-plan';
import { buildCoverageReport, COVERAGE_PLAN, type CoverageItem, type ExamCoverageReport } from '../src/lib/content/coverage';

/**
 * The blueprint coverage report and the human-approval dry run, from the
 * content files in this checkout.
 *
 *   npm run content:coverage [-- --exam=<key>] [--approvals-db=<sqlite file>] [--write]
 *
 * Approvals live in the database, not in the files. Without --approvals-db
 * the report assumes none, which is exactly the state of a database that has
 * just had migration 014: the review ledger starts empty. With it, approvals
 * are read from that SQLite file's ledger and matched to each question by
 * id, version and content fingerprint, the same rule the server applies.
 * Production runs PostgreSQL; this script never connects to it.
 *
 * --write saves docs/coverage/HUMAN-APPROVAL-DRY-RUN.md and
 * docs/coverage/AUTHORING-BACKLOG.md. Nothing else is written, and no model
 * is called.
 */

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

interface LedgerRow {
  question_id: string;
  question_version: number;
  review_fingerprint: string;
  outcome: 'approved' | 'changes_requested';
  created_at: string;
}

function readApprovals(file: string | undefined): ReviewDecision[] {
  if (!file) return [];
  const db = new Database(path.resolve(file), { readonly: true, fileMustExist: true });
  try {
    return (db.prepare('SELECT question_id, question_version, review_fingerprint, outcome, created_at FROM question_reviews').all() as LedgerRow[]).map(
      (row) => ({
        questionVersionId: `${row.question_id}@${row.question_version}`,
        reviewFingerprint: row.review_fingerprint,
        outcome: row.outcome,
        createdAt: row.created_at,
      }),
    );
  } finally {
    db.close();
  }
}

function main(): void {
  const only = arg('exam');
  const approvalsDb = arg('approvals-db');
  const write = process.argv.includes('--write');
  const decisions = readApprovals(approvalsDb);
  const { questions, stimuli, issues } = loadContent();
  const errors = issues.filter((i) => i.level === 'error');
  if (errors.length > 0) {
    console.error(`${errors.length} content error(s); run npm run content:validate first.`);
    process.exit(1);
  }
  const stimulusFiles = stimuli.map((s) => s.stimulus);
  const today = new Date().toISOString().slice(0, 10);
  const configs = EXAM_CONFIGS.filter((c) => !only || c.examKey === only);

  const reports: ExamCoverageReport[] = [];
  const impact: string[] = [];
  let publishedTotal = 0;
  let approvedTotal = 0;
  let openBefore = 0;
  let openAfter = 0;

  for (const config of configs) {
    const items: CoverageItem[] = questions
      .filter((q) => q.question.examKey === config.examKey)
      .map(({ question }) => {
        const versionKey = `${question.id}@${question.version}`;
        const fingerprint = reviewFingerprint(contentFromQuestion(question, stimulusFileFor(question, stimulusFiles)));
        return {
          questionVersionId: versionKey,
          questionId: question.id,
          sectionKey: question.sectionKey,
          domainSlug: question.domainSlug,
          skillSlug: question.skillSlug,
          responseType: question.responseType,
          difficulty: question.difficulty,
          stimulusId: question.stimulusRef?.id ?? null,
          lastSeenAt: null,
          state: question.state,
          humanApproved: standingApproval(decisions, versionKey, fingerprint) !== null,
          stemMd: question.stemMd,
        };
      });
    const report = buildCoverageReport(config, items);
    reports.push(report);

    // The dry run: each format under the old rule (published) and the strict one (published AND approved).
    const published = items.filter((i) => i.state === 'published') as PoolItem[];
    const approved = items.filter((i) => i.state === 'published' && i.humanApproved) as PoolItem[];
    publishedTotal += published.length;
    approvedTotal += approved.length;
    impact.push(`\n### ${config.name} (\`${config.examKey}\`)\n`);
    impact.push(`${published.length} published question(s); ${approved.length} with a current human approval.\n`);
    impact.push('| Format | Mode | Before (published pool) | After (strict policy) | Note |');
    impact.push('| --- | --- | --- | --- | --- |');
    for (const blueprint of config.blueprints) {
      const parts = resolveParts(blueprint, {}, config);
      const rulesBlocked = blueprint.mode === 'simulation' && !config.capabilities.fullSimulation.available;
      const before = checkBlueprintSufficiency(eligiblePool(published, blueprint), parts);
      const after = checkBlueprintSufficiency(eligiblePool(approved, blueprint), parts);
      const status = (s: typeof before) => (rulesBlocked ? 'closed (rules)' : s.sufficient ? 'open' : `closed (short ${s.shortfall})`);
      const bp = report.blueprints.find((b) => b.id === blueprint.id)!;
      if (!rulesBlocked && before.sufficient) openBefore += 1;
      if (!rulesBlocked && after.sufficient) openAfter += 1;
      const note =
        bp.status === 'essay-out-of-scope'
          ? 'includes an essay part (outside this work)'
          : !rulesBlocked && before.sufficient && !after.sufficient
            ? '**becomes unavailable**'
            : '';
      impact.push(`| ${blueprint.label} (\`${blueprint.id}\`) | ${blueprint.mode}${isMeasurementFormat(blueprint) ? ', measured' : ''} | ${status(before)} | ${status(after)} | ${note} |`);
    }
    const samples = PUBLIC_SAMPLES.filter((s) => s.examKey === config.examKey && s.use === 'homepage-sample');
    for (const sample of samples) {
      const isApproved = approved.some((i) => i.questionId === sample.questionId);
      impact.push(`\nPublic sample \`${sample.questionId}\` (home page and exam hub): ${isApproved ? 'still shown' : '**hidden until approved**'}.`);
    }
  }

  // --- Console summary --------------------------------------------------------
  console.log(`Coverage plan: ${COVERAGE_PLAN.targetDisjointSets} non-overlapping sets per format (a planning target, not an exam rule).`);
  console.log(`Approvals: ${approvalsDb ? `${decisions.length} decision(s) from ${approvalsDb}` : 'none (empty ledger, as after migration 014)'}\n`);
  for (const report of reports) {
    const c = report.counts;
    console.log(
      `${report.examKey.padEnd(24)} approved ${String(c.approved).padStart(4)}  awaiting human ${String(c['awaiting-human-review']).padStart(4)}  ` +
        `AI review ${String(c['in-automated-review']).padStart(3)}  quarantined ${String(c.quarantined).padStart(2)}  ` +
        `open formats ${report.blueprints.filter((b) => b.status === 'open').length}/${report.blueprints.length}`,
    );
  }
  console.log(`\n${publishedTotal} published, ${approvedTotal} human-approved. Formats open: ${openBefore} before, ${openAfter} under the strict policy.`);

  if (!write) {
    console.log('\nRun with --write to save docs/coverage/HUMAN-APPROVAL-DRY-RUN.md and AUTHORING-BACKLOG.md.');
    return;
  }

  const dir = path.resolve('docs/coverage');
  fs.mkdirSync(dir, { recursive: true });
  const source = approvalsDb
    ? `approvals read from \`${approvalsDb}\` (${decisions.length} decision(s))`
    : 'no approvals: the review ledger is empty, as it is in any database right after migration 014';

  fs.writeFileSync(
    path.join(dir, 'HUMAN-APPROVAL-DRY-RUN.md'),
    [
      '# Mandatory human approval: dry-run impact',
      '',
      `Generated ${today} by \`npm run content:coverage -- --write\` from the content files in this checkout; ${source}.`,
      'It reads no database other than the one named, and changes nothing.',
      '',
      '"Before" is the rule until now: a question is served once its content file says `published` (automated',
      'checks and an AI blind solve passed). "After" is the strict rule: published AND a standing approval of its',
      'exact current content by an authorised human reviewer. A format is open when the engine can fill it without',
      'repeating a question (`checkBlueprintSufficiency`, public samples excluded from measured formats) and its',
      "exam's rules allow it.",
      '',
      `**Summary:** ${publishedTotal} published question(s), ${approvedTotal} human-approved. ${openBefore} format(s) open before, ${openAfter} after.`,
      '',
      'Attempts already made are not affected: they keep the question versions they pinned, their results and',
      'their review pages. What closes is the start of NEW sessions, the free test included, and public sample',
      'questions on the home and exam pages.',
      '',
      'Production may hold different content from this checkout until it is re-seeded; run this again against the',
      'content you deploy.',
      ...impact,
      '',
    ].join('\n'),
  );

  const backlog: string[] = [
    '# Question bank expansion backlog',
    '',
    `Generated ${today} by \`npm run content:coverage -- --write\`; ${source}.`,
    '',
    'Counts are independent items: questions sharing a passage are one unit across sets, and near-duplicate',
    'variants of one question are one unit. "Pending review" is what approving the questions already awaiting',
    'human review would supply; "to author" is what remains after that. Approving pending questions is always the',
    'cheaper first step. Essay formats are outside this plan. Opening a simulation also needs its exam rules',
    'verified; content alone never opens it.',
    '',
    `Plan settings (src/lib/content/coverage.ts): ${COVERAGE_PLAN.targetDisjointSets} non-overlapping sets per format (a planning`,
    `target, not an official requirement); topic practice floor ${COVERAGE_PLAN.topicPractice.minPerSkill} per skill and`,
    `${COVERAGE_PLAN.topicPractice.minPerSkillDifficulty} per skill and difficulty band.`,
  ];
  for (const priority of [1, 2, 3] as const) {
    const title =
      priority === 1
        ? 'Priority 1: content blocking an existing non-essay format'
        : priority === 2
          ? `Priority 2: ${COVERAGE_PLAN.targetDisjointSets} non-overlapping sets per format`
          : 'Priority 3: topic-practice depth';
    backlog.push('', `## ${title}`, '');
    backlog.push('| Exam | Section | Domains / skills | Needed | Pending review | To author | Passages | Formats |');
    backlog.push('| --- | --- | --- | ---: | ---: | ---: | --- | --- |');
    let rows = 0;
    for (const report of reports) {
      const config = getExamConfig(report.examKey)!;
      const names = labelsFor(config);
      for (const need of report.needs.filter((n) => n.priority === priority)) {
        rows += 1;
        const scope = [
          need.domains.map((d) => names.domains[d] ?? d).join(', '),
          need.skills.map((s) => names.skills[s] ?? s).join(', '),
          need.responseTypes.join(', '),
          need.difficulties.length && priority === 3 ? `bands short: ${need.difficulties.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join(' · ') || 'any domain';
        const passages = need.stimulus && need.stimulus.passagesToWrite > 0 ? `${need.stimulus.passagesToWrite} × ~${need.stimulus.questionsPerPassage} q` : '—';
        backlog.push(
          `| ${report.examKey} | ${need.sectionKey} | ${scope} | ${need.needed} | ${need.coveredByPendingReview} | ${need.toAuthor} | ${passages} | ${need.formats.join(', ')} |`,
        );
      }
    }
    if (rows === 0) backlog.push('| — | — | Nothing needed at this priority. | 0 | 0 | 0 | — | — |');
  }
  backlog.push(
    '',
    '## Drafting against a gap',
    '',
    'For a row with something to author, draft against that constraint with the existing tool, which writes',
    '`in_review` items only (docs/AUTHORING-BRIEF.md). Check the request first with `--dry-run`; a live run calls',
    'a paid model and needs the owner’s go-ahead:',
    '',
    '    npm run content:draft -- --exam=<exam> --domain=<domain slug> --skill=<skill slug> --count=<n> --dry-run',
    '',
    'A drafted item is a structurally valid draft, nothing more. It becomes available to learners only after',
    'option-order normalisation, the AI blind review (`scripts/apply-review.ts`), a re-seed, and a human reviewer’s',
    'approval of its exact content.',
    '',
  );
  fs.writeFileSync(path.join(dir, 'AUTHORING-BACKLOG.md'), backlog.join('\n'));
  console.log(`\nWrote ${path.relative(process.cwd(), dir)}/HUMAN-APPROVAL-DRY-RUN.md and AUTHORING-BACKLOG.md.`);
}

main();
