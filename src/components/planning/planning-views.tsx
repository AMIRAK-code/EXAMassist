import Link from 'next/link';
import { cx } from '@/components/ui';

/**
 * The two views of the study plan: what to do (Plan) and what the evidence
 * says (Progress & readiness). Plain links, so they work without JavaScript;
 * the current one is marked for assistive technology as well as by fill.
 */

export type PlanningView = 'plan' | 'progress';

const VIEWS: Array<{ key: PlanningView; label: string; path: string }> = [
  { key: 'plan', label: 'Plan', path: '/study-plan' },
  { key: 'progress', label: 'Progress & readiness', path: '/study-plan/progress' },
];

export function planningHref(view: PlanningView, examKey: string | null): string {
  const path = VIEWS.find((v) => v.key === view)!.path;
  return examKey ? `${path}?exam=${encodeURIComponent(examKey)}` : path;
}

export function PlanningViews({ current, examKey }: { current: PlanningView; examKey: string | null }) {
  return (
    <nav aria-label="Study plan views" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {VIEWS.map((view) => {
          const active = view.key === current;
          return (
            <li key={view.key}>
              <Link
                href={planningHref(view.key, examKey)}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'inline-flex min-h-11 items-center rounded-full border-[1.5px] px-4 text-sm font-semibold no-underline',
                  active
                    ? 'border-ink bg-ink text-ink-inverse hover:text-ink-inverse'
                    : 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink',
                )}
              >
                {view.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
