import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { SUPPORT, SUPPORT_LANGUAGE_NAMES, supportMailto } from '@/lib/support';
import { buttonClass, cx } from '@/components/ui';

/**
 * Human support, as a page section. A real person answers every message, in
 * any of the site's languages, within one business day (src/lib/support.ts):
 * in a field where support increasingly means a chatbot, that is worth saying
 * plainly. Server-rendered, so it works on the saved static pages too.
 */
export async function HumanSupport({ accent }: { accent: (chunks: ReactNode) => ReactNode }) {
  const t = await getTranslations('home.support');
  const languages = SUPPORT_LANGUAGE_NAMES.join(' · ');
  return (
    <section id="support" aria-labelledby="support-heading" className="scroll-mt-20 border-t-[1.5px] border-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:py-24">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 id="support-heading" className="display-l mt-4 max-w-[18ch]">
            {t.rich('title', { accent })}
          </h2>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed">{t('body', { days: SUPPORT.firstReplyBusinessDays })}</p>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-ink-muted">{t('what')}</p>
        </div>
        <div className="self-end border-t-[1.5px] border-ink pt-6 lg:border-s-[1.5px] lg:border-t-0 lg:ps-10 lg:pt-0">
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{t('replyTime.label')}</dt>
              <dd className="mt-1 text-lg">{t('replyTime.value', { days: SUPPORT.firstReplyBusinessDays })}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{t('languages.label')}</dt>
              <dd className="mt-1 text-lg">{languages}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{t('who.label')}</dt>
              <dd className="mt-1 text-lg">{t('who.value')}</dd>
            </div>
          </dl>
          <p className="mt-8">
            <a href={supportMailto()} className={cx(buttonClass({ variant: 'ink', size: 'lg' }), 'w-full sm:w-auto')}>
              {t('cta', { email: SUPPORT.email })}
            </a>
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            {t.rich('questionReports', { link: (chunks) => <Link href="/report-question">{chunks}</Link> })}
          </p>
        </div>
      </div>
    </section>
  );
}
