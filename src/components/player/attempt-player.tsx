'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Response } from '@/lib/assessment/types';
import type { PlayerItem, PlayerModel } from '@/lib/attempts/view-model';
import { formatRemaining } from '@/lib/assessment/timing';
import type { ServerItem } from '@/lib/player/pending';
import { StimulusView } from '@/components/stimulus-view';
import { Alert, Badge, Button, FidelityBadge, cx } from '@/components/ui';
import { ResponseInput } from './response-input';
import { SaveIndicator } from './save-indicator';
import { postJson, usePendingSaves } from './use-pending-saves';

/**
 * The practice and exam player.
 *
 * Principles:
 * - The server owns the clock and the rules. The countdown here is display
 *   only; every save is validated server-side and can be rejected.
 * - Every answer and move is kept on the device until the server confirms
 *   it (use-pending-saves.ts), so a reload or a dropped connection loses
 *   nothing the server would still accept, and the save status shown is
 *   what the server has actually confirmed.
 * - Navigation controls reflect the exam's real policy, and the server rejects
 *   an illegal move even if the UI were bypassed.
 * - Focus mode: no site header or footer, the controls in a bar that does
 *   not move, and a passage beside its question on a wide screen.
 */

interface Notice {
  tone: 'info' | 'caution' | 'negative';
  text: string;
  link?: { href: string; label: string };
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const TYPING: ReadonlySet<PlayerItem['responseType']> = new Set(['numeric_entry', 'essay']);
/** Typing is sent once it pauses for this long (and at once on leaving the question). */
const TYPING_DEBOUNCE_MS = 800;

export function AttemptPlayer({ model, owner }: { model: PlayerModel; owner: string }) {
  const router = useRouter();
  const part = model.parts[model.currentPartIndex];

  // Reopen where the learner was. The server has already checked the stored
  // position against this section's rules and replaced it if it is no longer
  // allowed (a committed screen, a section that has closed).
  const [position, setPosition] = useState(() =>
    model.resume && model.resume.partIndex === model.currentPartIndex ? model.resume.position : 0,
  );
  const [responses, setResponses] = useState<Record<number, Response | null>>(() =>
    Object.fromEntries(part?.items.map((item) => [item.position, item.response]) ?? []),
  );
  const [feedback, setFeedback] = useState<Record<number, boolean>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(part?.items.map((item) => [item.position, item.flagged]) ?? []),
  );
  // Items whose explanation has been shown. The server is the authority; this
  // mirrors it so the controls lock at once rather than after a refresh.
  const [locked, setLocked] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(part?.items.map((item) => [item.position, item.locked]) ?? []),
  );
  const [notice, setNotice] = useState<Notice | null>(null);
  const [remaining, setRemaining] = useState<number | null>(part?.remainingSeconds ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [moving, setMoving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  const itemEnteredAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigatorRef = useRef<HTMLOListElement>(null);

  // After a refresh asked for by a reply (an answer locked elsewhere, a move
  // the server refused), take the server's view of the section again.
  const resyncing = useRef(false);
  const resync = () => {
    resyncing.current = true;
    router.refresh();
  };

  const saves = usePendingSaves({
    attemptId: model.attemptId,
    owner,
    partIndex: part?.partIndex ?? 0,
    serverNowMs: model.serverNowMs,
    events: {
      onReplaced(at, current, isLocked) {
        setResponses((all) => ({ ...all, [at]: current }));
        setNotice({
          tone: 'info',
          text: isLocked
            ? `Question ${at + 1} was checked in another tab or on another device, so its answer is locked. The checked answer is shown here.`
            : `Question ${at + 1} was answered again in another tab or on another device after this change. The newer answer is kept, and shown here.`,
        });
        if (isLocked) {
          setLocked((all) => ({ ...all, [at]: true }));
          resync();
        }
      },
      onLocked(at, text) {
        setLocked((all) => ({ ...all, [at]: true }));
        setNotice({ tone: 'caution', text });
        resync();
      },
      onClosed(lost, text) {
        setNotice({
          tone: 'caution',
          text: lost > 0 ? `${text} ${plural(lost, 'answer')} made on this device could not be saved.` : text,
        });
        // The server moves on: to the next section, or to the results.
        router.refresh();
      },
      onRefused(at, text) {
        setNotice({ tone: 'negative', text: at === null ? text : `Question ${at + 1}: ${text}` });
        if (at === null) resync();
      },
      onSignedOut() {
        setNotice({
          tone: 'negative',
          text: 'You are signed out, so nothing more can be saved from this page. Answers not yet saved are kept on this device for your account, and are sent when you sign in again and reopen this session.',
          link: { href: `/sign-in?next=/attempt/${model.attemptId}`, label: 'Sign in again' },
        });
      },
      onNotFound() {
        setNotice({
          tone: 'negative',
          text: 'This session is not available to the account now signed in, so nothing more will be sent from this page.',
          link: { href: '/dashboard', label: 'Go to your dashboard' },
        });
      },
    },
  });

  // --- Opening: what this device kept, sorted against the server ------------
  const opened = useRef(false);
  useEffect(() => {
    if (!saves.ready || opened.current || !part) return;
    opened.current = true;
    const server: ServerItem[] = model.parts.flatMap((p) =>
      p.items.map((item) => ({
        partIndex: p.partIndex,
        position: item.position,
        response: item.response,
        responseClock: item.responseClock,
        locked: item.locked,
      })),
    );
    const result = saves.open({ currentPartIndex: part.partIndex, items: server, resumeClock: model.resumeClock });
    if (!result) return;
    if (result.replay.length > 0) {
      setResponses((all) => ({ ...all, ...Object.fromEntries(result.replay.map((a) => [a.position, a.response])) }));
    }
    // A move that had not reached the server: make it, if it is one the
    // rules allow from here without asking (the server checks it again).
    if (result.move && result.move.position !== position && isFree(result.move.position)) {
      setPosition(result.move.position);
    }
    if (result.lost.length > 0) {
      const closedSection = result.lost.some((a) => a.partIndex !== part.partIndex);
      setNotice({
        tone: 'caution',
        text: closedSection
          ? `${plural(result.lost.length, 'answer')} made on this device did not reach the server before the previous section closed, so ${result.lost.length === 1 ? 'it does' : 'they do'} not count.`
          : `${plural(result.lost.length, 'answer')} made on this device could not be saved, because the question was checked in another tab first.`,
      });
    }
    // Opening runs once, when the device's store is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saves.ready]);

  useEffect(() => {
    if (!resyncing.current || !part) return;
    resyncing.current = false;
    const waiting = saves.status.unsavedPositions;
    setResponses((all) =>
      Object.fromEntries(part.items.map((item) => [item.position, waiting.has(item.position) ? all[item.position] ?? null : item.response])),
    );
    setLocked(Object.fromEntries(part.items.map((item) => [item.position, item.locked])));
    setFlags(Object.fromEntries(part.items.map((item) => [item.position, item.flagged])));
    if (model.resume && model.resume.partIndex === part.partIndex) setPosition(model.resume.position);
    // Only after a refresh this player asked for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const item = part?.items[position];
  const policy = part?.navigation;
  const pageSize = policy?.pageSize ?? 1;
  const currentPage = Math.floor(position / pageSize);
  const pageStart = currentPage * pageSize;
  const pageItems = part ? part.items.slice(pageStart, pageStart + pageSize) : [];
  const answeredCount = part ? part.items.filter((i) => responses[i.position] != null).length : 0;
  const timed = part?.deadlineAt != null;

  function isFree(target: number): boolean {
    return !!policy && (policy.allowBackWithinPart || Math.floor(target / pageSize) === currentPage);
  }

  // --- Clock ---------------------------------------------------------------
  // Purely a display of the server's deadline. When it reaches zero we ask the
  // server what actually happened rather than deciding locally.
  useEffect(() => {
    if (part?.deadlineAt == null) return;
    const deadline = new Date(part.deadlineAt).getTime();
    let asked = false;
    // Offline, a refresh would fail (or show the browser's offline page), so
    // it waits for the connection. The server decides what the clock meant.
    const ask = () => {
      if (asked || navigator.onLine === false) return;
      asked = true;
      router.refresh();
    };
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) ask();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    const online = () => {
      if (Date.now() >= deadline) ask();
    };
    window.addEventListener('online', online);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('online', online);
    };
  }, [part?.deadlineAt, router]);

  // Move focus to the question heading on navigation, so screen reader and
  // keyboard users land in the right place instead of at the top of the page.
  const firstPosition = useRef(true);
  useEffect(() => {
    itemEnteredAt.current = Date.now();
    navigatorRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (firstPosition.current) {
      firstPosition.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [position]);

  // Warn before leaving when leaving would cost something: a timed section's
  // clock keeps running, and answers held only in this page (the device's
  // storage being unavailable) would be lost.
  const unsavedInPageOnly = !saves.status.durable && saves.status.unsaved > 0;
  useEffect(() => {
    const clockRuns = model.pauseBehaviour === 'clock_runs' && model.status === 'in_progress';
    if (!clockRuns && !unsavedInPageOnly) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [model.pauseBehaviour, model.status, unsavedInPageOnly]);

  // --- Answering -------------------------------------------------------------
  const takeElapsed = () => {
    const elapsed = Math.max(0, Date.now() - itemEnteredAt.current);
    itemEnteredAt.current = Date.now();
    return elapsed;
  };

  const handleChange = (response: Response | null) => {
    if (!item) return;
    setResponses((current) => ({ ...current, [item.position]: response }));
    saves.answer(item.position, response, takeElapsed(), TYPING.has(item.responseType) ? TYPING_DEBOUNCE_MS : 0);
  };

  /**
   * Untimed practice: submit the current answer and release its explanation.
   * The server persists both in one write and refuses any later change, so
   * the controls lock here too.
   */
  const checkAnswer = async () => {
    if (!part || !item || checking) return;
    const response = responses[item.position] ?? null;
    if (!response) return;
    const target = item.position;
    setChecking(true);
    const reply = await saves.check(target, response, takeElapsed());
    setChecking(false);

    if (reply.kind === 'offline') {
      setNotice({
        tone: 'caution',
        text: 'You are offline, so this answer cannot be checked yet. It is kept on this device and saved when the connection returns; check it then.',
      });
      return;
    }
    if (reply.kind === 'retry') {
      setNotice({ tone: 'negative', text: 'The answer could not be checked just now. It is kept on this device; try again in a moment.' });
      return;
    }
    if (reply.kind !== 'saved') return; // the saving hook has reported it
    if (reply.stale) {
      setResponses((all) => ({ ...all, [target]: reply.current }));
      setNotice({
        tone: 'info',
        text: `Question ${target + 1} was answered again in another tab or on another device, so it was not checked. The newer answer is shown.`,
      });
      return;
    }
    setNotice(null);
    setLocked((current) => ({ ...current, [target]: true }));
    const correct = (reply.data as { feedback?: { correct?: boolean } } | null)?.feedback?.correct;
    if (typeof correct === 'boolean') setFeedback((current) => ({ ...current, [target]: correct }));
    // The explanation is rendered on the server.
    router.refresh();
  };

  // --- Moving ----------------------------------------------------------------
  const go = async (target: number) => {
    if (!part || target < 0 || target >= part.items.length || moving) return;

    // A move the rules always allow (anywhere in a free section, or within the
    // current screen) happens at once. It is kept on the device and sent
    // behind it, so a reload straight after still reopens here.
    if (isFree(target)) {
      setPosition(target);
      saves.move(target);
      return;
    }

    // Moving to another screen on a section that restricts navigation commits
    // the current one, so its answers must reach the server first, and the
    // server decides before the screen changes.
    setMoving(true);
    const flushed = await saves.flush();
    if (flushed !== 'saved') {
      setMoving(false);
      setNotice({
        tone: 'caution',
        text:
          flushed === 'offline'
            ? `You are offline. Moving on closes this screen for good, so it needs the connection. Your answers are kept on this device; move on when you are back online.${timed ? ' The timer keeps running.' : ''}`
            : 'The answers on this screen could not all be saved yet, so this screen stays open. Try again in a moment.',
      });
      return;
    }
    const { status, data } = await postJson(`/api/attempts/${model.attemptId}/visit`, {
      partIndex: part.partIndex,
      position: target,
      clock: saves.nextClock(),
    });
    setMoving(false);
    if (status === 0) {
      setNotice({ tone: 'caution', text: 'The connection dropped before the server confirmed the move, so this screen stays open. Try again.' });
      return;
    }
    if (status < 200 || status >= 300) {
      setNotice({ tone: 'negative', text: data?.error?.message ?? 'You cannot move there on this exam.' });
      const code = data?.error?.code;
      if (code === 'attempt-closed' || code === 'wrong-part' || code === 'part-expired') router.refresh();
      return;
    }
    setNotice(null);
    setPosition(target);
  };

  const toggleFlag = async () => {
    if (!item || !part) return;
    const at = item.position;
    const next = !flags[at];
    setFlags((current) => ({ ...current, [at]: next }));
    const { status, data } = await postJson(`/api/attempts/${model.attemptId}/flag`, {
      partIndex: part.partIndex,
      position: at,
      flagged: next,
    });
    if (status >= 200 && status < 300) return;
    setFlags((current) => ({ ...current, [at]: !next }));
    setNotice({
      tone: status === 0 ? 'caution' : 'negative',
      text: status === 0 ? 'Marking a question needs the connection. Try again when you are back online.' : (data?.error?.message ?? 'That question could not be marked.'),
    });
  };

  const submitCurrentPart = async () => {
    if (!part || submitting) return;
    setSubmitting(true);
    // Every answer must reach the server before the section closes.
    const flushed = await saves.flush();
    if (flushed !== 'saved') {
      setSubmitting(false);
      if (flushed !== 'halted') {
        setNotice({
          tone: 'caution',
          text:
            flushed === 'offline'
              ? `You are offline, so this section has not been submitted. Your answers are kept on this device; submit when the connection returns.${timed ? ' The timer keeps running.' : ''}`
              : 'Some answers could not be saved yet, so this section has not been submitted. Try again in a moment.',
        });
      }
      return;
    }
    const { status, data } = await postJson(`/api/attempts/${model.attemptId}/submit-part`, { partIndex: part.partIndex });
    setSubmitting(false);
    if (status === 0) {
      setNotice({ tone: 'caution', text: 'The connection dropped, so this section has not been submitted. Try again when you are back online.' });
      return;
    }
    if (status < 200 || status >= 300) {
      setNotice({ tone: 'negative', text: data?.error?.message ?? 'This section could not be submitted.' });
      return;
    }
    if (data?.attemptSubmitted) {
      router.push(`/attempt/${model.attemptId}/results`);
    } else {
      router.refresh();
    }
  };

  const canGoBack = useMemo(() => {
    if (!policy || position === 0) return false;
    if (policy.allowBackWithinPart) return true;
    return Math.floor((position - 1) / pageSize) === currentPage;
  }, [policy, position, pageSize, currentPage]);

  if (!part || !item || !policy) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Alert tone="caution" title="This attempt has no open section">
          <p>It may already be finished.</p>
          <a href={`/attempt/${model.attemptId}/results`}>View your results</a>
        </Alert>
      </div>
    );
  }

  const isLastOnPage = position >= pageStart + pageItems.length - 1;
  const isLastItem = position === part.items.length - 1;
  const isLocked = model.immediateFeedback && (locked[item.position] || item.locked);
  const itemCorrect = feedback[item.position] ?? item.review?.correct ?? null;
  const showFeedback = model.immediateFeedback && isLocked && item.review;
  const split = item.stimulus !== null;

  return (
    <div data-focus-mode className="flex min-h-dvh flex-col">
      {/* Study header: what this is, the clock, and the save status */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        {/* One row that never wraps: the label truncates, so the interface font arriving cannot add a line. */}
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{model.blueprintLabel}</p>
            <p className="truncate text-xs text-ink-muted">{`${model.examName} · ${part.label}`}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <SaveIndicator status={saves.status} timed={timed} onRetry={saves.retryNow} />
            {remaining !== null ? (
              <div
                role="timer"
                aria-live="off"
                className={cx(
                  'rounded px-2.5 py-1 font-mono text-base tabular-nums',
                  remaining <= 60 ? 'bg-negative-soft text-negative' : 'bg-surface-sunken text-ink',
                )}
              >
                <span className="sr-only">Time remaining: </span>
                {formatRemaining(remaining)}
              </div>
            ) : (
              <Badge tone="neutral">Untimed</Badge>
            )}
            <Link
              href={`/dashboard?exam=${model.examKey}`}
              className="text-sm font-medium"
              title={timed ? 'The timer keeps running while you are away.' : 'You can come back to this session later.'}
            >
              Leave
            </Link>
          </div>
        </div>
      </header>

      <div className={cx('mx-auto w-full flex-1 px-4 pb-6 pt-4 sm:px-6', split ? 'max-w-6xl' : 'max-w-3xl')}>
        {notice ? (
          <Alert tone={notice.tone} role={notice.tone === 'info' ? 'status' : 'alert'} className="mb-4">
            <p>{notice.text}</p>
            {notice.link ? (
              <p className="mt-1">
                <a href={notice.link.href}>{notice.link.label}</a>
              </p>
            ) : null}
          </Alert>
        ) : null}

        {remaining !== null && remaining <= 60 ? (
          <Alert tone="caution" role="status" className="mb-4">
            {remaining === 0 ? 'Time for this section has run out.' : 'Less than a minute left in this section.'}
          </Alert>
        ) : null}

        <QuestionNavigator
          listRef={navigatorRef}
          items={part.items}
          position={position}
          pageSize={pageSize}
          allowBack={policy.allowBackWithinPart}
          responses={responses}
          flags={flags}
          unsaved={saves.status.unsavedPositions}
          answeredCount={answeredCount}
          onGo={(target) => void go(target)}
        />

        <div className={cx('mt-4', split && 'lg:grid lg:grid-cols-2 lg:items-start lg:gap-8')}>
          {item.stimulus ? (
            // Beside the question on a wide screen the passage scrolls on its own, so it takes focus there.
            <div
              role="region"
              aria-label="Passage"
              tabIndex={split ? 0 : undefined}
              className="question-text mb-5 lg:sticky lg:top-20 lg:mb-0 lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto"
            >
              <StimulusView stimulus={item.stimulus} reading />
            </div>
          ) : null}

          <article aria-labelledby="question-heading" className="min-w-0">
            <h1 id="question-heading" ref={headingRef} tabIndex={-1} className="mb-3 font-heading text-lg font-semibold outline-none">
              Question {position + 1}
              <span className="sr-only"> of {part.items.length}</span>
            </h1>

            {item.instructionsHtml ? (
              <div
                className="prose-academic question-body question-text mb-3 text-sm text-ink-muted"
                dangerouslySetInnerHTML={{ __html: item.instructionsHtml }}
              />
            ) : null}

            <div className="prose-academic question-body question-text mb-5" dangerouslySetInnerHTML={{ __html: item.stemHtml }} />

            {item.accessibilityText ? <p className="sr-only">{item.accessibilityText}</p> : null}

            <ResponseInput
              item={{ ...item, response: responses[item.position] ?? null }}
              disabled={part.status !== 'in_progress' || isLocked}
              onChange={handleChange}
            />

            {model.immediateFeedback && part.status === 'in_progress' ? (
              isLocked ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Answer locked: you have seen the explanation for this question.
                </p>
              ) : (
                <div className="mt-5">
                  <Button onClick={() => void checkAnswer()} disabled={responses[item.position] == null} loading={checking}>
                    Check answer
                  </Button>
                  <p className="mt-2 text-sm text-ink-muted">
                    You can change your answer until you check it. Checking shows the explanation and locks the answer.
                  </p>
                </div>
              )
            ) : null}

            {showFeedback ? (
              <div
                className={cx(
                  'mt-6 rounded-card border-s-4 p-4',
                  itemCorrect ? 'border-positive bg-positive-soft' : 'border-negative bg-negative-soft',
                )}
              >
                <p className="font-semibold">
                  {itemCorrect ? 'Correct' : 'Not correct'}
                  {item.review?.correctSummary ? (
                    <span className="font-normal text-ink-muted"> · Answer: {item.review.correctSummary}</span>
                  ) : null}
                </p>
                {item.review?.explanationHtml ? (
                  <div
                    className="prose-academic question-text mt-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: item.review.explanationHtml }}
                  />
                ) : null}
              </div>
            ) : null}
          </article>
        </div>

        {/* End-of-section review screen */}
        {showReviewScreen ? (
          <section aria-labelledby="review-heading" className="mt-6 rounded-card border border-line bg-surface p-5">
            <h2 id="review-heading" className="font-heading text-lg font-semibold">
              Review before finishing
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {policy.reviewScreenEditable
                ? `You can change up to ${policy.editLimitPerPart ?? 'any number of'} answers from here.`
                : 'This summary is read-only, as it is on the real exam. Answers cannot be changed now.'}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {part.items.map((reviewItem) => (
                <li
                  key={reviewItem.position}
                  className="flex items-center justify-between gap-3 rounded border border-line px-3 py-2 text-sm"
                >
                  <span>Question {reviewItem.position + 1}</span>
                  <span className="flex items-center gap-2">
                    {flags[reviewItem.position] ? <Badge tone="caution">Marked</Badge> : null}
                    {responses[reviewItem.position] != null ? (
                      <Badge tone="accent">Answered</Badge>
                    ) : (
                      <Badge tone="neutral">Not answered</Badge>
                    )}
                    {policy.reviewScreenEditable ? (
                      <Button size="sm" variant="quiet" onClick={() => void go(reviewItem.position)}>
                        Open
                      </Button>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-end">
              <Button onClick={() => void submitCurrentPart()} disabled={submitting} loading={submitting}>
                Submit section
              </Button>
            </div>
          </section>
        ) : null}

        {/* Rules in force, stated plainly */}
        <details className="mt-8 rounded-card border border-line bg-surface-sunken p-4 text-sm">
          <summary className="cursor-pointer font-medium">Rules for this section</summary>
          <ul className="mt-3 list-disc space-y-1 ps-5 text-ink-muted">
            {part.navigationSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
            <li>{model.fidelityNote}</li>
            {part.routingDisclosure ? <li>{part.routingDisclosure}</li> : null}
            <li>
              {timed
                ? 'Answers are kept on this device until the server has them. The timer is the server’s: it keeps running while you are offline or away, and an answer that reaches the server after time runs out does not count.'
                : 'Answers are kept on this device until the server has them, and sent when the connection returns.'}
            </li>
          </ul>
        </details>
      </div>

      {/* Controls: a bar that stays put, whatever the question's length */}
      <nav aria-label="Question controls" className="sticky bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur-sm">
        <div className={cx('mx-auto flex items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6', split ? 'max-w-6xl' : 'max-w-3xl')}>
          <Button variant="secondary" onClick={() => void go(position - 1)} disabled={!canGoBack || moving}>
            Previous
          </Button>

          {policy.allowFlagForReview ? (
            <Button variant="quiet" onClick={() => void toggleFlag()} aria-pressed={flags[item.position] ?? false}>
              {flags[item.position] ? 'Unmark' : 'Mark'}
              <span className="sr-only"> for review</span>
            </Button>
          ) : null}

          <div className="ms-auto flex gap-2 sm:gap-3">
            {!isLastItem ? (
              <Button onClick={() => void go(position + 1)} loading={moving}>
                {pageSize > 1 && isLastOnPage ? 'Next screen' : 'Next'}
              </Button>
            ) : policy.reviewScreen && !showReviewScreen ? (
              <Button onClick={() => setShowReviewScreen(true)}>Review answers</Button>
            ) : (
              <Button onClick={() => void submitCurrentPart()} disabled={submitting} loading={submitting}>
                Finish section
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

/**
 * The question navigator. States differ by shape as well as colour: an
 * unanswered question is an outline, an answered one is filled with a bar
 * under its number (dotted while the answer is not yet saved), a marked one
 * has a corner, and the current one a heavy ring.
 */
function QuestionNavigator({
  listRef,
  items,
  position,
  pageSize,
  allowBack,
  responses,
  flags,
  unsaved,
  answeredCount,
  onGo,
}: {
  listRef: React.Ref<HTMLOListElement>;
  items: PlayerItem[];
  position: number;
  pageSize: number;
  allowBack: boolean;
  responses: Record<number, Response | null>;
  flags: Record<number, boolean>;
  unsaved: ReadonlySet<number>;
  answeredCount: number;
  onGo: (position: number) => void;
}) {
  const currentPage = Math.floor(position / pageSize);
  const anyUnsaved = items.some((i) => unsaved.has(i.position) && responses[i.position] != null);
  return (
    <nav aria-label="Questions in this section">
      <ol ref={listRef} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1 sm:flex-wrap sm:overflow-visible">
        {items.map((navItem) => {
          const isCurrent = navItem.position === position;
          const isAnswered = responses[navItem.position] != null;
          const isUnsaved = isAnswered && unsaved.has(navItem.position);
          const isFlagged = flags[navItem.position];
          const reachable = allowBack || Math.floor(navItem.position / pageSize) === currentPage;
          return (
            <li key={navItem.position} className="shrink-0">
              <button
                type="button"
                onClick={() => onGo(navItem.position)}
                disabled={!reachable}
                aria-current={isCurrent ? 'true' : undefined}
                aria-label={`Question ${navItem.position + 1}${isAnswered ? (isUnsaved ? ', answered, not yet saved' : ', answered') : ', not answered'}${isFlagged ? ', marked for review' : ''}${reachable ? '' : ', not available'}`}
                className={cx(
                  'relative flex size-11 items-center justify-center rounded border-[1.5px] text-sm font-semibold tabular-nums transition-colors duration-100',
                  isCurrent
                    ? 'border-accent bg-accent text-accent-contrast ring-2 ring-ink ring-offset-2 ring-offset-paper'
                    : isAnswered
                      ? 'border-accent-soft bg-accent-soft text-accent-strong'
                      : 'border-line-strong bg-surface text-ink-muted',
                  reachable ? 'hover:border-ink' : 'cursor-not-allowed opacity-40',
                )}
              >
                {navItem.position + 1}
                {isAnswered ? (
                  <span
                    aria-hidden="true"
                    className={cx('absolute inset-x-2.5 bottom-1.5 border-b-2', isUnsaved ? 'border-dotted' : 'border-solid', 'border-current')}
                  />
                ) : null}
                {isFlagged ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-0 size-0 border-l-[11px] border-t-[11px] border-l-transparent border-t-caution"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-1.5 text-xs text-ink-muted">
        {`${answeredCount} of ${items.length} answered`}
        {pageSize > 1 ? ` · ${pageSize} questions to a screen` : ''}
        {anyUnsaved ? ' · dotted: not yet saved' : ''}
      </p>
    </nav>
  );
}
