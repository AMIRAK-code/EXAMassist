import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ExamConfig } from '@/lib/assessment/types';
import { type Band, type ReadinessAssessment } from '@/lib/learning/readiness';
import { renderText, type LearnerText } from '@/lib/learning/text';
import { Alert, Badge, Card, Meter, SectionHeading, Stat } from '@/components/ui';

/**
 * The readiness report.
 *
 * Its job is to answer "am I on track for my target?" as far as the evidence
 * honestly reaches, and to be unmistakable about where that stops. The layout
 * follows that: what we measured, then what it does and does not say about the
 * target. Suggestions of what to do next are not part of it: the page shows
 * them apart, as suggestions (see suggestions.ts).
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
  const t = useTranslations('learning');
  return <Badge tone={BAND_TONE[band]}>{t(`readiness.band.${band}`)}</Badge>;
}

export function ReadinessReport({
  assessment,
  config,
}: {
  assessment: ReadinessAssessment;
  config: ExamConfig;
}) {
  const t = useTranslations('learning');
  const format = useFormatter();
  const text = (value: LearnerText) => renderText(t, value);
  const band = (value: Band) => t(`readiness.band.${value}`);
  const { target } = assessment;

  return (
    <div className="space-y-10">
      {/* --- Headline ----------------------------------------------------- */}
      <Card padding="lg" className="border-s-4 border-s-accent">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
              {t('report.eyebrow')}
            </p>
            <h2 className="mt-2 text-2xl">{band(assessment.overall)}</h2>
            <p className="mt-2.5 leading-relaxed text-ink-muted">{text(assessment.overallStatement)}</p>
          </div>
          <div className="w-full max-w-56 sm:w-56">
            <Meter
              value={BAND_FILL[assessment.overall]}
              label={t('report.meterLabel', { band: band(assessment.overall) })}
              tone={BAND_TONE[assessment.overall] === 'neutral' ? 'neutral' : BAND_TONE[assessment.overall]}
            />
            <p className="mt-2 text-xs text-ink-subtle">
              {t('report.basedOn', { count: assessment.answeredTotal })}
            </p>
          </div>
        </div>
      </Card>

      {/* --- The target --------------------------------------------------- */}
      {target ? (
        <section aria-labelledby="target-heading">
          <SectionHeading
            id="target-heading"
            title={t('report.target.title')}
            description={text(target.statedTarget)}
          />

          {target.quantifiable && target.projection ? (
            <Card padding="lg">
              <p className="leading-relaxed text-ink-muted">{text(target.explanation)}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <Stat
                  label={text(target.projection.scoreLabel ?? { key: 'readiness.projection.scoreLabelRaw' })}
                  value={format.number(target.projection.projectedRaw)}
                  of={format.number(target.projection.maxRaw)}
                  tone={target.projection.meetsTarget ? 'positive' : 'neutral'}
                />
                <Stat
                  label={t('report.target.title')}
                  value={format.number(target.projection.targetRaw)}
                  of={format.number(target.projection.maxRaw)}
                />
                {target.projection.officialFloor !== null ? (
                  <Stat
                    label={t('report.target.floorLabel')}
                    value={format.number(target.projection.officialFloor)}
                    hint={t('report.target.floorHint')}
                  />
                ) : null}
                {/* Threshold names and meanings are the exam owner's own, quoted as published. */}
                {(target.projection.thresholds ?? []).map((threshold) => (
                  <Stat
                    key={threshold.label}
                    label={threshold.label}
                    value={format.number(threshold.value)}
                    of={format.number(target.projection!.maxRaw)}
                    hint={threshold.meaning}
                  />
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Alert tone={target.projection.meetsTarget ? 'positive' : 'caution'} role="status">
                  {target.projection.meetsTarget
                    ? t('report.target.atOrAbove', { target: target.projection.targetRaw })
                    : t('report.target.short', {
                        gap: Math.round((target.projection.targetRaw - target.projection.projectedRaw) * 10) / 10,
                        target: target.projection.targetRaw,
                      })}
                </Alert>

                {(target.projection.thresholds ?? [])
                  .filter((threshold) => !threshold.met)
                  .map((threshold) => (
                    <Alert
                      key={threshold.label}
                      tone="caution"
                      role="status"
                      title={t('report.target.belowThresholdTitle', { threshold: threshold.label.toLowerCase() })}
                    >
                      {t('report.target.belowThreshold', { value: threshold.value })} {threshold.meaning}
                    </Alert>
                  ))}

                {target.projection.noThresholdReason ? (
                  <Alert tone="info" role="note" title={t('report.target.noPassMarkTitle')}>
                    {target.projection.noThresholdReason}
                  </Alert>
                ) : null}

                {target.projection.meetsOfficialFloor === false ? (
                  <Alert tone="negative" role="status" title={t('report.target.belowFloorTitle')}>
                    {t('report.target.belowFloor', { floor: target.projection.officialFloor ?? 0 })}
                  </Alert>
                ) : null}
              </div>

              <details className="mt-6 rounded-card border border-line bg-surface-sunken p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  {t('report.target.howCalculated')}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {text(target.projection.method)}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
                  {target.projection.assumptions.map(text).map((assumption) => (
                    <li key={assumption}>{assumption}</li>
                  ))}
                </ul>
              </details>
            </Card>
          ) : (
            <Card padding="lg">
              <Alert tone="info" title={t('report.target.noGuessTitle')}>
                <p className="leading-relaxed">{text(target.explanation)}</p>
              </Alert>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {t('report.target.officialPractice', { publisher: config.publisher })}
              </p>
            </Card>
          )}
        </section>
      ) : null}

      {/* --- Signals ------------------------------------------------------ */}
      <section aria-labelledby="signals-heading">
        <SectionHeading
          id="signals-heading"
          title={t('report.signals.title')}
          description={t('report.signals.description')}
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {assessment.signals.map((signal) => (
            <Card as="li" key={signal.key}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink-muted">{text(signal.label)}</p>
                  <p className="mt-1 font-heading text-2xl font-semibold">{text(signal.display)}</p>
                </div>
                <BandPill band={signal.band} />
              </div>
              <div className="mt-3">
                <Meter
                  value={BAND_FILL[signal.band]}
                  label={t('report.signals.meterLabel', { signal: text(signal.label), band: band(signal.band) })}
                  tone={BAND_TONE[signal.band] === 'neutral' ? 'neutral' : BAND_TONE[signal.band]}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-subtle">{text(signal.basis)}</p>
            </Card>
          ))}
        </ul>
      </section>

      {/* --- Gaps --------------------------------------------------------- */}
      {assessment.gaps.length > 0 ? (
        <section aria-labelledby="gaps-heading">
          <SectionHeading
            id="gaps-heading"
            title={t('report.gaps.title')}
            description={t('report.gaps.description')}
          />
          <div role="region" aria-labelledby="gaps-heading" tabIndex={0} className="relative overflow-x-auto rounded-card border border-line bg-surface shadow-card">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{t('report.gaps.caption', { exam: assessment.examName })}</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">
                    {t('report.gaps.topic')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    {t('report.gaps.answered')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    {t('report.gaps.accuracy')}
                  </th>
                  <th scope="col" className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                    {t('report.gaps.share')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    <span className="sr-only">{t('report.gaps.practise')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessment.gaps.slice(0, 5).map((gap) => (
                  <tr key={gap.domainSlug} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      {gap.label}
                    </th>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-muted">{gap.answered}</td>
                    <td className="px-4 py-3 text-right">
                      {gap.answered === 0 ? (
                        <span className="text-ink-subtle">{t('report.gaps.notAttempted')}</span>
                      ) : gap.hasSignal ? (
                        <span className="font-medium tabular-nums">
                          {format.number(Math.round(gap.accuracy * 100) / 100, { style: 'percent' })}
                        </span>
                      ) : (
                        <span className="text-ink-subtle">{t('report.gaps.tooFew')}</span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-ink-muted sm:table-cell">
                      {/* The published share is the test maker's own wording. */}
                      {gap.officialShare ?? <span className="text-ink-subtle">{t('report.gaps.notPublished')}</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/practice/${assessment.examKey}?domain=${encodeURIComponent(gap.domainSlug)}`}
                        className="text-sm no-underline hover:underline"
                      >
                        {t('report.gaps.practise')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* --- Limitations, never collapsed away ---------------------------- */}
      <section aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-lg">
          {t('report.limits.title')}
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-ink-muted">
          {assessment.limitations.map(text).map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
