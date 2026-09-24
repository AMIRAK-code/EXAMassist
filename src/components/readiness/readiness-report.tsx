import Link from 'next/link';
import type { ExamConfig } from '@/lib/assessment/types';
import { BAND_LABEL, type Band, type ReadinessAssessment } from '@/lib/learning/readiness';
import { Alert, Badge, Card, Meter, SectionHeading, Stat } from '@/components/ui';

/**
 * The readiness report.
 *
 * Its job is to answer "am I on track for my target?" as far as the evidence
 * honestly reaches, and to be unmistakable about where that stops. The layout
 * follows that: what we measured, then what it does and does not say about the
 * target, then what to do next.
 */

const BAND_TONE: Record<Band, 'neutral' | 'negative' | 'caution' | 'accent' | 'positive'> = {
  insufficient: 'neutral',
  early: 'negative',
  developing: 'caution',
  consistent: 'accent',
  strong: 'positive',
};

const BAND_FILL: Record<Band, number> = {
  insufficient: 0.08,
  early: 0.25,
  developing: 0.5,
  consistent: 0.75,
  strong: 1,
};

function BandPill({ band }: { band: Band }) {
  return <Badge tone={BAND_TONE[band]}>{BAND_LABEL[band]}</Badge>;
}

export function ReadinessReport({
  assessment,
  config,
}: {
  assessment: ReadinessAssessment;
  config: ExamConfig;
}) {
  const { target } = assessment;

  return (
    <div className="space-y-10">
      {/* --- Headline ----------------------------------------------------- */}
      <Card padding="lg" className="border-s-4 border-s-accent">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
              Readiness
            </p>
            <h2 className="mt-2 text-2xl">{BAND_LABEL[assessment.overall]}</h2>
            <p className="mt-2.5 leading-relaxed text-ink-muted">{assessment.overallStatement}</p>
          </div>
          <div className="w-full max-w-56 sm:w-56">
            <Meter
              value={BAND_FILL[assessment.overall]}
              label={`Readiness band: ${BAND_LABEL[assessment.overall]}`}
              tone={BAND_TONE[assessment.overall] === 'neutral' ? 'neutral' : BAND_TONE[assessment.overall]}
            />
            <p className="mt-2 text-xs text-ink-subtle">
              Based on {assessment.answeredTotal} question
              {assessment.answeredTotal === 1 ? '' : 's'} you have answered.
            </p>
          </div>
        </div>
      </Card>

      {/* --- The target --------------------------------------------------- */}
      {target ? (
        <section aria-labelledby="target-heading">
          <SectionHeading
            id="target-heading"
            title="Your target"
            description={target.statedTarget}
          />

          {target.quantifiable && target.projection ? (
            <Card padding="lg">
              <p className="leading-relaxed text-ink-muted">{target.explanation}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <Stat
                  label="Projected raw score"
                  value={target.projection.projectedRaw}
                  of={target.projection.maxRaw}
                  tone={target.projection.meetsTarget ? 'positive' : 'neutral'}
                />
                <Stat label="Your target" value={target.projection.targetRaw} of={target.projection.maxRaw} />
                {target.projection.officialFloor !== null ? (
                  <Stat
                    label="Official eligibility floor"
                    value={target.projection.officialFloor}
                    hint="Published by the university as a minimum to be considered — not a competitive score."
                  />
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                <Alert tone={target.projection.meetsTarget ? 'positive' : 'caution'} role="status">
                  {target.projection.meetsTarget
                    ? `On this projection you are at or above your target of ${target.projection.targetRaw}.`
                    : `On this projection you are ${Math.round((target.projection.targetRaw - target.projection.projectedRaw) * 10) / 10} points short of your target of ${target.projection.targetRaw}.`}
                </Alert>

                {target.projection.meetsOfficialFloor === false ? (
                  <Alert tone="negative" role="status" title="Below the published eligibility floor">
                    An application scoring below {target.projection.officialFloor} is not considered.
                    This is the one number here that is an official requirement rather than a goal you
                    set.
                  </Alert>
                ) : null}
              </div>

              <details className="mt-6 rounded-card border border-line bg-surface-sunken p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  How this projection is calculated, and what it assumes
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {target.projection.method}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
                  {target.projection.assumptions.map((assumption) => (
                    <li key={assumption}>{assumption}</li>
                  ))}
                </ul>
              </details>
            </Card>
          ) : (
            <Card padding="lg">
              <Alert tone="info" title="We will not guess at this">
                <p className="leading-relaxed">{target.explanation}</p>
              </Alert>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Official full-length practice from {config.publisher} is scored by their own model, so
                that is where a scaled-score estimate should come from. Use this page for diagnosis —
                which topics are weak, whether you are working at the exam&rsquo;s pace — and theirs for
                score prediction.
              </p>
            </Card>
          )}
        </section>
      ) : null}

      {/* --- Signals ------------------------------------------------------ */}
      <section aria-labelledby="signals-heading">
        <SectionHeading
          id="signals-heading"
          title="What we measured"
          description="Each of these comes from your own answers. The basis for every one is stated, so you can judge whether you agree with it."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {assessment.signals.map((signal) => (
            <Card as="li" key={signal.key}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink-muted">{signal.label}</p>
                  <p className="mt-1 font-heading text-2xl font-semibold">{signal.display}</p>
                </div>
                <BandPill band={signal.band} />
              </div>
              <div className="mt-3">
                <Meter
                  value={BAND_FILL[signal.band]}
                  label={`${signal.label}: ${BAND_LABEL[signal.band]}`}
                  tone={BAND_TONE[signal.band] === 'neutral' ? 'neutral' : BAND_TONE[signal.band]}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-subtle">{signal.basis}</p>
            </Card>
          ))}
        </ul>
      </section>

      {/* --- Gaps --------------------------------------------------------- */}
      {assessment.gaps.length > 0 ? (
        <section aria-labelledby="gaps-heading">
          <SectionHeading
            id="gaps-heading"
            title="Where the ground is weakest"
            description="Ordered by what would move your result most: topics you have never attempted first, then your lowest accuracy."
          />
          <div className="relative overflow-x-auto rounded-card border border-line bg-surface shadow-card">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Your accuracy by topic for the {assessment.examName}, weakest first.
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">
                    Topic
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Answered
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Accuracy
                  </th>
                  <th scope="col" className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                    Share of the exam
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    <span className="sr-only">Practise</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessment.gaps.map((gap) => (
                  <tr key={gap.domainSlug} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      {gap.label}
                    </th>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-muted">{gap.answered}</td>
                    <td className="px-4 py-3 text-right">
                      {gap.answered === 0 ? (
                        <span className="text-ink-subtle">Not attempted</span>
                      ) : gap.hasSignal ? (
                        <span className="font-medium tabular-nums">
                          {Math.round(gap.accuracy * 100)}%
                        </span>
                      ) : (
                        <span className="text-ink-subtle">Too few to say</span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-ink-muted sm:table-cell">
                      {gap.officialShare ?? <span className="text-ink-subtle">Not published</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/practice/${assessment.examKey}?domain=${encodeURIComponent(gap.domainSlug)}`}
                        className="text-sm no-underline hover:underline"
                      >
                        Practise
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* --- Next --------------------------------------------------------- */}
      {assessment.nextActions.length > 0 ? (
        <section aria-labelledby="next-heading">
          <SectionHeading id="next-heading" title="What to do next" />
          <ol className="space-y-3">
            {assessment.nextActions.map((action, index) => (
              <Card as="li" key={action.label}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <p className="font-medium">
                      <span className="me-2 font-mono text-sm text-ink-subtle">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {action.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{action.why}</p>
                  </div>
                  <Link
                    href={action.href}
                    className="shrink-0 text-sm no-underline hover:underline"
                  >
                    Start →
                  </Link>
                </div>
              </Card>
            ))}
          </ol>
        </section>
      ) : null}

      {/* --- Limitations, never collapsed away ---------------------------- */}
      <section aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-lg">
          What this assessment is not
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-ink-muted">
          {assessment.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
