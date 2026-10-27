'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Alert, Badge, Button, cx, fieldClass } from '@/components/ui';

/**
 * The optional AI tutor, as it appears to a learner.
 *
 * Rendered only when the server says the tutor is switched on, and only in
 * places where the server will actually allow it - the button is a
 * convenience, not the access check. Every response is labelled as AI output,
 * sits visually apart from the editors' reviewed explanation, and can be
 * reported.
 */

interface TutorReply {
  responseId: string;
  kind: 'hint' | 'explain' | 'debrief';
  html: string;
  label: string;
  cached: boolean;
  truncated: boolean;
}

interface Failure {
  /** The server's own sentence (English), or null when it could not be reached or said nothing. */
  message: string | null;
  /** No reply at all: the connection, not the tutor. */
  unreachable?: boolean;
  /** Set when the tutor is part of a plan this learner does not have. */
  upgradeHref?: string;
}

type Outcome = { ok: true; reply: TutorReply } | ({ ok: false } & Failure);

async function ask(url: string, body: unknown): Promise<Outcome> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => null)) as
      | (TutorReply & { error?: undefined })
      | { error: { message: string; detail?: { upgradeHref?: unknown } } }
      | null;
    if (response.ok && data && !('error' in data && data.error)) {
      return { ok: true, reply: data as TutorReply };
    }
    const failure = data && 'error' in data && data.error ? data.error : null;
    const upgradeHref = typeof failure?.detail?.upgradeHref === 'string' && failure.detail.upgradeHref.startsWith('/')
      ? failure.detail.upgradeHref
      : undefined;
    return { ok: false, message: failure?.message ?? null, upgradeHref };
  } catch {
    return { ok: false, message: null, unreachable: true };
  }
}

/** A small mark, so "this is AI" never rests on the badge colour alone. */
function SparkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5l1.6 4.4 4.4 1.6-4.4 1.6L8 13.5 6.4 9.1 2 7.5l4.4-1.6L8 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function AiBadge() {
  const t = useTranslations('player.tutor');
  return (
    <Badge tone="accent">
      <SparkIcon />
      {t('badge')}
    </Badge>
  );
}

/**
 * A refusal. The tutor API answers in English, so its sentence is shown only
 * to English readers; everyone else sees the general line in their language.
 */
function TutorError({ message, unreachable, upgradeHref }: Failure) {
  const t = useTranslations('player.tutor');
  const locale = useLocale();
  const text = unreachable ? t('unreachable') : locale === 'en' && message ? message : t('unavailable');
  return (
    <Alert tone="caution" role="alert" className="mt-3">
      <p>{text}</p>
      {upgradeHref ? (
        <p className="mt-2">
          <Link href={upgradeHref}>{t('upgrade')}</Link>
        </p>
      ) : null}
    </Alert>
  );
}

// ---------------------------------------------------------------------------
// One AI response, with its label and a way to report it
// ---------------------------------------------------------------------------

function AiResponse({ reply, title }: { reply: TutorReply; title: string }) {
  const t = useTranslations('player.tutor');
  const [reporting, setReporting] = useState(false);
  const [details, setDetails] = useState('');
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  async function report() {
    setReportState('sending');
    const response = await fetch('/api/tutor/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ responseId: reply.responseId, details: details.trim() || undefined }),
    }).catch(() => null);
    setReportState(response?.ok ? 'sent' : 'failed');
  }

  const detailsId = `ai-report-${reply.responseId}`;

  return (
    <section
      aria-label={t('generatedBy', { title })}
      className="rounded-card border border-accent-line bg-surface p-5"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <AiBadge />
        <h3 className="font-heading text-base font-semibold">{title}</h3>
      </div>

      <div className="prose-academic question-text text-sm" dangerouslySetInnerHTML={{ __html: reply.html }} />

      {reply.truncated ? (
        <p className="mt-2 text-xs text-ink-subtle">{t('truncated')}</p>
      ) : null}

      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-subtle">{reply.label}</p>

      <div className="mt-2 text-sm">
        {reportState === 'sent' ? (
          <p role="status" className="text-positive">
            {t('thanks')}
          </p>
        ) : reporting ? (
          <div className="mt-2 space-y-2">
            <label htmlFor={detailsId} className="block font-medium">
              {t('whatWrong')} <span className="font-normal text-ink-muted">{t('optional')}</span>
            </label>
            <textarea
              id={detailsId}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              maxLength={2000}
              rows={3}
              className={fieldClass('py-2')}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => void report()} loading={reportState === 'sending'}>
                {t('sendReport')}
              </Button>
              <Button size="sm" variant="quiet" onClick={() => setReporting(false)}>
                {t('cancel')}
              </Button>
            </div>
            {reportState === 'failed' ? (
              <Alert tone="caution" role="alert" className="mt-3">
                <p>{t('reportFailed')}</p>
              </Alert>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="text-ink-muted underline underline-offset-2 hover:text-ink"
            onClick={() => setReporting(true)}
          >
            {t('report')}
          </button>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Per-question help: progressive hints, then a deeper explanation
// ---------------------------------------------------------------------------

export function QuestionTutor({
  attemptId,
  partIndex,
  position,
  canHint,
  canExplain,
}: {
  attemptId: string;
  partIndex: number;
  position: number;
  /** Untimed learning session, answer not yet checked. */
  canHint: boolean;
  /** The learner may already see the answer. */
  canExplain: boolean;
}) {
  const t = useTranslations('player.tutor');
  const [hints, setHints] = useState<TutorReply[]>([]);
  const [explanation, setExplanation] = useState<TutorReply | null>(null);
  const [pending, setPending] = useState<'hint' | 'explain' | null>(null);
  const [error, setError] = useState<Failure | null>(null);

  if (!canHint && !canExplain) return null;

  async function requestHint() {
    const level = (hints.length + 1) as 1 | 2;
    setPending('hint');
    setError(null);
    const outcome = await ask('/api/tutor/help', { attemptId, partIndex, position, kind: 'hint', level });
    setPending(null);
    if (outcome.ok) setHints((current) => [...current, outcome.reply]);
    else setError(outcome);
  }

  async function requestExplanation() {
    setPending('explain');
    setError(null);
    const outcome = await ask('/api/tutor/help', { attemptId, partIndex, position, kind: 'explain' });
    setPending(null);
    if (outcome.ok) setExplanation(outcome.reply);
    else setError(outcome);
  }

  const showHints = canHint && !canExplain;

  return (
    <div className="mt-6 space-y-3">
      {showHints
        ? hints.map((hint, index) => <AiResponse key={hint.responseId} reply={hint} title={t('hintTitle', { number: index + 1, total: 2 })} />)
        : null}
      {explanation ? <AiResponse reply={explanation} title={t('deeper')} /> : null}

      <div className={cx('flex flex-wrap items-center gap-3', (hints.length > 0 || explanation) && 'pt-1')}>
        {showHints && hints.length < 2 ? (
          <Button size="sm" variant="secondary" onClick={() => void requestHint()} loading={pending === 'hint'} disabled={pending !== null}>
            {hints.length === 0 ? t('getHint') : t('anotherHint')}
          </Button>
        ) : null}
        {canExplain && !explanation ? (
          <Button size="sm" variant="secondary" onClick={() => void requestExplanation()} loading={pending === 'explain'} disabled={pending !== null}>
            {t('explainMore')}
          </Button>
        ) : null}
        {(showHints && hints.length < 2) || (canExplain && !explanation) ? (
          <span className="flex items-center gap-1.5 text-xs text-ink-muted">
            <SparkIcon />
            {showHints ? t('hintNote') : t('optionalHelp')}
          </span>
        ) : null}
      </div>

      {error ? <TutorError {...error} /> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// After the test: a study debrief with tips and tricks
// ---------------------------------------------------------------------------

export function DebriefTutor({ attemptId }: { attemptId: string }) {
  const t = useTranslations('player.tutor.debrief');
  const [reply, setReply] = useState<TutorReply | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Failure | null>(null);

  async function request() {
    setPending(true);
    setError(null);
    const outcome = await ask('/api/tutor/debrief', { attemptId });
    setPending(false);
    if (outcome.ok) setReply(outcome.reply);
    else setError(outcome);
  }

  if (reply) return <AiResponse reply={reply} title={t('title')} />;

  return (
    <div className="rounded-card border border-accent-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <AiBadge />
      </div>
      <h2 className="mt-3 font-heading text-xl font-semibold">{t('heading')}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('body')}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={() => void request()} loading={pending}>
          {pending ? t('writing') : t('write')}
        </Button>
        <span className="text-xs text-ink-muted">{t('note')}</span>
      </div>
      {error ? <TutorError {...error} /> : null}
    </div>
  );
}
