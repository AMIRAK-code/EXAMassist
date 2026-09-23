import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Presentational primitives.
 *
 * Deliberately plain: no component library, no runtime theming, and every
 * interactive element stays a real <button> or <a> so keyboard behaviour and
 * screen reader semantics are the browser's rather than ours to re-implement.
 */

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium no-underline ' +
  'transition-[background-color,border-color,color,box-shadow] duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-accent-contrast shadow-card hover:bg-accent-strong',
  secondary: 'border border-line-strong bg-surface text-ink hover:border-ink-subtle hover:bg-surface-sunken',
  quiet: 'text-accent hover:bg-accent-soft',
  danger: 'border border-negative-line bg-negative-soft text-negative hover:border-negative',
} as const;

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm min-h-9',
  md: 'px-4 py-2.5 text-[0.9375rem] min-h-11',
  lg: 'px-6 py-3 text-base min-h-12',
} as const;

export interface ButtonStyleProps {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  full?: boolean;
}

export function buttonClass({ variant = 'primary', size = 'md', full }: ButtonStyleProps = {}): string {
  return cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], full && 'w-full');
}

export function Button({
  variant,
  size,
  full,
  className,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  return <button {...props} className={cx(buttonClass({ variant, size, full }), className)} />;
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link {...props} className={cx(buttonClass({ variant, size, full }), className)} />;
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({
  children,
  className,
  as: Tag = 'div',
  padding = 'md',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}) {
  const pad = padding === 'none' ? '' : padding === 'sm' ? 'p-4' : padding === 'lg' ? 'p-6 sm:p-8' : 'p-5';
  return (
    <Tag className={cx('rounded-card border border-line bg-surface shadow-card', pad, className)}>
      {children}
    </Tag>
  );
}

const BADGE_TONES = {
  neutral: 'bg-surface-sunken text-ink-muted border-line',
  accent: 'bg-accent-soft text-accent-strong border-accent-line',
  positive: 'bg-positive-soft text-positive border-positive-line',
  caution: 'bg-caution-soft text-caution border-caution-line',
  negative: 'bg-negative-soft text-negative border-negative-line',
} as const;

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const ALERT_TONES = {
  info: { box: 'border-s-accent bg-accent-soft/60 border-accent-line', title: 'text-accent-strong' },
  positive: { box: 'border-s-positive bg-positive-soft/70 border-positive-line', title: 'text-positive' },
  caution: { box: 'border-s-caution bg-caution-soft/70 border-caution-line', title: 'text-caution' },
  negative: { box: 'border-s-negative bg-negative-soft/70 border-negative-line', title: 'text-negative' },
} as const;

export function Alert({
  tone = 'info',
  title,
  children,
  className,
  role = 'note',
}: {
  tone?: keyof typeof ALERT_TONES;
  title?: string;
  children?: ReactNode;
  className?: string;
  role?: 'note' | 'alert' | 'status';
}) {
  const styles = ALERT_TONES[tone];
  return (
    <div role={role} className={cx('rounded-card border border-s-4 p-4', styles.box, className)}>
      {title ? <p className={cx('font-semibold', styles.title)}>{title}</p> : null}
      {children ? (
        <div className={cx('text-sm leading-relaxed text-ink', title && 'mt-1')}>{children}</div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function Container({
  children,
  size = 'default',
  className,
}: {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide';
  className?: string;
}) {
  const width = size === 'narrow' ? 'max-w-3xl' : size === 'wide' ? 'max-w-7xl' : 'max-w-6xl';
  return <div className={cx('mx-auto px-4 py-10 sm:px-6 sm:py-12', width, className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow ? (
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      {lead ? <p className="mt-3.5 text-lg leading-relaxed text-ink-muted">{lead}</p> : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

/** A titled section break for long pages. */
export function SectionHeading({
  title,
  description,
  action,
  id,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        <h2 id={id} className="text-2xl">
          {title}
        </h2>
        {description ? <p className="mt-1.5 text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: Array<{ href?: string; label: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {trail.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden="true" className="px-1 text-ink-subtle">
                /
              </span>
            ) : null}
            {crumb.href ? (
              <Link href={crumb.href} className="no-underline hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
      <h2 className="text-lg">{title}</h2>
      {children ? (
        <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{children}</div>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data display
// ---------------------------------------------------------------------------

/** A single headline figure. `of` renders as a quieter denominator. */
export function Stat({
  label,
  value,
  of,
  hint,
  tone = 'neutral',
}: {
  label: string;
  value: ReactNode;
  of?: ReactNode;
  hint?: string;
  tone?: 'neutral' | 'positive' | 'negative' | 'accent';
}) {
  const valueTone =
    tone === 'positive'
      ? 'text-positive'
      : tone === 'negative'
        ? 'text-negative'
        : tone === 'accent'
          ? 'text-accent'
          : 'text-ink';
  return (
    <div>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={cx('mt-1 font-serif text-3xl font-semibold tabular-nums', valueTone)}>
        {value}
        {of !== undefined ? (
          <span className="text-lg font-normal text-ink-subtle"> / {of}</span>
        ) : null}
      </p>
      {hint ? <p className="mt-1 text-xs leading-snug text-ink-subtle">{hint}</p> : null}
    </div>
  );
}

const METER_TONES = {
  neutral: 'bg-line-strong',
  accent: 'bg-accent',
  positive: 'bg-positive',
  caution: 'bg-caution',
  negative: 'bg-negative',
} as const;

/**
 * A proportion bar with a real text equivalent. The number is always present as
 * text; the bar is a visual aid layered on top, never the only carrier.
 */
export function Meter({
  value,
  max = 1,
  label,
  tone = 'accent',
  showTrack = true,
}: {
  value: number;
  max?: number;
  label: string;
  tone?: keyof typeof METER_TONES;
  showTrack?: boolean;
}) {
  const percent = Math.max(0, Math.min(100, Math.round((value / (max || 1)) * 100)));
  return (
    <div
      role="img"
      aria-label={`${label}: ${percent}%`}
      className={cx('h-1.5 w-full overflow-hidden rounded-full', showTrack && 'bg-surface-sunken')}
    >
      <div className={cx('h-full rounded-full', METER_TONES[tone])} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function DefinitionList({ items }: { items: Array<{ term: string; value: ReactNode }> }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(9rem,auto)_1fr]">
      {items.map((item) => (
        <div key={item.term} className="contents">
          <dt className="text-sm font-medium text-ink-muted">{item.term}</dt>
          <dd className="text-sm text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Accessible progress bar with a real text equivalent. */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const safeMax = Math.max(1, max);
  const percent = Math.min(100, Math.round((value / safeMax) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="font-medium tabular-nums">
          {value} / {max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2 overflow-hidden rounded-full bg-surface-sunken"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product-specific
// ---------------------------------------------------------------------------

/**
 * Honest labelling of how close a practice format is to the real exam. Every
 * blueprint carries one; it is never omitted.
 */
export function FidelityBadge({
  fidelity,
}: {
  fidelity: 'exam_accurate' | 'approximation' | 'practice_only';
}) {
  if (fidelity === 'exam_accurate') {
    return <Badge tone="positive">Matches the published exam rules</Badge>;
  }
  if (fidelity === 'approximation') {
    return <Badge tone="caution">Close approximation</Badge>;
  }
  return <Badge tone="neutral">Study practice, not a simulation</Badge>;
}
