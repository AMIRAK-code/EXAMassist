import type { CheckQuestion } from '../../types';

/** Each distractor carries its own feedback. The answer is the one choice without a note. */
export function check(id: string, title: string, topic: string, stemMd: string,
  choices: [text: string, note?: string][], workingMd: string, lesson: string): CheckQuestion {
  const options = choices.map(([text, note = ''], index) => ({ id: 'ABCDE'[index], text, note }));
  const keys = options.filter(option => !option.note);
  if (keys.length !== 1) throw new Error(`Expected one answer for ${id}`);
  return { id, title, topic, stemMd, options, answer: keys[0].id, workingMd, lesson };
}
