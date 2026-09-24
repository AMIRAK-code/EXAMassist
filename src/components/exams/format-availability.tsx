import Link from 'next/link';
import type { FormatCell, MatrixRow } from '@/lib/home/home-data';
import { StatusBadge, StatusIcon } from '@/components/ui';

/**
 * Every exam's formats and whether each can be started, from the live bank.
 * Shown in full on /exams; the homepage carries a short summary that links
 * here.
 */

const COLUMNS: Array<{ key: 'practice' | 'diagnostic' | 'timed' | 'simulation'; label: string }> = [
  { key: 'practice', label: 'Topic practice' },
  { key: 'diagnostic', label: 'Diagnostic' },
  { key: 'timed', label: 'Timed sections' },
  { key: 'simulation', label: 'Full-length simulation' },
];

/** Below md each cell shows its column name above it, from data-label. */
const CELL_LABEL =
  'max-md:p-0 max-md:before:mb-1 max-md:before:block max-md:before:text-xs max-md:before:font-bold max-md:before:uppercase max-md:before:tracking-[0.08em] max-md:before:text-ink-subtle max-md:before:content-[attr(data-label)]';

function Cell({ cell }: { cell: FormatCell }) {
  return (
    <>
      <StatusBadge status={cell.status} />
      {cell.detail ? <span className="mt-1 block text-sm leading-snug text-ink-subtle">{cell.detail}</span> : null}
    </>
  );
}

export function FormatAvailabilityTable({ matrix, asOf }: { matrix: MatrixRow[]; asOf: string }) {
  const date = new Date(asOf).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ink-muted">
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

      {/*
       * One table at every width. Below md it reflows into a card per exam,
       * each cell labelled from its column; the explicit roles keep the table
       * semantics that a display change would otherwise drop.
       */}
      <table role="table" className="mt-6 w-full border-collapse max-md:block">
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
          {matrix.map((row) => (
            <tr
              role="row"
              key={row.examKey}
              className="border-b border-line align-top max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-3 max-md:border-b-0 max-md:border-t-[1.5px] max-md:border-ink max-md:py-5"
            >
              <th role="rowheader" scope="row" className="py-4 pe-4 text-left font-normal max-md:col-span-2 max-md:p-0">
                <Link href={`/exams/${row.hubSlug}`} className="block text-lg font-bold text-ink no-underline hover:underline">
                  {row.name}
                </Link>
                {row.variant ? <span className="text-sm text-ink-muted">{row.variant}</span> : null}
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
        Counts as of {date}. Essay tasks are not listed: we do not author or score essays. Every format
        shows its limits again on the practice screen, before you start.
      </p>
    </>
  );
}

/**
 * A row's formats by status, by name: open now, waiting for reviewed
 * questions, and not offered because the rules they need are not verified.
 */
export function formatSummary(row: MatrixRow): { open: string[]; notYet: string[]; notOffered: string[] } {
  const summary = { open: [] as string[], notYet: [] as string[], notOffered: [] as string[] };
  for (const column of COLUMNS) {
    const status = row[column.key].status;
    (status === 'open' ? summary.open : status === 'notyet' ? summary.notYet : summary.notOffered).push(column.label);
  }
  return summary;
}
