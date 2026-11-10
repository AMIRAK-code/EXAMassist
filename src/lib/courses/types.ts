/**
 * Study courses: teaching material laid out as course → units → lessons.
 *
 * A lesson teaches one idea the exam tests, works original examples step by
 * step, names the traps that cost marks, and ends with a short check whose
 * answers are hidden until the reader opens them. Every lesson links into
 * the matching topic practice in the app.
 *
 * Courses are free, public pages (src/lib/billing/plans.ts, `guides`): they
 * are teaching, like the guides, and the paid part stays the practice they
 * link to. They are served as static files after a deploy
 * (src/lib/seo/static-pages.ts), so nothing on them may depend on the visitor.
 *
 * Text is Markdown with KaTeX maths ($...$ inline, $$...$$ displayed),
 * rendered by src/lib/markdown.ts. Lesson files write it with String.raw
 * (`md` below) so that TeX backslashes stay as written. Content is English;
 * the interface around it is translated (messages/<locale>/courses.json).
 *
 * Review states (docs/COURSE-AUTHORING.md): a lesson is drafted with AI
 * assistance, then every worked example and check question is re-solved by
 * an independent checker, which records `review.independentCheckOn`. Only a
 * lesson with that date is published. `expertReview` stays null until a
 * named human reviewer is recorded; pages never claim a review that has not
 * happened.
 */

import type { SampleQuestion } from '@/lib/content/guides';

/** Markdown with TeX: String.raw, so `\frac` stays `\frac`. */
export const md = String.raw;

export type CourseSlug = 'gre' | 'gmat' | 'bocconi' | 'bocconi-master' | 'tolc-i';

export interface CourseSource {
  label: string;
  url: string;
  publisher: string;
}

/** Where a lesson's practice lives: /practice/<examKey>?domain=<domain>&skill=<skill>. */
export interface PracticeLink {
  examKey: string;
  /** A domain slug of that exam's config (src/lib/exams/configs). */
  domain: string;
  /** A skill slug inside that domain, when the lesson is about one skill. */
  skill?: string;
}

export interface WorkedExample {
  /** Anchor id, unique within the lesson. */
  id: string;
  title: string;
  /** The problem as the learner would meet it. */
  problemMd: string;
  /** One step per entry, in order; each says what to do and why. */
  steps: string[];
  /** The result, stated plainly. */
  answerMd: string;
}

export interface Trap {
  title: string;
  /** What the trap looks like, why it catches people, and how to avoid it. */
  md: string;
}

/**
 * A short-check question. The same shape as a guide's sample question, so a
 * wrong option always says why it is tempting and why it is wrong.
 */
export type CheckQuestion = SampleQuestion;

export interface LessonReview {
  /** Always true: lessons are drafted with AI assistance, and the page says so. */
  aiAssisted: true;
  /**
   * The day an independent checker re-derived every worked example and solved
   * every check question without the key, and they all agreed. Null while a
   * lesson waits for that check; such a lesson is not published.
   */
  independentCheckOn: string | null;
  /** A named human expert's review. None has happened; recorded only when it does. */
  expertReview: null;
}

export interface Lesson {
  /** URL slug, unique within the course: /courses/<course>/<slug>. */
  slug: string;
  title: string;
  /** One or two sentences: the lesson's promise. Used as the meta description (≤ 160 characters). */
  summary: string;
  /** Honest time to read the lesson and work the check, in minutes. */
  minutes: number;
  /** What the reader can do after the lesson, 2–4 short statements. */
  objectives: string[];
  /** The teaching: Markdown, subheadings at ### so they sit under the page's own headings. */
  teachMd: string;
  examples: WorkedExample[];
  traps: Trap[];
  check: CheckQuestion[];
  /** 3–5 one-line takeaways. */
  takeaways: string[];
  practice: PracticeLink;
  review: LessonReview;
}

export interface Unit {
  /** Anchor id on the course page, unique within the course. */
  slug: string;
  title: string;
  /** One paragraph: what the unit covers and where it sits in the exam. */
  summary: string;
  lessons: Lesson[];
}

export interface Course {
  slug: CourseSlug;
  title: string;
  /** For search results when `title` runs long. */
  metaTitle: string;
  /** Meta description, at most about 160 characters. */
  description: string;
  /** The exam config every practice link of the course belongs to. */
  examKeys: string[];
  /** The exam hub the course prepares for: /exams/<hubSlug>. */
  hubSlug: string;
  /** Markdown: who the course is for, what the exam is, how to use the course. */
  introMd: string;
  /** Who publishes the exam, as they name themselves. */
  examPublisher: string;
  publishedOn: string;
  /** Changes only when the substance changes. */
  updatedOn: string;
  /** Official sources for every fact about the exam the course states. */
  sources: CourseSource[];
  units: Unit[];
  /**
   * An interactive mind map of the course on its page
   * (src/components/courses/course-mind-map.tsx): the test in the centre,
   * the units as branches, lessons as leaves.
   */
  mindMap?: {
    /** The centre node: the test's name, short. */
    centre: string;
    /** Under it: the test in a few words ("50 questions · 75 minutes"). */
    centreNote: string;
    /** Per unit slug, a short line under the branch title ("24 questions"). */
    branchNotes?: Record<string, string>;
  };
}
