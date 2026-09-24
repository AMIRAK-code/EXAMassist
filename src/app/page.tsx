import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { getHub, listHubs, requireExamConfig } from '@/lib/exams/registry';
import { buildDemo, buildHomeData, initialSample, sourceExample, type MatrixRow, type FormatCell } from '@/lib/home/home-data';
import { ExamPreview } from '@/components/home/exam-preview';
import { EditorialLine } from '@/components/site/editorial-line';
import { StatusBadge, StatusIcon, buttonClass, cx } from '@/components/ui';
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
    body: 'Missed questions wait in your mistake notebook and come back for another look.',
  },
];

function Accent({ children }: { children: React.ReactNode }) {
  return <em className="accent-italic text-[1.08em]">{children}</em>;
}

function Cell({ cell }: { cell: FormatCell }) {
  return (
    <>
      <StatusBadge status={cell.status} />
      {cell.detail ? <span className="mt-1 block text-sm leading-snug text-ink-subtle">{cell.detail}</span> : null}
    </>
  );
}

function RowName({ row }: { row: MatrixRow }) {
  return (
    <>
      <Link href={`/exams/${row.hubSlug}`} className="block text-lg font-bold text-ink no-underline hover:underline">
        {row.name}
      </Link>
      {row.variant ? <span className="text-sm text-ink-muted">{row.variant}</span> : null}
    </>
  );
}

/** Below md each cell shows its column name above it, from data-label. */
const CELL_LABEL =
  'max-md:p-0 max-md:before:mb-1 max-md:before:block max-md:before:text-xs max-md:before:font-bold max-md:before:uppercase max-md:before:tracking-[0.08em] max-md:before:text-ink-subtle max-md:before:content-[attr(data-label)]';

const COLUMNS: Array<{ key: 'practice' | 'diagnostic' | 'timed' | 'simulation'; label: string }> = [
  { key: 'practice', label: 'Topic practice' },
  { key: 'diagnostic', label: 'Diagnostic' },
  { key: 'timed', label: 'Timed sections' },
  { key: 'simulation', label: 'Full-length simulation' },
];

/** Illustrative only: invented answers against the SAT's real topic names. */
const ILLUSTRATION: Record<string, string> = {
  'information-and-ideas': 'cccccccxx',
  'craft-and-structure': 'ccccxx',
  'expression-of-ideas': 'cx',
  'standard-english-conventions': '',
  algebra: 'cccxxxb',
  'advanced-math': 'ccx',
  'problem-solving-and-data-analysis': 'cccccx',
  'geometry-and-trigonometry': '',
};

function Tally({ marks }: { marks: string }) {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {[...marks].map((mark, index) => (
        <span
          key={index}
          className={cx(
            'inline-block h-5 w-2 rounded-[2px]',
            mark === 'c' && 'bg-ink',
            mark === 'x' && 'border-[1.5px] border-ink bg-surface',
            mark === 'b' && 'border-[1.5px] border-dashed border-line-strong',
          )}
        />
      ))}
    </span>
  );
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  const query = await searchParams;
  const db = getDb();
  const hubSlug = query.exam && getHub(query.exam) ? query.exam : DEFAULT_HUB;

  const home = buildHomeData(db);
  const sample = initialSample(db, hubSlug);
  const demo = buildDemo(db);
  const source = sourceExample();
  const sat = requireExamConfig('digital-sat');
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
                A clearer <span className="highlight"><Accent>next step.</Accent></span>
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

      {/* --- 3. Inside the mistake notebook ----------------------------------- */}
      {demo ? (
        <section id="demo" aria-labelledby="demo-heading" className="bg-ink text-ink-inverse">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="eyebrow text-highlight">Inside the mistake notebook</p>
                <h2 id="demo-heading" className="display-l mt-4 text-ink-inverse">
                  Every mistake comes back <Accent><span className="text-highlight">with the working.</span></Accent>
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-ink-inverse-muted lg:col-span-4 lg:col-start-9">
                A real SAT question from the bank, shown as the notebook shows it after a wrong answer.
                The chosen answer here is an example.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-6">
              <article className="min-w-0 rounded-card bg-surface p-5 text-ink sm:p-6">
                <h3 className="flex items-baseline gap-2.5 text-lg">
                  <span className="text-xs font-bold tracking-[0.1em] text-accent">01</span>
                  Your answer
                </h3>
                <div className="prose-academic mt-4" dangerouslySetInnerHTML={{ __html: demo.view.stemHtml }} />
                <ul className="mt-4 space-y-2">
                  {demo.view.options.map((option) => {
                    const isAnswer = option.id === demo.view.correctOptionId;
                    const isChosen = option.id === demo.chosenOptionId;
                    return (
                      <li
                        key={option.id}
                        className={cx(
                          'flex items-center gap-3 rounded-control border-[1.5px] px-3 py-2.5',
                          isAnswer ? 'border-positive bg-positive-soft' : isChosen ? 'border-negative bg-negative-soft' : 'border-line',
                        )}
                      >
                        <span className="w-4 font-bold">{option.label}</span>
                        <span className="min-w-0 flex-1" dangerouslySetInnerHTML={{ __html: option.html }} />
                        {isAnswer ? <span className="text-xs font-bold text-positive">Answer</span> : null}
                        {isChosen ? <span className="text-xs font-bold text-negative">Example answer</span> : null}
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="flex min-w-0 flex-col rounded-card bg-surface p-5 text-ink sm:p-6">
                <h3 className="flex items-baseline gap-2.5 text-lg">
                  <span className="text-xs font-bold tracking-[0.1em] text-accent">02</span>
                  Why {demo.view.options.find((o) => o.id === demo.chosenOptionId)?.label} doesn’t work
                </h3>
                <div
                  className="prose-academic mt-4"
                  dangerouslySetInnerHTML={{
                    __html: demo.view.options.find((o) => o.id === demo.chosenOptionId)?.rationaleHtml ?? '',
                  }}
                />
                <p className="mt-auto border-t border-line pt-4 text-sm leading-relaxed text-ink-muted">
                  Written for this option in advance: a common route to it, not a claim about how you
                  reasoned.
                </p>
              </article>

              <article className="min-w-0 rounded-card bg-surface p-5 text-ink sm:p-6">
                <h3 className="flex items-baseline gap-2.5 text-lg">
                  <span className="text-xs font-bold tracking-[0.1em] text-accent">03</span>
                  The worked explanation
                </h3>
                <div
                  className="prose-academic mt-4 text-[0.9375rem]"
                  dangerouslySetInnerHTML={{ __html: demo.view.explanationHtml }}
                />
              </article>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-5 rounded-card border-[1.5px] border-ink-inverse-subtle p-6 lg:mt-6">
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-xs font-bold tracking-[0.1em] text-highlight">04</span>
                <span className="text-lg font-bold">Then practise the topic again</span>
                <span className="text-ink-inverse-muted">
                  · {demo.domainLabel}, {demo.practiceCount} reviewed questions
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-ink-inverse-muted">Retrying never changes the original session’s result.</span>
                <Link
                  href={demo.practiceHref}
                  className={cx(
                    buttonClass({ variant: 'secondary' }),
                    'border-ink-inverse bg-transparent text-ink-inverse hover:border-ink-inverse hover:bg-ink-inverse hover:text-ink',
                  )}
                >
                  Practise {demo.domainLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* --- 4. What can be practised today ----------------------------------- */}
      <section id="formats" aria-labelledby="formats-heading" className="border-t-[1.5px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow">Formats and availability</p>
              <h2 id="formats-heading" className="display-l mt-4">
                What you can practise <Accent>today.</Accent>
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
                A format opens only when the exam’s rules are verified and the reviewed bank can fill it
                without repeating a question. These counts come from the live bank.
              </p>
            </div>
            <ul className="space-y-2.5 text-[0.9375rem] text-ink-muted lg:col-span-4">
              <li className="flex items-center gap-2">
                <StatusIcon status="open" />
                <strong className="text-ink">Open</strong> ready to start
              </li>
              <li className="flex items-center gap-2">
                <StatusIcon status="notyet" />
                <strong className="text-ink">Not yet</strong> needs more reviewed questions
              </li>
              <li className="flex items-center gap-2">
                <StatusIcon status="notoffered" />
                <strong className="text-ink">Not offered</strong> the rules it needs are not verified
              </li>
            </ul>
          </div>

          {/*
           * One table at every width. Below md it reflows into a card per exam,
           * each cell labelled from its column; the explicit roles keep the
           * table semantics that a display change would otherwise drop.
           */}
          <table role="table" className="mt-10 w-full border-collapse max-md:block md:mt-12">
            <caption className="sr-only">
              Practice formats by exam: reviewed questions and whether each format can be started
            </caption>
            <thead role="rowgroup" className="max-md:sr-only">
              <tr role="row" className="border-b-[1.5px] border-ink text-left">
                <th role="columnheader" scope="col" className="py-3 pe-4 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">Exam</th>
                <th role="columnheader" scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">Reviewed questions</th>
                {COLUMNS.map((column) => (
                  <th role="columnheader" key={column.key} scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup" className="max-md:block">
              {home.matrix.map((row) => (
                <tr
                  role="row"
                  key={row.examKey}
                  className="border-b border-line align-top max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-3 max-md:border-b-0 max-md:border-t-[1.5px] max-md:border-ink max-md:py-5"
                >
                  <th role="rowheader" scope="row" className="py-4 pe-4 text-left font-normal max-md:col-span-2 max-md:p-0">
                    <RowName row={row} />
                  </th>
                  <td role="cell" data-label="Reviewed questions" className={`px-4 py-4 text-lg font-semibold tabular-nums ${CELL_LABEL}`}>
                    {row.questions}
                  </td>
                  {COLUMNS.map((column) => (
                    <td role="cell" key={column.key} data-label={column.label} className={`px-4 py-4 ${CELL_LABEL}`}>
                      <Cell cell={row[column.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-6 text-sm text-ink-subtle">
            Counts as of {asOf}. Essay tasks are not listed: we do not author or score essays. Every
            format shows its limits again on the practice screen, before you start.
          </p>
        </div>
      </section>

      {/* --- 5. Progress, with the working shown (illustrative) ---------------- */}
      <section aria-labelledby="progress-heading" className="border-t-[1.5px] border-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-24">
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-5">
            <p className="eyebrow">Progress</p>
            <h2 id="progress-heading" className="display-l">
              Progress with the working <Accent>shown.</Accent>
            </h2>
            <p className="text-lg leading-relaxed text-ink-muted">
              Every figure comes with the number of questions behind it. With fewer than four answers in
              a topic, the dashboard says so instead of printing a percentage.
            </p>
            <div className="rounded-card border-[1.5px] border-ink bg-surface p-5">
              <p className="font-bold">Why no overall SAT score?</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                College Board scores the SAT with item response theory on its own questions and does not
                publish a conversion. Practice accuracy cannot honestly become a 400–1600 number, so we do
                not show one.
              </p>
            </div>
          </div>

          <div className="min-w-0 rounded-card border-[1.5px] border-ink bg-surface p-4 sm:p-7 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xl font-bold">SAT, by topic</p>
              <span className="rounded-sm bg-highlight px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-ink">
                Illustrative example · not real data
              </span>
            </div>
            <table className="mt-2 w-full border-collapse">
              <caption className="sr-only">
                Illustrative example, not real learner data: answers by SAT topic, correct out of scored,
                with a percentage only from four answers upward
              </caption>
              {sat.sections
                // Domains are tagged to the first section of each subject; later
                // modules draw from it (poolSectionKey), so group by those.
                .filter((section) => !section.poolSectionKey)
                .map((section) => {
                  const group = section.name.split(' — ')[0];
                  const domains = sat.domains.filter((domain) => domain.sectionKey === section.key);
                  if (domains.length === 0) return null;
                  return (
                    <tbody key={section.key}>
                      <tr>
                        <th colSpan={2} scope="colgroup" className="border-b-[1.5px] border-ink pb-2 pt-5 text-left text-xs font-bold uppercase tracking-[0.1em] text-ink-muted">
                          {group}
                        </th>
                      </tr>
                      {domains.map((domain) => {
                        const marks = ILLUSTRATION[domain.slug] ?? '';
                        const scored = marks.length;
                        const correct = [...marks].filter((m) => m === 'c').length;
                        return (
                          <tr key={domain.slug} className="border-b border-line">
                            <th scope="row" className="py-3 pe-3 text-left font-medium">
                              {domain.name}
                              {scored > 0 ? (
                                <span className="mt-1.5 block">
                                  <Tally marks={marks} />
                                </span>
                              ) : null}
                            </th>
                            <td className="py-3 text-right align-top tabular-nums sm:whitespace-nowrap">
                              {scored === 0 ? (
                                <span className="text-ink-subtle">Not attempted</span>
                              ) : scored < 4 ? (
                                <>
                                  <strong>{correct} of {scored}</strong> <span className="text-ink-muted">· too few to say</span>
                                </>
                              ) : (
                                <>
                                  <strong>{correct} of {scored}</strong>{' '}
                                  <span className="text-ink-muted">· {Math.round((correct / scored) * 100)}%</span>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  );
                })}
            </table>
            <ul aria-hidden="true" className="mt-5 flex flex-wrap gap-5 text-sm text-ink-muted">
              <li className="flex items-center gap-2"><Tally marks="c" /> correct</li>
              <li className="flex items-center gap-2"><Tally marks="x" /> wrong</li>
              <li className="flex items-center gap-2"><Tally marks="b" /> left blank</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- 6. Credibility --------------------------------------------------- */}
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
              {demo ? (
                <p className="mt-3">
                  <a href="#demo">See an example</a>
                </p>
              ) : null}
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

      {/* --- 7. Final call to action ---------------------------------------- */}
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
