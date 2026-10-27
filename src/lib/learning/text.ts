/**
 * Sentences the learning modules write for the learner (readiness, study
 * plan, suggestions, dashboard steps), kept as a message key in the
 * `learning` catalogue plus its values, and translated where they are shown.
 *
 * - A `Msg` is translated: `{ key: 'readiness.limitations.noPercentiles' }`.
 * - A plain string is data shown exactly as published (an exam config's own
 *   caveat, a domain name), never translated.
 * - An array is several sentences, shown one after another.
 *
 * A value may itself be a Msg (rendered first), or a list of Msgs (rendered
 * and joined with commas, as a short list of conditions).
 */

export type TextValue = string | number | Msg | Msg[];

export interface Msg {
  key: string;
  values?: Record<string, TextValue>;
}

export type LearnerText = Msg | string | LearnerText[];

export function msg(key: string, values?: Record<string, TextValue>): Msg {
  return values ? { key, values } : { key };
}

export type Translate = (key: string, values?: Record<string, string | number>) => string;

/** The text in the reader's language, from the page's `learning` translator. */
export function renderText(t: Translate, text: LearnerText): string {
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) return text.map((part) => renderText(t, part)).filter(Boolean).join(' ');
  if (!text.values) return t(text.key);
  const values: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(text.values)) {
    values[name] =
      typeof value === 'string' || typeof value === 'number'
        ? value
        : Array.isArray(value)
          ? value.map((part) => renderText(t, part)).join(', ')
          : renderText(t, value);
  }
  return t(text.key, values);
}

/**
 * For a database column: a message is stored as JSON, so it can be shown in
 * any language later. Text stored before messages existed reads back as is.
 */
export function encodeText(text: LearnerText): string {
  return typeof text === 'string' ? text : JSON.stringify(text);
}

export function decodeText(stored: string): LearnerText {
  if (!stored.startsWith('{') && !stored.startsWith('[')) return stored;
  try {
    const parsed = JSON.parse(stored) as unknown;
    return isLearnerText(parsed) ? parsed : stored;
  } catch {
    return stored;
  }
}

function isLearnerText(value: unknown): value is LearnerText {
  if (typeof value === 'string') return true;
  if (Array.isArray(value)) return value.every(isLearnerText);
  return !!value && typeof value === 'object' && typeof (value as Msg).key === 'string';
}
