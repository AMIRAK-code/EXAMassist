import fs from 'node:fs';
import path from 'node:path';
import { loadContent } from '../src/lib/content/loader';

/**
 * Exports questions awaiting review in a BLINDED form: the answer key, the
 * explanation and the distractor reasoning are removed.
 *
 * This is what makes the independent solve genuine. A reviewer who can see the
 * proposed key is not solving the question, they are agreeing with it.
 *
 *   npx tsx scripts/export-review-batch.ts <output-dir>
 */

const outDir = process.argv[2] ?? path.resolve('tmp/review');

interface BlindItem {
  id: string;
  examKey: string;
  responseType: string;
  domainSlug: string;
  skillSlug: string;
  difficulty: string;
  instructionsMd: string | null;
  stemMd: string;
  options: Array<{ id: string; label: string; textMd: string }>;
  stimulus: {
    id: string;
    kind: string;
    title: string | null;
    bodyMd: string | null;
    data: unknown;
  } | null;
  answerFormat: string;
}

/** Tells the solver exactly how to express an answer so it can be compared. */
function answerFormat(responseType: string): string {
  switch (responseType) {
    case 'single_select':
      return 'the option id of the single correct choice, e.g. "c"';
    case 'multi_select':
      return 'every correct option id, comma separated and sorted, e.g. "a,d"';
    case 'numeric_entry':
      return 'the numeric value only, e.g. "16" or "3/4" or "-0.25"';
    case 'quantitative_comparison':
      return 'one of the letters A, B, C or D';
    case 'data_sufficiency':
      return 'one of the letters A, B, C, D or E';
    case 'two_part':
      return 'one "columnId:optionId" pair per column, semicolon separated';
    case 'essay':
      return 'the word "essay" (essays are not auto-scored and are skipped)';
    default:
      return 'a plain answer';
  }
}

function main(): void {
  const { questions, stimuli } = loadContent();
  const stimulusById = new Map(stimuli.map((s) => [s.stimulus.id, s.stimulus]));

  const pending = questions.filter(
    (q) => q.question.state === 'in_review' && q.question.responseType !== 'essay',
  );

  const byExam = new Map<string, BlindItem[]>();
  for (const { question } of pending) {
    const stimulus = question.stimulusRef ? stimulusById.get(question.stimulusRef.id) : undefined;
    const item: BlindItem = {
      id: question.id,
      examKey: question.examKey,
      responseType: question.responseType,
      domainSlug: question.domainSlug,
      skillSlug: question.skillSlug,
      difficulty: question.difficulty,
      instructionsMd: question.instructionsMd,
      stemMd: question.stemMd,
      options: question.options,
      stimulus: stimulus
        ? {
            id: stimulus.id,
            kind: stimulus.kind,
            title: stimulus.title,
            bodyMd: stimulus.bodyMd,
            data: stimulus.data,
          }
        : null,
      answerFormat: answerFormat(question.responseType),
    };
    const bucket = byExam.get(question.examKey);
    if (bucket) bucket.push(item);
    else byExam.set(question.examKey, [item]);
  }

  fs.mkdirSync(outDir, { recursive: true });
  for (const [examKey, items] of byExam) {
    const file = path.join(outDir, `${examKey}.blind.json`);
    fs.writeFileSync(file, JSON.stringify(items, null, 2));
    console.log(`${examKey.padEnd(24)} ${String(items.length).padStart(3)} items -> ${file}`);
  }

  const skipped = questions.filter(
    (q) => q.question.state === 'in_review' && q.question.responseType === 'essay',
  ).length;
  console.log(`\n${pending.length} item(s) exported for blind review; ${skipped} essay item(s) skipped.`);

  // A blinded file must never contain an answer key.
  for (const [examKey] of byExam) {
    const raw = fs.readFileSync(path.join(outDir, `${examKey}.blind.json`), 'utf8');
    for (const forbidden of ['answerKey', 'explanationMd', 'distractorRationale']) {
      if (raw.includes(forbidden)) {
        console.error(`LEAK: ${examKey}.blind.json contains "${forbidden}"`);
        process.exit(1);
      }
    }
  }
  console.log('Verified: no answer keys, explanations or distractor notes leaked into the batch.');
}

main();
