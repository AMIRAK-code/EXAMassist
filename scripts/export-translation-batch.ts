import fs from 'node:fs';
import path from 'node:path';
import { loadContent } from '../src/lib/content/loader';
import { contentLocaleSchema } from '../src/lib/content/question-schema';

/**
 * Exports every question whose translation has not been checked, in a BLINDED
 * form: the English original and the translation side by side, with no answer
 * key, explanation or distractor notes.
 *
 * The checker does two things a translator cannot do for themselves: solves
 * the item from the translated wording alone, and compares the two versions
 * for any shift in meaning. `apply-translation-check.ts` then records the
 * result, comparing the checker's answer with the key in code.
 *
 *   npx tsx scripts/export-translation-batch.ts <output-dir> --locale it [examKey]
 */

const outDir = process.argv[2];
const localeArg = process.argv[process.argv.indexOf('--locale') + 1];
const only = process.argv.slice(2).find((a, i, all) => i > 0 && !a.startsWith('--') && all[i - 1] !== '--locale');

if (!outDir || !process.argv.includes('--locale')) {
  console.error('Usage: npx tsx scripts/export-translation-batch.ts <output-dir> --locale it [examKey]');
  process.exit(1);
}
const locale = contentLocaleSchema.parse(localeArg);

function main(): void {
  const { questions, stimuli } = loadContent();
  const stimulusById = new Map(stimuli.map((s) => [s.stimulus.id, s.stimulus]));

  const items = questions
    .filter(({ question }) => !only || question.examKey === only)
    .filter(({ question }) => question.translations?.[locale] && !question.translations[locale]!.check.checkedBy)
    .map(({ question }) => {
      const t = question.translations[locale]!;
      const stimulus = question.stimulusRef ? stimulusById.get(question.stimulusRef.id) : undefined;
      const st = stimulus?.translations?.[locale];
      return {
        id: question.id,
        examKey: question.examKey,
        responseType: question.responseType,
        original: {
          instructionsMd: question.instructionsMd,
          stemMd: question.stemMd,
          options: question.options.map((o) => ({ id: o.id, textMd: o.textMd })),
          stimulus: stimulus ? { id: stimulus.id, title: stimulus.title, bodyMd: stimulus.bodyMd, data: stimulus.data } : null,
        },
        translated: {
          locale,
          instructionsMd: t.instructionsMd,
          stemMd: t.stemMd,
          options: t.options,
          stimulus: stimulus
            ? st
              ? { id: stimulus.id, title: st.title, bodyMd: st.bodyMd, dataLabels: st.dataLabels, data: stimulus.data }
              : { id: stimulus.id, missing: 'This passage has no translation: report it.' }
            : null,
        },
        answerFormat: 'the option id of the single correct choice in the TRANSLATED version, e.g. "c"',
      };
    });

  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `translations-${locale}${only ? `-${only}` : ''}.blind.json`);
  fs.writeFileSync(file, JSON.stringify(items, null, 2));

  const raw = fs.readFileSync(file, 'utf8');
  for (const forbidden of ['answerKey', 'explanationMd', 'distractorRationale']) {
    if (raw.includes(forbidden)) {
      console.error(`LEAK: ${file} contains "${forbidden}"`);
      process.exit(1);
    }
  }
  console.log(`${items.length} unchecked ${locale} translation(s) -> ${file}`);
  console.log('Verified: no answer keys, explanations or distractor notes leaked into the batch.');
}

main();
