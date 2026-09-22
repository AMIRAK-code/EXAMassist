import { loadContent, summariseCoverage } from '../src/lib/content/loader';
import { EXAM_CONFIGS } from '../src/lib/exams/registry';
import { checkBlueprintSufficiency, type PoolItem } from '../src/lib/assessment/select';
import { resolveParts } from '../src/lib/attempts/service';

/**
 * Validates the question bank and reports honestly on what it can and cannot
 * support. Part of `npm run verify`.
 *
 *   npx tsx scripts/validate-content.ts
 */

const TARGET_PER_EXAM = 20;

function main(): void {
  // Optional argv filter, so an author can check only their own files while
  // other authors are writing theirs.
  const only = process.argv[2];
  const { questions, stimuli, issues: allIssues } = loadContent();
  const issues = only
    ? allIssues.filter((i) => i.file.split('\\').join('/').includes(only))
    : allIssues;
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  console.log(`Loaded ${questions.length} question file(s) and ${stimuli.length} stimulus file(s).\n`);

  if (issues.length > 0) {
    for (const issue of issues) {
      console.log(`${issue.level === 'error' ? 'ERROR' : 'warn '}  ${issue.file}  [${issue.code}] ${issue.message}`);
    }
    console.log('');
  }

  // --- Coverage ------------------------------------------------------------
  console.log('Coverage by exam');
  console.log('exam                      published  target  domains   gaps');
  const coverage = summariseCoverage(questions);
  for (const row of coverage) {
    const gap = row.missingDomains.length > 0 ? row.missingDomains.join(', ') : '-';
    console.log(
      `  ${row.examKey.padEnd(24)}${String(row.published).padStart(6)}` +
        `${String(TARGET_PER_EXAM).padStart(8)}` +
        `${String(`${row.domainsCovered}/${row.domainsTotal}`).padStart(9)}   ${gap.slice(0, 80)}`,
    );
  }

  // --- What the bank can actually run --------------------------------------
  console.log('\nBlueprint availability (can the reviewed pool fill it without repeats?)');
  const published = questions.filter((q) => q.question.state === 'published');

  for (const config of EXAM_CONFIGS) {
    const pool: PoolItem[] = published
      .filter((q) => q.question.examKey === config.examKey)
      .map((q) => ({
        questionVersionId: `${q.question.id}-v${q.question.version}`,
        questionId: q.question.id,
        sectionKey: q.question.sectionKey,
        domainSlug: q.question.domainSlug,
        skillSlug: q.question.skillSlug,
        responseType: q.question.responseType,
        difficulty: q.question.difficulty,
        stimulusId: q.question.stimulusRef?.id ?? null,
        lastSeenAt: null,
      }));

    console.log(`\n  ${config.examKey}  (${pool.length} published items)`);
    for (const blueprint of config.blueprints) {
      const parts = resolveParts(blueprint, {}, config);
      const check = checkBlueprintSufficiency(pool, parts);
      const status = check.sufficient ? 'available' : `SHORT by ${check.shortfall}`;
      console.log(`    ${blueprint.id.padEnd(28)} ${blueprint.mode.padEnd(11)} ${status}`);
    }
  }

  // --- Summary -------------------------------------------------------------
  const belowTarget = coverage.filter((c) => c.published < TARGET_PER_EXAM);
  console.log('\n---');
  console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
  if (belowTarget.length > 0) {
    console.log(
      `${belowTarget.length} exam(s) below the ${TARGET_PER_EXAM}-question target: ` +
        belowTarget.map((c) => `${c.examKey} (${c.published})`).join(', '),
    );
  }

  if (errors.length > 0) process.exit(1);
}

main();
