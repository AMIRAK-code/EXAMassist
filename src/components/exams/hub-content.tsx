import { Markdown } from '@/components/content';
import { Alert, Card } from '@/components/ui';
import { SampleQuestions } from '@/components/guides/sample-questions';
import { CONTENT_LANG } from '@/i18n/alternates';
import { longDate } from '@/lib/content/page-dates';
import type { HubContent } from '@/lib/exams/hub-content';

/*
 * The editorial parts of an exam hub (src/lib/exams/hub-content.ts). They are
 * English content, like the exam details, so they carry lang="en" whatever the
 * interface language. Prose is set in the reading serif, which needs no
 * download and so cannot gain a line when the interface font arrives and push
 * the page down (docs/REDESIGN.md §18).
 */

/** The direct answer under the heading, then where the next cycle stands and what to prepare for. */
export function HubIntro({ content }: { content: HubContent }) {
  return (
    <div lang={CONTENT_LANG}>
      <Markdown source={content.leadMd} className="prose-academic mb-8 font-serif text-lg" />
      {content.status ? <HubStatus content={content} className="mb-8" /> : null}
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
export function HubStatus({ content, className }: { content: HubContent; className?: string }) {
  const status = content.status;
  if (!status) return null;
  return (
    <section aria-labelledby="hub-status" lang={CONTENT_LANG} className={className}>
      <Card>
        <h2 id="hub-status" className="font-heading text-xl font-semibold">
          {status.heading}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Checked against the official pages on <time dateTime={status.checkedOn}>{longDate(status.checkedOn)}</time>.
        </p>
        <Markdown source={status.bodyMd} className="prose-academic mt-4 font-serif" />
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-semibold text-accent">Sources</summary>
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

/** A note above exam details that describe a cycle that has ended. */
export function HubDetailsNote({ content }: { content: HubContent }) {
  if (!content.detailsNote) return null;
  return (
    <div lang={CONTENT_LANG} className="mb-8">
      <Alert tone="caution" title={content.detailsNote.title}>
        <Markdown source={content.detailsNote.bodyMd} className="font-serif" />
      </Alert>
    </div>
  );
}

/** Worked sample questions, with their own heading, before the routes into other hubs. */
export function HubSamples({ content }: { content: HubContent }) {
  if (!content.samples) return null;
  return (
    <section id={content.samples.id} aria-labelledby={`${content.samples.id}-heading`} lang={CONTENT_LANG} className="mt-12 scroll-mt-24">
      <h2 id={`${content.samples.id}-heading`} className="font-heading text-2xl font-semibold">
        {content.samples.heading}
      </h2>
      <Markdown source={content.samples.introMd} className="prose-academic mt-3 font-serif" />
      <SampleQuestions set={content.samples.set} />
    </section>
  );
}
