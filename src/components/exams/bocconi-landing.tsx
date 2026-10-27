import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { BocconiLandingData, BocconiTestSummary } from '@/lib/exams/bocconi-landing';
import { BOCCONI_ADVICE, BOCCONI_FACTS_CHECKED_ON, BOCCONI_FAQ, BOCCONI_SOURCES } from '@/lib/exams/bocconi-facts';
import { checkoutPath, freeTestPath, pricingPath } from '@/lib/billing/config';
import { PLANS } from '@/lib/billing/plans';
import { Badge, ButtonLink, Card, FidelityBadge, StatusBadge, cx } from '@/components/ui';
import { OfficialNote } from './official-note';

/**
 * The Bocconi landing page, served at the established hub URL
 * /exams/bocconi-online-test.
 *
 * Every number about our product comes from `bocconiLandingData` (the live
 * bank); every statement about the exam comes from the exam configurations or
 * from bocconi-facts.ts, each with its source and check date. The core content
 * is server-rendered and readable without JavaScript or an account.
 *
 * Interface text is in the `exams` catalogue under `bocconi.*`. Area names,
 * format labels and fidelity notes come from the exam configurations, and the
 * FAQ, advice and source labels from bocconi-facts.ts; they stay as written.
 */

export interface BocconiLandingProps {
  data: BocconiLandingData;
  /** Both Bocconi tests are open to this visitor (a plan, or no paywall): the free-test call to action becomes "continue". */
  hasFullAccess: boolean;
  billingOn: boolean;
}

const UG = 'bocconi-undergraduate';
const LAW = 'bocconi-law';

/** The guides this page links to; each label is `bocconi.guides.<key>`. */
export const BOCCONI_GUIDE_LINKS = [
  { href: '/exams/bocconi-online-test/format', key: 'format' },
  { href: '/guides/bocconi-undergraduate-vs-law-test', key: 'vsLaw' },
  { href: '/guides/bocconi-test-preparation-plan', key: 'plan' },
  { href: '/guides/bocconi-test-negative-marking-when-to-guess', key: 'negativeMarking' },
] as const;

const DATE = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' } as const;

function isLaw(test: BocconiTestSummary): boolean {
  return test.config.examKey === LAW;
}

function Sources({ sources }: { sources: Array<{ label: string; url: string }> }) {
  const t = useTranslations('exams.bocconi');
  return (
    <span className="text-sm text-ink-muted">
      {t('sources', { count: sources.length })}{' '}
      {sources.map((source, index) => (
        <span key={source.url}>
          {index > 0 ? '; ' : ''}
          <a href={source.url} rel="noopener noreferrer">
            {source.label}
          </a>
        </span>
      ))}
    </span>
  );
}

export function BocconiLanding({ data, hasFullAccess, billingOn }: BocconiLandingProps) {
  const t = useTranslations('exams.bocconi');
  const tExams = useTranslations('exams');
  const tSite = useTranslations('common.site');
  const format = useFormatter();
  const ug = data.tests.find((test) => test.config.examKey === UG);
  const law = data.tests.find((test) => test.config.examKey === LAW);
  const checked = format.dateTime(new Date(BOCCONI_FACTS_CHECKED_ON), DATE);
  const price = (cents: number) => format.number(cents / 100, { style: 'currency', currency: 'EUR' });
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <div>
      {/* --- 1. What this page is, and the first step ------------------------------- */}
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow mb-3">{t('eyebrow')}</p>
        <h1 className="text-[clamp(2.1rem,1.6rem+1.8vw,3rem)] leading-[1.05] tracking-[-0.03em]">{t('title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('lead')}</p>
        <OfficialNote className="mt-3 text-sm text-ink-subtle" />
        <div className="mt-6 flex flex-wrap gap-3">
          {hasFullAccess ? (
            <>
              <ButtonLink href={`/practice/${UG}`} size="lg">
                {t('continuePractice')}
              </ButtonLink>
              <ButtonLink href={`/practice/${LAW}`} size="lg" variant="secondary">
                {t('lawPractice')}
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href={freeTestPath(UG)} size="lg">
                {t('tryFree')}
              </ButtonLink>
              <ButtonLink href={freeTestPath(LAW)} size="lg" variant="secondary">
                {t('freeLaw')}
              </ButtonLink>
            </>
          )}
        </div>
        {!hasFullAccess && ug?.freeTest ? (
          <p className="mt-3 text-sm text-ink-muted">
            {ug.freeTest.minutes
              ? t('freeNoteTimed', { questions: ug.freeTest.questions, minutes: ug.freeTest.minutes })
              : t('freeNote', { questions: ug.freeTest.questions })}
            {billingOn ? ` ${t('planOpens')}` : ''}
          </p>
        ) : null}

        <p className="mt-6 leading-relaxed">
          {ug && law
            ? t('introBoth', { ug: ug.questions, law: law.questions })
            : t('introOne', { count: data.totalQuestions })}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-4">
          {ug ? <Fact term={t('fact.ugQuestions')} value={format.number(ug.questions)} /> : null}
          {law ? <Fact term={t('fact.lawQuestions')} value={format.number(law.questions)} /> : null}
          <Fact term={t('fact.openFormats')} value={format.number(data.openFormats)} />
          <Fact term={t('fact.rulesChecked')} value={checked} />
        </dl>
      </header>

      {/* --- 2. Which test --------------------------------------------------------- */}
      <section aria-labelledby="which-test" className="mb-14">
        <h2 id="which-test" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('which.heading')}
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">{t('which.lead')}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {ug ? (
            <TestCard
              test={ug}
              title={t('which.standardTitle')}
              validFor={t('which.standardValid')}
              hasFullAccess={hasFullAccess}
            />
          ) : null}
          {law ? (
            <TestCard test={law} title={t('which.lawTitle')} validFor={t('which.lawValid')} hasFullAccess={hasFullAccess} />
          ) : null}
        </div>
        <p className="mt-4">
          <Sources sources={[BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.admissions]} />
        </p>
        <p className="mt-2">
          <Link href="/guides/bocconi-undergraduate-vs-law-test">{t('which.chooseLink')}</Link>
        </p>
      </section>

      {/* --- 3. What you get --------------------------------------------------------- */}
      <section aria-labelledby="what-you-get" className="mb-14">
        <h2 id="what-you-get" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('get.heading')}
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-xl font-semibold">{t('get.practiseTitle')}</h3>
            <p className="mt-2 text-ink-muted">{t('get.practiseBody')}</p>
            {[ug, law].filter(Boolean).map((test) => (
              <CoverageTable key={test!.config.examKey} test={test!} />
            ))}
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-semibold">{t('get.understandTitle')}</h3>
              <p className="mt-2 text-ink-muted">{t('get.understandBody')}</p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold">{t('get.weakTitle')}</h3>
              <p className="mt-2 text-ink-muted">{t('get.weakBody')}</p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold">{t('get.planTitle')}</h3>
              <p className="mt-2 text-ink-muted">{t('get.planBody')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. A real sample ------------------------------------------------------- */}
      {data.sample ? (
        <section aria-labelledby="sample-heading" className="mb-14">
          <h2 id="sample-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
            {t('sample.heading')}
          </h2>
          <Card padding="lg" className="mt-5 max-w-3xl">
            <p className="eyebrow">
              {t('sample.eyebrow', {
                topic: data.sample.topicLabel,
                difficulty: t(`sample.difficulty.${data.sample.difficulty}`),
              })}
            </p>
            <div className="question-text mt-3" dangerouslySetInnerHTML={{ __html: data.sample.stemHtml }} />
            <ol className="mt-4 space-y-2" aria-label={t('sample.options')}>
              {data.sample.options.map((option) => (
                <li key={option.id} className="flex gap-3 rounded-card border border-line p-3">
                  <span className="w-5 shrink-0 font-semibold text-ink-muted">{option.label}.</span>
                  <span className="question-text min-w-0" dangerouslySetInnerHTML={{ __html: option.html }} />
                </li>
              ))}
            </ol>
            <details className="mt-5">
              <summary className="cursor-pointer font-semibold">{t('sample.show')}</summary>
              <p className="mt-3">
                <strong>
                  {t('sample.answer', {
                    label: data.sample.options.find((o) => o.id === data.sample!.correctOptionId)?.label ?? '',
                  })}
                </strong>
              </p>
              <div className="prose-academic question-text mt-2" dangerouslySetInnerHTML={{ __html: data.sample.explanationHtml }} />
              <h3 className="mt-4 text-sm font-semibold">{t('sample.whyWrong')}</h3>
              <ul className="mt-2 space-y-2 text-sm text-ink-muted">
                {data.sample.options
                  .filter((o) => o.id !== data.sample!.correctOptionId && o.rationaleHtml)
                  .map((o) => (
                    <li key={o.id} className="flex gap-2">
                      <span className="font-semibold">{o.label}.</span>
                      <span className="question-text min-w-0" dangerouslySetInnerHTML={{ __html: o.rationaleHtml! }} />
                    </li>
                  ))}
              </ul>
            </details>
          </Card>
          <p className="mt-3 text-sm text-ink-muted">{t('sample.public')}</p>
        </section>
      ) : null}

      {/* --- 5. Formats ------------------------------------------------------------- */}
      <section aria-labelledby="formats-heading" className="mb-14">
        <h2 id="formats-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('formats.heading')}
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">{t('formats.lead')}</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {[ug, law].filter(Boolean).map((test) => (
            <div key={test!.config.examKey}>
              <h3 className="font-heading text-xl font-semibold">
                {isLaw(test!) ? t('variant.law') : t('variant.standard')}
              </h3>
              <ul className="mt-3 space-y-3">
                {test!.formats.map((entry) => (
                  <li key={entry.id} className="rounded-card border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{entry.label}</span>
                      {entry.available ? (
                        <FidelityBadge fidelity={entry.fidelity} />
                      ) : (
                        <StatusBadge status={entry.blockedBy === 'rules' ? 'notoffered' : 'notyet'}>
                          {tExams(entry.blockedBy === 'rules' ? 'status.notoffered' : 'status.notyet')}
                        </StatusBadge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">
                      {entry.available
                        ? entry.description
                        : tExams('availability.notOpenYet', {
                            reason:
                              entry.blockedBy === 'rules'
                                ? tExams('availability.rulesNotVerified')
                                : tExams('availability.needsMore', { shortfall: entry.shortfall }),
                          })}
                    </p>
                    {entry.available ? (
                      <details className="mt-2 text-sm">
                        <summary className="cursor-pointer text-ink-muted">{t('formats.fidelityToggle')}</summary>
                        <p className="mt-2 text-ink-muted">{entry.fidelityNote}</p>
                      </details>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- 6. Plans ---------------------------------------------------------------- */}
      <section aria-labelledby="plans-heading" className="mb-14">
        <h2 id="plans-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('plans.heading')}
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">{t('plans.lead')}</p>
        <ul className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2" aria-label={t('plans.label')}>
          <Card as="li" padding="lg" className="border-2 border-accent">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading text-xl font-semibold">{t('plans.singleName')}</h3>
              <Badge tone="accent">{t('plans.singleBadge')}</Badge>
            </div>
            <p className="mt-3">
              <span className="font-heading text-4xl font-semibold tracking-tight">{price(PLANS.single_exam.amount)}</span>
              <span className="text-ink-muted"> {t('plans.perMonth')}</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">{t('plans.singleBody')}</p>
          </Card>
          <Card as="li" padding="lg">
            <h3 className="font-heading text-xl font-semibold">{t('plans.allName')}</h3>
            <p className="mt-3">
              <span className="font-heading text-4xl font-semibold tracking-tight">{price(PLANS.all_access.amount)}</span>
              <span className="text-ink-muted"> {t('plans.perMonth')}</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">{t('plans.allBody')}</p>
          </Card>
        </ul>
        <p className="mt-3 max-w-3xl text-sm text-ink-muted">{t('plans.cancel')}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={checkoutPath('single_exam', UG)}>{t('plans.chooseBocconi')}</ButtonLink>
          <ButtonLink href={checkoutPath('single_exam', LAW)} variant="secondary">
            {t('plans.chooseLaw')}
          </ButtonLink>
          <ButtonLink href={pricingPath(UG)} variant="quiet">
            {t('plans.compare')}
          </ButtonLink>
        </div>
      </section>

      {/* --- 7. Limits ---------------------------------------------------------------- */}
      <section aria-labelledby="limits-heading" className="mb-14 max-w-3xl">
        <h2 id="limits-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('limits.heading')}
        </h2>
        <ul className="mt-4 list-disc space-y-2 ps-5">
          <li>{t.rich('limits.notTheirs', { strong })}</li>
          <li>{t.rich('limits.noPrediction', { strong })}</li>
          <li>{t.rich('limits.englishOnly', { strong })}</li>
          <li>{t.rich('limits.difficulty', { strong })}</li>
          <li>{t.rich('limits.grouped', { strong })}</li>
          <li>{t.rich('limits.small', { strong })}</li>
          <li>
            <strong>
              {data.expertReviewed === 0
                ? t('limits.expertNone')
                : t('limits.expertSome', { count: data.expertReviewed })}
            </strong>{' '}
            {t('limits.review')}
          </li>
        </ul>
      </section>

      {/* --- 8. Official facts --------------------------------------------------------- */}
      <section aria-labelledby="rules-heading" className="mb-14">
        <h2 id="rules-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('rules.heading')}
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">{t('rules.lead', { date: checked })}</p>
        <dl className="mt-5 grid max-w-4xl gap-x-8 gap-y-4 sm:grid-cols-[12rem_1fr]">
          {RULES.map((rule) => (
            <Rule key={rule} term={t(`rules.${rule}Term`)}>
              {t(`rules.${rule}`)}
            </Rule>
          ))}
        </dl>
        <p className="mt-4">
          <Sources sources={[BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.rules, BOCCONI_SOURCES.admissions]} />
        </p>
        <p className="mt-2">
          <Link href="/exams/bocconi-online-test/format">{t('rules.fullGuide')}</Link>
        </p>
      </section>

      {/* --- 9. Our advice, labelled as ours ------------------------------------------ */}
      <section aria-labelledby="advice-heading" className="mb-14 max-w-3xl">
        <h2 id="advice-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('advice.heading')}
        </h2>
        <p className="mt-2 text-ink-muted">{t('advice.lead')}</p>
        <ol className="mt-4 list-decimal space-y-2 ps-5">
          {BOCCONI_ADVICE.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <p className="mt-4">
          <Link href="/guides/bocconi-test-preparation-plan">{t('advice.planLink')}</Link>
        </p>
      </section>

      {/* --- 10. FAQ ---------------------------------------------------------------------- */}
      <section aria-labelledby="faq-heading" className="mb-14 max-w-3xl">
        <h2 id="faq-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('faq.heading')}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{t('faq.lead', { date: checked })}</p>
        <div className="mt-5 space-y-6">
          {BOCCONI_FAQ.map((faq) => (
            <div key={faq.id} id={`faq-${faq.id}`}>
              <h3 className="font-heading text-lg font-semibold">{faq.question}</h3>
              <p className="mt-1">{faq.answer}</p>
              <p className="mt-1">
                <Sources sources={faq.sources} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 11. Trust -------------------------------------------------------------------- */}
      <section aria-labelledby="trust-heading" className="mb-14 max-w-3xl">
        <h2 id="trust-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('trust.heading')}
        </h2>
        <p className="mt-3">
          {t.rich('trust.body', {
            link: (chunks) => <Link href="/about/editorial-standards">{chunks}</Link>,
          })}
        </p>
        <p className="mt-3">
          {t.rich('trust.report', {
            strong,
            link: (chunks) => <Link href="/report-question">{chunks}</Link>,
          })}
        </p>
      </section>

      {/* --- 12. Guides and independence ------------------------------------------------- */}
      <section aria-labelledby="guides-heading" className="mb-10 max-w-3xl">
        <h2 id="guides-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          {t('guides.heading')}
        </h2>
        <ul className="mt-4 space-y-2">
          {BOCCONI_GUIDE_LINKS.map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href}>{t(`guides.${guide.key}`)}</Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="max-w-3xl border-t border-line pt-5 text-sm text-ink-subtle">{tSite('independenceNotice')}</p>
    </div>
  );
}

/** The rows of "Bocconi's rules at a glance", each `bocconi.rules.<key>` with its `<key>Term`. */
const RULES = [
  'length',
  'areasStandard',
  'areasLaw',
  'scoring',
  'minimum',
  'selection',
  'navigation',
  'calculator',
  'attempts',
  'language',
  'sessions',
] as const;

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-muted">{term}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function Rule({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold">{term}</dt>
      <dd className="text-ink-muted">{children}</dd>
    </>
  );
}

function TestCard({
  test,
  title,
  validFor,
  hasFullAccess,
}: {
  test: BocconiTestSummary;
  title: string;
  validFor: string;
  hasFullAccess: boolean;
}) {
  const t = useTranslations('exams.bocconi.card');
  const open = test.formats.filter((f) => f.available);
  const law = isLaw(test);
  // Area names and their published shares come from the exam configuration.
  const areas = test.areas.map((area) => `${area.name} ${area.officialShare?.split(' ')[0] ?? ''}`.trim()).join(', ');
  return (
    <Card padding="lg" className="flex flex-col">
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2">{validFor}</p>
      <p className="mt-3 text-sm text-ink-muted">{t('shape', { areas })}</p>
      <h4 className="mt-4 text-sm font-semibold">{t('offerHeading')}</h4>
      <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
        <li>{t('offerQuestions', { count: test.questions })}</li>
        <li>{t('offerFormats', { count: open.length, names: open.map((f) => f.label).join('; ') })}</li>
        {test.freeTest ? (
          <li>
            {test.freeTest.minutes
              ? t('offerFreeTimed', { questions: test.freeTest.questions, minutes: test.freeTest.minutes })
              : t('offerFree', { questions: test.freeTest.questions })}
          </li>
        ) : null}
      </ul>
      <div className="mt-5 flex-1" />
      <ButtonLink
        href={hasFullAccess ? `/practice/${test.config.examKey}` : freeTestPath(test.config.examKey)}
        variant={test.config.examKey === UG ? 'primary' : 'secondary'}
        className="self-start"
      >
        {hasFullAccess
          ? t(law ? 'practiseLaw' : 'practiseStandard')
          : t(law ? 'freeLaw' : 'freeStandard')}
      </ButtonLink>
    </Card>
  );
}

function CoverageTable({ test }: { test: BocconiTestSummary }) {
  const t = useTranslations('exams.bocconi');
  const name = isLaw(test) ? t('variant.law') : t('variant.standard');
  return (
    <div
      role="region"
      aria-label={t('coverage.region', { test: name })}
      tabIndex={0}
      className="mt-4 overflow-x-auto rounded-card border border-line bg-surface"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="px-4 pt-3 text-left font-semibold">
          {t('coverage.caption', { test: name, count: test.questions })}
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-2 text-left font-semibold">{t('coverage.area')}</th>
            <th scope="col" className="px-4 py-2 text-right font-semibold">{t('coverage.onRealTest')}</th>
            <th scope="col" className="px-4 py-2 text-right font-semibold">{t('coverage.ourQuestions')}</th>
          </tr>
        </thead>
        <tbody>
          {test.areas.map((area) => (
            <tr key={area.slug} className="border-b border-line last:border-0">
              <th scope="row" className="px-4 py-2 text-left font-normal">{area.name}</th>
              <td className="px-4 py-2 text-right tabular-nums">{area.officialShare?.split(' ')[0] ?? '—'}</td>
              <td className={cx('px-4 py-2 text-right tabular-nums', area.questions === 0 && 'text-negative')}>{area.questions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
