import katex from 'katex';
import { getExamConfig } from '@/lib/exams/registry';
import { TITLE_BUDGET } from '@/lib/seo/title';
import type { Course, Lesson } from './types';

/** A course's short name sits beside each lesson title in the page's <title> (types.ts). */
const SHORT_TITLE_MAX = 24;

/**
 * Structural and editorial checks for a course: run by tests/unit/courses.test.ts
 * and by scripts/check-courses.ts while authoring. An error fails the build of
 * the course; nothing here is a style preference.
 */

export interface CourseIssue {
  where: string;
  problem: string;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Characters a lost backslash leaves behind: "\t" in "\times" becomes a tab, "\f" in "\frac" a form feed. */
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]|\t/;
/** Claims a course may never make about its own material. */
const OFFICIAL_CLAIMS =
  /\b(official (?:question|item|test question)s?|past (?:paper|exam question)s?|real (?:GRE|GMAT|Bocconi|IMAT) question|actual (?:GRE|GMAT|Bocconi|IMAT) question|taken from the (?:GRE|GMAT|Bocconi|IMAT)|domande? (?:ufficial[ei]|degli anni passati|reali dell)|quesiti (?:ufficiali|degli anni passati|reali)|tratt[aoie] dal(?:l'|l’| )(?:IMAT|test ufficiale))/i;

/** Every TeX fragment in a Markdown string, in the delimiters src/lib/markdown.ts uses. */
export function mathFragments(source: string): string[] {
  const out: string[] = [];
  const rest = source.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex: string) => {
    out.push(tex);
    return ' ';
  });
  for (const match of rest.matchAll(/(^|[^\\])\$((?:[^$\n\\]|\\[^\n])+?)\$/g)) out.push(match[2]);
  return out;
}

/** Internal links (`](/...)`) in a Markdown string, without their #fragment. */
export function internalLinks(source: string): string[] {
  return [...source.matchAll(/\]\((\/[^)\s#]*)(?:#[^)\s]*)?\)/g)].map((match) => match[1]);
}

/** Every Markdown string in a lesson, with where it sits. */
export function lessonTexts(lesson: Lesson): Array<[string, string]> {
  const texts: Array<[string, string]> = [
    ['title', lesson.title],
    ['summary', lesson.summary],
    ['teachMd', lesson.teachMd],
    ...lesson.objectives.map((text, i) => [`objectives[${i}]`, text] as [string, string]),
    ...lesson.takeaways.map((text, i) => [`takeaways[${i}]`, text] as [string, string]),
    ...(lesson.flashcards ?? []).flatMap((card, i): Array<[string, string]> => [
      [`flashcard ${i + 1} front`, card.front],
      [`flashcard ${i + 1} back`, card.back],
    ]),
  ];
  for (const example of lesson.examples) {
    texts.push([`example ${example.id} title`, example.title], [`example ${example.id} problem`, example.problemMd], [`example ${example.id} answer`, example.answerMd]);
    example.steps.forEach((step, i) => texts.push([`example ${example.id} step ${i + 1}`, step]));
  }
  lesson.traps.forEach((trap, i) => texts.push([`trap ${i + 1} title`, trap.title], [`trap ${i + 1}`, trap.md]));
  for (const q of lesson.check) {
    texts.push([`check ${q.id} title`, q.title], [`check ${q.id} stem`, q.stemMd], [`check ${q.id} working`, q.workingMd], [`check ${q.id} lesson`, q.lesson]);
    if (q.stimulusMd) texts.push([`check ${q.id} stimulus`, q.stimulusMd]);
    for (const option of q.options) texts.push([`check ${q.id} option ${option.id}`, option.text], [`check ${q.id} option ${option.id} note`, option.note]);
  }
  return texts;
}

export function validateLesson(lesson: Lesson, where: string): CourseIssue[] {
  const issues: CourseIssue[] = [];
  const fail = (problem: string, at = where) => issues.push({ where: at, problem });

  if (!SLUG.test(lesson.slug)) fail(`slug "${lesson.slug}" is not kebab-case`);
  if (!lesson.title.trim()) fail('empty title');
  if (lesson.title.length > TITLE_BUDGET && !lesson.metaTitle) fail(`title is ${lesson.title.length} characters; give a metaTitle of at most ${TITLE_BUDGET} for search results`);
  if (lesson.metaTitle !== undefined && (!lesson.metaTitle.trim() || lesson.metaTitle.length > TITLE_BUDGET)) fail(`metaTitle is ${lesson.metaTitle.length} characters; keep it between 1 and ${TITLE_BUDGET}`);
  if (lesson.summary.length < 50 || lesson.summary.length > 160) fail(`summary is ${lesson.summary.length} characters; keep it between 50 and 160`);
  if (!Number.isInteger(lesson.minutes) || lesson.minutes < 5 || lesson.minutes > 45) fail(`minutes ${lesson.minutes} is outside 5–45`);
  if (lesson.objectives.length < 2 || lesson.objectives.length > 4) fail(`${lesson.objectives.length} objectives; write 2–4`);
  if (lesson.takeaways.length < 3 || lesson.takeaways.length > 5) fail(`${lesson.takeaways.length} takeaways; write 3–5`);
  if (lesson.teachMd.trim().length < 1200) fail(`teachMd is ${lesson.teachMd.trim().length} characters; the teaching is too thin`);
  if (/^#{1,2} /m.test(lesson.teachMd)) fail('teachMd uses a # or ## heading; start at ###');
  if (lesson.examples.length < 2) fail(`${lesson.examples.length} worked examples; write at least 2`);
  if (lesson.traps.length < 2) fail(`${lesson.traps.length} traps; write at least 2`);
  if (lesson.check.length < 2 || lesson.check.length > 5) fail(`${lesson.check.length} check questions; write 2–5`);
  if (lesson.flashcards) {
    if (lesson.flashcards.length < 4 || lesson.flashcards.length > 8) fail(`${lesson.flashcards.length} flashcards; write 4–8`);
    lesson.flashcards.forEach((card, i) => {
      if (!card.front.trim() || !card.back.trim()) fail(`flashcard ${i + 1} has an empty side`);
    });
    const fronts = lesson.flashcards.map((card) => card.front.trim().toLowerCase());
    if (new Set(fronts).size !== fronts.length) fail('two flashcards have the same front');
  }

  const ids = new Set<string>();
  for (const example of lesson.examples) {
    if (!SLUG.test(example.id)) fail(`example id "${example.id}" is not kebab-case`);
    if (ids.has(example.id)) fail(`duplicate anchor id "${example.id}"`);
    ids.add(example.id);
    if (example.steps.length < 2) fail(`example ${example.id} has ${example.steps.length} step; show the working`);
    if (!example.answerMd.trim()) fail(`example ${example.id} has no answer`);
  }
  for (const q of lesson.check) {
    if (!SLUG.test(q.id)) fail(`check id "${q.id}" is not kebab-case`);
    if (ids.has(q.id)) fail(`duplicate anchor id "${q.id}"`);
    ids.add(q.id);
    const optionIds = q.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length) fail(`check ${q.id} repeats an option id`);
    if (q.options.length < 3 || q.options.length > 5) fail(`check ${q.id} has ${q.options.length} options; use 3–5`);
    if (!optionIds.includes(q.answer)) fail(`check ${q.id} answer "${q.answer}" is not an option`);
    if (optionIds.join('') !== 'ABCDE'.slice(0, optionIds.length)) fail(`check ${q.id} option ids must run A, B, C…`);
    for (const option of q.options) {
      if (option.id === q.answer && option.note.trim()) fail(`check ${q.id}: the key's note must be empty`);
      if (option.id !== q.answer && option.note.trim().length < 15) fail(`check ${q.id}: option ${option.id} needs a real note on why it is wrong`);
    }
    const texts = q.options.map((option) => option.text.trim().toLowerCase());
    if (new Set(texts).size !== texts.length) fail(`check ${q.id} has two identical options`);
    if (!q.workingMd.trim() || !q.lesson.trim()) fail(`check ${q.id} needs working and a lesson`);
  }

  const { examKey, domain, skill } = lesson.practice;
  const config = getExamConfig(examKey);
  if (!config) fail(`practice exam "${examKey}" does not exist`);
  else {
    const found = config.domains.find((d) => d.slug === domain);
    if (!found) fail(`practice domain "${domain}" is not in ${examKey}`);
    else if (skill && !found.skills.some((s) => s.slug === skill)) fail(`practice skill "${skill}" is not in ${examKey} / ${domain}`);
  }

  const { review } = lesson;
  if (review.aiAssisted !== true) fail('review.aiAssisted must be true');
  if (review.independentCheckOn !== null && !DATE.test(review.independentCheckOn)) fail('review.independentCheckOn must be YYYY-MM-DD or null');
  if (review.expertReview !== null) fail('review.expertReview must stay null (it would name an individual reviewer)');

  for (const [at, text] of lessonTexts(lesson)) {
    const place = `${where} › ${at}`;
    if (CONTROL.test(text)) fail('contains a tab or control character (a lost backslash?)', place);
    if (OFFICIAL_CLAIMS.test(text)) fail(`presents material as official: "${OFFICIAL_CLAIMS.exec(text)![0]}"`, place);
    const stripped = text.replace(/\$\$[\s\S]+?\$\$/g, '').replace(/(^|[^\\])\$((?:[^$\n\\]|\\[^\n])+?)\$/g, '$1');
    if (/(^|[^\\])\$/.test(stripped)) fail('has an unmatched $ (write a literal dollar as \\$)', place);
    if (/\\(?:frac|times|sqrt|cdot|le|ge|neq|pi|text|left|right)\b/.test(stripped)) fail('has TeX outside $...$', place);
    for (const tex of mathFragments(text)) {
      try {
        katex.renderToString(tex, { throwOnError: true, strict: false });
      } catch (error) {
        fail(`KaTeX cannot render "${tex}": ${(error as Error).message.split('\n')[0]}`, place);
      }
    }
  }
  return issues;
}

export function validateCourse(course: Course): CourseIssue[] {
  const issues: CourseIssue[] = [];
  for (const [lang, translation] of Object.entries(course.translations ?? {})) {
    if (translation) issues.push(...validateTranslation(course, translation, lang), ...validateCourse(translation));
  }
  const fail = (problem: string, where = course.slug) => issues.push({ where, problem });
  if (course.description.length > 160) fail(`description is ${course.description.length} characters; keep it to 160`);
  if (course.metaTitle.length > TITLE_BUDGET) fail(`metaTitle is ${course.metaTitle.length} characters; keep it to ${TITLE_BUDGET}`);
  if (course.shortTitle.length > SHORT_TITLE_MAX) fail(`shortTitle is ${course.shortTitle.length} characters; keep it to ${SHORT_TITLE_MAX}`);
  if (!DATE.test(course.publishedOn) || !DATE.test(course.updatedOn)) fail('dates must be YYYY-MM-DD');
  if (course.updatedOn < course.publishedOn) fail('updatedOn is before publishedOn');
  if (course.sources.length === 0) fail('a course cites the official sources for its exam facts');
  for (const source of course.sources) if (!/^https:\/\//.test(source.url)) fail(`source ${source.url} is not https`);

  const units = new Set<string>();
  const lessons = new Set<string>();
  for (const unit of course.units) {
    if (!SLUG.test(unit.slug)) fail(`unit slug "${unit.slug}" is not kebab-case`);
    if (units.has(unit.slug)) fail(`duplicate unit slug "${unit.slug}"`);
    units.add(unit.slug);
    if (unit.lessons.length === 0) fail(`unit ${unit.slug} has no lessons`);
    for (const lesson of unit.lessons) {
      if (lessons.has(lesson.slug)) fail(`duplicate lesson slug "${lesson.slug}"`);
      lessons.add(lesson.slug);
      if (course.interactive && !lesson.flashcards) fail(`lesson ${lesson.slug} needs flashcards: the course is interactive`);
      if (!course.examKeys.includes(lesson.practice.examKey)) fail(`lesson ${lesson.slug} practises ${lesson.practice.examKey}, which is not one of the course's exams`);
      issues.push(...validateLesson(lesson, `${course.slug}/${unit.slug}/${lesson.slug}`));
    }
  }
  return issues;
}

/**
 * A translation is the same course in another language (types.ts): the same
 * slug, units and lessons in the same order, the same minutes, practice links
 * and check keys, so that its pages are true alternates of the original's.
 */
function validateTranslation(course: Course, translation: Course, lang: string): CourseIssue[] {
  const issues: CourseIssue[] = [];
  const where = `${course.slug} (${lang})`;
  const fail = (problem: string, at = where) => issues.push({ where: at, problem });
  if (translation.lang !== lang) fail(`the translation's lang is "${translation.lang ?? 'en'}", not "${lang}"`);
  if (translation.slug !== course.slug) fail(`the translation's slug is "${translation.slug}"`);
  if (translation.translations) fail('a translation has no translations of its own');
  if (Boolean(translation.interactive) !== Boolean(course.interactive)) fail('the translation and the original differ in being interactive');
  if (translation.examKeys.join() !== course.examKeys.join()) fail('the translation practises different exams');
  const outline = (c: Course) => c.units.map((unit) => `${unit.slug}: ${unit.lessons.map((lesson) => lesson.slug).join(', ')}`).join(' | ');
  if (outline(translation) !== outline(course)) fail('units and lessons differ from the original, in slugs or order');
  const originals = new Map(course.units.flatMap((unit) => unit.lessons).map((lesson) => [lesson.slug, lesson]));
  for (const lesson of translation.units.flatMap((unit) => unit.lessons)) {
    const original = originals.get(lesson.slug);
    if (!original) continue;
    const at = `${where}/${lesson.slug}`;
    if (lesson.minutes !== original.minutes) fail(`minutes ${lesson.minutes}, the original ${original.minutes}`, at);
    if (JSON.stringify(lesson.practice) !== JSON.stringify(original.practice)) fail('practice link differs from the original', at);
    if (lesson.check.map((q) => q.answer).join() !== original.check.map((q) => q.answer).join()) fail('check keys differ from the original', at);
  }
  return issues;
}
