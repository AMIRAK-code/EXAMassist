import { loadContent, summariseCoverage } from '../src/lib/content/loader';
import { EXAM_CONFIGS } from '../src/lib/exams/registry';
import { checkBlueprintSufficiency, type PoolItem } from '../src/lib/assessment/select';
import { resolveParts } from '../src/lib/attempts/service';
import { eligiblePool, isMeasurementFormat } from '../src/lib/attempts/eligibility';

/**
 * Validates the question bank and reports honestly on what it can and cannot
 * support. Part of `npm run verify`.
 *
 *   npx tsx scripts/validate-content.ts
 *
 * This check reads files only. It can say an item is structurally valid and
 * passed the automated gates (state "published"), but not whether a human has
 * approved it: approvals live in the database's review ledger, and only an
 * approved item is served (src/lib/content/human-review.ts). The availability
 * below is therefore what the bank COULD run once approved. What each format
 * still needs, against the approved pool, is `npm run content:coverage`.
 */

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
  console.log('Coverage by exam ("published" = structurally valid and passed the automated gates; not yet served without human approval)');
  console.log('exam                      published  in review  domains   gaps');
  const coverage = summariseCoverage(questions);
  for (const row of coverage) {
    const gap = row.missingDomains.length > 0 ? row.missingDomains.join(', ') : '-';
    console.log(
      `  ${(row.draftConfig ? `${row.examKey} (draft)` : row.examKey).padEnd(24)}${String(row.published).padStart(6)}` +
        `${String(row.inReview).padStart(11)}` +
        `${String(`${row.domainsCovered}/${row.domainsTotal}`).padStart(9)}   ${gap.slice(0, 80)}`,
    );
  }

  // --- What the bank can actually run --------------------------------------
  console.log('\nBlueprint availability IF every published item were human-approved (can that pool fill it without repeats?)');
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
      // The app's own rule: public samples never fill a measurement format (*).
      const check = checkBlueprintSufficiency(eligiblePool(pool, blueprint), parts);
      const status = check.sufficient ? 'available' : `SHORT by ${check.shortfall}`;
      const mark = isMeasurementFormat(blueprint) ? '*' : ' ';
      console.log(`    ${blueprint.id.padEnd(28)} ${blueprint.mode.padEnd(11)}${mark} ${status}`);
    }
  }

  // --- Summary -------------------------------------------------------------
  console.log('\n---');
  console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
  console.log(
    'Human approval is recorded in the database and is not visible to this file check. While HUMAN_APPROVAL_REQUIRED ' +
      'is "true", nothing above is served until approved; `npm run content:coverage` reports what each format needs.',
  );

  if (errors.length > 0) process.exit(1);
}

main();
