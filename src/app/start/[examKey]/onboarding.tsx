'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button, ButtonLink, Card, cx } from '@/components/ui';

export interface OnboardingStep {
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
}

/**
 * Four short screens before an exam: what it is, how practice works, what the
 * results show, and the choice between Premium and the free test. "Skip" is
 * always there and goes straight to the free test; finishing goes to the
 * plans. Nothing is asked or stored.
 */
export function Onboarding({
  steps,
  choice,
  plansHref,
  freeTestHref,
}: {
  steps: OnboardingStep[];
  choice: { free: string[]; premium: string[]; freeLabel: string };
  plansHref: string;
  freeTestHref: string;
}) {
  const total = steps.length + 1;
  const [index, setIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new screen's heading, so a screen reader hears it and a
  // keyboard user starts from the top. Not on first load.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [index]);

  const go = (next: number) => {
    moved.current = true;
    setIndex(next);
  };

  const last = index === total - 1;
  const step = steps[index];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-ink-muted" aria-live="polite">
          Step {index + 1} of {total}
        </p>
        {!last ? (
          <Link href={freeTestHref} className="text-sm font-semibold">
            Skip to the free test
          </Link>
        ) : null}
      </div>
      <div className="mb-8 grid grid-cols-4 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cx('h-1.5 rounded-full', i <= index ? 'bg-accent' : 'bg-line')} />
        ))}
      </div>

      {!last && step ? (
        <section aria-labelledby="onboarding-heading">
          <p className="eyebrow mb-3">{step.eyebrow}</p>
          <h1 id="onboarding-heading" ref={heading} tabIndex={-1} className="text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] leading-[1.08] tracking-[-0.02em] outline-none">
            {step.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{step.lead}</p>
          <ul className="mt-6 space-y-3">
            {step.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-labelledby="onboarding-heading">
          <p className="eyebrow mb-3">Your choice</p>
          <h1 id="onboarding-heading" ref={heading} tabIndex={-1} className="text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] leading-[1.08] tracking-[-0.02em] outline-none">
            How would you like to start?
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card padding="lg" className="border-2 border-accent">
              <h2 className="font-heading text-xl font-semibold">Premium</h2>
              <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm">
                {choice.premium.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ButtonLink href={plansHref} full className="mt-5">
                See Premium plans
              </ButtonLink>
            </Card>
            <Card padding="lg">
              <h2 className="font-heading text-xl font-semibold">Free test</h2>
              <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm">
                {choice.free.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ButtonLink href={freeTestHref} variant="secondary" full className="mt-5">
                {choice.freeLabel}
              </ButtonLink>
            </Card>
          </div>
        </section>
      )}

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        {index > 0 ? (
          <Button variant="secondary" onClick={() => go(index - 1)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {!last ? (
          <Button onClick={() => go(index + 1)}>{index === total - 2 ? 'See my options' : 'Next'}</Button>
        ) : (
          <ButtonLink href={plansHref}>Continue to plans</ButtonLink>
        )}
      </div>
    </div>
  );
}
