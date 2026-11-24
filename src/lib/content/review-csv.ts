/**
 * The CSV round trip with the reviewers hired by the team: the file sent to
 * them (one row per question, with its exact version and content fingerprint
 * and empty decision columns) and the file they send back.
 *
 * Pure functions with no Node or database imports: the admin screen parses a
 * returned file in the browser, so only the columns that matter travel to the
 * server (the whole file, with every question's text, can exceed what a
 * serverless request may carry), and the server reads each row again with the
 * same `readDecisionRow`, so what the server approves never depends on the
 * browser having got it right.
 */

/** Columns of the export, in order. The last three are for the reviewer. */
export const EXPORT_COLUMNS = [
  'export_id',
  'question_id',
  'version',
  'fingerprint',
  'exam',
  'section',
  'domain',
  'skill',
  'difficulty',
  'response_type',
  'stimulus',
  'instructions',
  'stem',
  'options',
  'answer_key',
  'explanation',
  'distractor_notes',
  'decision',
  'reviewer_email',
  'notes',
] as const;

/** What a decision cell may say. Anything else is a malformed row, never a guess. */
const APPROVED_WORDS = new Set(['approved', 'approve', 'yes', 'y', 'ok', 'si', 'sì', 'sí', 'x', '✓', '✔', 'true', '1']);
const CHANGES_WORDS = new Set([
  'changes',
  'changes_requested',
  'changes requested',
  'change',
  'reject',
  'rejected',
  'no',
  'n',
  'false',
  '0',
]);

/** Header spellings we accept for each column we read back. Lower-cased, spaces and dashes as underscores. */
const HEADER_ALIASES: Record<keyof RawDecisionRow, string[]> = {
  line: [],
  questionId: ['question_id', 'questionid', 'id', 'question'],
  version: ['version', 'question_version', 'questionversion'],
  fingerprint: ['fingerprint', 'review_fingerprint', 'reviewfingerprint', 'content_fingerprint'],
  exportId: ['export_id', 'exportid', 'export'],
  decision: ['decision', 'outcome', 'approved', 'verdict', 'status'],
  reviewerEmail: ['reviewer_email', 'revieweremail', 'reviewer'],
};

export interface CsvRecord {
  /** 1-based line number in the file where the record starts, as a spreadsheet shows it. */
  line: number;
  cells: string[];
}

export interface CsvTable {
  header: string[];
  records: CsvRecord[];
  delimiter: string;
}

/**
 * RFC 4180 with what spreadsheets actually produce: a byte-order mark, CRLF
 * or LF line ends, and a comma, semicolon (Excel in Italian, Spanish, Polish
 * or Turkish) or tab between cells, detected from the header line.
 */
export function parseCsv(text: string): CsvTable {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const firstLine = source.slice(0, source.search(/\r?\n|$/));
  const delimiter = [',', ';', '\t']
    .map((d) => ({ d, n: countOutsideQuotes(firstLine, d) }))
    .sort((a, b) => b.n - a.n)[0].d;

  const rows: CsvRecord[] = [];
  let cells: string[] = [];
  let cell = '';
  let quoted = false;
  let line = 1;
  let startLine = 1;
  let i = 0;
  const endRecord = () => {
    cells.push(cell);
    if (!(cells.length === 1 && cells[0] === '')) rows.push({ line: startLine, cells });
    cells = [];
    cell = '';
  };
  while (i < source.length) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"') {
        if (source[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      if (ch === '\n') line += 1;
      cell += ch;
      i += 1;
      continue;
    }
    if (ch === '"' && cell === '') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === delimiter) {
      cells.push(cell);
      cell = '';
      i += 1;
      continue;
    }
    if (ch === '\r' || ch === '\n') {
      endRecord();
      i += ch === '\r' && source[i + 1] === '\n' ? 2 : 1;
      line += 1;
      startLine = line;
      continue;
    }
    cell += ch;
    i += 1;
  }
  if (cell !== '' || cells.length > 0) endRecord();

  const [head, ...records] = rows;
  return { header: head?.cells.map((h) => h.trim()) ?? [], records, delimiter };
}

function countOutsideQuotes(line: string, delimiter: string): number {
  let n = 0;
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === delimiter && !quoted) n += 1;
  }
  return n;
}

function normaliseHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

/** The cells of one returned row that matter, exactly as written. */
export interface RawDecisionRow {
  line: number;
  questionId: string;
  version: string;
  fingerprint: string;
  exportId: string;
  decision: string;
  reviewerEmail: string;
}

export type ColumnMap = Partial<Record<Exclude<keyof RawDecisionRow, 'line'>, number>>;

export type HeaderProblem = 'empty-file' | 'no-question-id-column' | 'no-decision-column';

/** Finds the columns we read back. A file without a question id or a decision column cannot be imported at all. */
export function mapColumns(header: readonly string[]): { columns: ColumnMap } | { problem: HeaderProblem } {
  if (header.length === 0 || header.every((h) => h === '')) return { problem: 'empty-file' };
  const normalised = header.map(normaliseHeader);
  const columns: ColumnMap = {};
  for (const [key, aliases] of Object.entries(HEADER_ALIASES) as Array<[keyof RawDecisionRow, string[]]>) {
    if (key === 'line') continue;
    for (const alias of aliases) {
      const index = normalised.indexOf(alias);
      if (index >= 0) {
        columns[key] = index;
        break;
      }
    }
  }
  if (columns.questionId === undefined) return { problem: 'no-question-id-column' };
  if (columns.decision === undefined) return { problem: 'no-decision-column' };
  return { columns };
}

/** The cells that matter from every record of a parsed file. */
export function rawDecisionRows(table: CsvTable, columns: ColumnMap): RawDecisionRow[] {
  const cell = (record: CsvRecord, index: number | undefined) => (index === undefined ? '' : (record.cells[index] ?? ''));
  return table.records.map((record) => ({
    line: record.line,
    questionId: cell(record, columns.questionId),
    version: cell(record, columns.version),
    fingerprint: cell(record, columns.fingerprint),
    exportId: cell(record, columns.exportId),
    decision: cell(record, columns.decision),
    reviewerEmail: cell(record, columns.reviewerEmail),
  }));
}

export type Decision = 'approved' | 'changes' | 'none';

export interface DecisionRow {
  line: number;
  questionId: string;
  version: number | null;
  fingerprint: string | null;
  exportId: string | null;
  decision: Decision;
  reviewerEmail: string | null;
}

export type RowProblem =
  | 'missing-question-id'
  | 'bad-question-id'
  | 'bad-version'
  | 'bad-fingerprint'
  | 'bad-export-id'
  | 'unknown-decision'
  | 'bad-reviewer-email';

/** A spreadsheet may prefix a cell with an apostrophe to keep it as text; the export does so for text starting with = + - @. */
function clean(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith("'") ? trimmed.slice(1).trim() : trimmed;
}

/**
 * Reads one returned row strictly. A value we cannot read is a problem with
 * the row, reported to the administrator; it is never read as an approval.
 */
export function readDecisionRow(raw: RawDecisionRow): { row: DecisionRow } | { problem: RowProblem } {
  const questionId = clean(raw.questionId);
  if (!questionId) return { problem: 'missing-question-id' };
  if (questionId.length > 160 || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(questionId)) return { problem: 'bad-question-id' };

  const versionText = clean(raw.version);
  let version: number | null = null;
  if (versionText) {
    // A spreadsheet may turn 3 into "3.0"; anything else is not a version.
    const match = /^v?(\d{1,6})(?:\.0+)?$/i.exec(versionText);
    if (!match || Number(match[1]) < 1) return { problem: 'bad-version' };
    version = Number(match[1]);
  }

  const fingerprintText = clean(raw.fingerprint).toLowerCase();
  if (fingerprintText && !/^[0-9a-f]{64}$/.test(fingerprintText)) return { problem: 'bad-fingerprint' };

  const exportText = clean(raw.exportId);
  if (exportText && !/^[0-9a-f-]{36}$/i.test(exportText)) return { problem: 'bad-export-id' };

  const word = clean(raw.decision).toLowerCase().replace(/\s+/g, ' ');
  let decision: Decision;
  if (word === '') decision = 'none';
  else if (APPROVED_WORDS.has(word)) decision = 'approved';
  else if (CHANGES_WORDS.has(word)) decision = 'changes';
  else return { problem: 'unknown-decision' };

  const email = clean(raw.reviewerEmail).toLowerCase();
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return { problem: 'bad-reviewer-email' };

  return {
    row: {
      line: raw.line,
      questionId,
      version,
      fingerprint: fingerprintText || null,
      exportId: exportText ? exportText.toLowerCase() : null,
      decision,
      reviewerEmail: email || null,
    },
  };
}

/** One cell of the export: quoted when it must be, and never read as a formula by a spreadsheet. */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : typeof value === 'string' ? value : JSON.stringify(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",;\r\n\t]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** A whole CSV file, with a byte-order mark so Excel reads it as UTF-8. CRLF line ends, as RFC 4180 has them. */
export function toCsv(rows: ReadonlyArray<ReadonlyArray<unknown>>): string {
  return `﻿${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}
