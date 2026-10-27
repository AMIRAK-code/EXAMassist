'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, cx } from '@/components/ui';
import { startPath } from '@/lib/billing/config';
import {
  defaultLength,
  eligibleCount,
  lengthOptions,
  type Difficulty,
  type PracticeFacet,
} from '@/lib/attempts/facets';

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

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

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
  const scopeLabel = skill ? `${skill.name} (${skill.domainName})` : (domainName ?? 'every topic');

  // Explicit ways to get a longer session, shown only when the current one is short.
  const broader: Array<{ label: string; apply: () => void }> = [];
  if (newOnly && matching > eligible && eligible < Math.max(5, requested)) {
    broader.push({ label: `Include questions you have seen (${matching})`, apply: () => setNewOnly(false) });
  }
  if (eligible < 5) {
    if (skill) {
      const inDomain = eligibleCount(pool, { domain: skill.domainSlug, difficulty });
      if (inDomain > eligible) {
        broader.push({
          label: `Practise all of ${skill.domainName} (${inDomain})`,
          apply: () => {
            setSkill(null);
            setDomain(skill.domainSlug);
          },
        });
      }
    }
    if (difficulty !== 'mixed') {
      const mixed = eligibleCount(pool, { ...filters, difficulty: 'mixed' });
      if (mixed > eligible) broader.push({ label: `Use mixed difficulty (${mixed})`, apply: () => setDifficulty('mixed') });
    }
    if (skill || domain) {
      broader.push({
        label: `Practise every ${examLabel} topic (${eligibleCount(pool, { difficulty })})`,
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
      setError('We could not reach the server. Check your connection and try again.');
      return;
    }

    const data = await response.json().catch(() => null);

    if (data?.error?.code === 'premium-required' || data?.error?.code === 'account-required') {
      window.location.assign(startPath(examKey));
      return;
    }
    if (!response.ok) {
      setSubmitting(false);
      const detail = data?.error?.detail;
      if (data?.error?.code === 'insufficient-content' && detail?.parts) {
        // The bank changed between loading this page and starting.
        const short = detail.parts.find((p: { sufficient: boolean }) => !p.sufficient);
        setError(
          `The reviewed bank no longer holds enough questions for this combination` +
            (short ? ` (${short.available} available, ${short.requested} requested).` : '.') +
            ' Reload the page to see the current counts.',
        );
        return;
      }
      setError(data?.error?.message ?? 'That session could not be started.');
      return;
    }

    // A brand-new guest session changes the header, which a client navigation
    // would not re-render, so the first session loads as a full page. Calling
    // router.refresh() beside router.push() instead can cancel the push.
    if (guest?.created) window.location.assign(`/attempt/${data.attemptId}`);
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
          <p className="mb-1.5 text-sm font-semibold">Skill</p>
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
              Remove skill filter
            </Button>
          </div>
          <p className="mt-1.5 text-sm text-ink-muted">
            This session is limited to one skill. Remove the filter to choose a topic instead.
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="practice-domain" className="mb-1.5 block text-sm font-semibold">
            Topic
          </label>
          <select
            id="practice-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            className="min-h-12 w-full rounded-control border-[1.5px] border-line-strong bg-surface px-3 text-base"
          >
            <option value="">Every topic ({eligibleCount(pool, { difficulty })})</option>
            {domains.map((option) => {
              const count = eligibleCount(pool, { domain: option.slug, difficulty });
              return (
                <option key={option.slug} value={option.slug} disabled={count === 0}>
                  {option.name} ({count})
                </option>
              );
            })}
          </select>
          <p className="mt-1.5 text-sm text-ink-muted">
            Counts are reviewed questions that match every setting on this form.
          </p>
        </div>
      )}

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Difficulty</legend>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((value) => {
            const count = eligibleCount(pool, { ...filters, difficulty: value });
            const selected = difficulty === value;
            return (
              <label
                key={value}
                className={cx(
                  'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-4 text-sm capitalize',
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
                {value}
                <span className={selected ? 'text-ink-inverse-muted' : 'text-ink-subtle'}>({count})</span>
              </label>
            );
          })}
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">
          Difficulty labels are our editorial judgement, not calibrated against test-taker data. A
          chosen level is used on its own; it is never padded with other levels.
        </p>
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
              <span className="font-semibold">New questions only</span>
              <span className="text-ink-subtle">{` (${unseenMatching} of ${matching} are new to you)`}</span>
            </span>
          </label>
          <p id="practice-new-note" className="mt-1 text-sm text-ink-muted">
            {newOnly
              ? 'Only questions you have never been shown. A session is never topped up with ones you have seen; if too few are left, it is shorter, or cannot start.'
              : `${matching - unseenMatching} of the ${matching} matching questions are ones you have been shown before. Those not seen recently are chosen first, but a repeat can be included; tick this to rule repeats out.`}
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor="practice-length" className="mb-1.5 block text-sm font-semibold">
          Number of questions
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
                ? `${option} (all of them)`
                : option}
            </option>
          ))}
        </select>
        <p id="practice-length-note" aria-live="polite" className="mt-1.5 text-sm text-ink-muted">
          {eligible === 0
            ? null
            : shortened
              ? `Only ${plural(eligible, newOnly ? 'new reviewed question matches' : 'reviewed question matches', newOnly ? 'new reviewed questions match' : 'reviewed questions match')} these settings, so this session has ${length}.`
              : null}
        </p>
      </div>

      {eligible === 0 ? (
        newOnly && matching > 0 ? (
          <Alert tone="caution" title="You have been shown every question that matches">
            <p>There is nothing new here. Include questions you have seen, or choose a broader option below.</p>
          </Alert>
        ) : (
          <Alert tone="caution" title="No reviewed questions match these settings">
            <p>Choose a broader option below, or change the topic or difficulty.</p>
          </Alert>
        )
      ) : null}

      {broader.length > 0 ? (
        <div className="rounded-card border border-line bg-paper p-4">
          <p className="text-sm font-semibold">Want a longer session?</p>
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
              <span className="font-semibold text-ink">{plural(length, 'question', 'questions')}</span>
              {/* One text run: separate pieces jumped between lines when the web font arrived. */}
              {` from ${scopeLabel} · ${difficulty === 'mixed' ? 'mixed difficulty' : `${difficulty} only`}${newOnly ? ' · new to you only' : ''} · untimed · check each answer to see its worked explanation · ${total} reviewed ${examLabel} questions in the bank`}
            </>
          ) : (
            'Nothing to start with these settings.'
          )}
        </p>
        <div className="mt-4">
          <Button onClick={() => void start()} disabled={eligible === 0} loading={submitting} size="lg">
            {submitting
              ? 'Preparing your session…'
              : eligible === 0
                ? 'Start practising'
                : `Start ${length}-question session`}
          </Button>
        </div>
        {guestNote ? <p className="mt-3 text-sm text-ink-subtle">{guestNote}</p> : null}
      </div>
    </div>
  );
}
