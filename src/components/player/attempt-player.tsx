'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';

import type { NavigationPolicy, Response } from '@/lib/assessment/types';
import type { AnswerSummary, PlayerItem, PlayerModel } from '@/lib/attempts/view-model';
import { formatRemaining } from '@/lib/assessment/timing';
import type { ServerItem } from '@/lib/player/pending';
import { StimulusView } from '@/components/stimulus-view';
import { Alert, Badge, Button, FidelityBadge, cx } from '@/components/ui';
import { QuestionTutor } from '@/components/tutor/tutor-panel';
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

/** Visually hidden text inside a translated message: `<sr>…</sr>`. */
const srOnly = (chunks: React.ReactNode) => <span className="sr-only">{chunks}</span>;
const TYPING: ReadonlySet<PlayerItem['responseType']> = new Set(['numeric_entry', 'essay']);
/** Typing is sent once it pauses for this long (and at once on leaving the question). */
const TYPING_DEBOUNCE_MS = 800;

export function AttemptPlayer({
  model,
  owner,
  tutorEnabled = false,
}: {
  model: PlayerModel;
  owner: string;
  /** The optional AI tutor is configured on the server. See lib/tutor/config.ts. */
  tutorEnabled?: boolean;
}) {
  const t = useTranslations('player');
  const locale = useLocale();
  const answerKeyText = useAnswerKeyText();
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
          text: t(isLocked ? 'notices.replacedLocked' : 'notices.replaced', { number: at + 1 }),
        });
        if (isLocked) {
          setLocked((all) => ({ ...all, [at]: true }));
          resync();
        }
      },
      onLocked(at, message, code) {
        setLocked((all) => ({ ...all, [at]: true }));
        setNotice({ tone: 'caution', text: errorText(code, message, t('errors.response-locked')) });
        resync();
      },
      onClosed(lost, message, code) {
        const text = errorText(code, message, t('errors.attempt-closed'));
        setNotice({
          tone: 'caution',
          text: lost > 0 ? `${text} ${t('notices.closedLost', { count: lost })}` : text,
        });
        // The server moves on: to the next section, or to the results.
        router.refresh();
      },
      onRefused(at, message, code) {
        const text = errorText(code, message, t('notices.saveRefused'));
        setNotice({ tone: 'negative', text: at === null ? text : t('notices.refusedAt', { number: at + 1, message: text }) });
        if (at === null) resync();
      },
      onSignedOut() {
        setNotice({
          tone: 'negative',
          text: t('notices.signedOut'),
          link: { href: `/sign-in?next=/attempt/${model.attemptId}`, label: t('notices.signInAgain') },
        });
      },
      onNotFound() {
        setNotice({
          tone: 'negative',
          text: t('notices.notFound'),
          link: { href: '/dashboard', label: t('notices.dashboard') },
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
        text: t(closedSection ? 'notices.lostClosedSection' : 'notices.lostChecked', { count: result.lost.length }),
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

  /**
   * A refusal from the server, in the learner's language. The API answers in
   * English; its error code is what is translated. An unknown code shows the
   * server's sentence in English and `fallback` in every other language.
   */
  function errorText(code: unknown, message: unknown, fallback: string): string {
    const key = typeof code === 'string' ? code : '';
    if (key === 'no-backward-navigation' && pageSize > 1) return t('errors.no-backward-navigation-screen');
    if (key === 'edit-limit-reached' || key === 'bookmark-limit-reached') {
      const limit = key === 'edit-limit-reached' ? policy?.editLimitPerPart : policy?.bookmarkLimitPerPart;
      if (limit != null) return t(`errors.${key}`, { count: limit });
    } else if (key && t.has(`errors.${key}`)) {
      return t(`errors.${key}`);
    }
    if (locale === 'en' && typeof message === 'string' && message) return message;
    return fallback;
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
        text: t('notices.checkOffline'),
      });
      return;
    }
    if (reply.kind === 'retry') {
      setNotice({ tone: 'negative', text: t('notices.checkRetry') });
      return;
    }
    if (reply.kind !== 'saved') return; // the saving hook has reported it
    if (reply.stale) {
      setResponses((all) => ({ ...all, [target]: reply.current }));
      setNotice({
        tone: 'info',
        text: t('notices.checkStale', { number: target + 1 }),
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
            ? `${t('notices.moveOffline')}${timed ? ` ${t('notices.timerRuns')}` : ''}`
            : t('notices.moveUnsaved'),
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
      setNotice({ tone: 'caution', text: t('notices.moveDropped') });
      return;
    }
    if (status < 200 || status >= 300) {
      setNotice({ tone: 'negative', text: errorText(data?.error?.code, data?.error?.message, t('notices.moveRefused')) });
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
      text:
        status === 0
          ? t('notices.flagOffline')
          : errorText(data?.error?.code, data?.error?.message, t('notices.flagFailed')),
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
              ? `${t('notices.submitOffline')}${timed ? ` ${t('notices.timerRuns')}` : ''}`
              : t('notices.submitUnsaved'),
        });
      }
      return;
    }
    const { status, data } = await postJson(`/api/attempts/${model.attemptId}/submit-part`, { partIndex: part.partIndex });
    setSubmitting(false);
    if (status === 0) {
      setNotice({ tone: 'caution', text: t('notices.submitDropped') });
      return;
    }
    if (status < 200 || status >= 300) {
      setNotice({ tone: 'negative', text: errorText(data?.error?.code, data?.error?.message, t('notices.submitFailed')) });
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
        <Alert tone="caution" title={t('noOpenSection.title')}>
          <p>{t('noOpenSection.body')}</p>
          <Link href={`/attempt/${model.attemptId}/results`}>{t('noOpenSection.results')}</Link>
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
            <p className="truncate text-sm font-medium">{model.retry ? t('retry.label') : model.blueprintLabel}</p>
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
                <span className="sr-only">{`${t('header.timeRemaining')} `}</span>
                {formatRemaining(remaining)}
              </div>
            ) : (
              <Badge tone="neutral">{t('header.untimed')}</Badge>
            )}
            <Link
              href={`/dashboard?exam=${model.examKey}`}
              className="text-sm font-medium"
              title={timed ? t('header.leaveTimed') : t('header.leaveUntimed')}
            >
              {t('header.leave')}
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
                <Link href={notice.link.href}>{notice.link.label}</Link>
              </p>
            ) : null}
          </Alert>
        ) : null}

        {remaining !== null && remaining <= 60 ? (
          <Alert tone="caution" role="status" className="mb-4">
            {remaining === 0 ? t('time.runOut') : t('time.lastMinute')}
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
              aria-label={t('passage')}
              tabIndex={split ? 0 : undefined}
              lang={item.contentLocale}
              className="question-text mb-5 lg:sticky lg:top-20 lg:mb-0 lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto"
            >
              <StimulusView stimulus={item.stimulus} reading />
            </div>
          ) : null}

          <article aria-labelledby="question-heading" className="min-w-0">
            <h1 id="question-heading" ref={headingRef} tabIndex={-1} className="mb-3 font-heading text-lg font-semibold outline-none">
              {t.rich('question.heading', { number: position + 1, total: part.items.length, sr: srOnly })}
            </h1>

            {item.instructionsHtml ? (
              <div
                lang={item.contentLocale}
                className="prose-academic question-body question-text mb-3 text-sm text-ink-muted"
                dangerouslySetInnerHTML={{ __html: item.instructionsHtml }}
              />
            ) : null}

            <div lang={item.contentLocale} className="prose-academic question-body question-text mb-5" dangerouslySetInnerHTML={{ __html: item.stemHtml }} />

            {item.accessibilityText ? <p lang={item.contentLocale} className="sr-only">{item.accessibilityText}</p> : null}

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
                  {t('question.locked')}
                </p>
              ) : (
                <div className="mt-5">
                  <Button onClick={() => void checkAnswer()} disabled={responses[item.position] == null} loading={checking}>
                    {t('question.check')}
                  </Button>
                  <p className="mt-2 text-sm text-ink-muted">{t('question.checkHint')}</p>
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
                  {itemCorrect ? t('feedback.correct') : t('feedback.incorrect')}
                  {item.review?.correctSummary ? (
                    <span className="font-normal text-ink-muted">
                      {` · ${t('feedback.answer', { summary: answerKeyText(item.review.correctSummary) })}`}
                    </span>
                  ) : null}
                </p>
                {item.review?.explanationHtml ? (
                  <div
                    lang={item.contentLocale}
                    className="prose-academic question-text mt-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: item.review.explanationHtml }}
                  />
                ) : null}
              </div>
            ) : null}

            {/* Optional AI help, in untimed learning sessions only - the server
                refuses it anywhere else. Hints until the answer is checked;
                a deeper explanation once the reviewed one is showing. */}
            {tutorEnabled && model.immediateFeedback && part.status === 'in_progress' ? (
              <QuestionTutor
                key={`${part.partIndex}-${item.position}`}
                attemptId={model.attemptId}
                partIndex={part.partIndex}
                position={item.position}
                canHint={!isLocked}
                canExplain={Boolean(showFeedback)}
              />
            ) : null}
          </article>
        </div>

        {/* End-of-section review screen */}
        {showReviewScreen ? (
          <section aria-labelledby="review-heading" className="mt-6 rounded-card border border-line bg-surface p-5">
            <h2 id="review-heading" className="font-heading text-lg font-semibold">
              {t('review.title')}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {policy.reviewScreenEditable
                ? policy.editLimitPerPart != null
                  ? t('review.editableLimit', { count: policy.editLimitPerPart })
                  : t('review.editableAny')
                : t('review.readOnly')}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {part.items.map((reviewItem) => (
                <li
                  key={reviewItem.position}
                  className="flex items-center justify-between gap-3 rounded border border-line px-3 py-2 text-sm"
                >
                  <span>{t('review.question', { number: reviewItem.position + 1 })}</span>
                  <span className="flex items-center gap-2">
                    {flags[reviewItem.position] ? <Badge tone="caution">{t('review.marked')}</Badge> : null}
                    {responses[reviewItem.position] != null ? (
                      <Badge tone="accent">{t('review.answered')}</Badge>
                    ) : (
                      <Badge tone="neutral">{t('review.notAnswered')}</Badge>
                    )}
                    {policy.reviewScreenEditable ? (
                      <Button size="sm" variant="quiet" onClick={() => void go(reviewItem.position)}>
                        {t('review.open')}
                      </Button>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-end">
              <Button onClick={() => void submitCurrentPart()} disabled={submitting} loading={submitting}>
                {t('review.submit')}
              </Button>
            </div>
          </section>
        ) : null}

        {/* Rules in force, stated plainly */}
        <details className="mt-8 rounded-card border border-line bg-surface-sunken p-4 text-sm">
          <summary className="cursor-pointer font-medium">{t('rules.title')}</summary>
          <ul className="mt-3 list-disc space-y-1 ps-5 text-ink-muted">
            <PolicyRules policy={policy} />
            {/* The fidelity note and the routing disclosure come from the exam's configuration. */}
            <li>{model.retry ? t('retry.fidelityNote') : model.fidelityNote}</li>
            {part.routingDisclosure ? <li>{part.routingDisclosure}</li> : null}
            <li>{timed ? t('rules.savingTimed') : t('rules.savingUntimed')}</li>
          </ul>
        </details>
      </div>

      {/* Controls: a bar that stays put, whatever the question's length */}
      <nav aria-label={t('controls.label')} className="sticky bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur-sm">
        <div className={cx('mx-auto flex items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6', split ? 'max-w-6xl' : 'max-w-3xl')}>
          <Button variant="secondary" onClick={() => void go(position - 1)} disabled={!canGoBack || moving}>
            {t('controls.previous')}
          </Button>

          {policy.allowFlagForReview ? (
            <Button variant="quiet" onClick={() => void toggleFlag()} aria-pressed={flags[item.position] ?? false}>
              {t.rich(flags[item.position] ? 'controls.unmark' : 'controls.mark', { sr: srOnly })}
            </Button>
          ) : null}

          <div className="ms-auto flex gap-2 sm:gap-3">
            {!isLastItem ? (
              <Button onClick={() => void go(position + 1)} loading={moving}>
                {pageSize > 1 && isLastOnPage ? t('controls.nextScreen') : t('controls.next')}
              </Button>
            ) : policy.reviewScreen && !showReviewScreen ? (
              <Button onClick={() => setShowReviewScreen(true)}>{t('controls.reviewAnswers')}</Button>
            ) : (
              <Button onClick={() => void submitCurrentPart()} disabled={submitting} loading={submitting}>
                {t('controls.finish')}
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
  const t = useTranslations('player.navigator');
  const currentPage = Math.floor(position / pageSize);
  const anyUnsaved = items.some((i) => unsaved.has(i.position) && responses[i.position] != null);
  return (
    <nav aria-label={t('label')}>
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
                aria-label={[
                  t('question', { number: navItem.position + 1 }),
                  t(isAnswered ? (isUnsaved ? 'answeredUnsaved' : 'answered') : 'notAnswered'),
                  ...(isFlagged ? [t('marked')] : []),
                  ...(reachable ? [] : [t('unavailable')]),
                ].join(', ')}
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
        {[
          t('progress', { answered: answeredCount, total: items.length }),
          ...(pageSize > 1 ? [t('perScreen', { count: pageSize })] : []),
          ...(anyUnsaved ? [t('dotted')] : []),
        ].join(' · ')}
      </p>
    </nav>
  );
}

/** What the section's navigation policy allows, in the learner's language. */
function PolicyRules({ policy }: { policy: NavigationPolicy }) {
  const t = useTranslations('player.rules');
  const lines = [
    t(policy.allowBackWithinPart ? 'backFree' : 'backFixed'),
    t(policy.allowChangeAnswer ? 'changeAllowed' : 'changeLocked'),
    ...(policy.reviewScreen
      ? [policy.editLimitPerPart === null ? t('reviewScreen') : t('reviewScreenEdits', { count: policy.editLimitPerPart })]
      : []),
    ...(policy.allowFlagForReview
      ? [policy.bookmarkLimitPerPart === null ? t('flagAny') : t('flagLimit', { count: policy.bookmarkLimitPerPart })]
      : []),
    t(policy.allowReturnToPreviousPart ? 'returnAllowed' : 'returnLocked'),
  ];
  return (
    <>
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </>
  );
}

/** The correct answer, worded in the learner's language. Option letters and values are data. */
function useAnswerKeyText() {
  const t = useTranslations('player.answerKey');
  const format = useFormatter();
  return (summary: AnswerSummary): string => {
    switch (summary.kind) {
      case 'option':
        return t('option', { label: summary.label });
      case 'options':
        return t('options', { labels: format.list(summary.labels, { type: 'conjunction' }) });
      case 'range':
        return t('range', { min: summary.min, max: summary.max });
      case 'tolerance':
        return `${summary.value} (± ${summary.tolerance})`;
      case 'value':
        return summary.value;
      case 'pairs':
        return summary.pairs.map((pair) => `${pair.column}: ${pair.label}`).join('; ');
      case 'essay':
        return t('essay');
    }
  };
}
