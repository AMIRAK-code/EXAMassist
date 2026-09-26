import Link from 'next/link';
import type { ContinueStudying } from '@/lib/learning/continue';
import { buttonClass, cx } from '@/components/ui';

/**
 * A slim line above the hero for a returning learner.
 *
 * Fixed height and a single truncated line, so the web font arriving cannot
 * change its height and push the hero down (docs/REDESIGN.md §14). The full
 * text stays in the page for screen readers.
 */
export function ContinueStrip({ strip }: { strip: ContinueStudying }) {
  return (
    <section aria-label="Continue studying" className="border-b border-line bg-accent-soft">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        {/* On a phone the label is read out but not shown, leaving the line for the details. */}
        <p className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold text-accent-ink max-sm:sr-only">Continue studying</span>
          <span aria-hidden="true" className="max-sm:hidden">
            {' · '}
          </span>
          <span className="text-ink">{strip.detail}</span>
        </p>
        <Link href={strip.href} className={cx(buttonClass({ size: 'sm' }), 'shrink-0')}>
          {strip.actionLabel}
        </Link>
      </div>
    </section>
  );
}
