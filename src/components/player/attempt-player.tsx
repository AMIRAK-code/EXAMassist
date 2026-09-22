'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Response } from '@/lib/assessment/types';
import type { PlayerItem, PlayerModel } from '@/lib/attempts/view-model';
import { formatRemaining } from '@/lib/assessment/timing';
import { StimulusView } from '@/components/stimulus-view';
import { Alert, Badge, Button, FidelityBadge } from '@/components/ui';
import { ResponseInput } from './response-input';

/**
 * The practice and exam player.
 *
 * Principles:
 * - The server owns the clock and the rules. The countdown here is display
 *   only; every save is validated server-side and can be rejected.
 * - Answers are saved as they are made, and a failed save is retried rather
 *   than silently dropped.
 * - Navigation controls reflect the exam's real policy, and the server rejects
 *   an illegal move even if the UI were bypassed.
 */

type SaveState = 'idle' | 'saving' | 'saved' | 'offline' | 'rejected';

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; status: number; data: any }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(body),
  });
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    /* an empty or non-JSON body is fine */
  }
  return { ok: response.ok, status: response.status, data };
}

export function AttemptPlayer({ model }: { model: PlayerModel }) {
  const router = useRouter();
  const part = model.parts[model.currentPartIndex];

  const [position, setPosition] = useState(0);
  const [responses, setResponses] = useState<Record<number, Response | null>>(() =>
    Object.fromEntries(part?.items.map((item) => [item.position, item.response]) ?? []),
  );
  const [feedback, setFeedback] = useState<Record<number, PlayerItem['review']>>(() =>
    Object.fromEntries(part?.items.filter((i) => i.review).map((i) => [i.position, i.review]) ?? []),
  );
  const [flags, setFlags] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(part?.items.map((item) => [item.position, item.flagged]) ?? []),
  );
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(part?.remainingSeconds ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  const itemEnteredAt = useRef<number>(Date.now());
  const pending = useRef<Map<number, Response | null>>(new Map());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const item = part?.items[position];
  const policy = part?.navigation;
  const pageSize = policy?.pageSize ?? 1;
  const currentPage = Math.floor(position / pageSize);
  const pageStart = currentPage * pageSize;
  const pageItems = part ? part.items.slice(pageStart, pageStart + pageSize) : [];
  const answeredCount = part ? part.items.filter((i) => responses[i.position] != null).length : 0;

  // --- Clock ---------------------------------------------------------------
  // Purely a display of the server's deadline. When it reaches zero we ask the
  // server what actually happened rather than deciding locally.
  useEffect(() => {
    if (part?.deadlineAt == null) return;
    const deadline = new Date(part.deadlineAt).getTime();
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) router.refresh();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [part?.deadlineAt, router]);

  // Move focus to the question heading on navigation, so screen reader and
  // keyboard users land in the right place instead of at the top of the page.
  useEffect(() => {
    headingRef.current?.focus();
    itemEnteredAt.current = Date.now();
  }, [position]);

  // Warn before leaving a timed attempt whose clock keeps running.
  useEffect(() => {
    if (model.pauseBehaviour !== 'clock_runs' || model.status !== 'in_progress') return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [model.pauseBehaviour, model.status]);

  // --- Saving --------------------------------------------------------------
  const save = useCallback(
    async (targetPosition: number, response: Response | null) => {
      if (!part) return;
      pending.current.set(targetPosition, response);
      setSaveState('saving');

      const elapsedMs = Math.max(0, Date.now() - itemEnteredAt.current);
      itemEnteredAt.current = Date.now();

      const result = await postJson(`/api/attempts/${model.attemptId}/answer`, {
        partIndex: part.partIndex,
        position: targetPosition,
        response,
        elapsedMs,
      }).catch(() => ({ ok: false, status: 0, data: null }));

      if (result.status === 0) {
        // Network failure: keep the answer queued and say so honestly.
        setSaveState('offline');
        setMessage('You appear to be offline. Your answer is saved on this device and will be sent when the connection returns.');
        return;
      }

      pending.current.delete(targetPosition);

      if (!result.ok) {
        setSaveState('rejected');
        setMessage(result.data?.error?.message ?? 'That answer could not be saved.');
        if (result.data?.error?.code === 'time-expired' || result.data?.error?.code === 'attempt-closed') {
          router.refresh();
        }
        return;
      }

      setSaveState('saved');
      setMessage(null);
      if (result.data?.feedback) {
        setFeedback((current) => ({
          ...current,
          [targetPosition]: {
            correct: result.data.feedback.correct,
            explanationHtml: '',
            distractorHtml: {},
            correctSummary: '',
            difficultyBasis: 'editorial',
          },
        }));
        // Immediate-feedback mode needs the server-rendered explanation.
        router.refresh();
      }
    },
    [model.attemptId, part, router],
  );

  // Retry anything queued while offline.
  useEffect(() => {
    if (saveState !== 'offline') return;
    const id = window.setInterval(() => {
      const queued = [...pending.current.entries()];
      if (queued.length === 0) return;
      const [queuedPosition, queuedResponse] = queued[0];
      void save(queuedPosition, queuedResponse);
    }, 5000);
    return () => window.clearInterval(id);
  }, [saveState, save]);

  const handleChange = (response: Response | null) => {
    if (!item) return;
    setResponses((current) => ({ ...current, [item.position]: response }));
    void save(item.position, response);
  };

  const go = async (target: number) => {
    if (!part || target < 0 || target >= part.items.length) return;
    const result = await postJson(`/api/attempts/${model.attemptId}/visit`, {
      partIndex: part.partIndex,
      position: target,
    }).catch(() => ({ ok: false, status: 0, data: null }));

    if (!result.ok && result.status !== 0) {
      setMessage(result.data?.error?.message ?? 'You cannot move there on this exam.');
      return;
    }
    setMessage(null);
    setPosition(target);
  };

  const toggleFlag = async () => {
    if (!item || !part) return;
    const next = !flags[item.position];
    setFlags((current) => ({ ...current, [item.position]: next }));
    const result = await postJson(`/api/attempts/${model.attemptId}/flag`, {
      partIndex: part.partIndex,
      position: item.position,
      flagged: next,
    }).catch(() => ({ ok: false, status: 0, data: null }));
    if (!result.ok) setFlags((current) => ({ ...current, [item.position]: !next }));
  };

  const submitCurrentPart = async () => {
    if (!part || submitting) return;
    setSubmitting(true);
    const result = await postJson(`/api/attempts/${model.attemptId}/submit-part`, {
      partIndex: part.partIndex,
    }).catch(() => ({ ok: false, status: 0, data: null }));
    setSubmitting(false);

    if (!result.ok) {
      setMessage(result.data?.error?.message ?? 'This section could not be submitted.');
      return;
    }
    if (result.data?.attemptSubmitted) {
      router.push(`/attempt/${model.attemptId}/results`);
    } else {
      setPosition(0);
      setShowReviewScreen(false);
      router.refresh();
    }
  };

  const canGoBack = useMemo(() => {
    if (!policy || position === 0) return false;
    if (policy.allowBackWithinPart) return true;
    return Math.floor((position - 1) / pageSize) === currentPage;
  }, [policy, position, pageSize, currentPage]);

  if (!part || !item) {
    return (
      <Alert tone="caution" title="This attempt has no open section">
        <p>It may already be finished. </p>
        <a href={`/attempt/${model.attemptId}/results`}>View your results</a>
      </Alert>
    );
  }

  const isLastOnPage = position >= pageStart + pageItems.length - 1;
  const isLastItem = position === part.items.length - 1;
  const itemFeedback = model.immediateFeedback ? (feedback[item.position] ?? item.review) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Status bar */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line bg-surface px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{model.blueprintLabel}</p>
          <p className="truncate text-xs text-ink-muted">
            {model.examName} · {part.label}
          </p>
        </div>

        <div className="ms-auto flex items-center gap-3">
          <FidelityBadge fidelity={model.fidelity} />
          {remaining !== null ? (
            <div
              role="timer"
              aria-live="off"
              className={`rounded px-3 py-1.5 font-mono text-lg tabular-nums ${
                remaining <= 60 ? 'bg-negative-soft text-negative' : 'bg-surface-sunken text-ink'
              }`}
            >
              <span className="sr-only">Time remaining: </span>
              {formatRemaining(remaining)}
            </div>
          ) : (
            <Badge tone="neutral">Untimed</Badge>
          )}
        </div>
      </div>

      {/* Save state, announced politely */}
      <div aria-live="polite" className="sr-only">
        {saveState === 'saved' ? 'Answer saved.' : saveState === 'saving' ? 'Saving.' : ''}
      </div>

      {message ? (
        <Alert tone={saveState === 'offline' ? 'caution' : 'negative'} role="alert" className="mb-4">
          {message}
        </Alert>
      ) : null}

      {remaining !== null && remaining <= 60 ? (
        <Alert tone="caution" role="status" className="mb-4">
          Less than a minute left in this section.
        </Alert>
      ) : null}

      {/* Question navigator */}
      <nav aria-label="Questions in this section" className="mb-5">
        <ol className="flex flex-wrap gap-1.5">
          {part.items.map((navItem) => {
            const isCurrent = navItem.position === position;
            const isAnswered = responses[navItem.position] != null;
            const isFlagged = flags[navItem.position];
            const samePage = Math.floor(navItem.position / pageSize) === currentPage;
            const reachable = policy.allowBackWithinPart || samePage;
            return (
              <li key={navItem.position}>
                <button
                  type="button"
                  onClick={() => void go(navItem.position)}
                  disabled={!reachable}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-label={`Question ${navItem.position + 1}${isAnswered ? ', answered' : ', not answered'}${isFlagged ? ', marked for review' : ''}${reachable ? '' : ', not available'}`}
                  className={`relative size-9 rounded border text-sm font-medium tabular-nums transition-colors ${
                    isCurrent
                      ? 'border-accent bg-accent text-accent-contrast'
                      : isAnswered
                        ? 'border-accent-soft bg-accent-soft text-accent-strong'
                        : 'border-line bg-surface text-ink-muted'
                  } ${reachable ? 'hover:border-line-strong' : 'cursor-not-allowed opacity-40'}`}
                >
                  {navItem.position + 1}
                  {isFlagged ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-caution"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-xs text-ink-muted">
          {answeredCount} of {part.items.length} answered
          {pageSize > 1 ? ` · questions are shown ${pageSize} to a screen` : ''}
        </p>
      </nav>

      {/* Question */}
      <article className="rounded-card border border-line bg-surface p-5 sm:p-6">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mb-4 font-serif text-lg font-semibold outline-none"
        >
          Question {position + 1}
          <span className="sr-only"> of {part.items.length}</span>
        </h1>

        {item.stimulus ? (
          <div className="mb-5">
            <StimulusView stimulus={item.stimulus} />
          </div>
        ) : null}

        {item.instructionsHtml ? (
          <div
            className="prose-academic question-body mb-3 text-sm text-ink-muted"
            dangerouslySetInnerHTML={{ __html: item.instructionsHtml }}
          />
        ) : null}

        <div
          className="prose-academic question-body mb-5"
          dangerouslySetInnerHTML={{ __html: item.stemHtml }}
        />

        {item.accessibilityText ? <p className="sr-only">{item.accessibilityText}</p> : null}

        <ResponseInput
          item={{ ...item, response: responses[item.position] ?? null }}
          disabled={part.status !== 'in_progress'}
          onChange={handleChange}
        />

        {itemFeedback && item.review ? (
          <div
            className={`mt-6 rounded-card border-s-4 p-4 ${
              itemFeedback.correct
                ? 'border-positive bg-positive-soft'
                : 'border-negative bg-negative-soft'
            }`}
          >
            <p className="font-semibold">
              {itemFeedback.correct ? 'Correct' : 'Not correct'}
              {item.review.correctSummary ? (
                <span className="font-normal text-ink-muted"> · Answer: {item.review.correctSummary}</span>
              ) : null}
            </p>
            {item.review.explanationHtml ? (
              <div
                className="prose-academic mt-2 text-sm"
                dangerouslySetInnerHTML={{ __html: item.review.explanationHtml }}
              />
            ) : null}
          </div>
        ) : null}
      </article>

      {/* Controls */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => void go(position - 1)} disabled={!canGoBack}>
          Previous
        </Button>

        {policy.allowFlagForReview ? (
          <Button variant="quiet" onClick={() => void toggleFlag()} aria-pressed={flags[item.position]}>
            {flags[item.position] ? 'Unmark' : 'Mark for review'}
          </Button>
        ) : null}

        <div className="ms-auto flex gap-3">
          {!isLastItem ? (
            <Button onClick={() => void go(position + 1)}>
              {pageSize > 1 && isLastOnPage ? 'Next screen' : 'Next'}
            </Button>
          ) : policy.reviewScreen && !showReviewScreen ? (
            <Button onClick={() => setShowReviewScreen(true)}>Review answers</Button>
          ) : (
            <Button onClick={() => void submitCurrentPart()} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Finish section'}
            </Button>
          )}
        </div>
      </div>

      {/* End-of-section review screen */}
      {showReviewScreen ? (
        <section aria-labelledby="review-heading" className="mt-6 rounded-card border border-line bg-surface p-5">
          <h2 id="review-heading" className="font-serif text-lg font-semibold">
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
            <Button onClick={() => void submitCurrentPart()} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit section'}
            </Button>
          </div>
        </section>
      ) : null}

      {/* Rules in force, stated plainly */}
      <details className="mt-6 rounded-card border border-line bg-surface-sunken p-4 text-sm">
        <summary className="cursor-pointer font-medium">Rules for this section</summary>
        <ul className="mt-3 list-disc space-y-1 ps-5 text-ink-muted">
          {part.navigationSummary.map((line) => (
            <li key={line}>{line}</li>
          ))}
          <li>{model.fidelityNote}</li>
          {part.routingDisclosure ? <li>{part.routingDisclosure}</li> : null}
        </ul>
      </details>
    </div>
  );
}
