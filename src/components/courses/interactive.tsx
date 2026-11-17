'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { buttonClass, cx } from '@/components/ui';

/*
 * The interactive parts of a lesson in an interactive course (Course.interactive):
 * checks answered by selecting an option, worked examples revealed one step at
 * a time, flip-card decks, and progress kept in the reader's browser.
 *
 * Lesson pages are static files shared by every visitor, so every piece of
 * text reaches these components already rendered by the server (Markdown and
 * KaTeX) and is in the HTML. Until script runs they render everything open
 * (all steps, every card as a list, solutions in native <details>), so the
 * page reads in full without it. Nothing here is sent anywhere; progress
 * lives in localStorage and is lost with the browser's data.
 */

// ---------------------------------------------------------------------------
// Progress in this browser
// ---------------------------------------------------------------------------

const PROGRESS_EVENT = 'uniexamer:course-progress';
const progressKey = (course: string) => `uniexamer:course-progress:${course}`;
const EMPTY: readonly string[] = [];
const snapshots = new Map<string, { raw: string | null; value: readonly string[] }>();

function readProgress(course: string): readonly string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(progressKey(course));
  } catch {
    return EMPTY;
  }
  // useSyncExternalStore needs the same array back while nothing has changed.
  const cached = snapshots.get(course);
  if (cached && cached.raw === raw) return cached.value;
  let value: readonly string[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed.filter((slug): slug is string => typeof slug === 'string');
  } catch {
    value = EMPTY;
  }
  snapshots.set(course, { raw, value });
  return value;
}

function writeProgress(course: string, slugs: readonly string[]): void {
  try {
    window.localStorage.setItem(progressKey(course), JSON.stringify([...new Set(slugs)]));
  } catch {
    // Storage blocked (private mode, site data off): progress simply is not kept.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(PROGRESS_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** The lessons of a course marked complete in this browser; empty on the server. */
function useProgress(course: string): readonly string[] {
  return useSyncExternalStore(
    subscribe,
    () => readProgress(course),
    () => EMPTY,
  );
}

/** On a lesson page: mark the lesson complete, or not. */
export function LessonCompleteToggle({ course, lesson, labels }: { course: string; lesson: string; labels: { mark: string; done: string; undo: string } }) {
  const done = useProgress(course).includes(lesson);
  const toggle = () => {
    const current = readProgress(course);
    writeProgress(course, done ? current.filter((slug) => slug !== lesson) : [...current, lesson]);
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={toggle} aria-pressed={done} className={buttonClass({ variant: done ? 'secondary' : 'primary' })}>
        {done ? `✓ ${labels.done}` : labels.mark}
      </button>
      {done ? <span className="text-sm text-ink-muted">{labels.undo}</span> : null}
    </div>
  );
}

/** On a course page: how many lessons are complete in this browser. */
export function CourseProgressSummary({ course, lessons, label, empty }: { course: string; lessons: string[]; label: string; empty: string }) {
  const progress = useProgress(course);
  const done = lessons.filter((slug) => progress.includes(slug)).length;
  const percent = Math.round((done / Math.max(1, lessons.length)) * 100);
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ink-muted">{done === 0 ? empty : label}</span>
        <span className="font-medium tabular-nums">
          {done} / {lessons.length}
        </span>
      </div>
      <div role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={lessons.length} aria-label={label} className="h-2 overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/** Beside a lesson in the course contents: a tick once it is complete in this browser. */
export function LessonDoneTick({ course, lesson, label }: { course: string; lesson: string; label: string }) {
  const done = useProgress(course).includes(lesson);
  if (!done) return null;
  return (
    <span className="ms-2 inline-flex items-center rounded-full bg-positive-soft px-2 py-0.5 text-xs font-semibold text-positive">
      <span aria-hidden="true">✓</span>
      <span className="ms-1">{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Worked examples, one step at a time
// ---------------------------------------------------------------------------

export function StepReveal({
  steps,
  answer,
  labels,
}: {
  steps: ReactNode[];
  answer: ReactNode;
  labels: { next: string; all: string; hide: string; tryFirst: string; answer: string; progress: string };
}) {
  // Every step is in the HTML; before hydration all are shown, then the reader reveals them.
  const [hydrated, setHydrated] = useState(false);
  const [shown, setShown] = useState(steps.length);
  useEffect(() => {
    setHydrated(true);
    setShown(0);
  }, []);
  const complete = shown >= steps.length;
  return (
    <div className="mt-4">
      {hydrated && shown === 0 ? <p className="text-sm text-ink-muted">{labels.tryFirst}</p> : null}
      <ol className="mt-2 space-y-3 border-s-2 border-line ps-4 font-serif">
        {steps.map((step, index) => (
          <li key={index} hidden={index >= shown} className="flex gap-3">
            <span aria-hidden="true" className="shrink-0 font-sans text-sm font-semibold tabular-nums text-ink-subtle">
              {index + 1}.
            </span>
            <div className="min-w-0 flex-1">{step}</div>
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-md bg-accent-soft px-4 py-3" hidden={!complete}>
        <p className="font-sans text-sm font-semibold text-accent-ink">{labels.answer}</p>
        <div className="mt-1">{answer}</div>
      </div>
      {hydrated ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!complete ? (
            <>
              <button type="button" className={buttonClass({ size: 'sm' })} onClick={() => setShown((n) => n + 1)}>
                {labels.next}
              </button>
              <button type="button" className={buttonClass({ size: 'sm', variant: 'quiet' })} onClick={() => setShown(steps.length)}>
                {labels.all}
              </button>
            </>
          ) : (
            <button type="button" className={buttonClass({ size: 'sm', variant: 'quiet' })} onClick={() => setShown(0)}>
              {labels.hide}
            </button>
          )}
          <span className="text-sm tabular-nums text-ink-subtle" aria-live="polite">
            {labels.progress.replace('{shown}', String(Math.min(shown, steps.length))).replace('{total}', String(steps.length))}
          </span>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checks with instant feedback
// ---------------------------------------------------------------------------

interface ScoreContext {
  report: (id: string, correct: boolean) => void;
  round: number;
}

const Score = createContext<ScoreContext | null>(null);

/** Around a lesson's check: keeps the score and offers a fresh attempt. */
export function CheckScoreboard({
  total,
  children,
  labels,
}: {
  total: number;
  children: ReactNode;
  labels: { score: string; perfect: string; retry: string };
}) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [round, setRound] = useState(0);
  const report = useCallback((id: string, correct: boolean) => setResults((r) => (id in r ? r : { ...r, [id]: correct })), []);
  const value = useMemo(() => ({ report, round }), [report, round]);
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  return (
    <Score.Provider value={value}>
      {children}
      {answered === total ? (
        <div role="status" className="mt-6 flex flex-wrap items-center gap-4 rounded-card border border-line-strong bg-surface p-5">
          <p className="font-heading text-lg font-semibold">
            {labels.score.replace('{correct}', String(correct)).replace('{total}', String(total))}
            {correct === total ? <span className="ms-2 font-sans text-base font-normal text-positive">{labels.perfect}</span> : null}
          </p>
          <button
            type="button"
            className={buttonClass({ size: 'sm', variant: 'secondary' })}
            onClick={() => {
              setResults({});
              setRound((n) => n + 1);
            }}
          >
            {labels.retry}
          </button>
        </div>
      ) : null}
    </Score.Provider>
  );
}

export interface InteractiveOption {
  id: string;
  text: ReactNode;
  note: ReactNode;
}

/**
 * A check question's options as buttons: the first choice is final, marks
 * itself right or wrong at once with its own note, and opens the full
 * solution. The static list and the solution's <details> stay in the HTML for
 * readers without script.
 */
export function InteractiveOptions({
  questionId,
  options,
  answer,
  solution,
  labels,
}: {
  questionId: string;
  options: InteractiveOption[];
  answer: string;
  solution: ReactNode;
  labels: { group: string; correct: string; wrong: string; theAnswer: string; showSolution: string; hideSolution: string };
}) {
  const score = useContext(Score);
  const [chosen, setChosen] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const details = useRef<HTMLDetailsElement>(null);
  const round = score?.round ?? 0;
  useEffect(() => {
    setChosen(null);
    if (details.current) details.current.open = false;
  }, [round]);

  const choose = (id: string) => {
    if (chosen) return;
    setChosen(id);
    score?.report(questionId, id === answer);
    if (details.current) details.current.open = true;
  };
  const key = options.find((option) => option.id === answer);
  const picked = options.find((option) => option.id === chosen);

  return (
    <div className="mt-4">
      <div role="group" aria-label={labels.group} className="space-y-2 font-serif">
        {options.map((option) => {
          const isKey = option.id === answer;
          const state = !chosen ? 'idle' : isKey ? 'key' : option.id === chosen ? 'wrong' : 'other';
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option.id)}
              aria-disabled={chosen ? true : undefined}
              aria-pressed={option.id === chosen}
              className={cx(
                'flex w-full gap-3 rounded-md border px-3 py-2 text-start transition-colors',
                state === 'idle' && 'border-line hover:border-accent hover:bg-accent-soft',
                state === 'key' && 'border-positive-line bg-positive-soft',
                state === 'wrong' && 'border-negative-line bg-negative-soft',
                state === 'other' && 'border-line opacity-70',
              )}
            >
              <span className="font-semibold">{option.id}.</span>
              <span className="min-w-0 flex-1">{option.text}</span>
              {state === 'key' ? (
                <span aria-hidden="true" className="font-sans font-semibold text-positive">
                  ✓
                </span>
              ) : null}
              {state === 'wrong' ? (
                <span aria-hidden="true" className="font-sans font-semibold text-negative">
                  ✗
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {picked ? (
          <div className={cx('mt-4 rounded-md border px-4 py-3', picked.id === answer ? 'border-positive-line bg-positive-soft' : 'border-negative-line bg-negative-soft')}>
            <p className={cx('font-semibold', picked.id === answer ? 'text-positive' : 'text-negative')}>{picked.id === answer ? labels.correct : labels.wrong}</p>
            {picked.id !== answer ? (
              <>
                <div className="mt-1 font-serif">{picked.note}</div>
                <p className="mt-2 font-serif">
                  <span className="font-semibold">{labels.theAnswer.replace('{option}', answer)}</span> {key?.text}
                </p>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* A native <details>: readable without script, and opened for the reader once they have answered. */}
      <details
        ref={details}
        className="sample-answer mt-5 rounded-md border border-line-strong"
        onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer px-4 py-3 font-semibold text-accent">{open ? labels.hideSolution : labels.showSolution}</summary>
        <div className="border-t border-line px-4 pb-4">{solution}</div>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------

export function FlashcardDeck({
  cards,
  labels,
}: {
  cards: Array<{ front: ReactNode; back: ReactNode }>;
  labels: { flip: string; front: string; back: string; again: string; known: string; position: string; finished: string; restart: string; reviewMissed: string; shuffle: string };
}) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const finished = position >= order.length;
  const current = order[position];
  const advance = (knewIt: boolean) => {
    if (!knewIt) setMissed((m) => [...m, current]);
    setFlipped(false);
    setPosition((p) => p + 1);
  };
  const restart = (cardsToShow: number[]) => {
    setOrder(cardsToShow);
    setMissed([]);
    setPosition(0);
    setFlipped(false);
  };
  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    restart(next);
  };

  if (!hydrated) {
    // Before script runs, and without it: every card, both sides, as a list.
    return (
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((card, index) => (
          <div key={index} className="rounded-card border border-line bg-surface p-4">
            <dt className="font-semibold">{card.front}</dt>
            <dd className="mt-2 font-serif text-ink-muted">{card.back}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (finished) {
    const known = order.length - missed.length;
    return (
      <div role="status" className="mt-4 rounded-card border border-line-strong bg-surface p-6 text-center">
        <p className="font-heading text-lg font-semibold">{labels.finished.replace('{known}', String(known)).replace('{total}', String(order.length))}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {missed.length > 0 ? (
            <button type="button" className={buttonClass({ size: 'sm' })} onClick={() => restart(missed)}>
              {labels.reviewMissed.replace('{count}', String(missed.length))}
            </button>
          ) : null}
          <button type="button" className={buttonClass({ size: 'sm', variant: 'secondary' })} onClick={() => restart(cards.map((_, i) => i))}>
            {labels.restart}
          </button>
        </div>
      </div>
    );
  }

  const card = cards[current];
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-sm text-ink-subtle">
        <span className="tabular-nums" aria-live="polite">
          {labels.position.replace('{n}', String(position + 1)).replace('{total}', String(order.length))}
        </span>
        <button type="button" className="font-semibold text-accent hover:underline" onClick={shuffle}>
          {labels.shuffle}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${flipped ? labels.back : labels.front}. ${labels.flip}`}
        className="group block w-full [perspective:1200px]"
      >
        {/* Both faces share one grid cell, so the card is as tall as its longer side. */}
        <span
          className={cx(
            'grid w-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none',
            flipped && '[transform:rotateY(180deg)]',
          )}
        >
          <span
            aria-hidden={flipped}
            className="flex min-h-48 flex-col items-center justify-center rounded-card border-2 border-line-strong bg-surface p-6 text-center [backface-visibility:hidden] [grid-area:1/1] group-hover:border-accent"
          >
            <span className="eyebrow text-ink-subtle">{labels.front}</span>
            <span className="mt-2 font-heading text-xl font-semibold">{card.front}</span>
            <span className="mt-4 text-sm text-ink-subtle">{labels.flip}</span>
          </span>
          <span
            aria-hidden={!flipped}
            className="flex min-h-48 flex-col items-center justify-center rounded-card border-2 border-accent bg-accent-soft p-6 text-center [backface-visibility:hidden] [grid-area:1/1] [transform:rotateY(180deg)]"
          >
            <span className="eyebrow text-accent-ink">{labels.back}</span>
            <span className="mt-2 font-serif text-lg">{card.back}</span>
          </span>
        </span>
      </button>
      <div className="mt-4 flex flex-wrap justify-center gap-3" hidden={!flipped}>
        <button type="button" className={buttonClass({ size: 'sm', variant: 'secondary' })} onClick={() => advance(false)}>
          {labels.again}
        </button>
        <button type="button" className={buttonClass({ size: 'sm' })} onClick={() => advance(true)}>
          {labels.known}
        </button>
      </div>
    </div>
  );
}
