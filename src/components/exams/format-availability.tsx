import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { FormatCell, MatrixRow } from '@/lib/home/home-data';
import { StatusBadge, StatusIcon } from '@/components/ui';

/**
 * Every exam's formats and whether each can be started, from the live bank.
 * Shown in full on /exams; the homepage carries a short summary that links
 * here.
 */

export const FORMAT_COLUMNS = ['practice', 'diagnostic', 'timed', 'simulation'] as const;
export type FormatColumn = (typeof FORMAT_COLUMNS)[number];

/** Below md each cell shows its column name above it, from data-label. */
const CELL_LABEL =
  'max-md:p-0 max-md:before:mb-1 max-md:before:block max-md:before:text-xs max-md:before:font-bold max-md:before:uppercase max-md:before:tracking-[0.08em] max-md:before:text-ink-subtle max-md:before:content-[attr(data-label)]';

function Cell({ cell }: { cell: FormatCell }) {
  const t = useTranslations('exams.status');
  // The cell's detail is a `home` message (built by home-data); its values are numbers and config names.
  const tHome = useTranslations('home');
  const format = useFormatter();
  let detail: string | null = cell.detail;
  if (cell.message) {
    const values = Object.fromEntries(
      Object.entries(cell.message.values ?? {}).map(([key, value]) => [
        key,
        typeof value === 'object' ? format.list(value.list, { type: 'conjunction' }) : value,
      ]),
    );
    detail = tHome(cell.message.key, values);
  }
  return (
    <>
      <StatusBadge status={cell.status}>{t(cell.status)}</StatusBadge>
      {detail ? <span className="mt-1 block text-sm leading-snug text-ink-subtle">{detail}</span> : null}
    </>
  );
}

export function FormatAvailabilityTable({ matrix, asOf }: { matrix: MatrixRow[]; asOf: string }) {
  const t = useTranslations('exams');
  const format = useFormatter();
  const date = format.dateTime(new Date(asOf), { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ink-muted">
        {(['open', 'notyet', 'notoffered'] as const).map((status) => (
          <li key={status} className="flex items-center gap-2">
            <StatusIcon status={status} />
            <strong className="text-ink">{t(`status.${status}`)}</strong> {t(`formats.legend.${status}`)}
          </li>
        ))}
      </ul>

      {/*
       * One table at every width. Below md it reflows into a card per exam,
       * each cell labelled from its column; the explicit roles keep the table
       * semantics that a display change would otherwise drop.
       */}
      <table role="table" className="mt-6 w-full border-collapse max-md:block">
        <caption className="sr-only">{t('formats.caption')}</caption>
        <thead role="rowgroup" className="max-md:sr-only">
          <tr role="row" className="border-b-[1.5px] border-ink text-left">
            <th role="columnheader" scope="col" className="py-3 pe-4 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
              {t('formats.exam')}
            </th>
            <th role="columnheader" scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
              {t('formats.reviewedQuestions')}
            </th>
            {FORMAT_COLUMNS.map((column) => (
              <th role="columnheader" key={column} scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
                {t(`formats.column.${column}`)}
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
              <td role="cell" data-label={t('formats.reviewedQuestions')} className={`px-4 py-4 text-lg font-semibold tabular-nums ${CELL_LABEL}`}>
                {format.number(row.questions)}
              </td>
              {FORMAT_COLUMNS.map((column) => (
                <td role="cell" key={column} data-label={t(`formats.column.${column}`)} className={`px-4 py-4 ${CELL_LABEL}`}>
                  <Cell cell={row[column]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-6 text-sm text-ink-subtle">{t('formats.footnote', { date })}</p>
    </>
  );
}

/**
 * A row's formats by status: open now, waiting for reviewed questions, and
 * not offered because the rules they need are not verified. `label` names a
 * column in the reader's language, e.g. from the `exams` messages
 * `formats.column.<column>`.
 */
export function formatSummary(
  row: MatrixRow,
  label: (column: FormatColumn) => string,
): { open: string[]; notYet: string[]; notOffered: string[] } {
  const summary = { open: [] as string[], notYet: [] as string[], notOffered: [] as string[] };
  for (const column of FORMAT_COLUMNS) {
    const status = row[column].status;
    (status === 'open' ? summary.open : status === 'notyet' ? summary.notYet : summary.notOffered).push(label(column));
  }
  return summary;
}
