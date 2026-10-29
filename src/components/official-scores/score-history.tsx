import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { HistoryEntry, OfficialScoreHistory, ScoreVersion } from '@/lib/learning/official-scores';
import { Alert, Badge, Card } from '@/components/ui';
import { DeleteScoreButton } from './delete-score';

/**
 * Official practice results the learner entered, read back to them. Every
 * figure is the learner's own entry; the only arithmetic is a difference
 * between two results on the same scale, or between a result and a target on
 * that same scale. Nothing is converted, predicted or verified.
 */

function useScore() {
  const format = useFormatter();
  return {
    value: (n: number) => format.number(n, { maximumFractionDigits: 2 }),
    change: (n: number) => format.number(n, { maximumFractionDigits: 2, signDisplay: 'exceptZero' }),
    date: (iso: string) => format.dateTime(new Date(`${iso}T00:00:00Z`), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
  };
}

function sectionLabel(version: ScoreVersion | null, key: string): string {
  return version?.sections.find((s) => s.key === key)?.label ?? key;
}

/** The latest result beside the learner's target, when both are on one scale. */
export function LatestOfficialResult({ history, examName }: { history: OfficialScoreHistory; examName: string }) {
  const t = useTranslations('learning.officialScores');
  const fmt = useScore();
  const latest = history.latest;
  return (
    <Card padding="lg">
      <h2 className="text-xl">{t('latest.title')}</h2>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-muted">{t('label')}</p>
      {!latest ? (
        <p className="mt-3 text-sm text-ink-muted">{t('latest.none', { exam: examName })}</p>
      ) : (
        <>
          <p className="mt-3 text-sm">
            {t('latest.which', { test: latest.testName, provider: latest.providerName, date: fmt.date(latest.takenOn) })}
          </p>
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[minmax(10rem,auto)_1fr]">
            {latest.overallScore !== null ? (
              <>
                <dt className="font-medium text-ink-muted">{latest.version?.overall?.label ?? t('form.overall')}</dt>
                <dd className="text-lg font-semibold tabular-nums">{fmt.value(latest.overallScore)}</dd>
              </>
            ) : null}
            {Object.entries(latest.sectionScores).map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="font-medium text-ink-muted">{sectionLabel(latest.version, key)}</dt>
                <dd className="tabular-nums">{fmt.value(value)}</dd>
              </div>
            ))}
            <dt className="font-medium text-ink-muted">{t('latest.target')}</dt>
            <dd>
              {history.target === null ? (
                t('latest.noTarget')
              ) : (
                <>
                  <span className="tabular-nums">{fmt.value(history.target)}</span>
                  {history.targetDifference !== null ? (
                    <span className="text-ink-muted">
                      {' · '}
                      {history.targetDifference === 0
                        ? t('latest.atTarget')
                        : history.targetDifference > 0
                          ? t('latest.aboveTarget', { points: fmt.value(history.targetDifference) })
                          : t('latest.belowTarget', { points: fmt.value(-history.targetDifference) })}
                    </span>
                  ) : null}
                </>
              )}
            </dd>
          </dl>
          {history.targetNotComparable ? <p className="mt-3 text-sm text-ink-muted">{t('latest.notComparable')}</p> : null}
          {latest.sittingOfTest > 1 ? (
            <Alert tone="caution" className="mt-4">
              <p>{t('latest.repeat', { n: latest.sittingOfTest })}</p>
            </Alert>
          ) : null}
        </>
      )}
    </Card>
  );
}

/** A small line of overall scores over time, on the scale's own range. The table beside it carries the data. */
function OverallChart({ entries, version }: { entries: HistoryEntry[]; version: ScoreVersion }) {
  const points = entries.filter((e) => e.overallScore !== null);
  if (!version.overall || points.length < 2) return null;
  const { min, max } = version.overall.scale;
  const width = 320;
  const height = 120;
  const x = (i: number) => 16 + (i * (width - 32)) / (points.length - 1);
  const y = (v: number) => height - 12 - ((v - min) / (max - min)) * (height - 24);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-28 w-full max-w-md text-accent" aria-hidden="true" focusable="false">
      <line x1="16" x2={width - 16} y1={height - 12} y2={height - 12} className="stroke-line" strokeWidth="1" />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points.map((p, i) => `${x(i)},${y(p.overallScore!)}`).join(' ')}
      />
      {points.map((p, i) => (
        <circle key={p.id} cx={x(i)} cy={y(p.overallScore!)} r={p.sittingOfTest > 1 ? 4 : 3} fill={p.sittingOfTest > 1 ? 'white' : 'currentColor'} stroke="currentColor" strokeWidth="2" />
      ))}
    </svg>
  );
}

/** Every recorded result, grouped by scale and test version; results on different scales are never compared. */
export function OfficialScoreHistoryTables({ history, examKey }: { history: OfficialScoreHistory; examKey: string }) {
  const t = useTranslations('learning.officialScores');
  const fmt = useScore();
  if (history.entries.length === 0) return null;
  const groups = new Map<string, HistoryEntry[]>();
  for (const entry of history.entries) groups.set(entry.scaleKey, [...(groups.get(entry.scaleKey) ?? []), entry]);

  return (
    <section aria-labelledby="official-history-heading">
      <h2 id="official-history-heading" className="text-xl">
        {t('history.title')}
      </h2>
      {groups.size > 1 ? <p className="mt-1 text-sm text-ink-muted">{t('history.separateScales')}</p> : null}
      {[...groups.entries()].map(([scaleKey, entries]) => {
        const version = entries[0].version;
        const captionId = `official-history-${scaleKey}`;
        return (
          <div key={scaleKey} className="mt-6">
            <h3 className="text-base font-semibold">{version?.label ?? scaleKey}</h3>
            {version ? <OverallChart entries={entries} version={version} /> : null}
            <div role="region" aria-labelledby={captionId} tabIndex={0} className="mt-3 overflow-x-auto rounded-card border border-line bg-surface">
              <table className="w-full min-w-[42rem] border-collapse text-sm">
                <caption id={captionId} className="px-4 pt-3 text-start text-xs text-ink-muted">
                  {t('history.caption', { version: version?.label ?? scaleKey })}
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="px-3 py-2 text-start font-semibold">{t('history.date')}</th>
                    <th scope="col" className="px-3 py-2 text-start font-semibold">{t('history.test')}</th>
                    <th scope="col" className="px-3 py-2 text-end font-semibold">{version?.overall?.label ?? t('form.overall')}</th>
                    <th scope="col" className="px-3 py-2 text-start font-semibold">{t('history.sections')}</th>
                    <th scope="col" className="px-3 py-2 text-start font-semibold">{t('history.change')}</th>
                    <th scope="col" className="px-3 py-2 text-start font-semibold">
                      <span className="sr-only">{t('history.actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().map((entry) => (
                    <tr key={entry.id} className="border-b border-line align-top last:border-b-0">
                      <th scope="row" className="px-3 py-2 text-start font-normal tabular-nums">
                        <time dateTime={entry.takenOn}>{fmt.date(entry.takenOn)}</time>
                      </th>
                      <td className="px-3 py-2">
                        <span className="font-medium">{entry.testName}</span>
                        <span className="block text-xs text-ink-subtle">{entry.providerName}</span>
                        {entry.sittingOfTest > 1 ? (
                          <Badge tone="caution" className="mt-1">
                            {t('history.repeatBadge', { n: entry.sittingOfTest })}
                          </Badge>
                        ) : null}
                        {entry.notes ? <span className="mt-1 block text-xs text-ink-muted">{entry.notes}</span> : null}
                      </td>
                      <td className="px-3 py-2 text-end tabular-nums">{entry.overallScore === null ? '—' : fmt.value(entry.overallScore)}</td>
                      <td className="px-3 py-2">
                        {Object.keys(entry.sectionScores).length === 0
                          ? '—'
                          : Object.entries(entry.sectionScores)
                              .map(([key, value]) => `${sectionLabel(entry.version, key)}: ${fmt.value(value)}`)
                              .join(' · ')}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {!entry.previous ? (
                          <span className="text-ink-muted">{t('history.firstOnScale')}</span>
                        ) : (
                          <>
                            {entry.overallChange !== null ? (
                              <span className="block tabular-nums">
                                {t('history.changeVs', { change: fmt.change(entry.overallChange), date: fmt.date(entry.previous.takenOn) })}
                              </span>
                            ) : null}
                            {entry.sectionChanges.map((c) => (
                              <span key={c.key} className="block tabular-nums text-ink-muted">
                                {`${sectionLabel(entry.version, c.key)}: ${fmt.change(c.change)}`}
                              </span>
                            ))}
                            {entry.overallChange === null && entry.sectionChanges.length === 0 ? (
                              <span className="text-ink-muted">{t('history.nothingToCompare')}</span>
                            ) : null}
                          </>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/study-plan/scores?exam=${encodeURIComponent(examKey)}&edit=${encodeURIComponent(entry.id)}#score-form`}
                            className="text-sm"
                            aria-label={t('history.editLabel', { test: entry.testName })}
                          >
                            {t('history.edit')}
                          </Link>
                          <DeleteScoreButton id={entry.id} label={entry.testName} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/** The short version for the Progress page: the latest official result, kept apart from what was measured here. */
export function OfficialScoresSummaryCard({ history, examKey, examName }: { history: OfficialScoreHistory; examKey: string; examName: string }) {
  const t = useTranslations('learning.officialScores');
  const fmt = useScore();
  const latest = history.latest;
  return (
    <Card padding="lg">
      <h2 className="text-xl">{t('summary.title')}</h2>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-muted">{t('label')}</p>
      {latest ? (
        <p className="mt-3 text-sm">
          {t('summary.latest', {
            score: latest.overallScore !== null ? fmt.value(latest.overallScore) : '—',
            test: latest.testName,
            date: fmt.date(latest.takenOn),
          })}
          {history.targetDifference !== null
            ? ` ${
                history.targetDifference === 0
                  ? t('latest.atTarget')
                  : history.targetDifference > 0
                    ? t('latest.aboveTarget', { points: fmt.value(history.targetDifference) })
                    : t('latest.belowTarget', { points: fmt.value(-history.targetDifference) })
              }`
            : ''}
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">{t('latest.none', { exam: examName })}</p>
      )}
      <p className="mt-2 text-sm text-ink-muted">{t('summary.separate')}</p>
      <p className="mt-3 text-sm">
        <Link href={`/study-plan/scores?exam=${encodeURIComponent(examKey)}`}>{t('summary.link')}</Link>
      </p>
    </Card>
  );
}
