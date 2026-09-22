import Link from 'next/link';
import type { Metadata } from 'next';
import { EXAM_CONFIGS, getHubForConfig } from '@/lib/exams/registry';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Alert, Badge, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';

/**
 * How scoring works.
 *
 * The per-exam rules in the table are read from the exam registry rather than
 * retyped, so this page cannot drift away from what the engine actually applies.
 */

const PATH = '/about/how-scoring-works';
const TITLE = 'How our scoring works';
const DESCRIPTION =
  'What Examer reports after a practice session — raw marks, accuracy by topic and pacing — and why it reports no scaled score, no percentile and no admission estimate for any exam, with the per-exam rules for correct, wrong and omitted answers.';

/** Real dates: this page was written on 2026-09-22 and has not been revised since. */
const PUBLISHED = '2026-09-22';
const UPDATED = '2026-09-22';
const PUBLISHED_LABEL = '22 September 2026';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: 'article',
    url: absoluteUrl(PATH),
    title: `${TITLE} | ${SITE.shortName}`,
    description: DESCRIPTION,
    publishedTime: PUBLISHED,
    modifiedTime: UPDATED,
  },
};

/** "+1", "0", "−0.2" — with a real minus sign, and no invented precision. */
function formatPoints(value: number): string {
  if (value === 0) return '0';
  const magnitude = String(Math.abs(value));
  return value > 0 ? `+${magnitude}` : `−${magnitude}`;
}

function formatRange(min: number, max: number): string {
  return `${min}–${max}`;
}

const WE_REPORT: Array<{ term: string; value: string }> = [
  {
    term: 'Raw marks',
    value:
      'How many questions you answered correctly, how many you got wrong, and how many you left blank.',
  },
  {
    term: 'Points, where the exam has a penalty',
    value:
      'On an exam with negative marking we also show points earned out of points possible, applying the exam’s own published penalty. On an exam without one, points and raw marks are the same number.',
  },
  {
    term: 'Accuracy by topic and skill',
    value:
      'The same breakdown split by section, content domain and individual skill, so a weak area is visible rather than averaged away.',
  },
  {
    term: 'Pacing',
    value:
      'Total time and median time per question, which on a timed format usually explains more than the raw mark does.',
  },
  {
    term: 'What the session was and was not',
    value:
      'Every result carries the fidelity of the format you took, the exam’s official scoring rules as published facts, and the list of rules the test maker does not publish.',
  },
];

const WE_REFUSE: Array<{ claim: string; why: string }> = [
  {
    claim: 'A scaled score (400–1600, 1–36, 120–180, 205–805, 130–170, and so on)',
    why:
      'Every one of those scales is produced by equating, and no test maker we cover publishes the tables, item parameters or transformations that equating uses. A number produced without them would be invented, however carefully it was dressed up.',
  },
  {
    claim: 'A percentile or a score band',
    why:
      'A percentile is a statement about a reference population. We have no calibrated reference population, and a percentile computed against the people who happened to use this site would describe our visitors, not test takers.',
  },
  {
    claim: 'A probability of admission, or a “target score”',
    why:
      'Admission decisions are made by institutions using criteria they control, and several of the processes we cover — Bocconi’s among them — are competitive rankings with no published cut-off at all. There is no honest arithmetic from a practice session to an admission outcome.',
  },
  {
    claim: 'A readiness verdict dressed up as a measurement',
    why:
      'We will happily tell you that you got 6 of 10 Algebra questions right and spent 2 minutes each. We will not convert that into a claim about how you would perform on test day.',
  },
];

export default function HowScoringWorksPage() {
  const trail = [{ href: '/', label: 'Home' }, { label: TITLE }];

  const rows = EXAM_CONFIGS.map((config) => {
    const hub = getHubForConfig(config.examKey);
    return {
      key: config.examKey,
      name: config.name,
      shortName: config.shortName,
      publisher: config.publisher,
      hubSlug: hub?.slug ?? null,
      scoring: config.scoring,
      penalised: config.scoring.pointsIncorrect < 0,
    };
  });

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: absoluteUrl(PATH),
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: PUBLISHED,
            dateModified: UPDATED,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow="About Examer"
        title={TITLE}
        lead="What a practice result here means, what it deliberately does not contain, and the scoring rule each exam actually applies."
      />

      <div className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">In short</h2>
        <p className="mt-2 text-ink">
          We report what we can count: how many questions you answered correctly, how many you left
          blank, how that splits by topic and skill, how long you took, and — where the exam has real
          negative marking — your penalty-adjusted points. We report no scaled score for any exam,
          because the tables that convert raw answers into a scaled score are unpublished for every
          exam we cover. We also report no percentile and no estimate of an admission outcome.
        </p>
      </div>

      <p className="mt-4 text-sm text-ink-subtle">
        By {SITE.publisher} · Published <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time>
      </p>

      <div className="mt-10 space-y-12">
        <section aria-labelledby="we-report">
          <h2 id="we-report" className="font-serif text-2xl font-semibold">
            1. What a result contains
          </h2>
          <dl className="mt-4 space-y-4">
            {WE_REPORT.map((item) => (
              <div key={item.term} className="rounded-card border border-line bg-surface p-4">
                <dt className="font-medium text-ink">{item.term}</dt>
                <dd className="mt-1 text-sm text-ink-muted">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="we-refuse">
          <h2 id="we-refuse" className="font-serif text-2xl font-semibold">
            2. What a result never contains, and why
          </h2>
          <div className="prose-academic">
            <p>
              These are not features we have not built yet. They are numbers we have decided cannot
              be produced honestly from what test makers publish, so the field that would hold a
              reported score is left empty in our database rather than filled with an estimate.
            </p>
          </div>
          <ul className="mt-4 space-y-4">
            {WE_REFUSE.map((item) => (
              <li key={item.claim} className="rounded-card border border-line bg-surface p-4">
                <p className="font-medium text-ink">{item.claim}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="two-cases">
          <h2 id="two-cases" className="font-serif text-2xl font-semibold">
            3. Two exams that show why the rule is not one rule
          </h2>
          <div className="prose-academic">
            <p>
              “No scaled score” sounds like a single policy. It is really the same conclusion reached
              from two very different directions, and the Digital SAT and the Online Bocconi Test are
              the clearest illustration.
            </p>
          </div>

          <Card className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-lg font-semibold">
                Digital SAT — no penalty, but the scale is not arithmetic
              </h3>
              <Badge tone="neutral">No penalty for a wrong answer</Badge>
            </div>
            <div className="prose-academic mt-2">
              <p>
                A wrong answer and a blank both score zero, so on the real exam guessing is never
                worse than leaving a question blank. That part is simple. The scale is not: College
                Board produces the 200–800 section score with Item Response Theory over the specific
                items administered, not from a count of correct answers. Its own guidance states that
                two students who answer the same number of questions correctly in a section may earn
                different section scores.
              </p>
              <p>
                The item parameters and the transformation onto the scale are unpublished, so there
                is no arithmetic that turns “38 of 44 correct on our questions” into an SAT section
                score. The 400–1600 scale is recorded on our exam pages as a fact about the exam. We
                do not place your result on it.
              </p>
            </div>
          </Card>

          <Card className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-lg font-semibold">
                Online Bocconi Test — the penalty is real, and the raw total is the score
              </h3>
              <Badge tone="caution">Negative marking</Badge>
            </div>
            <div className="prose-academic mt-2">
              <p>
                Bocconi publishes its scoring outright: a correct answer scores +1, an omitted answer
                scores 0, and a wrong answer costs 0.2 points — 0.33 points on critical-thinking
                items presented with only three options. The penalty belongs to the item, not to the
                exam, which is why the table below records the exam-level rule and our engine applies
                the heavier penalty to the items that carry it.
              </p>
              <p>
                Two consequences follow, and both are practical rather than theoretical. First,
                omitting genuinely beats blind guessing here, which is the opposite of the advice
                that works on the SAT. Second, there is no scale to estimate: the result Bocconi
                reports <em>is</em> the penalty-adjusted raw total out of 50, with per-area subscores
                and the counts of correct, wrong and omitted answers. So our result screen shows you
                the same shape of information, and stops there.
              </p>
              <p>
                Bocconi states that an applicant scoring below 17 “will not be considered in the
                selection process”. That is an eligibility floor, not a pass mark and not a target:
                admission is decided by a competitive ranking that weights the test 55% and
                high-school GPA 45%, and no cut-off is published for any programme or round.
              </p>
            </div>
          </Card>
        </section>

        <section aria-labelledby="rules-table">
          <h2 id="rules-table" className="font-serif text-2xl font-semibold">
            4. The scoring rule for every exam we cover
          </h2>
          <div className="prose-academic">
            <p>
              These are the exams’ own published rules, and they are the rules our engine applies to
              a practice attempt. The reported scale in the final column is a fact about the exam: we
              record it, and we do not produce a score on it.
            </p>
          </div>

          <div
            role="region"
            aria-labelledby="rules-table"
            tabIndex={0}
            className="mt-4 overflow-x-auto rounded-card border border-line"
          >
            <table className="w-full min-w-[42rem] border-collapse bg-surface text-sm">
              <caption className="border-b border-line px-4 py-3 text-start text-sm text-ink-muted">
                Points awarded per answer, and the scale each test maker reports. No exam in this
                table has a published raw-to-scale conversion, so no scaled score is produced for any
                of them.
              </caption>
              <thead>
                <tr className="bg-surface-sunken">
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    Exam
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    Correct
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    Wrong
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    Omitted
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    Officially reported scale
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-start font-medium">
                      {row.hubSlug ? (
                        <Link href={`/exams/${row.hubSlug}/format`}>{row.name}</Link>
                      ) : (
                        row.name
                      )}
                      <span className="block text-xs font-normal text-ink-subtle">
                        {row.publisher}
                      </span>
                    </th>
                    <td className="px-4 py-3 tabular-nums">{formatPoints(row.scoring.pointsCorrect)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatPoints(row.scoring.pointsIncorrect)}
                      {row.penalised ? (
                        <span className="block text-xs text-ink-muted">Negative marking</span>
                      ) : (
                        <span className="block text-xs text-ink-muted">No penalty</span>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatPoints(row.scoring.pointsOmitted)}</td>
                    <td className="px-4 py-3">
                      {row.scoring.officialScale ? (
                        <>
                          <span className="font-medium tabular-nums">
                            {formatRange(row.scoring.officialScale.min, row.scoring.officialScale.max)}
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {row.scoring.officialScale.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-ink-muted">No single reported scale</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-ink-muted">
            One exception the table cannot hold: on both Bocconi variants, critical-thinking items
            offered with three answer options carry a heavier penalty of 0.33 points instead of 0.2.
            That penalty attaches to the individual item, so the column above shows the exam-level
            rule.
          </p>
        </section>

        <section aria-labelledby="no-scaled">
          <h2 id="no-scaled" className="font-serif text-2xl font-semibold">
            5. Why there is no scaled score, exam by exam
          </h2>
          <div className="prose-academic">
            <p>
              The reasons differ enough to be worth reading in full for the exam you are preparing
              for. Each is the reason recorded in our exam configuration, which is also what the
              methodology note on your result links back to.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {rows.map((row) => (
              <details key={row.key} className="rounded-card border border-line bg-surface p-4">
                <summary className="cursor-pointer font-medium text-ink">
                  Why no scaled score for the {row.shortName}?
                </summary>
                <p className="mt-3 text-sm text-ink-muted">
                  {row.scoring.scaledEstimate.enabled
                    ? row.scoring.scaledEstimate.method
                    : row.scoring.scaledEstimate.reason}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="ours-not-theirs">
          <h2 id="ours-not-theirs" className="font-serif text-2xl font-semibold">
            6. The parts that are ours, labelled as ours
          </h2>
          <div className="prose-academic">
            <p>
              Some things we have to choose, because the test maker does not publish them. Wherever
              that happens the choice is disclosed on the screen where it applies, never presented as
              the exam’s own rule:
            </p>
            <ul>
              <li>
                <strong>Difficulty labels.</strong> Easy, medium and hard are our editorial
                judgement. They are not calibrated against test-taker data — see{' '}
                <Link href="/about/editorial-standards">editorial standards</Link>.
              </li>
              <li>
                <strong>Adaptive routing thresholds.</strong> Where an exam routes between modules,
                the real cut score is unpublished. The threshold we use is ours, it is stated on the
                simulation, and it is stored with the attempt so resuming replays the same path.
              </li>
              <li>
                <strong>Item counts where the exam does not publish them,</strong> and any extended
                time setting, which is a study aid rather than a replica of an accommodation.
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="using-it">
          <h2 id="using-it" className="font-serif text-2xl font-semibold">
            7. Getting something useful out of a result anyway
          </h2>
          <div className="prose-academic">
            <p>
              A raw mark from one session is a small sample, and treating it as a measurement is the
              fastest way to be misled by it. Two things in a result are genuinely informative early
              on: which content domains you miss repeatedly, and where your time goes. Both are
              reported per topic and per skill precisely because they are actionable in a way a
              single headline number is not.
            </p>
          </div>
          <Alert tone="info" title="A practice result is a study signal, not a score" className="mt-4">
            <p>
              Nothing here is a prediction of your performance on test day or of an admission
              decision. If you want to know what a given exam’s score means, its format guide records
              the official scale, the published rules and the things the test maker does not publish.
            </p>
          </Alert>
          <p className="mt-4 text-sm">
            <Link href="/exams">Browse the exam format and scoring guides →</Link>
          </p>
        </section>
      </div>
    </Container>
  );
}
