/**
 * The two inputs a learner gives a study plan, read from a form or an
 * address. Pure, so the preview page and the form action read them the same
 * way.
 */

/** The weekly times offered, in minutes. */
export const MINUTE_CHOICES = [60, 90, 120, 150, 180, 240, 300, 420] as const;
export const DEFAULT_WEEKLY_MINUTES = 150;
const MAX_YEARS_AHEAD = 3;

/** 15 minutes to 28 hours a week: anything outside that is a typo, not a plan. */
export function parseWeeklyMinutes(value: string | null | undefined): number | null {
  if (!value || !/^\d{1,4}$/.test(value)) return null;
  const minutes = Number(value);
  return minutes >= 15 && minutes <= 1680 ? minutes : null;
}

/**
 * An exam date: empty means none; otherwise a real calendar date after today
 * (UTC) and within three years. Anything else is 'invalid', never guessed at.
 */
export function parsePlanDate(value: string | null | undefined, now = new Date()): string | null | 'invalid' {
  const trimmed = (value ?? '').trim();
  if (trimmed === '') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return 'invalid';
  const time = Date.parse(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== trimmed) return 'invalid';
  const today = now.toISOString().slice(0, 10);
  if (trimmed <= today) return 'invalid';
  const limit = new Date(now);
  limit.setUTCFullYear(limit.getUTCFullYear() + MAX_YEARS_AHEAD);
  if (time > limit.getTime()) return 'invalid';
  return trimmed;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * A day for display, e.g. "Sat 3 Oct" (or "Sat 3 Oct 2026"). Calendar dates
 * are UTC days. English is spelled out here rather than by the locale, whose
 * short forms ("Sept", a comma after the weekday) vary between runtimes;
 * other languages use their own short forms ("sab 3 ott").
 */
export function formatDay(day: string, locale = 'en', withYear = false): string {
  const date = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return day;
  if (locale !== 'en') {
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      ...(withYear ? { year: 'numeric' as const } : {}),
      timeZone: 'UTC',
    });
  }
  const text = `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
  return withYear ? `${text} ${date.getUTCFullYear()}` : text;
}

/** A date in full, "3 October 2026", in the reader's language. */
export function formatDate(day: string, locale = 'en'): string {
  const date = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return day;
  return date.toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
