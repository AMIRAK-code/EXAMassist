'use client';

import { useTranslations } from 'next-intl';
import { cx } from '@/components/ui';
import type { SaveStatus } from './use-pending-saves';

/**
 * What the server has confirmed, in a few words: saving, saved, offline or
 * failed. "Saved" is shown only once the server has confirmed every answer;
 * an answer kept on the device is never called saved. Offline says where the
 * waiting answers are (this device, or only this page) and, in a timed
 * section, that the timer keeps running.
 *
 * Changes are announced politely, except while saving, which would chatter
 * on every keystroke.
 */
export function SaveIndicator({ status, timed, onRetry }: { status: SaveStatus; timed: boolean; onRetry: () => void }) {
  const t = useTranslations('player.save');
  const { state, unsaved, durable } = status;
  const timer = timed ? ` ${t('timerRuns')}` : '';

  let short: string;
  let long: string;
  switch (state) {
    case 'saving':
      short = t('savingShort');
      long = t('savingLong');
      break;
    case 'saved':
      short = t('savedShort');
      long = t('savedLong');
      break;
    case 'offline':
      short = unsaved > 0 ? t('offlineWaitingShort', { count: unsaved }) : t('offlineShort');
      long =
        unsaved > 0
          ? `${t(durable ? 'offlineDevice' : 'offlinePage', { count: unsaved })}${timer}`
          : `${t('offlineSaved')}${timer}`;
      break;
    case 'failed':
      short = unsaved > 0 ? t('failedShort', { count: unsaved }) : t('notSavedShort');
      long = unsaved > 0 ? t(durable ? 'failedDevice' : 'failedPage', { count: unsaved }) : t('stopped');
      break;
    default:
      short = t('idle');
      long = '';
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cx(
          'inline-flex min-w-[6.5rem] items-center justify-end gap-1.5 font-medium',
          state === 'offline' || state === 'failed' ? 'text-caution' : 'text-ink-muted',
        )}
        title={long || undefined}
        aria-hidden="true"
      >
        <StatusMark state={state} />
        {short}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'saving' ? '' : long}
      </span>
      {state === 'failed' && !status.halted ? (
        <button type="button" onClick={onRetry} className="font-semibold text-accent underline underline-offset-2">
          {t('retry')}
        </button>
      ) : null}
    </div>
  );
}

function StatusMark({ state }: { state: SaveStatus['state'] }) {
  if (state === 'saving') {
    return <span className="size-2 rounded-full border border-current border-t-transparent motion-safe:animate-spin" />;
  }
  if (state === 'saved') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.5 5 9l4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === 'offline') {
    return <span className="size-2 rounded-full border-[1.5px] border-current" />;
  }
  if (state === 'failed') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 2v5M6 9.2v.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return <span className="size-2 rounded-full bg-current opacity-40" />;
}
