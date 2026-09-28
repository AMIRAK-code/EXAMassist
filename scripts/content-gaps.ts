import { loadContent } from '../src/lib/content/loader';
import { EXAM_CONFIGS } from '../src/lib/exams/registry';
import { checkBlueprintSufficiency, type PoolItem } from '../src/lib/assessment/select';
import { resolveParts } from '../src/lib/attempts/service';

/**
 * Says exactly what is missing, part by part, so an author knows what to write
 * rather than guessing from a total. `validate-content.ts` reports whether a
 * format is available; this reports why it is not.
 *
 *   npx tsx scripts/content-gaps.ts [examKey] [--include-review]
 *
 * --include-review counts items still in review as if they were published,
 * to plan the next authoring wave while a review is in flight.
 */

interface Need {
  examKey: string;
  sectionKey: string;
  domains: string[];
  skills: string[];
  responseTypes: string[];
  /** The largest single-part deficit. Parts sharing a pool do not add up. */
  deficit: number;
  blueprints: string[];
}

function main(): void {
  const includeReview = process.argv.includes('--include-review');
  const only = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const { questions } = loadContent();
  const published = questions.filter(
    (q) => q.question.state === 'published' || (includeReview && q.question.state === 'in_review'),
  );

  const configs = only ? EXAM_CONFIGS.filter((c) => c.examKey === only) : EXAM_CONFIGS;
  const needs = new Map<string, Need>();

  for (const config of configs) {
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

    for (const blueprint of config.blueprints) {
      const parts = resolveParts(blueprint, {}, config);
      const check = checkBlueprintSufficiency(pool, parts);
      if (check.sufficient) continue;

      for (const partCheck of check.parts) {
        if (partCheck.sufficient) continue;
        const part = parts.find((p) => p.key === partCheck.partKey)!;
        const section = config.sections.find((s) => s.key === part.sectionKey);
        // Items are written against the pool section, not the presented one.
        const poolSection = section?.poolSectionKey ?? part.sectionKey;
        const sel = part.selection;
        const id = [config.examKey, poolSection, sel.domains.join('|'), sel.skills.join('|'), sel.responseTypes.join('|')].join('::');
        const deficit = partCheck.requested - partCheck.available;
        const existing = needs.get(id);
        if (existing) {
          existing.deficit = Math.max(existing.deficit, deficit);
          if (!existing.blueprints.includes(blueprint.id)) existing.blueprints.push(blueprint.id);
        } else {
          needs.set(id, {
            examKey: config.examKey,
            sectionKey: poolSection,
            domains: sel.domains,
            skills: sel.skills,
            responseTypes: sel.responseTypes,
            deficit,
            blueprints: [blueprint.id],
          });
        }
      }
    }
  }

  const rows = [...needs.values()].sort((a, b) =>
    a.examKey === b.examKey ? a.deficit - b.deficit : a.examKey.localeCompare(b.examKey),
  );

  if (rows.length === 0) {
    console.log('Every blueprint can be filled from the reviewed pool.');
    return;
  }

  let exam = '';
  let total = 0;
  for (const row of rows) {
    if (row.examKey !== exam) {
      exam = row.examKey;
      console.log(`\n${exam}`);
    }
    total += row.deficit;
    const filters = [
      row.domains.length ? `domains=${row.domains.join(',')}` : '',
      row.skills.length ? `skills=${row.skills.join(',')}` : '',
      row.responseTypes.length ? `responseTypes=${row.responseTypes.join(',')}` : '',
    ]
      .filter(Boolean)
      .join('  ');
    console.log(
      `  +${String(row.deficit).padStart(3)}  section=${row.sectionKey.padEnd(22)} ${filters || '(any domain)'}`,
    );
    console.log(`        unlocks: ${row.blueprints.join(', ')}`);
  }
  console.log(`\n${total} question(s) would close every gap.`);
}

main();
