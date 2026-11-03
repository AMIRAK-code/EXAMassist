import { getTranslations } from 'next-intl/server';
import { Markdown } from '@/components/content';
import { Alert, Card } from '@/components/ui';
import { SampleQuestions } from '@/components/guides/sample-questions';
import { CONTENT_LANG } from '@/i18n/alternates';
import { longDate } from '@/lib/content/page-dates';
import type { HubContent } from '@/lib/exams/hub-content';

/*
 * The editorial parts of an exam hub (src/lib/exams/hub-content.ts). They
 * carry the language they are written in (`lang`: English, whatever the
 * interface language, unless the hub is translated), and so do their labels.
 * Prose is set in the reading serif, which needs no download and so cannot
 * gain a line when the interface font arrives and push the page down
 * (docs/REDESIGN.md §18).
 */

type Props = { content: HubContent; lang?: string };

/** The direct answer under the heading, then where the next cycle stands and what to prepare for. */
export function HubIntro({ content, lang = CONTENT_LANG }: Props) {
  return (
    <div lang={lang}>
      <Markdown source={content.leadMd} className="prose-academic mb-8 font-serif text-lg" />
      {content.status ? <HubStatus content={content} lang={lang} className="mb-8" /> : null}
      {content.routes ? (
        <section aria-labelledby="hub-routes" className="mb-10">
          <h2 id="hub-routes" className="font-heading text-xl font-semibold">
            {content.routes.heading}
          </h2>
          <Markdown source={content.routes.bodyMd} className="prose-academic mt-3 font-serif" />
        </section>
      ) : null}
    </div>
  );
}

/** What is confirmed and what is not published yet, with the date it was checked and the sources. */
export async function HubStatus({ content, lang = CONTENT_LANG, className }: Props & { className?: string }) {
  const status = content.status;
  if (!status) return null;
  const t = await getTranslations({ locale: lang, namespace: 'exams.hubContent' });
  return (
    <section aria-labelledby="hub-status" lang={lang} className={className}>
      <Card>
        <h2 id="hub-status" className="font-heading text-xl font-semibold">
          {status.heading}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {t.rich('checkedOn', { date: () => <time dateTime={status.checkedOn}>{longDate(status.checkedOn, lang)}</time> })}
        </p>
        <Markdown source={status.bodyMd} className="prose-academic mt-4 font-serif" />
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-semibold text-accent">{t('sources')}</summary>
          <ul className="mt-2 space-y-1.5">
            {content.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noopener">
                  {source.label}
                </a>{' '}
                <span className="text-ink-muted">({source.publisher})</span>
              </li>
            ))}
          </ul>
        </details>
      </Card>
    </section>
  );
}

/** A translation no fluent human reviewer has checked yet says so, before anything else. */
export function HubTranslationNote({ content, lang = CONTENT_LANG }: Props) {
  if (!content.translationNote) return null;
  return (
    <div lang={lang} className="mb-8">
      <Alert tone="info" title={content.translationNote.title}>
        <Markdown source={content.translationNote.bodyMd} className="font-serif" />
      </Alert>
    </div>
  );
}

/** A note above exam details that describe a cycle that has ended. */
export function HubDetailsNote({ content, lang = CONTENT_LANG }: Props) {
  if (!content.detailsNote) return null;
  return (
    <div lang={lang} className="mb-8">
      <Alert tone="caution" title={content.detailsNote.title}>
        <Markdown source={content.detailsNote.bodyMd} className="font-serif" />
      </Alert>
    </div>
  );
}

/** Worked sample questions, with their own heading, before the routes into other hubs. */
export function HubSamples({ content, lang = CONTENT_LANG }: Props) {
  if (!content.samples) return null;
  return (
    <section id={content.samples.id} aria-labelledby={`${content.samples.id}-heading`} lang={lang} className="mt-12 scroll-mt-24">
      <h2 id={`${content.samples.id}-heading`} className="font-heading text-2xl font-semibold">
        {content.samples.heading}
      </h2>
      <Markdown source={content.samples.introMd} className="prose-academic mt-3 font-serif" />
      <SampleQuestions set={content.samples.set} lang={lang} />
    </section>
  );
}

/** How to prepare, after the samples it links back to. */
export function HubStudyPlan({ content, lang = CONTENT_LANG }: Props) {
  if (!content.studyPlan) return null;
  return (
    <section id={content.studyPlan.id} aria-labelledby={`${content.studyPlan.id}-heading`} lang={lang} className="mt-12 scroll-mt-24">
      <h2 id={`${content.studyPlan.id}-heading`} className="font-heading text-2xl font-semibold">
        {content.studyPlan.heading}
      </h2>
      <Markdown source={content.studyPlan.bodyMd} className="prose-academic mt-3 font-serif" />
    </section>
  );
}
