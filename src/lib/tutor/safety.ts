/**
 * Checks applied to model output before a learner sees it.
 *
 * A prompt instruction is a request, not a guarantee. A hint that gives the
 * answer away defeats the point of offering one, so every hint is checked
 * mechanically before it is served. A check that rejects a good hint costs a
 * little convenience; a check that passes a leaked answer costs the learner
 * the question, so these err towards rejecting.
 */

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/\$+/g, ' ')
    .replace(/[*_`~>#]/g, ' ')
    .replace(/[^\p{L}\p{N}.\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Standalone numbers in a text, normalised ("1,200" and "1200" are the same). */
function numbersIn(text: string): Set<string> {
  const found = new Set<string>();
  for (const match of text.replace(/(\d),(?=\d{3}\b)/g, '$1').matchAll(/-?\d+(?:\.\d+)?/g)) {
    found.add(String(Number(match[0])));
  }
  return found;
}

export interface HintLeakInput {
  hint: string;
  /** The text of each correct choice, for choice-based items. */
  correctChoiceTexts: string[];
  /** Accepted values, for numeric-entry items. */
  correctValues: string[];
  /** Everything the learner can already see: stem, passage, all choices. */
  visibleText: string;
}

export interface HintLeakResult {
  safe: boolean;
  reason: string | null;
}

export function checkHintForLeaks(input: HintLeakInput): HintLeakResult {
  const hint = normalise(input.hint);

  // Naming a choice by position. Letters in the stem's own notation, such as
  // point A on a figure, are rare enough in a hint that rejecting is the right
  // trade.
  // Upper-case only: "answer a simpler version first" is a fine hint.
  if (
    /(?<![\w$])\([A-E]\)/.test(input.hint) ||
    /\b(?:[Oo]ptions?|[Cc]hoices?|[Aa]nswers?)\s+\*{0,2}[A-E]\b(?![\w'’])/.test(input.hint)
  ) {
    return { safe: false, reason: 'names a choice by letter' };
  }

  if (/\b(?:the (?:correct|right) (?:answer|choice|option)|the answer is|answer is)\b/i.test(input.hint)) {
    return { safe: false, reason: 'states the answer' };
  }

  // Quoting the correct choice. Very short choices ("4", "yes") are covered by
  // the number check below or are too generic to test by substring.
  for (const choice of input.correctChoiceTexts) {
    const text = normalise(choice);
    if (text.length >= 12 && hint.includes(text)) {
      return { safe: false, reason: 'quotes the correct choice' };
    }
  }

  // Giving the final value. A number is only a leak if the learner cannot
  // already see it: repeating a figure from the stem is how hints work.
  const visibleNumbers = numbersIn(input.visibleText);
  const hintNumbers = numbersIn(input.hint);
  const answerNumbers = new Set<string>();
  for (const value of [...input.correctValues, ...input.correctChoiceTexts]) {
    for (const n of numbersIn(value)) answerNumbers.add(n);
  }
  for (const n of answerNumbers) {
    if (hintNumbers.has(n) && !visibleNumbers.has(n)) {
      return { safe: false, reason: 'gives the final value' };
    }
  }

  return { safe: true, reason: null };
}

/**
 * The debrief is about performance, and the one thing it must never do is
 * dress a guess up as a forecast. These are the phrasings a model reaches for
 * when it does.
 */
export function checkDebriefForForecasts(text: string): HintLeakResult {
  const patterns: Array<[RegExp, string]> = [
    [/\bpercentile\b/i, 'mentions a percentile'],
    [/\b(?:you(?:'| a)re|you will|you'll|likely to) (?:score|get|achieve) (?:a |an |around |about )?\d/i, 'predicts a score'],
    [/\bpredicted score\b|\bestimated score\b|\bscore of (?:around|about|roughly)\b/i, 'predicts a score'],
    [/\b(?:chance|chances|probability|odds) of (?:admission|getting in|being admitted|passing)\b/i, 'estimates admission chances'],
    [/\byou (?:will|would) (?:pass|fail)\b/i, 'predicts a pass or fail'],
  ];
  for (const [pattern, reason] of patterns) {
    if (pattern.test(text)) return { safe: false, reason };
  }
  return { safe: true, reason: null };
}
