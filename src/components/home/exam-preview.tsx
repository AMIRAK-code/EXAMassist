'use client';

import Link from 'next/link';
import { useRef, useState, useTransition, type ReactNode } from 'react';
import type { ExamChoice } from '@/lib/home/home-data';
import type { SampleView } from '@/lib/content/sample-view';
import { StimulusView } from '@/components/stimulus-view';
import { Button, buttonClass, cx } from '@/components/ui';
import { GUEST_NOTE_SHORT } from '@/components/site/nav-items';

/**
 * The homepage's exam selector and sample question.
 *
 * Choosing an exam swaps the sample and the destination without moving focus.
 * The sample is public content: checking an answer happens here in the
 * browser, against the sample's own published key, and records nothing.
 */

type Loaded = SampleView | null; // null: no sample is available for that exam

function Tick({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ExamPreview({
  choices,
  initialHub,
  initialSample,
  intro,
}: {
  choices: ExamChoice[];
  initialHub: string;
  initialSample: Loaded;
  intro: ReactNode;
}) {
  // The chips and the destination follow `selectedHub` at once. The sample card
  // follows `hub` in a transition, so the click paints before the heavier swap.
  const [selectedHub, setSelectedHub] = useState(initialHub);
  const [hub, setHub] = useState(initialHub);
  const [switching, startTransition] = useTransition();
  const [samples, setSamples] = useState<Record<string, Loaded>>({ [initialHub]: initialSample });
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const verdictRef = useRef<HTMLParagraphElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);

  const choice = choices.find((c) => c.hubSlug === selectedHub) ?? choices[0];
  const shown = choices.find((c) => c.hubSlug === hub) ?? choices[0];
  const sample = samples[hub];
  const loading = sample === undefined && !failed[hub];

  async function load(target: string) {
    setFailed((current) => ({ ...current, [target]: false }));
    try {
      const response = await fetch(`/api/samples/${encodeURIComponent(target)}`);
      if (response.status === 404) {
        setSamples((current) => ({ ...current, [target]: null }));
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as SampleView;
      setSamples((current) => ({ ...current, [target]: data }));
    } catch {
      setFailed((current) => ({ ...current, [target]: true }));
    }
  }

  function choose(target: string) {
    setSelectedHub(target);
    startTransition(() => {
      setHub(target);
      setPicked(null);
      setChecked(false);
    });
    if (samples[target] === undefined) void load(target);
    // Keep the choice in the address, so a reload or a shared link opens it.
    // Deferred: the router syncs its state on replaceState, and that work does
    // not belong between the click and its paint.
    window.setTimeout(() => window.history.replaceState(null, '', `?exam=${encodeURIComponent(target)}`), 0);
  }

  function check() {
    if (!picked) return;
    setChecked(true);
    // The button that was focused disappears, so move to the result it produced.
    requestAnimationFrame(() => verdictRef.current?.focus());
  }

  function reset() {
    setPicked(null);
    setChecked(false);
    requestAnimationFrame(() => firstOptionRef.current?.focus());
  }

  const correct = sample ? sample.options.find((o) => o.id === sample.correctOptionId) : undefined;
  const chosen = sample && picked ? sample.options.find((o) => o.id === picked) : undefined;
  const right = checked && picked === sample?.correctOptionId;

  return (
    <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
      <div className="flex flex-col gap-8 lg:col-span-7 lg:pt-4">
        {intro}

        <fieldset className="min-w-0">
          <legend className="mb-3 text-sm font-semibold text-ink-muted">Which exam are you preparing for?</legend>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {choices.map((option) => {
              const selected = option.hubSlug === selectedHub;
              return (
                <label
                  key={option.hubSlug}
                  className={cx(
                    'relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] px-3 text-base font-semibold transition-colors sm:min-h-13 sm:px-5 sm:text-[1.0625rem]',
                    'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-accent',
                    selected ? 'border-ink bg-ink text-ink-inverse' : 'border-line-strong bg-surface text-ink hover:border-ink',
                  )}
                >
                  <input
                    type="radio"
                    name="exam"
                    value={option.hubSlug}
                    checked={selected}
                    onChange={() => choose(option.hubSlug)}
                    className="sr-only"
                  />
                  {selected ? (
                    <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
                  ) : null}
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-3">
            {choice.destinations.map((destination, index) => (
              <Link
                key={destination.href}
                href={destination.href}
                className={cx(
                  buttonClass({ variant: index === 0 ? 'primary' : 'secondary', size: 'lg' }),
                  'w-full sm:w-auto',
                )}
              >
                {destination.label}
                {index === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </Link>
            ))}
            <Link href={choice.guideHref} className="px-1 py-2 font-semibold text-ink underline decoration-accent underline-offset-4 hover:text-ink">
              {choice.guideLabel}
            </Link>
          </div>
          <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            {choice.facts.join(' · ').replace(/^./, (c) => c.toUpperCase())}
          </p>
          <p className="max-w-[52ch] text-sm leading-relaxed text-ink-subtle">{GUEST_NOTE_SHORT}</p>
        </div>
      </div>

      <div className="relative lg:col-span-5 lg:pt-14">
        <p
          aria-hidden="true"
          className="accent-italic absolute -top-1 left-1 hidden items-end gap-1.5 text-[1.6rem] leading-none text-accent lg:flex"
        >
          Try it, no sign-up
          <svg width="56" height="40" viewBox="0 0 64 46" fill="none">
            <path d="M4 8c22-6 42 4 50 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M46 32l8 7 3-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>

        <section
          aria-labelledby="sample-heading"
          className="rounded-card border-[1.5px] border-ink bg-surface shadow-[5px_5px_0_var(--color-ink)] sm:shadow-offset"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-[1.5px] border-ink px-4 py-3 sm:px-6">
            <h2 id="sample-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-accent">
              <span aria-hidden="true" className="text-lg font-normal leading-none">[</span>
              Sample question
              <span aria-hidden="true" className="text-lg font-normal leading-none">]</span>
            </h2>
            {sample ? (
              <p className="text-[0.8125rem] font-semibold text-ink-muted">
                {sample.examShortName} · {sample.topicLabel}
              </p>
            ) : null}
          </div>

          <div
            className={cx('min-h-[26rem] px-4 py-5 transition-opacity sm:px-6 sm:py-6', switching && 'opacity-60')}
            aria-busy={loading || switching || undefined}
          >
            {loading ? (
              <div role="status" className="space-y-3">
                <span className="sr-only">Loading the {shown.label} sample question</span>
                <div className="h-4 w-11/12 rounded bg-surface-sunken" />
                <div className="h-4 w-9/12 rounded bg-surface-sunken" />
                <div className="h-4 w-10/12 rounded bg-surface-sunken" />
                {[0, 1, 2, 3].map((n) => (
                  <div key={n} className="h-14 rounded-control border border-line bg-paper" />
                ))}
              </div>
            ) : failed[hub] ? (
              <div role="alert" className="space-y-4">
                <p>We couldn’t load the {shown.label} sample. Check your connection and try again.</p>
                <Button variant="secondary" onClick={() => void load(hub)}>
                  Try again
                </Button>
              </div>
            ) : !sample ? (
              <div className="space-y-4">
                <p>No sample question is available for the {shown.label} right now.</p>
                <Link href={shown.destinations[0].href}>Go to {shown.label} practice</Link>
              </div>
            ) : (
              <div key={sample.questionId}>
                {sample.stimulus ? (
                  <div className="mb-5">
                    <StimulusView stimulus={sample.stimulus} />
                  </div>
                ) : null}
                {sample.instructionsHtml ? (
                  <div
                    className="prose-academic mb-3 text-sm text-ink-muted"
                    dangerouslySetInnerHTML={{ __html: sample.instructionsHtml }}
                  />
                ) : null}
                <div
                  className={cx(
                    'prose-academic question-body mb-5 sm:text-[1.1875rem]',
                    sample.examKey === 'lsat' && 'font-serif',
                  )}
                  dangerouslySetInnerHTML={{ __html: sample.stemHtml }}
                />

                <fieldset disabled={checked} className="min-w-0">
                  <legend className="sr-only">Answer choices</legend>
                  <ul className="space-y-2.5">
                    {sample.options.map((option, index) => {
                      const isPicked = picked === option.id;
                      const isAnswer = option.id === sample.correctOptionId;
                      const tone = !checked
                        ? isPicked
                          ? 'border-ink bg-accent-soft'
                          : 'border-line-strong bg-surface hover:border-ink'
                        : isAnswer
                          ? 'border-positive bg-positive-soft'
                          : isPicked
                            ? 'border-negative bg-negative-soft'
                            : 'border-line bg-surface opacity-60';
                      const letter = !checked
                        ? isPicked
                          ? 'border-ink bg-ink text-ink-inverse'
                          : 'border-line-strong text-ink'
                        : isAnswer
                          ? 'border-positive bg-positive text-white'
                          : isPicked
                            ? 'border-negative bg-negative text-white'
                            : 'border-line-strong text-ink';
                      return (
                        <li key={option.id}>
                          <label
                            className={cx(
                              'flex min-h-14 cursor-pointer items-start gap-3 rounded-control border-[1.5px] px-3.5 py-3 transition-colors',
                              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                              checked && 'cursor-default',
                              tone,
                            )}
                          >
                            <input
                              ref={index === 0 ? firstOptionRef : undefined}
                              type="radio"
                              name={`sample-${sample.questionId}`}
                              value={option.id}
                              checked={isPicked}
                              onChange={() => setPicked(option.id)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={cx(
                                'inline-flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-sm font-bold',
                                letter,
                              )}
                            >
                              {option.label}
                            </span>
                            <span className="min-w-0 flex-1 pt-0.5 leading-snug">
                              <span className="sr-only">Option {option.label}: </span>
                              <span dangerouslySetInnerHTML={{ __html: option.html }} />
                            </span>
                            {checked && isAnswer ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-positive px-2 py-0.5 text-xs font-bold text-white">
                                <Tick />
                                Answer
                              </span>
                            ) : null}
                            {checked && isPicked && !isAnswer ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-negative px-2 py-0.5 text-xs font-bold text-white">
                                <Cross />
                                Your answer
                              </span>
                            ) : null}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>

                {!checked ? (
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Button size="lg" onClick={check} disabled={!picked} className="w-full sm:w-auto">
                      Check answer
                    </Button>
                    <span className="text-sm text-ink-subtle">
                      Editorial difficulty: {sample.difficulty}
                    </span>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    <p ref={verdictRef} tabIndex={-1} className="text-[1.0625rem] leading-relaxed outline-none">
                      <strong className={right ? 'text-positive' : 'text-negative'}>
                        {right ? 'Correct.' : 'Not this time.'}
                      </strong>{' '}
                      {right
                        ? `${correct?.label} is the answer. Here is the full working.`
                        : `You chose ${chosen?.label}. The answer is ${correct?.label}. Here is why.`}
                    </p>

                    {!right && chosen?.rationaleHtml ? (
                      <div className="rounded-control border-[1.5px] border-negative-line bg-negative-soft p-4">
                        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-negative">
                          Why {chosen.label} doesn’t work
                        </p>
                        <div
                          className="prose-academic text-[0.9375rem]"
                          dangerouslySetInnerHTML={{ __html: chosen.rationaleHtml }}
                        />
                        <p className="mt-2 text-sm text-ink-muted">
                          Written for this option in advance: a common route to it, not a claim about how
                          you reasoned.
                        </p>
                      </div>
                    ) : null}

                    <div className="border-t-[1.5px] border-dashed border-line-strong pt-4">
                      <h3 className="mb-2 text-lg">Worked explanation</h3>
                      <div
                        className="prose-academic text-[0.9375rem] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sample.explanationHtml }}
                      />
                    </div>

                    <details className="border-t border-line pt-3 text-[0.9375rem]">
                      <summary className="min-h-8 cursor-pointer font-semibold">A note on every other option</summary>
                      <ul className="mt-3 space-y-3">
                        {sample.options
                          .filter((option) => option.rationaleHtml)
                          .map((option) => (
                            <li key={option.id} className="flex gap-2.5">
                              <span className="font-bold">{option.label}</span>
                              <div
                                className="prose-academic min-w-0"
                                dangerouslySetInnerHTML={{ __html: option.rationaleHtml! }}
                              />
                            </li>
                          ))}
                      </ul>
                    </details>

                    <div className="flex flex-wrap items-center gap-3 border-t-[1.5px] border-ink pt-4">
                      <Link href={shown.destinations[0].href} className={cx(buttonClass({ size: 'md' }), 'w-full sm:w-auto')}>
                        Practise more {shown.label} questions
                      </Link>
                      <Button variant="secondary" onClick={reset}>
                        Try it again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="border-t border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink-muted sm:px-6">
            One question can’t show how ready you are. It shows how every answer is explained.
          </p>
        </section>
      </div>
    </div>
  );
}
