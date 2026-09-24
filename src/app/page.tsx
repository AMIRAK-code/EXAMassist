import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { getHub, listHubs } from '@/lib/exams/registry';
import { buildHomeData, initialSample, sourceExample } from '@/lib/home/home-data';
import { ExamPreview } from '@/components/home/exam-preview';
import { EditorialLine } from '@/components/site/editorial-line';
import { formatSummary } from '@/components/exams/format-availability';
import { buttonClass, cx } from '@/components/ui';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/json-ld';
import { accent } from './_fonts/accent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

const DEFAULT_HUB = 'digital-sat';

const STEPS = [
  {
    title: 'Pick a starting point',
    body: 'Take a short diagnostic across the exam’s own topics where one is open, or go straight to the topic you want.',
  },
  {
    title: 'Practise with explanations',
    body: 'Check each answer when you are ready: the worked solution follows, with a note on why each wrong option fails.',
  },
  {
    title: 'See where you struggled',
    body: 'Accuracy by topic, always shown with the number of questions it rests on.',
  },
  {
    title: 'Review, then go again',
    body: 'Missed questions wait in your mistake notebook and come back for another look. Retrying never changes the original session’s result.',
  },
];

function Accent({ children }: { children: React.ReactNode }) {
  return <em className="accent-italic text-[1.08em]">{children}</em>;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  const query = await searchParams;
  const db = getDb();
  const hubSlug = query.exam && getHub(query.exam) ? query.exam : DEFAULT_HUB;

  const home = buildHomeData(db);
  const sample = initialSample(db, hubSlug);
  const source = sourceExample();
  const asOf = new Date(home.asOf).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={accent.variable}>
      <JsonLd
        data={[
          organizationSchema(siteUrl(), SITE.name, SITE.description),
          webSiteSchema(siteUrl(), SITE.name),
        ]}
      />

      {/* --- 1. Hero: headline, exam selector, a real sample question ------ */}
      <section id="top" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:pb-24">
        <ExamPreview
          choices={home.choices}
          initialHub={hubSlug}
          initialSample={sample}
          intro={
            <>
              <p className="eyebrow">Practice for {listHubs().map((h) => h.label).join(' · ')}</p>
              <h1 className="display-xl">
                Big ambitions.
                <br />
                A clearer <span className="highlight"><Accent>next&nbsp;step.</Accent></span>
              </h1>
              <p className="max-w-[30ch] text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-snug text-ink-muted">
                Discover what needs work. Practise with purpose. Understand every answer.
              </p>
            </>
          }
        />
      </section>

      {/* --- 2. How practice works ------------------------------------------ */}
      <section aria-labelledby="journey-heading" className="border-t-[1.5px] border-ink">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow">How it works</p>
              <h2 id="journey-heading" className="display-l mt-4">
                From one question
                <br />
                to <Accent>a plan.</Accent>
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:col-start-8">
              Every session feeds the next. What you get wrong is kept, explained and brought back, so
              practice time goes where it is needed.
            </p>
          </div>
          <ol className="mt-14 grid gap-10 border-t-[1.5px] border-ink sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative pt-9">
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
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- 3. What can be practised today ---------------------------------- */}
      <section id="formats" aria-labelledby="formats-heading" className="border-t-[1.5px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <p className="eyebrow">Formats and availability</p>
          <h2 id="formats-heading" className="display-l mt-4">
            What you can practise <Accent>today.</Accent>
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
            A format opens only when the exam’s rules are verified and the reviewed bank can fill it
            without repeating a question. These counts come from the live bank.
          </p>

          <ul className="mt-10 grid border-t-[1.5px] border-ink sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
            {home.matrix.map((row) => {
              const { open, notYet, notOffered } = formatSummary(row);
              return (
                <li key={row.examKey} className="border-b border-line py-4">
                  <p>
                    <Link href={`/exams/${row.hubSlug}`} className="font-bold text-ink no-underline hover:underline">
                      {row.name}
                      {row.variant ? ` · ${row.variant}` : ''}
                    </Link>{' '}
                    <span className="text-ink-muted tabular-nums">· {row.questions} reviewed questions</span>
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink-muted">
                    <strong className="font-semibold text-ink">Open:</strong> {open.length > 0 ? open.join(', ') : 'none yet'}.
                    {notYet.length > 0 ? <> <strong className="font-semibold text-ink">Not yet:</strong> {notYet.join(', ')}.</> : null}
                    {notOffered.length > 0 ? <> <strong className="font-semibold text-ink">Not offered:</strong> {notOffered.join(', ')}.</> : null}
                  </p>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 max-w-[70ch] text-sm leading-relaxed text-ink-subtle">
            Counts as of {asOf}. Essay tasks are not listed: we do not author or score essays. Every
            format shows its limits again on the practice screen, before you start.{' '}
            <Link href="/exams#formats">Every format, and what each still needs</Link>
          </p>
        </div>
      </section>

      {/* --- 4. Credibility --------------------------------------------------- */}
      <section aria-labelledby="trust-heading" className="border-t-[1.5px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <p className="eyebrow">Why you can check our work</p>
          <h2 id="trust-heading" className="display-l mt-4">
            Built to be <Accent>checked.</Accent>
          </h2>
          <EditorialLine className="mt-6 max-w-[62ch] text-lg leading-relaxed" />

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
            <div className="md:pe-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">Original questions</h3>
              <p className="mt-3 leading-relaxed">
                Drafted with AI assistance for this bank. Before publication a separate AI reviewer
                solved each one without the answer key, and code compared the two answers. No
                per-question human review is recorded yet.
              </p>
            </div>
            <div className="border-line md:border-s-[1.5px] md:border-ink md:px-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">Worked explanations</h3>
              <p className="mt-3 leading-relaxed">
                Each answer is explained step by step, and each wrong option carries its own note on why
                it fails.
              </p>
              <p className="mt-3">
                <a href="#top">Try the sample question</a>
              </p>
            </div>
            <div className="md:border-s-[1.5px] md:border-ink md:ps-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">Sources and verification dates</h3>
              <p className="mt-3 leading-relaxed">
                Format, timing and scoring facts cite the test maker’s own pages, with the date they were
                last checked.
              </p>
              {source ? (
                <p className="mt-3 text-sm text-ink-muted">
                  For example, the <Link href={source.href}>SAT format guide</Link> cites {source.host},
                  checked{' '}
                  {new Date(source.verifiedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-12 border-t-[1.5px] border-ink pt-5 text-lg">
            <strong>What we won’t do:</strong> invent a scaled score, report percentiles, or predict
            admission. <Link href="/about/how-scoring-works">How our scoring works</Link>
          </p>
        </div>
      </section>

      {/* --- 5. Final call to action ---------------------------------------- */}
      <section aria-labelledby="final-heading" className="border-t-[1.5px] border-ink bg-highlight">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <h2 id="final-heading" className="display-xl max-w-[14ch]">
            Your next step is <Accent>one question</Accent> away.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/exams" className={cx(buttonClass({ variant: 'ink', size: 'lg' }), 'w-full sm:w-auto')}>
              Choose your exam
            </Link>
            <Link
              href="#top"
              className={cx(
                buttonClass({ variant: 'secondary', size: 'lg' }),
                'w-full border-ink bg-transparent hover:bg-ink hover:text-ink-inverse sm:w-auto',
              )}
            >
              Try the sample question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
