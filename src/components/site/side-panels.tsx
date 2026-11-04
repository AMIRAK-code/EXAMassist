'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { BrowseTree } from '@/lib/content/browse';
import { BrowsePanel } from './browse-panel';
import { StudyPanel, useStudyPanel } from './study-panel';
import { showsPanels } from './panel-paths';
import type { AccountState } from './nav-items';

/** Wide enough for both panels beside a page's own column: Tailwind's `wide:` (src/app/globals.css). */
const DOCKED_QUERY = '(min-width: 90rem)';

type Which = 'browse' | 'study';

/**
 * The page's main column with the site's two side panels: on the left,
 * every exam and guide; on the right, the learner's study plan.
 *
 * From the `wide` breakpoint both sit beside the page, each scrolling on its
 * own. Below it they would crowd the page, so a tab on each edge of the
 * screen opens its panel as a modal drawer: the browser's own <dialog>, so focus stays in
 * it, Escape closes it and focus returns to the button. Pages where they would
 * distract (src/components/site/panel-paths.ts) get the main column alone.
 *
 * DOM order is visual order (browse, page, study plan), and the skip link
 * still lands on <main>.
 */
export function SidePanels({
  browse,
  account,
  deferred,
  children,
}: {
  browse: BrowseTree;
  account: AccountState;
  deferred: boolean;
  children: ReactNode;
}) {
  const t = useTranslations('common.panels');
  const pathname = usePathname() ?? '/';
  const shown = showsPanels(pathname);
  const docked = useMediaQuery(DOCKED_QUERY);
  const [open, setOpen] = useState<Which | null>(null);
  const openers = { browse: useRef<HTMLButtonElement>(null), study: useRef<HTMLButtonElement>(null) };

  // The study plan is fetched only once it can be seen: docked, or its drawer open.
  const study = useStudyPanel({ served: account, deferred, active: shown && (docked || open === 'study') });

  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (docked) setOpen(null);
  }, [docked]);

  if (!shown) {
    return (
      <main id="main" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <div className="flex-1 wide:grid wide:grid-cols-[16rem_minmax(0,1fr)_19rem]">
      {/* Links only, so a navigation landmark (BrowsePanel's <nav>) rather than a complementary one. */}
      <div className="hidden border-e border-line wide:block">
        <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-8">
          <BrowsePanel tree={browse} headingId="browse-panel-heading" />
        </div>
      </div>

      {/* Before <main> so they come first from the keyboard; the skip link passes them. */}
      <div className="wide:hidden">
        <PanelButton which="browse" opener={openers.browse} open={open} onOpen={setOpen} label={t('browse.open')} />
        <PanelButton which="study" opener={openers.study} open={open} onOpen={setOpen} label={t('study.open')} />
      </div>

      {/* A phone's 16 px page gutter is narrower than the edge tabs: widen it to their 24 px. */}
      <main id="main" className="min-w-0 px-2 sm:px-0">
        {children}
      </main>

      <aside aria-labelledby="study-panel-heading" className="hidden border-s border-line wide:block">
        <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto px-5 py-8">
          <StudyPanel state={study} headingId="study-panel-heading" />
        </div>
      </aside>

      {!docked ? (
        <>
          <PanelDrawer
            id="browse-drawer"
            side="start"
            open={open === 'browse'}
            onClose={() => setOpen(null)}
            returnFocus={openers.browse}
            labelledBy="browse-drawer-heading"
            closeLabel={t('close')}
          >
            {open === 'browse' ? <BrowsePanel tree={browse} headingId="browse-drawer-heading" /> : null}
          </PanelDrawer>
          <PanelDrawer
            id="study-drawer"
            side="end"
            open={open === 'study'}
            onClose={() => setOpen(null)}
            returnFocus={openers.study}
            labelledBy="study-drawer-heading"
            closeLabel={t('close')}
          >
            {open === 'study' ? <StudyPanel state={study} headingId="study-drawer-heading" /> : null}
          </PanelDrawer>
        </>
      ) : null}
    </div>
  );
}

/**
 * A panel's tab on its own edge of the screen, just under the sticky header:
 * an icon showing which side the panel opens from, named for screen readers
 * and in a tooltip. It sits in the page gutter (24 px wide, 44 px tall), so it
 * takes no row of its own.
 */
function PanelButton({
  which,
  opener,
  open,
  onOpen,
  label,
}: {
  which: Which;
  opener: RefObject<HTMLButtonElement | null>;
  open: Which | null;
  onOpen: (which: Which) => void;
  label: string;
}) {
  const start = which === 'browse';
  return (
    <button
      ref={opener}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open === which}
      aria-controls={`${which}-drawer`}
      aria-label={label}
      title={label}
      onClick={() => onOpen(which)}
      className={
        'fixed top-[4.75rem] z-30 inline-flex h-11 w-6 items-center justify-center border border-line-strong bg-paper text-ink shadow-raised hover:border-ink hover:bg-surface ' +
        (start ? 'start-0 rounded-e-control border-s-0' : 'end-0 rounded-s-control border-e-0')
      }
    >
      {/* A window with its side bar shaded: the side the panel opens from. */}
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={start ? undefined : '-scale-x-100'}>
        <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.75 3v12" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2.75" y="3.75" width="3.25" height="10.5" rx="1" fill="currentColor" opacity="0.35" />
      </svg>
    </button>
  );
}

/** A side drawer over the page: a modal <dialog>, closed by Escape, its button or a click outside it. */
function PanelDrawer({
  id,
  side,
  open,
  onClose,
  returnFocus,
  labelledBy,
  closeLabel,
  children,
}: {
  id: string;
  side: 'start' | 'end';
  open: boolean;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
  labelledBy: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) {
      element.close();
      returnFocus.current?.focus();
    }
  }, [open, returnFocus]);

  const close = useCallback(() => onClose(), [onClose]);

  return (
    <dialog
      ref={dialog}
      id={id}
      aria-labelledby={labelledBy}
      data-side-panel
      // Escape closes a modal dialog natively; keep React's state in step.
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={
        'fixed inset-y-0 m-0 h-dvh max-h-none w-[min(22rem,calc(100vw-2.5rem))] max-w-none overflow-y-auto border-line-strong bg-paper p-0 text-ink ' +
        'backdrop:bg-ink/40 ' +
        (side === 'start' ? 'start-0 border-e' : 'end-0 start-auto border-s')
      }
    >
      <div className="sticky top-0 z-10 flex justify-end border-b border-line bg-paper px-3 py-2">
        <button
          type="button"
          onClick={close}
          className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-semibold text-ink hover:bg-surface-sunken"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {closeLabel}
        </button>
      </div>
      <div className="px-5 pb-10 pt-4">{children}</div>
    </dialog>
  );
}

/** Whether a media query matches; false on the server and before hydration. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}
