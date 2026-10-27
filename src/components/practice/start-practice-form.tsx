'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname, useRouter } from '@/i18n/navigation';
import { Alert, Button, cx } from '@/components/ui';
import { upgradeTarget } from '@/lib/billing/upgrade';
import {
  defaultLength,
  eligibleCount,
  lengthOptions,
  type Difficulty,
  type PracticeFacet,
} from '@/lib/attempts/facets';
import { useStartError } from './use-start-error';

/**
 * Practice setup.
 *
 * Every count shown here is computed from the same eligible pool, with all of
 * the learner's filters together, that the server checks when the session is
 * created. Nothing is changed behind the learner's back: a preset skill is
 * shown and can be removed, a shortened session says why, and broader
 * practice is offered as a button, never applied as a fallback.
 *
 * "New questions only" counts from the learner's own unseen pool, which the
 * server enforces: such a session is never topped up with questions the
 * learner has been shown, and the form says how many matching questions
 * are repeats when it is off.
 */

export interface DomainChoice {
  slug: string;
  name: string;
  skills: Array<{ slug: string; name: string }>;
}

export interface PresetSkill {
  slug: string;
  name: string;
  domainSlug: string;
  domainName: string;
}

type DifficultyChoice = Difficulty | 'mixed';
const DIFFICULTIES: DifficultyChoice[] = ['mixed', 'easy', 'medium', 'hard'];

export function StartPracticeForm({
  examKey,
  examLabel,
  blueprintId,
  facets,
  domains,
  presetDomain,
  presetSkill,
  unseenFacets,
  guestNote,
}: {
  examKey: string;
  examLabel: string;
  blueprintId: string;
  facets: PracticeFacet[];
  domains: DomainChoice[];
  presetDomain?: string | null;
  presetSkill?: PresetSkill | null;
  /** This learner's never-seen questions, when they have been shown some; null offers no choice. */
  unseenFacets?: PracticeFacet[] | null;
  /** Shown to visitors and guests; registered learners keep their history anyway. */
  guestNote?: string | null;
}) {
  const t = useTranslations('practice');
  const locale = useLocale();
  const startError = useStartError();
  const router = useRouter();
  const [skill, setSkill] = useState<PresetSkill | null>(presetSkill ?? null);
  const [domain, setDomain] = useState(presetSkill ? presetSkill.domainSlug : (presetDomain ?? ''));
  const [difficulty, setDifficulty] = useState<DifficultyChoice>('mixed');
  const [requested, setRequested] = useState(10);
  const [newOnly, setNewOnly] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = { domain: skill ? null : domain || null, skill: skill?.slug ?? null };
  // Every count on the form comes from the pool the session will draw from.
  const pool = newOnly && unseenFacets ? unseenFacets : facets;
  const eligible = eligibleCount(pool, { ...filters, difficulty });
  const matching = eligibleCount(facets, { ...filters, difficulty });
  const unseenMatching = unseenFacets ? eligibleCount(unseenFacets, { ...filters, difficulty }) : matching;
  const options = lengthOptions(eligible);
  const length = useMemo(() => {
    if (options.includes(requested)) return requested;
    const below = options.filter((n) => n <= requested);
    return below.length > 0 ? below[below.length - 1] : (options[options.length - 1] ?? 0);
  }, [options, requested]);
  const shortened = eligible > 0 && length < requested;

  const total = eligibleCount(facets, {});
  const domainName = domains.find((d) => d.slug === domain)?.name ?? null;
  const scopeLabel = skill
    ? t('form.summary.skillScope', { skill: skill.name, domain: skill.domainName })
    : (domainName ?? t('form.summary.everyTopic'));

  // Explicit ways to get a longer session, shown only when the current one is short.
  const broader: Array<{ label: string; apply: () => void }> = [];
  if (newOnly && matching > eligible && eligible < Math.max(5, requested)) {
    broader.push({ label: t('form.broader.includeSeen', { count: matching }), apply: () => setNewOnly(false) });
  }
  if (eligible < 5) {
    if (skill) {
      const inDomain = eligibleCount(pool, { domain: skill.domainSlug, difficulty });
      if (inDomain > eligible) {
        broader.push({
          label: t('form.broader.wholeDomain', { domain: skill.domainName, count: inDomain }),
          apply: () => {
            setSkill(null);
            setDomain(skill.domainSlug);
          },
        });
      }
    }
    if (difficulty !== 'mixed') {
      const mixed = eligibleCount(pool, { ...filters, difficulty: 'mixed' });
      if (mixed > eligible) broader.push({ label: t('form.broader.mixedDifficulty', { count: mixed }), apply: () => setDifficulty('mixed') });
    }
    if (skill || domain) {
      broader.push({
        label: t('form.broader.everyTopic', { exam: examLabel, count: eligibleCount(pool, { difficulty }) }),
        apply: () => {
          setSkill(null);
          setDomain('');
        },
      });
    }
  }

  async function start() {
    if (eligible === 0 || submitting) return;
    setSubmitting(true);
    setError(null);

    // Make sure the visitor has a session; guests get one automatically so
    // practice can start without an account.
    const guest = await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'X-Requested-With': 'examer' },
    })
      .then((r) => r.json())
      .catch(() => null);

    const idempotencyKey = `${examKey}-${blueprintId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        examKey,
        blueprintId,
        idempotencyKey,
        overrides: {
          domains: filters.domain ? [filters.domain] : undefined,
          skills: filters.skill ? [filters.skill] : undefined,
          difficulty,
          length,
          unseenOnly: newOnly || undefined,
        },
      }),
    }).catch(() => null);

    if (!response) {
      setSubmitting(false);
      setError(t('errors.network'));
      return;
    }

    const data = await response.json().catch(() => null);

    // No plan for this format: the pricing page for this exam, never an error.
    const upgrade = data?.error ? upgradeTarget(data.error) : null;
    if (upgrade) {
      window.location.assign(getPathname({ href: upgrade, locale }));
      return;
    }
    if (!response.ok) {
      setSubmitting(false);
      const detail = data?.error?.detail;
      if (data?.error?.code === 'insufficient-content' && detail?.parts) {
        // The bank changed between loading this page and starting.
        const short = detail.parts.find((p: { sufficient: boolean }) => !p.sufficient);
        setError(
          short
            ? t('errors.insufficientCounts', { available: short.available, requested: short.requested })
            : t('errors.insufficient'),
        );
        return;
      }
      setError(startError(data?.error, 'formFallback'));
      return;
    }

    // A brand-new guest session changes the header, which a client navigation
    // would not re-render, so the first session loads as a full page. Calling
    // router.refresh() beside router.push() instead can cancel the push.
    if (guest?.created) window.location.assign(getPathname({ href: `/attempt/${data.attemptId}`, locale }));
    else router.push(`/attempt/${data.attemptId}`);
  }

  return (
    <div className="space-y-6">
      {error ? (
        <Alert tone="negative" role="alert">
          {error}
        </Alert>
      ) : null}

      {skill ? (
        <div>
          <p className="mb-1.5 text-sm font-semibold">{t('form.skill')}</p>
          <div className="flex flex-wrap items-center gap-3 rounded-control border-[1.5px] border-ink bg-accent-soft px-4 py-3">
            <p className="min-w-0 flex-1">
              <span className="font-semibold">{skill.name}</span>
              <span className="text-ink-muted"> · {skill.domainName}</span>
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSkill(null);
                setDomain(skill.domainSlug);
              }}
            >
              {t('form.removeSkill')}
            </Button>
          </div>
          <p className="mt-1.5 text-sm text-ink-muted">{t('form.skillNote')}</p>
        </div>
      ) : (
        <div>
          <label htmlFor="practice-domain" className="mb-1.5 block text-sm font-semibold">
            {t('form.topic')}
          </label>
          <select
            id="practice-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            className="min-h-12 w-full rounded-control border-[1.5px] border-line-strong bg-surface px-3 text-base"
          >
            <option value="">{t('form.everyTopicOption', { count: eligibleCount(pool, { difficulty }) })}</option>
            {domains.map((option) => {
              const count = eligibleCount(pool, { domain: option.slug, difficulty });
              return (
                <option key={option.slug} value={option.slug} disabled={count === 0}>
                  {option.name} ({count})
                </option>
              );
            })}
          </select>
          <p className="mt-1.5 text-sm text-ink-muted">{t('form.countsNote')}</p>
        </div>
      )}

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">{t('form.difficulty')}</legend>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((value) => {
            const count = eligibleCount(pool, { ...filters, difficulty: value });
            const selected = difficulty === value;
            return (
              <label
                key={value}
                className={cx(
                  'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-4 text-sm',
                  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                  selected ? 'border-ink bg-ink font-semibold text-ink-inverse' : 'border-line-strong bg-surface hover:border-ink',
                  count === 0 && !selected && 'cursor-not-allowed border-dashed text-ink-subtle hover:border-line-strong',
                )}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={value}
                  checked={selected}
                  disabled={count === 0 && !selected}
                  onChange={() => setDifficulty(value)}
                  className="sr-only"
                />
                {t(`form.levels.${value}`)}
                <span className={selected ? 'text-ink-inverse-muted' : 'text-ink-subtle'}>({count})</span>
              </label>
            );
          })}
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">{t('form.difficultyNote')}</p>
      </fieldset>

      {unseenFacets ? (
        <div>
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
            <input
              type="checkbox"
              checked={newOnly}
              onChange={(event) => setNewOnly(event.target.checked)}
              aria-describedby="practice-new-note"
              className="size-5 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              <span className="font-semibold">{t('form.newOnly')}</span>
              <span className="text-ink-subtle">{` ${t('form.newOnlyCount', { unseen: unseenMatching, matching })}`}</span>
            </span>
          </label>
          <p id="practice-new-note" className="mt-1 text-sm text-ink-muted">
            {newOnly
              ? t('form.newOnlyOn')
              : t('form.newOnlyOff', { seen: matching - unseenMatching, matching })}
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor="practice-length" className="mb-1.5 block text-sm font-semibold">
          {t('form.length')}
        </label>
        <select
          id="practice-length"
          value={length}
          disabled={options.length === 0}
          onChange={(event) => setRequested(Number(event.target.value))}
          aria-describedby="practice-length-note"
          className="min-h-12 w-full max-w-48 rounded-control border-[1.5px] border-line-strong bg-surface px-3 text-base disabled:border-dashed disabled:bg-surface-sunken"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option === eligible && !(option === 5 || option === 10 || option === 15 || option === 20 || option === 30)
                ? t('form.allOfThem', { count: option })
                : option}
            </option>
          ))}
        </select>
        <p id="practice-length-note" aria-live="polite" className="mt-1.5 text-sm text-ink-muted">
          {eligible === 0
            ? null
            : shortened
              ? t(newOnly ? 'form.shortenedNew' : 'form.shortened', { count: eligible, length })
              : null}
        </p>
      </div>

      {eligible === 0 ? (
        newOnly && matching > 0 ? (
          <Alert tone="caution" title={t('form.allSeen.title')}>
            <p>{t('form.allSeen.body')}</p>
          </Alert>
        ) : (
          <Alert tone="caution" title={t('form.noMatch.title')}>
            <p>{t('form.noMatch.body')}</p>
          </Alert>
        )
      ) : null}

      {broader.length > 0 ? (
        <div className="rounded-card border border-line bg-paper p-4">
          <p className="text-sm font-semibold">{t('form.longer')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {broader.map((option) => (
              <Button key={option.label} variant="secondary" size="sm" onClick={option.apply}>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t-[1.5px] border-ink pt-5">
        <p className="text-sm text-ink-muted">
          {eligible > 0 ? (
            <>
              {t.rich('form.summary.count', {
                count: length,
                scope: scopeLabel,
                strong: (chunks) => <span className="font-semibold text-ink">{chunks}</span>,
              })}
              {/* One text run: separate pieces jumped between lines when the web font arrived. */}
              {` · ${[
                t(`form.summary.${difficulty}`),
                ...(newOnly ? [t('form.summary.newOnly')] : []),
                t('form.summary.untimed'),
                t('form.summary.check'),
                t('form.summary.bank', { count: total, exam: examLabel }),
              ].join(' · ')}`}
            </>
          ) : (
            t('form.nothing')
          )}
        </p>
        <div className="mt-4">
          <Button onClick={() => void start()} disabled={eligible === 0} loading={submitting} size="lg">
            {submitting
              ? t('form.preparing')
              : eligible === 0
                ? t('form.startPractising')
                : t('form.startLength', { count: length })}
          </Button>
        </div>
        {guestNote ? <p className="mt-3 text-sm text-ink-subtle">{guestNote}</p> : null}
      </div>
    </div>
  );
}
