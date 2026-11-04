import type { BrowseTree } from '@/lib/content/browse';

/**
 * Where the site's side panels (browse, and the study plan) appear. They run
 * in the browser too, so nothing here may import the exam registry.
 *
 * Left out:
 *  - the test itself (a session, the free test, onboarding before one): a
 *    learner in a timed section should see the questions and nothing else;
 *  - the home and plans pages, which are built as full-width landing pages;
 *  - sign-in, sign-up and checkout, where one form is the whole task;
 *  - the staff area, whose tables need the width.
 * A session's results, and every exam, guide and learner page, keep them.
 */
const WITHOUT_PANELS: readonly RegExp[] = [
  /^\/$/,
  /^\/pricing(?:\/|$)/,
  /^\/attempt\/[^/]+\/?$/,
  /^\/free-test(?:\/|$)/,
  /^\/start(?:\/|$)/,
  /^\/checkout(?:\/|$)/,
  /^\/(?:sign-in|sign-up|forgot-password|verify-email)(?:\/|$)/,
  /^\/admin(?:\/|$)/,
];

/** True when the page (its path without the locale prefix) shows the side panels. */
export function showsPanels(pathname: string): boolean {
  return !WITHOUT_PANELS.some((pattern) => pattern.test(pathname));
}

/**
 * The hub the page belongs to, so its group opens: one of its own pages, or
 * practice for one of its tests.
 */
export function hubForPath(pathname: string, tree: BrowseTree): string | null {
  const exam = /^\/exams\/([^/]+)/.exec(pathname)?.[1];
  if (exam && tree.hubs.some((hub) => hub.slug === exam)) return exam;
  const config = /^\/practice\/([^/]+)/.exec(pathname)?.[1];
  if (!config) return null;
  const key = safeDecode(config);
  return tree.hubs.find((hub) => hub.configKeys.includes(key))?.slug ?? null;
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
