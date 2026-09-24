import fs from 'node:fs';
import path from 'node:path';
import { loadContent } from '../src/lib/content/loader';
import { createRng, shuffle } from '../src/lib/assessment/select';

/**
 * Removes answer-position bias from the question bank.
 *
 * Independent review found that correct answers clustered on the first option
 * (on one exam, every mathematics item keyed to "A"), which makes a set
 * guessable without reading it. This rewrites option order so position carries
 * no information:
 *
 *  - Numeric choice sets are sorted ASCENDING, which is what the real exams do
 *    and which makes the correct position a consequence of the maths.
 *  - Other choice sets are shuffled with a seed derived from the question id,
 *    so the result is deterministic and reproducible.
 *  - Fixed choice sets are left alone: quantitative comparison and data
 *    sufficiency options have exam-defined meanings attached to their letters,
 *    and two-part items are grouped by column.
 *
 * Option ids and labels are renumbered by position, and the answer key,
 * distractor notes and independent-solve record are remapped with them, so
 * every cross-reference in the file stays correct.
 *
 * Only draft and in-review items are touched: published order is immutable.
 *
 *   npx tsx scripts/normalise-option-order.ts [--dry-run]
 */

const dryRun = process.argv.includes('--dry-run');
const SHUFFLEABLE = new Set(['single_select', 'multi_select']);
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Reads an option as a number, ignoring KaTeX delimiters and formatting. */
function numericValue(textMd: string): number | null {
  const cleaned = textMd
    .replace(/\$+/g, '')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .replace(/[,\s]/g, '')
    .trim();
  if (cleaned === '') return null;

  const fraction = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(cleaned);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator !== 0) return Number(fraction[1]) / denominator;
  }
  if (!/^-?\d*\.?\d+%?$/.test(cleaned)) return null;
  return Number(cleaned.replace('%', ''));
}

function main(): void {
  const { questions } = loadContent();
  let reordered = 0;
  let sorted = 0;
  let skipped = 0;
  const namesLetters: string[] = [];

  for (const entry of questions) {
    const question = entry.question;

    // Published content is immutable. Re-ordering a published item would change
    // what a learner was shown and would make this script non-idempotent, so
    // ordering is fixed while an item is still in review, before anyone sees
    // it. Run this BEFORE the blind review, not after.
    if (question.state !== 'draft' && question.state !== 'in_review') {
      skipped += 1;
      continue;
    }

    if (!SHUFFLEABLE.has(question.responseType) || question.options.length < 2) {
      skipped += 1;
      continue;
    }

    // Letters written in prose are not remapped, and a stale "Choice B." sends
    // a learner to the wrong option. This happened to 104 published items, so
    // an item whose explanation or distractor notes name option letters is
    // left in its order and reported, to be reordered and re-lettered by hand.
    const prose = [question.explanationMd, ...Object.values(question.distractorRationale)]
      .join('\n')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/\$[^$\n]*\$/g, ' ');
    if (/\b(?:[Cc]hoices?|[Oo]ptions?) \(?[A-H]\)?(?![A-Za-z])|\([A-H]\)/.test(prose)) {
      namesLetters.push(question.id);
      continue;
    }

    const values = question.options.map((option) => numericValue(option.textMd));
    const allNumeric = values.every((value) => value !== null);

    // Canonicalise before shuffling, so the shuffle's input never depends on a
    // previous run. Without this, re-running the script re-randomises the same
    // item every time, because a shuffled list is a different input.
    const canonical = [...question.options].sort((a, b) => a.textMd.localeCompare(b.textMd, 'en'));

    const ordered = allNumeric
      ? [...question.options].sort(
          (a, b) => (numericValue(a.textMd) ?? 0) - (numericValue(b.textMd) ?? 0),
        )
      : shuffle(canonical, createRng(`option-order:${question.id}`));

    const unchanged = ordered.every((option, index) => option.id === question.options[index]?.id);
    if (unchanged) {
      skipped += 1;
      continue;
    }

    // Renumber ids and labels by position, and remember the mapping.
    const remap = new Map<string, string>();
    const newOptions = ordered.map((option, index) => {
      const newId = LABELS[index].toLowerCase();
      remap.set(option.id, newId);
      return { id: newId, label: LABELS[index], textMd: option.textMd };
    });

    const updated = structuredClone(question) as Record<string, unknown>;
    updated.options = newOptions;

    const key = structuredClone(question.answerKey) as Record<string, unknown>;
    if (key.type === 'single_select') {
      key.optionId = remap.get(String(key.optionId)) ?? key.optionId;
    } else if (key.type === 'multi_select') {
      key.optionIds = (key.optionIds as string[]).map((id) => remap.get(id) ?? id);
    }
    updated.answerKey = key;

    updated.distractorRationale = Object.fromEntries(
      Object.entries(question.distractorRationale).map(([id, text]) => [remap.get(id) ?? id, text]),
    );

    // Keep the audit trail consistent with the file it describes.
    const review = updated.review as Record<string, unknown>;
    const solve = review.independentSolve as Record<string, unknown> | null;
    if (solve && typeof solve.solvedAnswer === 'string') {
      const remapped = solve.solvedAnswer
        .split(',')
        .map((part) => remap.get(part.trim()) ?? part.trim())
        .join(',');
      solve.solvedAnswer = remapped;
    }
    review.notes =
      `${String(review.notes ?? '')} Options were reordered after review to remove answer-position bias; ` +
      `ids and labels were remapped with the key.`.trim();

    if (!dryRun) {
      fs.writeFileSync(path.resolve(entry.file), `${JSON.stringify(updated, null, 2)}\n`);
    }
    if (allNumeric) sorted += 1;
    else reordered += 1;
  }

  console.log(`${dryRun ? '[dry run] ' : ''}Option order normalised.`);
  console.log(`  numeric sets sorted ascending: ${sorted}`);
  console.log(`  other sets shuffled:           ${reordered}`);
  console.log(`  unchanged or not applicable:   ${skipped}`);
  if (namesLetters.length > 0) {
    console.log(`  left alone, prose names option letters: ${namesLetters.length}`);
    for (const id of namesLetters) console.log(`    ${id}`);
  }
}

main();
