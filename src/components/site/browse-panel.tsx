'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { BrowseLink, BrowseTree } from '@/lib/content/browse';
import { cx } from '@/components/ui';
import { hubForPath } from './panel-paths';

const LINK =
  'flex min-h-9 items-center rounded-control px-2 text-sm text-ink-muted no-underline hover:bg-surface-sunken hover:text-ink ' +
  'aria-[current=page]:bg-accent-soft aria-[current=page]:font-semibold aria-[current=page]:text-accent-ink';

/**
 * Every exam hub with its pages and practice, then every guide (the data is
 * src/lib/content/browse.ts). The page being read is marked with
 * aria-current, and its hub's group is open; every group is a native
 * disclosure, so the list stays short and works from the keyboard.
 */
export function BrowsePanel({ tree, headingId }: { tree: BrowseTree; headingId: string }) {
  const t = useTranslations('common.panels.browse');
  const locale = useLocale();
  const pathname = usePathname() ?? '/';
  const currentHub = hubForPath(pathname, tree);
  // Exam names and guide titles are published in English (CONTENT_LANG in
  // src/i18n/alternates.ts, which is not imported here: it pulls in the hubs).
  const contentLang = locale === 'en' ? undefined : 'en';
  const current = (href: string) => (pathname === href ? 'page' : undefined);

  const linkLabel = (link: BrowseLink) =>
    link.kind === 'practice' ? (link.variant ? t('practiceVariant', { variant: link.variant }) : t('practice')) : t(link.kind);

  return (
    <nav aria-labelledby={headingId}>
      <h2 id={headingId} className="eyebrow mb-3">
        {t('heading')}
      </h2>

      <Link href="/exams" aria-current={current('/exams')} className={cx(LINK, 'font-semibold text-ink')}>
        {t('allExams')}
      </Link>
      <ul className="mt-1 space-y-0.5">
        {tree.hubs.map((hub) => (
          <li key={hub.slug}>
            <details open={hub.slug === currentHub} className="group">
              <summary
                className={cx(
                  'flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-control px-2 text-sm font-medium text-ink hover:bg-surface-sunken',
                  '[&::-webkit-details-marker]:hidden',
                )}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-90 rtl:-scale-x-100">
                  <path d="M3 1.5L6.5 5 3 8.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span lang={contentLang}>{hub.name}</span>
              </summary>
              <ul className="mb-1 ms-4 border-s border-line ps-2">
                {hub.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} aria-current={current(link.href)} className={LINK}>
                      {linkLabel(link)}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>

      <h3 className="eyebrow mb-2 mt-7">{t('guidesHeading')}</h3>
      <Link href="/guides" aria-current={current('/guides')} className={cx(LINK, 'font-semibold text-ink')}>
        {t('allGuides')}
      </Link>
      <ul className="mt-1 space-y-0.5">
        {tree.guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={guide.href} aria-current={current(guide.href)} className={cx(LINK, 'min-h-0 flex-col items-start py-1.5')}>
              <span lang={contentLang} className="leading-snug">
                {guide.title}
              </span>
              {guide.hubLabel ? (
                <span lang={contentLang} className="text-2xs text-ink-subtle">
                  {guide.hubLabel}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
