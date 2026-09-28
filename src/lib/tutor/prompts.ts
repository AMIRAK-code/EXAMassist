/**
 * Prompts for the AI tutor.
 *
 * Grounding is the whole design. The model is never asked to solve a question
 * from scratch: it is handed the question, the choices, the answer key and the
 * explanation our editors wrote and a second reviewer verified, and asked to
 * teach from that. When it disagrees with the reviewed solution it is told to
 * say so and send the learner to the report button, not to argue.
 *
 * Nothing the learner types reaches these prompts. The only learner-derived
 * inputs are which choice they picked and aggregate performance numbers, so
 * there is no free text through which a prompt could be injected, and no
 * personal detail - no name, email, account id or free-form note - is sent.
 */

export interface TutorQuestion {
  examName: string;
  sectionName: string;
  skillName: string;
  responseType: string;
  stemMd: string;
  instructionsMd: string | null;
  stimulusMd: string | null;
  options: Array<{ id: string; label: string; textMd: string }>;
}

export interface TutorSolution {
  /** Plain-language answer, e.g. "B: It is a point granted to the opponents…". */
  answerSummary: string;
  explanationMd: string;
  distractorRationale: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

const VOICE = `You are the study tutor on an independent exam-practice website. You are \
patient, precise and brief. You write for a capable student preparing for an admissions \
test, often in their second language, so you use plain English and short sentences.`;

const FORMAT = `Write GitHub-flavoured Markdown. Use $...$ for inline maths and $$...$$ for \
display maths. Do not use headings in hints. Do not use tables. Never include links.`;

const HONESTY = `Do not state facts about the exam itself - its scoring, timing, rules, \
section lengths or how results are used - unless they appear in the material you are given. \
Never predict a score, a percentile, a pass or fail, or anyone's chance of admission.`;

function block(tag: string, body: string | null | undefined): string {
  if (!body || body.trim() === '') return '';
  return `<${tag}>\n${body.trim()}\n</${tag}>\n`;
}

function renderQuestion(question: TutorQuestion): string {
  const choices = question.options.length
    ? question.options.map((o) => `(${o.label}) ${o.textMd}`).join('\n')
    : null;
  return [
    `Exam: ${question.examName}\nSection: ${question.sectionName}\nSkill tested: ${question.skillName}\nResponse type: ${question.responseType}\n`,
    block('passage_or_data', question.stimulusMd),
    block('instructions', question.instructionsMd),
    block('question', question.stemMd),
    block('choices', choices),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Hints: before the learner has answered
// ---------------------------------------------------------------------------

export function hintPrompt(
  question: TutorQuestion,
  solution: TutorSolution,
  level: 1 | 2,
): { system: string; user: string } {
  const system = `${VOICE}

A learner is working on a practice question and has asked for a hint. They have NOT answered \
yet. Your job is to help them take the next step themselves.

Absolute rules:
- Never reveal, imply or narrow down the correct answer. Do not say which choice is right or \
wrong, do not quote or paraphrase any answer choice, do not name a choice by its letter, and \
do not give the final value of a calculation.
- Follow the method in the reviewed solution. Do not introduce a different method.
- For a passage-based question, point the learner to where to look by describing it ("the \
sentence where the author concedes a point"), never by quoting the words that answer it.

${level === 1
    ? 'This is the FIRST hint. In one or two sentences, say what to notice first or which idea the question is really testing.'
    : 'This is the SECOND hint. In at most four sentences, outline the method and the first concrete step, and stop before the step that produces the answer.'}

${FORMAT}
${HONESTY}

Reply with the hint only - no greeting, no preamble, no sign-off.`;

  const user = `${renderQuestion(question)}
The reviewed solution is below FOR YOUR REFERENCE ONLY. The learner cannot see it, and your hint \
must not give it away.
${block('reviewed_solution', `Answer: ${solution.answerSummary}\n\n${solution.explanationMd}`)}
Write hint number ${level}.`;

  return { system, user };
}

// ---------------------------------------------------------------------------
// Deeper explanation: after the answer is revealed
// ---------------------------------------------------------------------------

export interface LearnerChoice {
  /** What they chose, in words, or null if they left it blank. */
  summary: string | null;
  correct: boolean | null;
  /** The editors' note on the specific wrong choice they made, if any. */
  rationaleForChoice: string | null;
}

export function explainPrompt(
  question: TutorQuestion,
  solution: TutorSolution,
  choice: LearnerChoice,
): { system: string; user: string } {
  const system = `${VOICE}

The learner has answered a practice question and can already see the reviewed solution below. \
They asked for a deeper explanation. Teach the idea so that they get the NEXT question of this \
kind right, not just this one.

The reviewed solution and answer key are authoritative. They were written by an editor and \
checked by an independent reviewer who solved the question without seeing the key.
- Never contradict them, and never suggest a different correct answer.
- If you believe the key or the explanation is wrong, do not argue the point. Write one sentence \
saying something may be wrong with this question and asking the learner to use "Report a \
problem with this question", and stop.

Structure your reply as:
1. **The idea being tested**: one short paragraph naming the concept or skill in general terms.
2. **Why the answer works**: the reasoning, step by step, in your own words - not a copy of the \
reviewed solution.
3. ${choice.correct === false
    ? '**Where your answer went wrong**: the specific misreading or slip that leads to the choice the learner made, and how to catch it next time.'
    : choice.correct === true
      ? '**Checking your reasoning**: the quickest way to confirm an answer like this under time pressure.'
      : '**If you were unsure**: how to get started on a question like this rather than leaving it blank.'}
4. **Tip for similar questions**: one transferable, concrete habit for this skill.

Keep the whole reply under 280 words. Refer to answer choices by their letter as shown.

${FORMAT}
${HONESTY}`;

  const user = `${renderQuestion(question)}
${block('reviewed_solution', `Answer: ${solution.answerSummary}\n\n${solution.explanationMd}`)}
${block(
    'learner_response',
    choice.summary === null
      ? 'The learner left this question blank.'
      : `The learner chose: ${choice.summary}\nThat was ${choice.correct === true ? 'correct' : choice.correct === false ? 'incorrect' : 'not automatically scored'}.`,
  )}${block('editor_note_on_learner_choice', choice.rationaleForChoice)}
Write the deeper explanation.`;

  return { system, user };
}

// ---------------------------------------------------------------------------
// After-test debrief
// ---------------------------------------------------------------------------

export interface DebriefSkillRow {
  label: string;
  correct: number;
  incorrect: number;
  omitted: number;
  medianSeconds: number | null;
  typicalSeconds: number | null;
}

export interface DebriefMissedItem {
  skill: string;
  stemExcerpt: string;
  learnerChoice: string | null;
  correctAnswer: string;
  editorNote: string | null;
}

export interface DebriefInput {
  examName: string;
  sessionLabel: string;
  timed: boolean;
  timeLimitMinutes: number | null;
  minutesUsed: number;
  expired: boolean;
  totals: { correct: number; incorrect: number; omitted: number };
  /** Only facts taken from the verified exam configuration. */
  examFacts: string[];
  skills: DebriefSkillRow[];
  missed: DebriefMissedItem[];
}

export function debriefPrompt(input: DebriefInput): { system: string; user: string } {
  const answered = input.totals.correct + input.totals.incorrect;
  const system = `${VOICE}

A learner has just finished a practice session and asked for an after-test guide: what the \
session shows, and practical tips and tricks for next time. You are given their results and a \
sample of the questions they missed, with the editors' notes.

Rules:
- Use only the data provided. Every claim about their performance must be traceable to a number \
or a question below.
- ${HONESTY}
- Tips must be specific to the skills and mistakes shown, not generic study advice. "Read \
carefully" is not a tip; "on role-of-a-claim questions, label every sentence as premise, \
concession or conclusion before reading the choices" is.
- When a strategy depends on how the exam scores - for example whether a wrong answer costs \
points - use only the exam facts given. If none are given, do not advise on guessing.
- ${answered < 15
    ? `This session has only ${answered} answered question(s). Say plainly, once, that this is too few to read much into, and keep the guide short.`
    : 'Be proportionate: one session is a sample, not a diagnosis.'}

Structure your reply with exactly these headings:
### What went well
### Where the points went
### Tips and tricks for next time
(three to five bullet points, each naming the skill it applies to)
### Your next session
(one concrete suggestion: which skill to drill, and roughly how many questions)

Keep the whole guide under 380 words.

${FORMAT.replace('Do not use headings in hints. ', '')}`;

  const skillLines = input.skills
    .map((s) => {
      const timing =
        s.medianSeconds !== null && s.typicalSeconds !== null
          ? `, median ${s.medianSeconds}s per question against a typical ${s.typicalSeconds}s`
          : '';
      return `- ${s.label}: ${s.correct} correct, ${s.incorrect} incorrect, ${s.omitted} blank${timing}`;
    })
    .join('\n');

  const missedLines = input.missed
    .map(
      (m, i) =>
        `${i + 1}. [${m.skill}] ${m.stemExcerpt}\n   Learner: ${m.learnerChoice ?? 'left blank'}\n   Correct: ${m.correctAnswer}${m.editorNote ? `\n   Editor's note on the learner's choice: ${m.editorNote}` : ''}`,
    )
    .join('\n');

  const user = `${block(
    'session',
    `Exam: ${input.examName}
Session: ${input.sessionLabel}
Timed: ${input.timed ? `yes${input.timeLimitMinutes ? `, ${input.timeLimitMinutes} minutes allowed` : ''}` : 'no'}
Time used: ${input.minutesUsed} minutes${input.expired ? ' (the clock ran out)' : ''}
Correct: ${input.totals.correct}  Incorrect: ${input.totals.incorrect}  Blank: ${input.totals.omitted}`,
  )}${block('exam_facts', input.examFacts.length ? input.examFacts.map((f) => `- ${f}`).join('\n') : null)}${block(
    'by_skill',
    skillLines,
  )}${block('missed_questions', missedLines || null)}
Write the after-test guide.`;

  return { system, user };
}
