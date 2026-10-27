import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import { googleSiteVerification, indexingEnabled, shareImages, SITE, siteUrl } from '@/lib/site';
import { getHub, listHubs } from '@/lib/exams/registry';
import { buildHomeData, initialSample, sourceExample, type MatrixRow } from '@/lib/home/home-data';
import { ExamPreview } from '@/components/home/exam-preview';
import { EditorialLine } from '@/components/site/editorial-line';
import { buttonClass, cx } from '@/components/ui';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/json-ld';
import { getCurrentUser } from '@/lib/auth/session';
import { continueStudying } from '@/lib/learning/continue';
import { ContinueStrip } from '@/components/home/continue-strip';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { accent } from '../_fonts/accent';

export const dynamic = 'force-dynamic';

/*
 * Built per request (this page is dynamic anyway), so the Search Console token
 * is read from the running deployment. Google's HTML-tag verification looks
 * only at the home page, so the tag lives here rather than in the root layout,
 * which would have made every prerendered page dynamic.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common.site' });
  const google = indexingEnabled() ? googleSiteVerification() : null;
  const title = `${SITE.name} — ${t('tagline')}`;
  const alternates = languageAlternates('/', locale as Locale);
  return {
    title,
    description: t('description'),
    alternates,
    openGraph: {
      images: shareImages('site', title),
      url: alternates.canonical,
      title,
      description: t('description'),
    },
    ...(google ? { verification: { google } } : {}),
  };
}

const DEFAULT_HUB = 'digital-sat';

/** Message keys under journey.steps, in order. */
const STEPS = ['start', 'practise', 'struggled', 'review'] as const;

/** Exam pages whose directory link and note say more than the default (keys under directory.special). */
const DIRECTORY_SPECIAL: Record<string, string> = {
  'bocconi-online-test': 'bocconi',
};

const FORMAT_COLUMNS = ['practice', 'diagnostic', 'timed', 'simulation'] as const;

/** A row's formats by status: open now, waiting for reviewed questions, not offered. */
function formatsByStatus(row: MatrixRow) {
  const summary = { open: [] as string[], notYet: [] as string[], notOffered: [] as string[] };
  for (const column of FORMAT_COLUMNS) {
    const status = row[column].status;
    (status === 'open' ? summary.open : status === 'notyet' ? summary.notYet : summary.notOffered).push(column);
  }
  return summary;
}

function Accent({ children }: { children: React.ReactNode }) {
  return <em className="accent-italic text-[1.08em]">{children}</em>;
}

const accentTag = (chunks: React.ReactNode) => <Accent>{chunks}</Accent>;
const strongTag = (chunks: React.ReactNode) => <strong className="font-semibold text-ink">{chunks}</strong>;
const DATE = { day: 'numeric', month: 'long', year: 'numeric' } as const;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  const query = await searchParams;
  const t = await getTranslations('home');
  const tSite = await getTranslations('common.site');
  const format = await getFormatter();
  const db = getDb();
  const hubSlug = query.exam && getHub(query.exam) ? query.exam : DEFAULT_HUB;

  const home = (await buildHomeData(db));
  const sample = (await initialSample(db, hubSlug));
  const source = sourceExample();
  const asOf = format.dateTime(new Date(home.asOf), DATE);
  const formatList = (keys: string[]) => keys.map((key) => t(`formats.columns.${key}`)).join(', ');

  // A returning learner's way back in. Rendered here, per request, for the
  // learner the cookie names; the page is dynamic and sent as private and
  // uncacheable, so it can never be served to anyone else.
  const user = await getCurrentUser();
  const strip = user ? (await continueStudying(db, user.id)) : null;

  return (
    <div className={accent.variable}>
      <JsonLd
        data={[
          organizationSchema(siteUrl(), SITE.name, tSite('description')),
          webSiteSchema(siteUrl(), SITE.name),
        ]}
      />

      {strip ? <ContinueStrip strip={strip} /> : null}

      {/* --- 1. Hero: headline, exam selector, a real sample question ------ */}
      <section id="top" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:pb-24">
        <ExamPreview
          choices={home.choices}
          initialHub={hubSlug}
          initialSample={sample}
          intro={
            <>
              <p className="eyebrow">{t('hero.eyebrow', { exams: listHubs().map((h) => h.label).join(' · ') })}</p>
              <h1 className="display-xl">
                {t('hero.titleLine1')}
                <br />
                {t.rich('hero.titleLine2', {
                  accent: (chunks) => (
                    <span className="highlight">
                      <Accent>{chunks}</Accent>
                    </span>
                  ),
                })}
              </h1>
              <p className="max-w-[30ch] text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-snug text-ink-muted">
                {t('hero.lede')}
              </p>
            </>
          }
        />
      </section>

      {/* --- 1b. The exam directory: one descriptive link per exam page ------ */}
      <section aria-labelledby="directory-heading" className="border-t-[1.5px] border-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="eyebrow">{t('directory.eyebrow')}</p>
          <h2 id="directory-heading" className="display-l mt-4">
            {t.rich('directory.title', { accent: accentTag })}
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {listHubs().map((hub) => {
              const special = DIRECTORY_SPECIAL[hub.slug];
              return (
                <li key={hub.slug}>
                  <Link href={`/exams/${hub.slug}`} className="font-bold text-ink">
                    {special ? t(`directory.special.${special}.label`) : t('directory.linkLabel', { name: hub.name })}
                  </Link>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink-muted">
                    {special ? t(`directory.special.${special}.note`) : hub.publisher}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-8">
            <Link href="/exams">{t('directory.allExams')}</Link>
          </p>
        </div>
      </section>

      {/* --- 2. How practice works ------------------------------------------ */}
      <section aria-labelledby="journey-heading" className="border-t-[1.5px] border-ink">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow">{t('journey.eyebrow')}</p>
              <h2 id="journey-heading" className="display-l mt-4">
                {t('journey.titleLine1')}
                <br />
                {t.rich('journey.titleLine2', { accent: accentTag })}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:col-start-8">
              {t('journey.lede')}
            </p>
          </div>
          <ol className="mt-14 grid gap-10 border-t-[1.5px] border-ink sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, index) => (
              <li key={step} className="relative pt-9">
                <span
                  aria-hidden="true"
                  className={cx(
                    'absolute -top-[11px] left-0 size-[22px] rounded-full border-[1.5px] border-ink',
                    index === STEPS.length - 1 ? 'bg-highlight' : 'bg-paper',
                  )}
                />
                <span aria-hidden="true" className="block text-5xl font-light tracking-[-0.04em] text-accent">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-xl">{t(`journey.steps.${step}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{t(`journey.steps.${step}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- 3. What can be practised today ---------------------------------- */}
      <section id="formats" aria-labelledby="formats-heading" className="border-t-[1.5px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <p className="eyebrow">{t('formats.eyebrow')}</p>
          <h2 id="formats-heading" className="display-l mt-4">
            {t.rich('formats.title', { accent: accentTag })}
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{t('formats.lede')}</p>

          <ul className="mt-10 grid border-t-[1.5px] border-ink sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
            {home.matrix.map((row) => {
              const { open, notYet, notOffered } = formatsByStatus(row);
              return (
                <li key={row.examKey} className="border-b border-line py-4">
                  <p>
                    <Link href={`/exams/${row.hubSlug}`} className="font-bold text-ink no-underline hover:underline">
                      {row.name}
                      {row.variant ? ` · ${row.variant}` : ''}
                    </Link>{' '}
                    <span className="text-ink-muted tabular-nums">
                      · {t('formats.reviewedQuestions', { count: row.questions })}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink-muted">
                    {open.length > 0
                      ? t.rich('formats.open', { formats: formatList(open), strong: strongTag })
                      : t.rich('formats.openNone', { strong: strongTag })}
                    {notYet.length > 0 ? (
                      <> {t.rich('formats.notYet', { formats: formatList(notYet), strong: strongTag })}</>
                    ) : null}
                    {notOffered.length > 0 ? (
                      <> {t.rich('formats.notOffered', { formats: formatList(notOffered), strong: strongTag })}</>
                    ) : null}
                  </p>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 max-w-[70ch] text-sm leading-relaxed text-ink-subtle">
            {t('formats.footnote', { date: asOf })}{' '}
            <Link href="/exams#formats">{t('formats.allFormats')}</Link>
          </p>
        </div>
      </section>

      {/* --- 4. Credibility --------------------------------------------------- */}
      <section aria-labelledby="trust-heading" className="border-t-[1.5px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <p className="eyebrow">{t('trust.eyebrow')}</p>
          <h2 id="trust-heading" className="display-l mt-4">
            {t.rich('trust.title', { accent: accentTag })}
          </h2>
          <EditorialLine className="mt-6 max-w-[62ch] text-lg leading-relaxed" />

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
            <div className="md:pe-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{t('trust.original.title')}</h3>
              <p className="mt-3 leading-relaxed">{t('trust.original.body')}</p>
            </div>
            <div className="border-line md:border-s-[1.5px] md:border-ink md:px-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{t('trust.explanations.title')}</h3>
              <p className="mt-3 leading-relaxed">{t('trust.explanations.body')}</p>
              <p className="mt-3">
                <a href="#top">{t('trySample')}</a>
              </p>
            </div>
            <div className="md:border-s-[1.5px] md:border-ink md:ps-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{t('trust.sources.title')}</h3>
              <p className="mt-3 leading-relaxed">{t('trust.sources.body')}</p>
              {source ? (
                <p className="mt-3 text-sm text-ink-muted">
                  {t.rich('trust.sources.example', {
                    host: source.host,
                    date: format.dateTime(new Date(source.verifiedOn), DATE),
                    link: (chunks) => <Link href={source.href}>{chunks}</Link>,
                  })}
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-12 border-t-[1.5px] border-ink pt-5 text-lg">
            {t.rich('trust.wontDo', { strong: (chunks) => <strong>{chunks}</strong> })}{' '}
            <Link href="/about/how-scoring-works">{t('trust.scoringLink')}</Link>
          </p>
        </div>
      </section>

      {/* --- 5. Final call to action ---------------------------------------- */}
      <section aria-labelledby="final-heading" className="border-t-[1.5px] border-ink bg-highlight">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <h2 id="final-heading" className="display-xl max-w-[14ch]">
            {t.rich('final.title', { accent: accentTag })}
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/exams" className={cx(buttonClass({ variant: 'ink', size: 'lg' }), 'w-full sm:w-auto')}>
              {t('final.chooseExam')}
            </Link>
            <Link
              href="#top"
              className={cx(
                buttonClass({ variant: 'secondary', size: 'lg' }),
                'w-full border-ink bg-transparent hover:bg-ink hover:text-ink-inverse sm:w-auto',
              )}
            >
              {t('trySample')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
