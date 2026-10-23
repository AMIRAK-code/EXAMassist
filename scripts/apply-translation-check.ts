import fs from 'node:fs';
import path from 'node:path';
import { loadContent } from '../src/lib/content/loader';
import { isResponseCorrect } from '../src/lib/assessment/score';
import { contentLocaleSchema } from '../src/lib/content/question-schema';
import { responseSchema, type Response } from '../src/lib/assessment/types';

/**
 * Records translation checks.
 *
 * A translation passes only if the checker, working from the translated
 * wording alone, reached the keyed answer AND judged it faithful to the
 * original. The answer comparison is done here, in code, against the key.
 * A failed check is recorded in the notes and leaves the translation
 * unchecked, so it is never served; nothing is "fixed" to match the checker.
 *
 * Verdict file: a JSON array of
 *   { "questionId", "solvedAnswer", "faithful": boolean, "checkedBy", "notes" }
 * and optionally
 *   { "stimulusId", "faithful": boolean, "checkedBy", "notes" }
 *
 *   npx tsx scripts/apply-translation-check.ts <verdicts.json> --locale it [--dry-run]
 */

interface QuestionVerdict {
  questionId: string;
  solvedAnswer: string;
  faithful: boolean;
  checkedBy: string;
  notes?: string;
}
interface StimulusVerdict {
  stimulusId: string;
  faithful: boolean;
  checkedBy: string;
  notes?: string;
}

const verdictsPath = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!verdictsPath || !process.argv.includes('--locale')) {
  console.error('Usage: npx tsx scripts/apply-translation-check.ts <verdicts.json> --locale it [--dry-run]');
  process.exit(1);
}
const locale = contentLocaleSchema.parse(process.argv[process.argv.indexOf('--locale') + 1]);

function toResponse(responseType: string, raw: string): Response | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  try {
    if (responseType === 'single_select') return responseSchema.parse({ type: 'single_select', optionId: value });
    if (responseType === 'multi_select') {
      return responseSchema.parse({ type: 'multi_select', optionIds: value.split(',').map((s) => s.trim()).filter(Boolean) });
    }
  } catch {
    return null;
  }
  return null;
}

function main(): void {
  const verdicts = JSON.parse(fs.readFileSync(path.resolve(verdictsPath), 'utf8')) as Array<QuestionVerdict | StimulusVerdict>;
  const { questions, stimuli } = loadContent();
  const questionById = new Map(questions.map((q) => [q.question.id, q]));
  const stimulusById = new Map(stimuli.map((s) => [s.stimulus.id, s]));
  const today = new Date().toISOString().slice(0, 10);

  let passed = 0;
  let failed = 0;
  const problems: string[] = [];

  for (const verdict of verdicts) {
    if ('stimulusId' in verdict) {
      const entry = stimulusById.get(verdict.stimulusId);
      const t = entry?.stimulus.translations?.[locale];
      if (!entry || !t) {
        problems.push(`no ${locale} translation for stimulus ${verdict.stimulusId}`);
        continue;
      }
      const ok = verdict.faithful === true && verdict.checkedBy !== t.check.translatedBy;
      const updated = structuredClone(entry.stimulus);
      updated.translations[locale] = {
        ...t,
        check: ok
          ? { ...t.check, checkedBy: verdict.checkedBy, checkedOn: today, answerPreserved: true, notes: verdict.notes ?? '' }
          : { ...t.check, checkedBy: null, checkedOn: null, answerPreserved: null, notes: `Rejected by ${verdict.checkedBy} on ${today}: ${verdict.notes ?? 'not faithful'}` },
      };
      ok ? passed++ : failed++;
      if (!ok) problems.push(`stimulus ${verdict.stimulusId}: ${verdict.notes ?? 'not faithful'}`);
      if (!dryRun) fs.writeFileSync(path.resolve(entry.file), `${JSON.stringify(updated, null, 2)}\n`);
      continue;
    }

    const entry = questionById.get(verdict.questionId);
    const t = entry?.question.translations?.[locale];
    if (!entry || !t) {
      problems.push(`no ${locale} translation for question ${verdict.questionId}`);
      continue;
    }
    const question = entry.question;
    const response = toResponse(question.responseType, verdict.solvedAnswer);
    let correct = false;
    try {
      correct = response !== null && isResponseCorrect(question.answerKey, response);
    } catch {
      correct = false;
    }
    const ok = correct && verdict.faithful === true && verdict.checkedBy !== t.check.translatedBy;
    const updated = structuredClone(question);
    updated.translations[locale] = {
      ...t,
      check: ok
        ? { ...t.check, checkedBy: verdict.checkedBy, checkedOn: today, answerPreserved: true, notes: verdict.notes ?? '' }
        : {
            ...t.check,
            checkedBy: null,
            checkedOn: null,
            answerPreserved: null,
            notes:
              `Rejected by ${verdict.checkedBy} on ${today}: ` +
              (correct ? '' : `solved "${verdict.solvedAnswer}", which is not the key. `) +
              (verdict.faithful ? '' : 'judged not faithful to the original. ') +
              (verdict.notes ?? ''),
          },
    };
    ok ? passed++ : failed++;
    if (!ok) problems.push(`${verdict.questionId}: ${updated.translations[locale]!.check.notes}`);
    if (!dryRun) fs.writeFileSync(path.resolve(entry.file), `${JSON.stringify(updated, null, 2)}\n`);
  }

  console.log(`${dryRun ? '[dry run] ' : ''}${locale} translation checks: ${passed} passed, ${failed} rejected.`);
  for (const p of problems) console.log(`  - ${p}`);
}

main();
