/**
 * Accessible performance breakdown.
 *
 * The bar is a visual aid layered on a real table: every number is readable as
 * text, the table has proper row headers, and nothing is conveyed by colour
 * alone (each row states its counts).
 */

export interface SkillRow {
  key: string;
  label: string;
  correct: number;
  incorrect: number;
  omitted: number;
  total: number;
  accuracy: number;
  medianTimeMs: number;
  notAutoScored: number;
}

function toneFor(accuracy: number, scored: number): { bar: string; text: string; word: string } {
  if (scored === 0) return { bar: 'bg-line-strong', text: 'text-ink-muted', word: 'not scored' };
  if (accuracy >= 0.8) return { bar: 'bg-positive', text: 'text-positive', word: 'strong' };
  if (accuracy >= 0.5) return { bar: 'bg-caution', text: 'text-caution', word: 'mixed' };
  return { bar: 'bg-negative', text: 'text-negative', word: 'needs work' };
}

function formatSeconds(ms: number): string {
  if (ms <= 0) return '—';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`;
}

export function SkillBreakdown({ rows }: { rows: SkillRow[] }) {
  const sorted = [...rows].sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="relative overflow-x-auto rounded-card border border-line bg-surface">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Your accuracy and median time per question, by skill, for this session.
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-3 text-left font-semibold">
              Skill
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Correct
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Accuracy
            </th>
            <th scope="col" className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
              <span aria-hidden="true">Profile</span>
              <span className="sr-only">Accuracy shown as a bar</span>
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Median time
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const scored = row.total - row.notAutoScored;
            const tone = toneFor(row.accuracy, scored);
            const percent = Math.round(row.accuracy * 100);
            return (
              <tr key={row.key} className="border-b border-line last:border-0">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  {row.label}
                  {row.omitted > 0 ? (
                    <span className="block text-xs text-ink-subtle">
                      {row.omitted} left blank
                    </span>
                  ) : null}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">
                  {row.correct} / {scored}
                </td>
                <td className={`px-4 py-3 text-right font-medium tabular-nums ${tone.text}`}>
                  {scored > 0 ? `${percent}%` : '—'}
                  <span className="sr-only"> ({tone.word})</span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <div
                    className="h-2.5 w-full max-w-40 overflow-hidden rounded-full bg-surface-sunken"
                    aria-hidden="true"
                  >
                    <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${percent}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                  {formatSeconds(row.medianTimeMs)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
