import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Small presentational primitives shared by every page.
 *
 * Deliberately plain: no component library, no runtime theming, and every
 * interactive element stays a real <button> or <a> so keyboard and screen
 * reader behaviour is the browser's, not ours to re-implement.
 */

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded font-medium no-underline ' +
  'transition-colors disabled:cursor-not-allowed disabled:opacity-55';

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-accent-contrast hover:bg-accent-strong',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-surface-sunken',
  quiet: 'text-accent hover:bg-accent-soft',
  danger: 'border border-negative text-negative hover:bg-negative-soft',
} as const;

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm min-h-9',
  md: 'px-4 py-2.5 text-[0.95rem] min-h-11',
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

export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li';
}) {
  return (
    <Tag className={cx('rounded-card border border-line bg-surface p-5', className)}>{children}</Tag>
  );
}

const BADGE_TONES = {
  neutral: 'bg-surface-sunken text-ink-muted border-line',
  accent: 'bg-accent-soft text-accent-strong border-accent-soft',
  positive: 'bg-positive-soft text-positive border-positive-soft',
  caution: 'bg-caution-soft text-caution border-caution-soft',
  negative: 'bg-negative-soft text-negative border-negative-soft',
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
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const ALERT_TONES = {
  info: { box: 'border-accent bg-accent-soft', title: 'text-accent-strong' },
  positive: { box: 'border-positive bg-positive-soft', title: 'text-positive' },
  caution: { box: 'border-caution bg-caution-soft', title: 'text-caution' },
  negative: { box: 'border-negative bg-negative-soft', title: 'text-negative' },
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
    <div
      role={role}
      className={cx('rounded-card border-s-4 border-y border-e border-line p-4', styles.box, className)}
    >
      {title ? <p className={cx('font-semibold', styles.title)}>{title}</p> : null}
      {children ? <div className={cx('text-sm text-ink', title && 'mt-1')}>{children}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------

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
    <div className="mb-8">
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-ink-subtle">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{title}</h1>
      {lead ? <p className="mt-3 max-w-2xl text-lg text-ink-muted">{lead}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function Container({
  children,
  size = 'default',
  className,
}: {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide';
  className?: string;
}) {
  const width =
    size === 'narrow' ? 'max-w-3xl' : size === 'wide' ? 'max-w-7xl' : 'max-w-6xl';
  return <div className={cx('mx-auto px-4 py-10 sm:px-6', width, className)}>{children}</div>;
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
              <Link href={crumb.href}>{crumb.label}</Link>
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
    <div className="rounded-card border border-dashed border-line-strong bg-surface p-8 text-center">
      <h2 className="font-serif text-lg">{title}</h2>
      {children ? <div className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{children}</div> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------

/**
 * Honest labelling of how close a practice format is to the real exam.
 * Every blueprint carries one; it is never omitted.
 */
export function FidelityBadge({ fidelity }: { fidelity: 'exam_accurate' | 'approximation' | 'practice_only' }) {
  if (fidelity === 'exam_accurate') {
    return <Badge tone="positive">Matches the published exam rules</Badge>;
  }
  if (fidelity === 'approximation') {
    return <Badge tone="caution">Close approximation</Badge>;
  }
  return <Badge tone="neutral">Study practice, not a simulation</Badge>;
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
export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const safeMax = Math.max(1, max);
  const percent = Math.min(100, Math.round((value / safeMax) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
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
