import { requireExamConfig } from '@/lib/exams/registry';
import { MIN_ATTEMPTS_FOR_SIGNAL } from '@/lib/learning/recommend';
import { cx } from '@/components/ui';

/**
 * What accuracy by topic looks like, drawn with invented answers against the
 * SAT's real topic names and labelled as an illustration. It shows the
 * reporting rule: every figure comes with its count, and below
 * MIN_ATTEMPTS_FOR_SIGNAL answers no percentage is printed.
 */

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

export function TopicAccuracyExample({ className }: { className?: string }) {
  const sat = requireExamConfig('digital-sat');
  return (
    <div className={cx('min-w-0 rounded-card border-[1.5px] border-ink bg-surface p-4 sm:p-7', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xl font-bold">SAT, by topic</p>
        <span className="rounded-sm bg-highlight px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-ink">
          Illustrative example · not real data
        </span>
      </div>
      <table className="mt-2 w-full border-collapse">
        <caption className="sr-only">
          Illustrative example, not real learner data: answers by SAT topic, correct out of scored, with a
          percentage only from {MIN_ATTEMPTS_FOR_SIGNAL} answers upward
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
                        ) : scored < MIN_ATTEMPTS_FOR_SIGNAL ? (
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
  );
}
