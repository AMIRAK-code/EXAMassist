import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import { googleSiteVerification, indexingEnabled, shareImages, SITE, siteUrl } from '@/lib/site';
import { getHub, listHubs } from '@/lib/exams/registry';
import { buildHomeData, initialSample, sourceExample, type MatrixRow } from '@/lib/home/home-data';
import { ExamPreview } from '@/components/home/exam-preview';
import { EditorialLine } from '@/components/site/editorial-line';
import { HumanSupport } from '@/components/site/human-support';
import { buttonClass, cx } from '@/components/ui';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/json-ld';
import { getCurrentUser } from '@/lib/auth/session';
import { continueStudying } from '@/lib/learning/continue';
import { ContinueStrip } from '@/components/home/continue-strip';
import { ContinueStripLoader } from '@/components/home/continue-strip-loader';
import { isSnapshotRequest } from '@/lib/seo/static-pages';
import { pageAlternates } from '@/i18n/alternates';
import { ClientMessages } from '@/i18n/client-messages';
import type { Locale } from '@/i18n/locales';
import { BlueprintBackdrop } from '@/components/home/blueprint-backdrop';
import { barlow, martian } from '../_fonts/blueprint';

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
  const alternates = (await pageAlternates(params, '/'));
  return {
    title: { absolute: title },
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

/** The emphasised words of a display heading, in the blueprint's pencil yellow. */
function Accent({ children }: { children: React.ReactNode }) {
  return <span className="accent-italic">{children}</span>;
}

const accentTag = (chunks: React.ReactNode) => <Accent>{chunks}</Accent>;

/** A section's sheet number, before its eyebrow: the page reads as a numbered set of drawings. */
function Sheet({ n }: { n: number }) {
  return <span aria-hidden="true">{String(n).padStart(2, '0')} / </span>;
}

/** Grid references round the hero, as on a drawing's border. Decoration only. */
function DrawingBorder() {
  return (
    <div aria-hidden="true" className="bp-mono pointer-events-none absolute inset-x-2 top-3 bottom-0 hidden border border-line text-[0.625rem] text-ink-subtle sm:block">
      <div className="absolute inset-x-0 -top-5 flex justify-around">
        {['A', 'B', 'C', 'D', 'E', 'F'].map((c) => <span key={c}>{c}</span>)}
      </div>
      <div className="absolute inset-y-0 -left-4 flex flex-col justify-around">
        {['1', '2', '3', '4'].map((r) => <span key={r}>{r}</span>)}
      </div>
    </div>
  );
}
const strongTag = (chunks: React.ReactNode) => <strong className="font-semibold text-ink">{chunks}</strong>;
const DATE = { day: 'numeric', month: 'long', year: 'numeric' } as const;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  const query = await searchParams;
  const t = await getTranslations('home');
  const tSite = await getTranslations('common.site');
  const format = await getFormatter();
  const db = getDb();
  const hubSlug = query.exam && getHub(query.exam) ? query.exam : DEFAULT_HUB;

  const home = (await buildHomeData(db, new Date(), await getLocale()));
  const sample = (await initialSample(db, hubSlug));
  const source = sourceExample();
  const asOf = format.dateTime(new Date(home.asOf), DATE);
  const formatList = (keys: string[]) => keys.map((key) => t(`formats.columns.${key}`)).join(', ');

  // A returning learner's way back in. Rendered here, per request, for the
  // learner the cookie names; the page is dynamic and sent as private and
  // uncacheable, so it can never be served to anyone else.
  // Saved as a static file for everyone, the page asks for the line from the
  // browser instead (src/lib/seo/static-pages.ts).
  const user = await getCurrentUser();
  const strip = user ? (await continueStudying(db, user.id)) : null;
  const snapshot = isSnapshotRequest(await headers());
  // The title block's revision: the day the counts on this page were taken.
  const revision = new Date(home.asOf).toISOString().slice(0, 10);

  return (
    // The sample question, the continue line and the drawing are client components.
    <ClientMessages pick={['common', 'home', 'player.stimulus']}>
    <div className={cx('theme-blueprint relative isolate', barlow.variable, martian.variable)}>
      <BlueprintBackdrop />
      <JsonLd
        data={[
          organizationSchema(siteUrl(), SITE.name, tSite('description'), SITE.alternateNames),
          webSiteSchema(siteUrl(), SITE.name, SITE.alternateNames),
        ]}
      />

      {strip ? <ContinueStrip strip={strip} /> : snapshot ? <ContinueStripLoader /> : null}

      {/* --- 1. Hero: headline, exam selector, a real sample question ------ */}
      <section id="top" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 pt-10 sm:px-8 sm:pt-16 lg:pb-20">
        <DrawingBorder />
        <div className="relative sm:px-4 sm:pt-6">
          <ExamPreview
            choices={home.choices}
            initialHub={hubSlug}
            initialSample={sample}
            intro={
              <>
                <p className="eyebrow">{t('hero.eyebrow', { exams: listHubs().map((h) => h.label).join(' · ') })}</p>
                {/* What the product is, in the heading; the slogan stays as supporting copy. */}
                <h1 className="display-l">{t.rich('hero.title', { accent: accentTag })}</h1>
                <p className="bp-mono text-[clamp(0.9375rem,0.85rem+0.4vw,1.0625rem)] uppercase leading-snug text-ink">
                  {t('hero.slogan')}
                </p>
                <p className="max-w-[44ch] text-lg leading-snug text-ink-muted">{t('hero.lede')}</p>
              </>
            }
          />
        </div>

        {/* The drawing's title block. */}
        <dl aria-hidden="true" className="bp-mono relative mt-12 ms-auto grid w-fit grid-cols-2 border-s border-t border-line-strong text-[0.6875rem] sm:grid-cols-4">
          {[
            [t('blueprint.project'), SITE.name],
            [t('blueprint.sheet'), '01 / 07'],
            [t('blueprint.scale'), '1 : 1'],
            [t('blueprint.revision'), revision],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-e border-line-strong px-4 py-2">
              <dt className="text-[0.5625rem] uppercase text-ink-subtle">{label}</dt>
              <dd className="mt-0.5 text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* --- 1b. The exam directory: one descriptive link per exam page ------ */}
      <section aria-labelledby="directory-heading" className="bp-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <p className="eyebrow"><Sheet n={2} />{t('directory.eyebrow')}</p>
          <h2 id="directory-heading" className="display-l mt-4">
            {t.rich('directory.title', { accent: accentTag })}
          </h2>
          <ul className="mt-10 grid border-s border-t border-dashed border-line-strong sm:grid-cols-2 lg:grid-cols-4">
            {listHubs().map((hub) => {
              const special = DIRECTORY_SPECIAL[hub.slug];
              return (
                <li key={hub.slug} className="border-b border-e border-dashed border-line-strong p-4">
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
      <section aria-labelledby="journey-heading" className="bp-rule">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow"><Sheet n={3} />{t('journey.eyebrow')}</p>
              <h2 id="journey-heading" className="display-l mt-4">
                {t('journey.titleLine1')}
                <br />
                {t.rich('journey.titleLine2', { accent: accentTag })}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-ink-muted lg:col-span-5">
              {t('journey.lede')}
            </p>
          </div>
          {/* The steps hang off one dimension line, each marked by a node. */}
          <ol className="mt-14 grid gap-10 border-t border-line-strong sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, index) => (
              <li key={step} className="relative pt-9">
                <span
                  aria-hidden="true"
                  className={cx(
                    'absolute -top-[9px] left-0 size-[17px] rounded-full border border-ink',
                    index === STEPS.length - 1 ? 'bg-accent' : 'bg-paper',
                  )}
                />
                <span aria-hidden="true" className="bp-num block text-6xl leading-none text-accent">
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
      <section id="formats" aria-labelledby="formats-heading" className="bp-rule">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-24">
          <p className="eyebrow"><Sheet n={4} />{t('formats.eyebrow')}</p>
          <h2 id="formats-heading" className="display-l mt-4">
            {t.rich('formats.title', { accent: accentTag })}
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{t('formats.lede')}</p>

          <ul className="mt-10 grid border-t border-line-strong bg-paper/70 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
            {home.matrix.map((row) => {
              const { open, notYet, notOffered } = formatsByStatus(row);
              return (
                <li key={row.examKey} className="border-b border-dashed border-line py-4">
                  <p>
                    <Link href={`/exams/${row.hubSlug}`} className="font-bold text-ink no-underline hover:underline">
                      {row.name}
                      {row.variant ? ` · ${row.variant}` : ''}
                    </Link>{' '}
                    <span className="bp-mono text-[0.8125rem] text-accent tabular-nums">
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
      <section aria-labelledby="trust-heading" className="bp-rule">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-24">
          <p className="eyebrow"><Sheet n={5} />{t('trust.eyebrow')}</p>
          <h2 id="trust-heading" className="display-l mt-4">
            {t.rich('trust.title', { accent: accentTag })}
          </h2>
          <EditorialLine className="mt-6 max-w-[62ch] text-lg leading-relaxed" />

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
            <div className="md:pe-8">
              <h3 className="bp-mono text-xs uppercase text-accent">{t('trust.original.title')}</h3>
              <p className="mt-3 leading-relaxed">{t('trust.original.body')}</p>
            </div>
            <div className="md:border-s md:border-dashed md:border-line-strong md:px-8">
              <h3 className="bp-mono text-xs uppercase text-accent">{t('trust.explanations.title')}</h3>
              <p className="mt-3 leading-relaxed">{t('trust.explanations.body')}</p>
              <p className="mt-3">
                <a href="#top">{t('trySample')}</a>
              </p>
            </div>
            <div className="md:border-s md:border-dashed md:border-line-strong md:ps-8">
              <h3 className="bp-mono text-xs uppercase text-accent">{t('trust.sources.title')}</h3>
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

          <p className="mt-12 border-t border-line-strong pt-5 text-lg">
            {t.rich('trust.wontDo', { strong: (chunks) => <strong>{chunks}</strong> })}{' '}
            <Link href="/about/how-scoring-works">{t('trust.scoringLink')}</Link>
          </p>
        </div>
      </section>

      {/* --- 5. Human support ----------------------------------------------- */}
      <HumanSupport accent={accentTag} eyebrowPrefix={<Sheet n={6} />} />

      {/* --- 6. Final call to action ---------------------------------------- */}
      <section aria-labelledby="final-heading" className="bp-rule">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
          <div className="border border-line-strong bg-paper/80 p-6 sm:p-10">
            <p className="eyebrow"><Sheet n={7} />{SITE.name}</p>
            <h2 id="final-heading" className="display-xl mt-4 max-w-[14ch]">
              {t.rich('final.title', { accent: accentTag })}
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/exams" className={cx(buttonClass({ variant: 'primary', size: 'lg' }), 'w-full sm:w-auto')}>
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
        </div>
      </section>
    </div>
    </ClientMessages>
  );
}
