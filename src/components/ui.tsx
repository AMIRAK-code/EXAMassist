import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Presentational primitives.
 *
 * Deliberately plain: no component library, no runtime theming, and every
 * interactive element stays a real <button> or <a> so keyboard behaviour and
 * screen reader semantics are the browser's rather than ours to re-implement.
 *
 * Shape follows role: editorial surfaces (cards, alerts) are nearly square,
 * things you press (buttons, inputs, chips) are rounder.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-control border font-semibold no-underline ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:border-line-strong disabled:bg-surface-sunken disabled:text-ink-subtle ' +
  'disabled:active:translate-y-0 aria-disabled:cursor-not-allowed';

const BUTTON_VARIANTS = {
  primary: 'border-transparent bg-accent text-accent-contrast hover:bg-accent-strong hover:text-accent-contrast',
  ink: 'border-transparent bg-ink text-ink-inverse hover:bg-black hover:text-ink-inverse',
  secondary: 'border-line-strong bg-surface text-ink hover:border-ink hover:bg-surface hover:text-ink',
  quiet: 'border-transparent text-accent hover:bg-accent-soft hover:text-accent-ink',
  danger: 'border-negative-line bg-negative-soft text-negative hover:border-negative hover:text-negative',
} as const;

const BUTTON_SIZES = {
  sm: 'min-h-10 px-3.5 text-sm',
  md: 'min-h-11 px-5 text-[0.9375rem]',
  lg: 'min-h-13 px-6 text-base',
} as const;

export interface ButtonStyleProps {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  full?: boolean;
}

export function buttonClass({ variant = 'primary', size = 'md', full }: ButtonStyleProps = {}): string {
  return cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], full && 'w-full');
}

/** A small indeterminate spinner. Motion is disabled under reduced-motion. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={cx('size-4 animate-spin motion-reduce:animate-none', className)}
      fill="none"
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M10 2.5a7.5 7.5 0 0 1 7.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant,
  size,
  full,
  loading,
  className,
  children,
  disabled,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(buttonClass({ variant, size, full }), className)}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
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
  return <Tag className={cx('rounded-card border border-line bg-surface', pad, className)}>{children}</Tag>;
}

const BADGE_TONES = {
  neutral: 'bg-surface text-ink-muted border-line-strong',
  accent: 'bg-accent-soft text-accent-ink border-accent-line',
  positive: 'bg-positive-soft text-positive border-positive-line',
  caution: 'bg-caution-soft text-caution border-caution-line',
  negative: 'bg-negative-soft text-negative border-negative-line',
  highlight: 'bg-highlight text-ink border-highlight',
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
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Tone glyphs, so an alert's meaning never rests on its colour alone. */
function ToneIcon({ tone }: { tone: 'info' | 'positive' | 'caution' | 'negative' }) {
  const common = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true } as const;
  if (tone === 'positive') {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="8" fill="currentColor" />
        <path d="M5.2 9.3l2.4 2.3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tone === 'negative') {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="8" fill="currentColor" />
        <path d="M6 6l6 6M12 6l-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (tone === 'caution') {
    return (
      <svg {...common}>
        <path d="M9 1.5l8 14.5H1z" fill="currentColor" />
        <path d="M9 7v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="13.4" r="1" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="9" cy="9" r="8" fill="currentColor" />
      <path d="M9 8v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="5.3" r="1" fill="#fff" />
    </svg>
  );
}

const ALERT_TONES = {
  info: { box: 'border-accent-line bg-accent-soft/70', icon: 'text-accent', title: 'text-accent-ink' },
  positive: { box: 'border-positive-line bg-positive-soft/80', icon: 'text-positive', title: 'text-positive' },
  caution: { box: 'border-caution-line bg-caution-soft/80', icon: 'text-caution', title: 'text-caution' },
  negative: { box: 'border-negative-line bg-negative-soft/80', icon: 'text-negative', title: 'text-negative' },
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
    <div role={role} className={cx('flex gap-3 rounded-card border p-4', styles.box, className)}>
      <span className={cx('mt-0.5 shrink-0', styles.icon)}>
        <ToneIcon tone={tone} />
      </span>
      <div className="min-w-0 flex-1">
        {title ? <p className={cx('font-semibold', styles.title)}>{title}</p> : null}
        {children ? (
          <div className={cx('text-sm leading-relaxed text-ink', title && 'mt-1')}>{children}</div>
        ) : null}
      </div>
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

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('eyebrow', className)}>{children}</p>;
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
      {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
      <h1 className="text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] leading-[1.05] tracking-[-0.03em]">{title}</h1>
      {lead ? <p className="mt-4 text-lg leading-relaxed text-ink-muted">{lead}</p> : null}
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
              <Link href={crumb.href} className="text-ink-muted no-underline hover:text-ink hover:underline">
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
      <p className={cx('mt-1 font-heading text-3xl font-bold tabular-nums tracking-tight', valueTone)}>
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

export type FormatStatus = 'open' | 'notyet' | 'notoffered';

const STATUS_LABEL: Record<FormatStatus, string> = {
  open: 'Open',
  notyet: 'Not yet',
  notoffered: 'Not offered',
};

/** Shape-coded status marks: a filled tick, a half circle, a dash. */
export function StatusIcon({ status }: { status: FormatStatus }) {
  if (status === 'open') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 text-accent">
        <circle cx="7" cy="7" r="6.25" fill="currentColor" />
        <path d="M4 7.2l2 1.9L10 5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'notyet') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 text-ink-muted">
        <circle cx="7" cy="7" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 1.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 text-ink-subtle">
      <circle cx="7" cy="7" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Whether a format can be started, with a shape and a word, never colour alone. */
export function StatusBadge({ status, children }: { status: FormatStatus; children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
      <StatusIcon status={status} />
      {children ?? STATUS_LABEL[status]}
    </span>
  );
}
