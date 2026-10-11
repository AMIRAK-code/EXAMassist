import { loadContent } from '../../src/lib/content/loader';
import { EXAM_CONFIGS } from '../../src/lib/exams/registry';

/**
 * Items per skill, counting every skill the config declares (including those
 * with none), so an authoring wave can be aimed at the thin ones.
 *
 *   npx tsx scripts/review-tools/skill-coverage.ts [examKey...]
 */

const only = process.argv.slice(2);
const { questions } = loadContent();
for (const config of EXAM_CONFIGS) {
  if (only.length && !only.includes(config.examKey)) continue;
  const items = questions.filter((q) => q.question.examKey === config.examKey);
  const count = (skill: string, state: string) =>
    items.filter((q) => q.question.skillSlug === skill && q.question.state === state).length;
  console.log(`\n${config.examKey}`);
  for (const domain of config.domains) {
    console.log(`  ${domain.slug} (section ${domain.sectionKey})`);
    for (const skill of domain.skills) {
      console.log(
        `    ${String(count(skill.slug, 'published')).padStart(3)} published ${String(count(skill.slug, 'in_review')).padStart(3)} in review  ${skill.slug}`,
      );
    }
  }
}
