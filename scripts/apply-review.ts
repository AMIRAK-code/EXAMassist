import fs from 'node:fs';
import path from 'node:path';
import { loadContent } from '../src/lib/content/loader';
import { isResponseCorrect } from '../src/lib/assessment/score';
import { responseSchema, type Response } from '../src/lib/assessment/types';

/**
 * Applies blind-review verdicts to the question bank.
 *
 * The comparison is done here in code, not by the reviewer: the reviewer's
 * answer is parsed into a Response and run through the same scoring engine the
 * app uses. Agreement publishes the item with an independent-solve record;
 * disagreement quarantines it for a human, and never silently "fixes" the key.
 *
 *   npx tsx scripts/apply-review.ts <verdicts.json> [--dry-run]
 */

interface Verdict {
  questionId: string;
  solvedAnswer: string;
  uniquenessChecked: boolean;
  workingNotes: string;
  solvedBy: string;
  concern?: string;
}

const verdictsPath = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!verdictsPath) {
  console.error('Usage: npx tsx scripts/apply-review.ts <verdicts.json> [--dry-run]');
  process.exit(1);
}

/** Turns the reviewer's plain-text answer into a Response the engine can score. */
function toResponse(responseType: string, raw: string): Response | null {
  const value = raw.trim();
  if (value === '') return null;

  try {
    switch (responseType) {
      case 'single_select':
        return responseSchema.parse({ type: 'single_select', optionId: value.toLowerCase() });
      case 'multi_select':
        return responseSchema.parse({
          type: 'multi_select',
          optionIds: value
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean),
        });
      case 'numeric_entry':
        return responseSchema.parse({ type: 'numeric_entry', raw: value });
      case 'quantitative_comparison':
        return responseSchema.parse({
          type: 'quantitative_comparison',
          choice: value.toUpperCase(),
        });
      case 'data_sufficiency':
        return responseSchema.parse({ type: 'data_sufficiency', choice: value.toUpperCase() });
      case 'two_part':
        return responseSchema.parse({
          type: 'two_part',
          selections: value
            .split(';')
            .map((pair) => pair.trim())
            .filter(Boolean)
            .map((pair) => {
              const [columnId, optionId] = pair.split(':').map((s) => s.trim());
              return { columnId, optionId: optionId?.toLowerCase() ?? '' };
            }),
        });
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function main(): void {
  const verdicts = JSON.parse(fs.readFileSync(verdictsPath, 'utf8')) as Verdict[];
  const { questions } = loadContent();
  const byId = new Map(questions.map((q) => [q.question.id, q]));

  const today = new Date().toISOString().slice(0, 10);
  let published = 0;
  let quarantined = 0;
  let unparseable = 0;
  const problems: string[] = [];

  for (const verdict of verdicts) {
    const entry = byId.get(verdict.questionId);
    if (!entry) {
      problems.push(`unknown question id: ${verdict.questionId}`);
      continue;
    }
    const question = entry.question;
    if (question.state !== 'in_review') continue;

    const response = toResponse(question.responseType, verdict.solvedAnswer);
    let agrees = false;

    if (response === null) {
      unparseable += 1;
      problems.push(
        `${verdict.questionId}: reviewer answer "${verdict.solvedAnswer}" could not be parsed as ${question.responseType}`,
      );
    } else {
      try {
        agrees = isResponseCorrect(question.answerKey, response);
      } catch {
        agrees = false;
      }
    }

    const updated = structuredClone(question) as Record<string, unknown>;
    const review = updated.review as Record<string, unknown>;
    review.independentSolve = {
      solvedBy: verdict.solvedBy,
      solvedAnswer: verdict.solvedAnswer,
      agreesWithKey: agrees,
      uniquenessChecked: verdict.uniquenessChecked,
      workingNotes: verdict.workingNotes,
    };

    if (agrees && verdict.uniquenessChecked) {
      review.reviewer = verdict.solvedBy;
      review.reviewedOn = today;
      updated.state = 'published';
      published += 1;
    } else {
      // Never guess at the intended answer. Quarantine it, say why, and leave
      // it out of the live bank until a human resolves it.
      updated.state = 'quarantined';
      updated.quarantine = {
        reason: !agrees
          ? `Independent solver answered "${verdict.solvedAnswer}", which does not match the author's key. ` +
            `Reviewer notes: ${verdict.workingNotes}${verdict.concern ? ` | ${verdict.concern}` : ''}`
          : `Answer uniqueness was not confirmed. Reviewer notes: ${verdict.workingNotes}`,
        replacedBy: null,
      };
      quarantined += 1;
      problems.push(`${verdict.questionId}: QUARANTINED (${agrees ? 'uniqueness unconfirmed' : 'key disputed'})`);
    }

    if (!dryRun) {
      fs.writeFileSync(path.resolve(entry.file), `${JSON.stringify(updated, null, 2)}\n`);
    }
  }

  console.log(`${dryRun ? '[dry run] ' : ''}Applied ${verdicts.length} verdict(s).`);
  console.log(`  published:   ${published}`);
  console.log(`  quarantined: ${quarantined}`);
  if (unparseable > 0) console.log(`  unparseable: ${unparseable}`);
  if (problems.length > 0) {
    console.log('\nNeeds attention:');
    for (const problem of problems) console.log(`  ${problem}`);
  }
}

main();
