import Link from 'next/link';
import type { BocconiLandingData, BocconiTestSummary } from '@/lib/exams/bocconi-landing';
import { BOCCONI_ADVICE, BOCCONI_FACTS_CHECKED_ON, BOCCONI_FAQ, BOCCONI_SOURCES } from '@/lib/exams/bocconi-facts';
import { PLANS, formatEuros, freeTestPath } from '@/lib/billing/config';
import { INDEPENDENCE_NOTICE } from '@/lib/site';
import { Badge, ButtonLink, Card, FidelityBadge, StatusBadge, cx } from '@/components/ui';

/**
 * The Bocconi landing page, served at the established hub URL
 * /exams/bocconi-online-test.
 *
 * Every number about our product comes from `bocconiLandingData` (the live
 * bank); every statement about the exam comes from the exam configurations or
 * from bocconi-facts.ts, each with its source and check date. The core content
 * is server-rendered and readable without JavaScript or an account.
 */

export interface BocconiLandingProps {
  data: BocconiLandingData;
  /** Signed in with Premium (or no paywall): the free-test call to action becomes "continue". */
  hasFullAccess: boolean;
  billingOn: boolean;
}

const UG = 'bocconi-undergraduate';
const LAW = 'bocconi-law';

export const BOCCONI_GUIDE_LINKS = [
  { href: '/exams/bocconi-online-test/format', label: 'Bocconi test format, timing and scoring, with every source' },
  { href: '/guides/bocconi-undergraduate-vs-law-test', label: 'Undergraduate or Law: which Bocconi test to take' },
  { href: '/guides/bocconi-test-preparation-plan', label: 'A preparation plan for the Bocconi test, week by week' },
  { href: '/guides/bocconi-test-negative-marking-when-to-guess', label: 'Negative marking on the Bocconi test: when to guess' },
] as const;

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function Sources({ sources }: { sources: Array<{ label: string; url: string }> }) {
  return (
    <span className="text-sm text-ink-muted">
      Source{sources.length > 1 ? 's' : ''}:{' '}
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
  const ug = data.tests.find((t) => t.config.examKey === UG);
  const law = data.tests.find((t) => t.config.examKey === LAW);
  const quarterly = PLANS.quarterly;
  const monthly = PLANS.monthly;
  const yearly = PLANS.yearly;
  const quarterlySaving = Math.floor((1 - quarterly.perMonth / monthly.perMonth) * 100);
  const checked = longDate(BOCCONI_FACTS_CHECKED_ON);

  return (
    <div>
      {/* --- 1. What this page is, and the first step ------------------------------- */}
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow mb-3">Independent preparation · not affiliated with Università Bocconi</p>
        <h1 className="text-[clamp(2.1rem,1.6rem+1.8vw,3rem)] leading-[1.05] tracking-[-0.03em]">
          Bocconi Online Test preparation
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Practise questions on Bocconi’s published topics, understand every mistake, find your weak topics and follow a plan to your
          test date, for the standard test or the Law test.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {hasFullAccess ? (
            <>
              <ButtonLink href={`/practice/${UG}`} size="lg">
                Continue Bocconi practice
              </ButtonLink>
              <ButtonLink href={`/practice/${LAW}`} size="lg" variant="secondary">
                Bocconi Law practice
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href={freeTestPath(UG)} size="lg">
                Try a free Bocconi test
              </ButtonLink>
              <ButtonLink href={freeTestPath(LAW)} size="lg" variant="secondary">
                Free Bocconi Law test
              </ButtonLink>
            </>
          )}
        </div>
        {!hasFullAccess && ug?.freeTest ? (
          <p className="mt-3 text-sm text-ink-muted">
            Free with an account, no card needed: one {ug.freeTest.questions}-question test
            {ug.freeTest.minutes ? ` (about ${ug.freeTest.minutes} minutes)` : ''} across the four Bocconi areas, the
            same questions for everyone, with your results by area and every explanation.
            {billingOn ? ' Premium opens everything else.' : ''}
          </p>
        ) : null}

        <p className="mt-6 leading-relaxed">
          Practice for the Online Bocconi Test, the admission test for Bocconi’s bachelor programmes, and for the
          separate Bocconi Law test. {ug ? `${ug.questions} undergraduate` : ''}
          {ug && law ? ' and ' : ''}
          {law ? `${law.questions} Law` : ''} practice questions written to Bocconi’s published topic lists, each with
          a worked explanation; results by area that show which topics cost you marks; timed 50-question sets under
          Bocconi’s scoring and forward-only rules; and a study plan toward your test date.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-4">
          {ug ? <Fact term="Undergraduate questions" value={String(ug.questions)} /> : null}
          {law ? <Fact term="Law questions" value={String(law.questions)} /> : null}
          <Fact term="Practice formats open" value={String(data.openFormats)} />
          <Fact term="Bocconi rules checked" value={checked} />
        </dl>
      </header>

      {/* --- 2. Which test --------------------------------------------------------- */}
      <section aria-labelledby="which-test" className="mb-14">
        <h2 id="which-test" className="font-heading text-2xl font-semibold sm:text-3xl">
          Which Bocconi test are you taking?
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          Bocconi runs two different online tests. Both are 50 questions in 75 minutes with the same scoring, but they
          test different things, and only the standard one is valid for every programme.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {ug ? (
            <TestCard
              test={ug}
              title="The standard test (undergraduate)"
              validFor="Valid for every Bocconi bachelor programme, Law included."
              hasFullAccess={hasFullAccess}
            />
          ) : null}
          {law ? (
            <TestCard
              test={law}
              title="The Law test"
              validFor="Only for programmes in the legal area (the Law School programmes). It cannot be used for economics, management or other bachelor programmes."
              hasFullAccess={hasFullAccess}
            />
          ) : null}
        </div>
        <p className="mt-4">
          <Sources sources={[BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.admissions]} />
        </p>
        <p className="mt-2">
          <Link href="/guides/bocconi-undergraduate-vs-law-test">Undergraduate or Law: how to choose, in more detail</Link>
        </p>
      </section>

      {/* --- 3. What you get --------------------------------------------------------- */}
      <section aria-labelledby="what-you-get" className="mb-14">
        <h2 id="what-you-get" className="font-heading text-2xl font-semibold sm:text-3xl">
          What you can do here
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-xl font-semibold">1. Practise questions on Bocconi’s topics</h3>
            <p className="mt-2 text-ink-muted">
              Every question is tagged to one of Bocconi’s published areas and topics. Here is how our reviewed bank
              compares with the real test’s mix, so you can see where it is deep and where it is thin.
            </p>
            {[ug, law].filter(Boolean).map((test) => (
              <CoverageTable key={test!.config.examKey} test={test!} />
            ))}
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-semibold">2. Understand every mistake</h3>
              <p className="mt-2 text-ink-muted">
                After you answer, you get the worked solution and a note on why each wrong option fails, so a mistake
                tells you what to fix rather than just costing a point. The sample below is a real question from the
                bank, with its full explanation.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold">3. Find your weak topics</h3>
              <p className="mt-2 text-ink-muted">
                Each session ends with your accuracy by Bocconi area and by topic, always shown with the number of
                questions it rests on, plus how many you left blank and how long you took. Missed questions go into a
                mistake notebook and come back for another try.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold">4. Follow a plan to your test date</h3>
              <p className="mt-2 text-ink-muted">
                Set your test date and the time you have each week, and the study plan schedules short sessions up
                to eight weeks ahead, weakest topics first, based on your results so far. Adjust it whenever you
                like; it never reschedules itself behind your back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. A real sample ------------------------------------------------------- */}
      {data.sample ? (
        <section aria-labelledby="sample-heading" className="mb-14">
          <h2 id="sample-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
            A sample Bocconi question, with its explanation
          </h2>
          <Card padding="lg" className="mt-5 max-w-3xl">
            <p className="eyebrow">
              {`Undergraduate · ${data.sample.topicLabel} · ${data.sample.difficulty}`}
            </p>
            <div className="question-text mt-3" dangerouslySetInnerHTML={{ __html: data.sample.stemHtml }} />
            <ol className="mt-4 space-y-2" aria-label="Answer options">
              {data.sample.options.map((option) => (
                <li key={option.id} className="flex gap-3 rounded-card border border-line p-3">
                  <span className="w-5 shrink-0 font-semibold text-ink-muted">{option.label}.</span>
                  <span className="question-text min-w-0" dangerouslySetInnerHTML={{ __html: option.html }} />
                </li>
              ))}
            </ol>
            <details className="mt-5">
              <summary className="cursor-pointer font-semibold">Show the answer and the worked explanation</summary>
              <p className="mt-3">
                <strong>
                  Answer: {data.sample.options.find((o) => o.id === data.sample!.correctOptionId)?.label}
                </strong>
              </p>
              <div className="prose-academic question-text mt-2" dangerouslySetInnerHTML={{ __html: data.sample.explanationHtml }} />
              <h3 className="mt-4 text-sm font-semibold">Why the other options are wrong</h3>
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
          <p className="mt-3 text-sm text-ink-muted">
            This question is public, so it is kept out of the free test, diagnostics and timed sets.
          </p>
        </section>
      ) : null}

      {/* --- 5. Formats ------------------------------------------------------------- */}
      <section aria-labelledby="formats-heading" className="mb-14">
        <h2 id="formats-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          Practice formats, and how close each is to the real test
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          A format opens only when Bocconi’s rules for it are verified and the reviewed bank can fill it without
          repeating a question. Each one says what matches the real test and what does not.
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {[ug, law].filter(Boolean).map((test) => (
            <div key={test!.config.examKey}>
              <h3 className="font-heading text-xl font-semibold">{test!.variant === 'Law' ? 'Law test' : 'Standard test'}</h3>
              <ul className="mt-3 space-y-3">
                {test!.formats.map((format) => (
                  <li key={format.id} className="rounded-card border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{format.label}</span>
                      {format.available ? <FidelityBadge fidelity={format.fidelity} /> : <StatusBadge status={format.blockedNote?.startsWith('the rules') ? 'notoffered' : 'notyet'} />}
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">
                      {format.available ? format.description : `Not open yet: ${format.blockedNote}.`}
                    </p>
                    {format.available ? (
                      <details className="mt-2 text-sm">
                        <summary className="cursor-pointer text-ink-muted">What matches the real test, and what does not</summary>
                        <p className="mt-2 text-ink-muted">{format.fidelityNote}</p>
                      </details>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- 6. Premium -------------------------------------------------------------- */}
      <section aria-labelledby="premium-heading" className="mb-14">
        <h2 id="premium-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          Premium for Bocconi applicants
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          The free test shows you where you stand. Premium is for the weeks after it: every Bocconi format for both
          tests, a fresh selection of questions in each session, retries of what you missed, results by area after
          every session and a plan that runs to your test date. It also includes every other exam on the site, at no
          extra cost.
        </p>
        <ul className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2" aria-label="Premium plans">
          <Card as="li" padding="lg" className="border-2 border-accent">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading text-xl font-semibold">3 months</h3>
              <Badge tone="accent">A 3-month run-up</Badge>
            </div>
            <p className="mt-3">
              <span className="font-heading text-4xl font-semibold tracking-tight">{formatEuros(quarterly.perMonth)}</span>
              <span className="text-ink-muted"> / month</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {formatEuros(quarterly.amount)} billed every 3 months, VAT included. Save {quarterlySaving}% against
              monthly. Renews every 3 months until you cancel.
            </p>
          </Card>
          <Card as="li" padding="lg">
            <h3 className="font-heading text-xl font-semibold">Monthly</h3>
            <p className="mt-3">
              <span className="font-heading text-4xl font-semibold tracking-tight">{formatEuros(monthly.perMonth)}</span>
              <span className="text-ink-muted"> / month</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">Billed every month, VAT included. Renews monthly until you cancel.</p>
          </Card>
        </ul>
        <p className="mt-3 max-w-3xl text-sm text-ink-muted">
          A yearly plan is also available at {formatEuros(yearly.perMonth)} a month ({formatEuros(yearly.amount)} billed
          once a year). Cancel any time from your account; Premium stays on until the end of the period you paid for.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={`/premium?exam=${UG}`}>See Premium for the Bocconi test</ButtonLink>
          <ButtonLink href={`/premium?exam=${LAW}`} variant="secondary">
            Premium for the Law test
          </ButtonLink>
        </div>
      </section>

      {/* --- 7. Limits ---------------------------------------------------------------- */}
      <section aria-labelledby="limits-heading" className="mb-14 max-w-3xl">
        <h2 id="limits-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          What this preparation does not do
        </h2>
        <ul className="mt-4 list-disc space-y-2 ps-5">
          <li>
            <strong>These are not Bocconi’s questions.</strong> Every question is original, written with AI assistance
            to Bocconi’s published topic lists. Bocconi publishes no past papers, and we do not copy its simulation.
          </li>
          <li>
            <strong>No score prediction and no admission prediction.</strong> Bocconi publishes no conversion from
            practice to a real score and admits by ranking, so we report your raw penalty-adjusted total and accuracy
            by area, nothing more.
          </li>
          <li>
            <strong>Practice is in English only.</strong> The real test can be taken in Italian or English.
          </li>
          <li>
            <strong>Difficulty labels are our judgement,</strong> not statistics from real candidates.
          </li>
          <li>
            <strong>Simulations group the areas.</strong> The real test mixes areas across its screens in an order
            Bocconi does not publish; our full simulations deliver them as consecutive groups under one 75-minute clock.
          </li>
          <li>
            <strong>The bank is still small in places.</strong> See the table above: some areas have only a few more
            questions than the real test asks, so repeated full simulations will start to repeat questions.
          </li>
          <li>
            <strong>
              {data.expertReviewed === 0
                ? 'No question has had a human expert review yet.'
                : `${data.expertReviewed} question${data.expertReviewed === 1 ? ' has' : 's have'} a recorded human expert review; the rest have not.`}
            </strong>{' '}
            Before publication a separate AI reviewer solves every question blind and code compares its answer with the
            key. Where a qualified person has reviewed a question, the question’s review page names them.
          </li>
        </ul>
      </section>

      {/* --- 8. Official facts --------------------------------------------------------- */}
      <section aria-labelledby="rules-heading" className="mb-14">
        <h2 id="rules-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          Bocconi’s rules at a glance
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          What Università Bocconi publishes, checked against its own pages on {checked}. Always confirm dates and
          fees on Bocconi’s site before you book.
        </p>
        <dl className="mt-5 grid max-w-4xl gap-x-8 gap-y-4 sm:grid-cols-[12rem_1fr]">
          <Rule term="Length">50 single-answer questions in 75 minutes, in one block with no break.</Rule>
          <Rule term="Areas, standard test">Mathematics 24, Reading comprehension 11, Numerical reasoning 6, Critical thinking 9.</Rule>
          <Rule term="Areas, Law test">
            Mathematics 5, Reading comprehension 11, Numerical reasoning 6, Logic and critical thinking 18, Verbal reasoning 10.
          </Rule>
          <Rule term="Scoring">
            +1 correct, 0 blank, −0.2 wrong; −0.33 wrong on critical-thinking questions with only three options.
          </Rule>
          <Rule term="Minimum to be considered">
            17 out of 50 (penalties included). Also 11 out of 24 in Mathematics for the Bachelor in Mathematical and
            Computing Sciences for AI. No admission cut-off is published.
          </Rule>
          <Rule term="Selection">Ranking: test 55%, third-last and second-last year school grades 45%.</Rule>
          <Rule term="Navigation">Three questions per screen; once you press Next you cannot go back.</Rule>
          <Rule term="Calculator">Not allowed. Two blank A4 sheets for working.</Rule>
          <Rule term="Attempts and fee">Up to four per test type per academic year, €60 each; the highest result is used.</Rule>
          <Rule term="Language">Italian or English, your choice.</Rule>
          <Rule term="2027-28 sessions">
            Winter 25 November 2026 – 26 January 2027; Spring 8–27 April 2027 (Italian applicants only). The Early
            session (September 2026) has closed.
          </Rule>
        </dl>
        <p className="mt-4">
          <Sources sources={[BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.rules, BOCCONI_SOURCES.admissions]} />
        </p>
        <p className="mt-2">
          <Link href="/exams/bocconi-online-test/format">The full format and scoring guide, with every source</Link>
        </p>
      </section>

      {/* --- 9. Our advice, labelled as ours ------------------------------------------ */}
      <section aria-labelledby="advice-heading" className="mb-14 max-w-3xl">
        <h2 id="advice-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          Our preparation advice
        </h2>
        <p className="mt-2 text-ink-muted">
          This is our advice, not a Bocconi rule. It follows from the rules above.
        </p>
        <ol className="mt-4 list-decimal space-y-2 ps-5">
          {BOCCONI_ADVICE.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <p className="mt-4">
          <Link href="/guides/bocconi-test-preparation-plan">A week-by-week preparation plan for the Bocconi test</Link>
        </p>
      </section>

      {/* --- 10. FAQ ---------------------------------------------------------------------- */}
      <section aria-labelledby="faq-heading" className="mb-14 max-w-3xl">
        <h2 id="faq-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          Questions applicants ask about the Bocconi test
        </h2>
        <p className="mt-2 text-sm text-ink-muted">Answered from Bocconi’s own pages, checked {checked}.</p>
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
          How questions are made, and how to report one
        </h2>
        <p className="mt-3">
          Each question is drafted with AI assistance against Bocconi’s topic list. Before it is published, a separate
          AI reviewer solves it without seeing the answer key, and code compares the two answers; a disagreement keeps
          it out of the bank. We also audit samples of the bank: in October 2026 a blind re-solve of 36
          Bocconi questions by separate AI reviewers found no wrong answer key and no question with two defensible
          answers. It did find smaller
          faults in the wording, explanations or screen-reader text of 15, which have been fixed or queued for
          re-review.{' '}
          <Link href="/about/editorial-standards">Our editorial standards</Link>
        </p>
        <p className="mt-3">
          <strong>Think an answer is wrong?</strong> After any session, open the question’s review page and choose
          “Report a problem with this question”, or use the <Link href="/report-question">report form</Link> with the
          question’s id. No account is needed. If the answer key turns out to be wrong, or a second answer is
          defensible, the question is withdrawn rather than quietly corrected, and your earlier results keep the
          version you saw.
        </p>
      </section>

      {/* --- 12. Guides and independence ------------------------------------------------- */}
      <section aria-labelledby="guides-heading" className="mb-10 max-w-3xl">
        <h2 id="guides-heading" className="font-heading text-2xl font-semibold sm:text-3xl">
          Bocconi guides
        </h2>
        <ul className="mt-4 space-y-2">
          {BOCCONI_GUIDE_LINKS.map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href}>{guide.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="max-w-3xl border-t border-line pt-5 text-sm text-ink-subtle">{INDEPENDENCE_NOTICE}</p>
    </div>
  );
}

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
  const open = test.formats.filter((f) => f.available);
  return (
    <Card padding="lg" className="flex flex-col">
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2">{validFor}</p>
      <p className="mt-3 text-sm text-ink-muted">
        50 questions, 75 minutes:{' '}
        {test.areas.map((area, index) => `${index > 0 ? ', ' : ''}${area.name} ${area.officialShare?.split(' ')[0] ?? ''}`).join('')}.
      </p>
      <h4 className="mt-4 text-sm font-semibold">What we offer for it</h4>
      <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
        <li>{test.questions} reviewed practice questions.</li>
        <li>
          {open.length} practice format{open.length === 1 ? '' : 's'} open: {open.map((f) => f.label).join('; ')}.
        </li>
        {test.freeTest ? (
          <li>
            A free {test.freeTest.questions}-question test{test.freeTest.minutes ? `, about ${test.freeTest.minutes} minutes` : ''}.
          </li>
        ) : null}
      </ul>
      <div className="mt-5 flex-1" />
      <ButtonLink
        href={hasFullAccess ? `/practice/${test.config.examKey}` : freeTestPath(test.config.examKey)}
        variant={test.config.examKey === UG ? 'primary' : 'secondary'}
        className="self-start"
      >
        {hasFullAccess ? `Practise the ${test.variant === 'Law' ? 'Law' : 'standard'} test` : `Free ${test.variant === 'Law' ? 'Law' : 'Bocconi'} test`}
      </ButtonLink>
    </Card>
  );
}

function CoverageTable({ test }: { test: BocconiTestSummary }) {
  return (
    <div
      role="region"
      aria-label={`Question bank coverage, ${test.variant} test`}
      tabIndex={0}
      className="mt-4 overflow-x-auto rounded-card border border-line bg-surface"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="px-4 pt-3 text-left font-semibold">
          {test.variant === 'Law' ? 'Law test' : 'Standard test'}: {test.questions} reviewed questions
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-2 text-left font-semibold">Area</th>
            <th scope="col" className="px-4 py-2 text-right font-semibold">On the real test</th>
            <th scope="col" className="px-4 py-2 text-right font-semibold">Our questions</th>
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
