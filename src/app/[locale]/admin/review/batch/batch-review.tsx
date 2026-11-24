'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Alert, Badge, Button, Card, fieldClass } from '@/components/ui';
import { mapColumns, parseCsv, rawDecisionRows, type HeaderProblem, type RawDecisionRow } from '@/lib/content/review-csv';
import type { BatchPlan, PendingQuestion, RowOutcome } from '@/lib/content/review-batches';

/**
 * The batch screen's interactive part: filter and select questions awaiting
 * review, export them for reviewers, import a returned file, and record either
 * after a dry run. Every rule is enforced again on the server; this only
 * gathers the choice and shows what the server says it would do.
 */

export interface BatchExam {
  key: string;
  name: string;
  sections: Array<{ key: string; name: string }>;
  domains: Array<{ slug: string; name: string; sectionKey: string }>;
}

interface ReviewerChoice {
  userId: string;
  publicName: string;
  publicCredentials: string;
  examKeys: string[];
}

interface ExportChoice {
  id: string;
  fileName: string;
  itemCount: number;
  createdAt: string;
}

const PAGE_SIZE = 100;
const HEADERS = { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' };

async function post<T>(url: string, body: unknown): Promise<{ data: T } | { error: string | null }> {
  const response = await fetch(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) }).catch(() => null);
  if (!response) return { error: null };
  const json = (await response.json().catch(() => null)) as (T & { error?: { message?: string } }) | null;
  if (!response.ok) return { error: json?.error?.message ?? '' };
  return { data: json as T };
}

async function sha256Hex(text: string): Promise<string | null> {
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

export function BatchReview({
  questions,
  exams,
  examNames,
  exports,
  reviewers,
  today,
  maxRows,
  maxExportRows,
}: {
  questions: PendingQuestion[];
  exams: BatchExam[];
  examNames: Record<string, string>;
  exports: ExportChoice[];
  reviewers: ReviewerChoice[];
  today: string;
  maxRows: number;
  maxExportRows: number;
}) {
  const t = useTranslations('admin.batchReview');
  const id = useId();

  const [exam, setExam] = useState('');
  const [section, setSection] = useState('');
  const [domain, setDomain] = useState('');
  const [sent, setSent] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const lastClicked = useRef<number | null>(null);
  const [recording, setRecording] = useState<null | { kind: 'selection' } | { kind: 'csv'; file: ParsedFile }>(null);
  // A new panel each time "Record approvals" is pressed; it survives the selection being cleared after recording.
  const [panelKey, setPanelKey] = useState(0);

  const examConfig = exams.find((e) => e.key === exam);
  const domainNames = useMemo(() => {
    const out: Record<string, string> = {};
    for (const e of exams) for (const d of e.domains) out[`${e.key}|${d.slug}`] = d.name;
    return out;
  }, [exams]);
  const exportNames = useMemo(() => new Map(exports.map((e) => [e.id, e.fileName])), [exports]);

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (!exam || q.examKey === exam) &&
          (!section || q.sectionKey === section) &&
          (!domain || q.domainSlug === domain) &&
          (!from || q.loadedOn >= from) &&
          (!to || q.loadedOn <= to) &&
          (!sent || (sent === 'never' ? q.exportIds.length === 0 : q.exportIds.includes(sent))),
      ),
    [questions, exam, section, domain, from, to, sent],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const shown = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  // A filter change starts again at the first page; the range anchor belongs to the old list.
  useEffect(() => {
    setPage(0);
    lastClicked.current = null;
  }, [exam, section, domain, from, to, sent]);

  function toggle(index: number, checked: boolean, shift: boolean) {
    // Read the anchor now: React may run the updater below after the ref has moved on.
    const anchor = lastClicked.current;
    const [start, end] = shift && anchor !== null ? [Math.min(anchor, index), Math.max(anchor, index)] : [index, index];
    const ids = filtered.slice(start, end + 1).map((q) => q.questionVersionId);
    lastClicked.current = index;
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  const selectedQuestions = useMemo(() => questions.filter((q) => selected.has(q.questionVersionId)), [questions, selected]);
  const selectionRows: RawDecisionRow[] = useMemo(
    () =>
      selectedQuestions.map((q, i) => ({
        line: i + 1,
        questionId: q.questionId,
        version: String(q.version),
        fingerprint: q.fingerprint,
        exportId: '',
        decision: 'approved',
        reviewerEmail: '',
      })),
    [selectedQuestions],
  );

  const filter = { exam: exam || undefined, section: section || undefined, domain: domain || undefined, sent: sent || undefined, from: from || undefined, to: to || undefined };

  return (
    <div className="space-y-10">
      <section aria-labelledby={`${id}-list`}>
        <h2 id={`${id}-list`} className="font-heading text-2xl font-semibold">
          {t('filters.heading')}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select id={`${id}-exam`} label={t('filters.exam')} value={exam} onChange={(v) => (setExam(v), setSection(''), setDomain(''))}>
            <option value="">{t('filters.allExams')}</option>
            {exams.map((e) => (
              <option key={e.key} value={e.key}>{e.name}</option>
            ))}
          </Select>
          <Select id={`${id}-section`} label={t('filters.section')} value={section} onChange={(v) => (setSection(v), setDomain(''))} disabled={!examConfig}>
            <option value="">{t('filters.allSections')}</option>
            {examConfig?.sections.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
          </Select>
          <Select id={`${id}-domain`} label={t('filters.domain')} value={domain} onChange={setDomain} disabled={!examConfig}>
            <option value="">{t('filters.allDomains')}</option>
            {examConfig?.domains
              .filter((d) => !section || d.sectionKey === section)
              .map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
          </Select>
          <Select id={`${id}-sent`} label={t('filters.sent')} value={sent} onChange={setSent}>
            <option value="">{t('filters.sentAny')}</option>
            <option value="never">{t('filters.sentNever')}</option>
            {exports.map((e) => (
              <option key={e.id} value={e.id}>{t('filters.sentIn', { file: e.fileName, count: e.itemCount })}</option>
            ))}
          </Select>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${id}-from`} className="text-sm font-medium">{t('filters.from')}</label>
            <input id={`${id}-from`} type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={fieldClass()} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${id}-to`} className="text-sm font-medium">{t('filters.to')}</label>
            <input id={`${id}-to`} type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={fieldClass()} />
          </div>
        </div>
        <div className="mt-3">
          <Button
            variant="quiet"
            size="sm"
            onClick={() => (setExam(''), setSection(''), setDomain(''), setSent(''), setFrom(''), setTo(''))}
          >
            {t('filters.reset')}
          </Button>
        </div>

        <Card className="sticky top-2 z-10 mt-6" padding="md">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p role="status" aria-live="polite" className="text-sm font-medium tabular-nums">
              {t('selection.summary', { selected: selected.size, matching: filtered.length })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={filtered.length === 0}
                onClick={() => setSelected((prev) => new Set([...prev, ...filtered.map((q) => q.questionVersionId)]))}
              >
                {t('selection.selectAll', { count: filtered.length })}
              </Button>
              <Button variant="quiet" size="sm" disabled={selected.size === 0} onClick={() => setSelected(new Set())}>
                {t('selection.clear')}
              </Button>
              <Button size="sm" disabled={selected.size === 0 || reviewers.length === 0} onClick={() => (setPanelKey((k) => k + 1), setRecording({ kind: 'selection' }))}>
                {t('selection.approve', { count: selected.size })}
              </Button>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">{t('selection.hint')}</p>
        </Card>

        {recording?.kind === 'selection' ? (
          <RecordPanel
            key={`selection-${panelKey}`}
            rows={selectionRows}
            source="selection"
            defaultSourceName=""
            sourceSha256={null}
            fileExportId={null}
            exports={exports}
            reviewers={reviewers}
            today={today}
            onCancel={() => setRecording(null)}
            onRecorded={() => setSelected(new Set())}
          />
        ) : null}

        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">{t('selection.empty')}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-start">
                  <th scope="col" className="w-10 px-3 py-2"><span className="sr-only">{t('columns.select')}</span></th>
                  <th scope="col" className="px-3 py-2 text-start font-semibold">{t('columns.question')}</th>
                  <th scope="col" className="px-3 py-2 text-start font-semibold">{t('columns.exam')}</th>
                  <th scope="col" className="px-3 py-2 text-start font-semibold">{t('columns.domain')}</th>
                  <th scope="col" className="px-3 py-2 text-start font-semibold">{t('columns.loaded')}</th>
                  <th scope="col" className="px-3 py-2 text-start font-semibold">{t('columns.sent')}</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((q, offset) => {
                  const index = current * PAGE_SIZE + offset;
                  const checked = selected.has(q.questionVersionId);
                  return (
                    <tr key={q.questionVersionId} className={checked ? 'border-b border-line bg-accent-soft/40' : 'border-b border-line'}>
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          className="size-4"
                          checked={checked}
                          aria-label={t('selection.select', { id: q.questionId })}
                          onClick={(event) => toggle(index, event.currentTarget.checked, event.shiftKey)}
                          onChange={() => undefined}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Link href={`/admin/review/${encodeURIComponent(q.questionId)}`} className="font-mono text-xs">
                          {q.questionId}
                        </Link>
                        <span className="ms-2 text-xs text-ink-muted">v{q.version}</span>
                        <p className="mt-1 line-clamp-2 text-ink">{q.stem}</p>
                      </td>
                      <td className="px-3 py-2 align-top">{examNames[q.examKey] ?? q.examKey}</td>
                      <td className="px-3 py-2 align-top">{domainNames[`${q.examKey}|${q.domainSlug}`] ?? q.domainSlug}</td>
                      <td className="px-3 py-2 align-top tabular-nums">{q.loadedOn}</td>
                      <td className="px-3 py-2 align-top text-xs">
                        {q.exportIds.length === 0 ? (
                          <span className="text-ink-muted">{t('notSent')}</span>
                        ) : (
                          q.exportIds.map((e) => <div key={e}>{exportNames.get(e) ?? e}</div>)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 ? (
          <nav className="mt-3 flex items-center gap-3 text-sm" aria-label={t('selection.page', { page: current + 1, pages })}>
            <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
              {t('selection.previous')}
            </Button>
            <span className="tabular-nums">{t('selection.page', { page: current + 1, pages })}</span>
            <Button variant="secondary" size="sm" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
              {t('selection.next')}
            </Button>
          </nav>
        ) : null}
      </section>

      <ExportPanel filter={filter} matching={filtered.length} maxExportRows={maxExportRows} />

      <ImportPanel
        maxRows={maxRows}
        active={recording?.kind === 'csv' ? recording.file : null}
        onParsed={(file) => setRecording(file ? { kind: 'csv', file } : null)}
      />
      {recording?.kind === 'csv' ? (
        <RecordPanel
          key={recording.file.sha256 ?? recording.file.name}
          rows={recording.file.rows}
          source="csv"
          defaultSourceName={recording.file.name}
          sourceSha256={recording.file.sha256}
          fileExportId={recording.file.exportId}
          exports={exports}
          reviewers={reviewers}
          today={today}
          onCancel={() => setRecording(null)}
          onRecorded={() => undefined}
        />
      ) : null}
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={fieldClass()}>
        {children}
      </select>
    </div>
  );
}

function ExportPanel({
  filter,
  matching,
  maxExportRows,
}: {
  filter: Record<string, string | undefined>;
  matching: number;
  maxExportRows: number;
}) {
  const t = useTranslations('admin.batchReview');
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'positive' | 'negative'; text: string; truncated?: boolean } | null>(null);

  async function download() {
    setBusy(true);
    setMessage(null);
    const response = await fetch('/api/admin/review-batches/export', { method: 'POST', headers: HEADERS, body: JSON.stringify(filter) }).catch(() => null);
    setBusy(false);
    if (!response) return setMessage({ tone: 'negative', text: t('errors.network') });
    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      return setMessage({ tone: 'negative', text: json?.error?.message || t('errors.generic') });
    }
    const name = /filename="([^"]+)"/.exec(response.headers.get('content-disposition') ?? '')?.[1] ?? 'review.csv';
    const url = URL.createObjectURL(await response.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage({
      tone: 'positive',
      text: t('export.done', { file: name, count: Number(response.headers.get('x-export-count') ?? 0) }),
      truncated: response.headers.get('x-export-truncated') === '1',
    });
    router.refresh();
  }

  return (
    <section aria-labelledby="export-heading">
    <Card padding="lg">
      <h2 id="export-heading" className="text-xl">{t('export.heading')}</h2>
      <p className="mt-2 text-sm text-ink-muted">{t('export.body', { max: maxExportRows })}</p>
      {message ? (
        <Alert tone={message.tone} role={message.tone === 'negative' ? 'alert' : 'status'} className="mt-4">
          <p>{message.text}</p>
          {message.truncated ? <p>{t('export.truncated', { max: maxExportRows })}</p> : null}
        </Alert>
      ) : null}
      <Button className="mt-4" variant="secondary" loading={busy} disabled={matching === 0} onClick={download}>
        {t('export.button', { count: Math.min(matching, maxExportRows) })}
      </Button>
    </Card>
    </section>
  );
}

interface ParsedFile {
  name: string;
  sha256: string | null;
  rows: RawDecisionRow[];
  exportId: string | null;
}

function ImportPanel({
  maxRows,
  active,
  onParsed,
}: {
  maxRows: number;
  active: ParsedFile | null;
  onParsed: (file: ParsedFile | null) => void;
}) {
  const t = useTranslations('admin.batchReview');
  const id = useId();
  const [problem, setProblem] = useState<string | null>(null);

  async function read(file: File | undefined) {
    setProblem(null);
    onParsed(null);
    if (!file) return;
    const text = await file.text();
    const table = parseCsv(text);
    const mapped = mapColumns(table.header);
    if ('problem' in mapped) return setProblem(t(`import.headerProblem.${mapped.problem as HeaderProblem}`));
    if (table.records.length > maxRows) return setProblem(t('import.tooMany', { rows: table.records.length, max: maxRows }));
    const rows = rawDecisionRows(table, mapped.columns);
    const exportIds = [...new Set(rows.map((r) => r.exportId.trim()).filter(Boolean))];
    onParsed({ name: file.name, sha256: await sha256Hex(text), rows, exportId: exportIds.length === 1 ? exportIds[0] : null });
  }

  return (
    <section aria-labelledby={`${id}-heading`}>
    <Card padding="lg">
      <h2 id={`${id}-heading`} className="text-xl">{t('import.heading')}</h2>
      <p className="mt-2 text-sm text-ink-muted">{t('import.body')}</p>
      <div className="mt-4">
        <label htmlFor={`${id}-file`} className="mb-1.5 block text-sm font-medium">{t('import.file')}</label>
        <input
          id={`${id}-file`}
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => void read(e.target.files?.[0])}
          className="block text-sm"
        />
      </div>
      {problem ? (
        <Alert tone="negative" role="alert" className="mt-4">
          <p>{problem}</p>
        </Alert>
      ) : null}
      {active ? <p className="mt-3 text-sm" role="status">{t('import.read', { rows: active.rows.length, file: active.name })}</p> : null}
    </Card>
    </section>
  );
}

const SUMMARY_GROUPS: Array<{ key: 'alreadyApproved' | 'changed'; outcomes: RowOutcome[] }> = [
  { key: 'alreadyApproved', outcomes: ['already-approved'] },
  { key: 'changed', outcomes: ['changed-since-sent'] },
];
const PROBLEM_ROWS_SHOWN = 200;

function RecordPanel({
  rows,
  source,
  defaultSourceName,
  sourceSha256,
  fileExportId,
  exports,
  reviewers,
  today,
  onCancel,
  onRecorded,
}: {
  rows: RawDecisionRow[];
  source: 'csv' | 'selection';
  defaultSourceName: string;
  sourceSha256: string | null;
  fileExportId: string | null;
  exports: ExportChoice[];
  reviewers: ReviewerChoice[];
  today: string;
  onCancel: () => void;
  onRecorded: () => void;
}) {
  const t = useTranslations('admin.batchReview');
  const router = useRouter();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [reviewerId, setReviewerId] = useState('');
  const [sourceName, setSourceName] = useState(defaultSourceName);
  const [reviewedOn, setReviewedOn] = useState(today);
  const [exportId, setExportId] = useState('');
  const [attested, setAttested] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<BatchPlan | null>(null);
  const [done, setDone] = useState<{ batchId: string; count: number; skipped: number } | null>(null);

  useEffect(() => {
    panel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    panel.current?.focus();
  }, []);

  // A dry run is for exactly these rows: if the selection changes, it has to be run again.
  useEffect(() => {
    setPlan(null);
  }, [rows]);

  const reviewer = reviewers.find((r) => r.userId === reviewerId);
  const ready = Boolean(reviewer) && sourceName.trim().length >= 3 && /^\d{4}-\d{2}-\d{2}$/.test(reviewedOn) && reviewedOn <= today && attested;
  const body = {
    reviewerUserId: reviewerId,
    exportId: exportId || null,
    rows,
  };

  function edited() {
    setPlan(null);
    setError(null);
  }

  async function dryRun() {
    setBusy(true);
    setError(null);
    const result = await post<{ plan: BatchPlan }>('/api/admin/review-batches/preview', body);
    setBusy(false);
    if ('error' in result) return setError(result.error === null ? t('errors.network') : result.error || t('errors.generic'));
    setPlan(result.data.plan);
  }

  async function record() {
    setBusy(true);
    setError(null);
    const result = await post<{ batch: { id: string; approvedCount: number }; skippedAtWrite: number }>('/api/admin/review-batches', {
      ...body,
      source,
      sourceName: sourceName.trim(),
      sourceSha256,
      reviewedOn,
      reviewerCheckedAll: attested,
    });
    setBusy(false);
    dialog.current?.close();
    if ('error' in result) return setError(result.error === null ? t('errors.network') : result.error || t('errors.generic'));
    setDone({ batchId: result.data.batch.id, count: result.data.batch.approvedCount, skipped: result.data.skippedAtWrite });
    setPlan(null);
    onRecorded();
    router.refresh();
  }

  const problemRows = plan ? plan.rows.filter((r) => r.outcome !== 'will-approve') : [];
  const otherRefused = plan
    ? problemRows.length - SUMMARY_GROUPS.reduce((n, g) => n + g.outcomes.reduce((m, o) => m + (plan.counts[o] ?? 0), 0), 0)
    : 0;

  return (
    <div ref={panel} tabIndex={-1} className="mt-6 outline-none">
      <section aria-labelledby={`${id}-heading`}>
      <Card padding="lg">
        <h3 id={`${id}-heading`} className="text-xl">{t('record.heading')}</h3>

        {done ? (
          <Alert tone="positive" role="status" className="mt-4" title={t('done.title')}>
            <p>{t('done.body', { count: done.count, batch: done.batchId.slice(0, 8) })}</p>
            {done.skipped > 0 ? <p>{t('done.skipped', { count: done.skipped })}</p> : null}
            <p>
              <Link href={`/admin/review/batches/${done.batchId}`}>{t('done.view')}</Link>
            </p>
          </Alert>
        ) : (
          <>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor={`${id}-reviewer`} className="text-sm font-medium">{t('record.reviewer')}</label>
                <select
                  id={`${id}-reviewer`}
                  value={reviewerId}
                  onChange={(e) => (setReviewerId(e.target.value), edited())}
                  aria-describedby={`${id}-reviewer-hint`}
                  className={fieldClass()}
                >
                  <option value="">{t('record.chooseReviewer')}</option>
                  {reviewers.map((r) => (
                    <option key={r.userId} value={r.userId}>
                      {t('record.reviewerOption', { name: r.publicName, credentials: r.publicCredentials })}
                    </option>
                  ))}
                </select>
                <p id={`${id}-reviewer-hint`} className="text-xs text-ink-muted">{t('record.reviewerHint')}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`${id}-source`} className="text-sm font-medium">{t('record.source')}</label>
                <input
                  id={`${id}-source`}
                  value={sourceName}
                  maxLength={200}
                  onChange={(e) => setSourceName(e.target.value)}
                  aria-describedby={`${id}-source-hint`}
                  className={fieldClass()}
                />
                <p id={`${id}-source-hint`} className="text-xs text-ink-muted">{t('record.sourceHint')}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`${id}-date`} className="text-sm font-medium">{t('record.reviewedOn')}</label>
                <input id={`${id}-date`} type="date" value={reviewedOn} max={today} onChange={(e) => setReviewedOn(e.target.value)} className={fieldClass()} />
              </div>
              {source === 'csv' ? (
                <div className="flex flex-col gap-1">
                  <label htmlFor={`${id}-export`} className="text-sm font-medium">{t('record.export')}</label>
                  <select id={`${id}-export`} value={exportId} onChange={(e) => (setExportId(e.target.value), edited())} className={fieldClass()}>
                    <option value="">{t('record.exportFromFile')}</option>
                    {exports.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.fileName}
                        {e.id === fileExportId ? ' ✓' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5 size-4" checked={attested} onChange={(e) => setAttested(e.target.checked)} />
              <span>{t('record.attest')}</span>
            </label>

            {error ? (
              <Alert tone="negative" role="alert" className="mt-4">
                <p>{error}</p>
              </Alert>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant={plan ? 'secondary' : 'primary'} loading={busy && !plan} disabled={!reviewer} onClick={dryRun}>
                {busy && !plan ? t('record.checking') : t('record.check')}
              </Button>
              <Button variant="quiet" onClick={onCancel}>{t('confirm.cancel')}</Button>
            </div>

            {plan ? (
              <div className="mt-6" aria-live="polite">
                <h4 className="font-heading text-lg font-semibold">{t('plan.heading')}</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="font-semibold">{t('plan.willApprove', { count: plan.willApprove })}</li>
                  <li>{t('plan.alreadyApproved', { count: plan.counts['already-approved'] ?? 0 })}</li>
                  <li>{t('plan.changed', { count: plan.counts['changed-since-sent'] ?? 0 })}</li>
                  <li>{t('plan.otherRefused', { count: otherRefused })}</li>
                </ul>
                <table className="mt-4 w-full max-w-2xl border-collapse text-sm">
                  <caption className="text-start text-sm text-ink-muted">{t('plan.breakdown')}</caption>
                  <thead>
                    <tr className="border-b border-line-strong">
                      <th scope="col" className="py-1.5 pe-4 text-start font-semibold">{t('plan.outcome')}</th>
                      <th scope="col" className="py-1.5 text-end font-semibold">{t('plan.rows')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.entries(plan.counts) as Array<[RowOutcome, number]>).map(([outcome, n]) => (
                      <tr key={outcome} className="border-b border-line">
                        <td className="py-1.5 pe-4">
                          {outcome === 'will-approve' ? <Badge tone="positive">{t(`outcomes.${outcome}`)}</Badge> : t(`outcomes.${outcome}`)}
                        </td>
                        <td className="py-1.5 text-end tabular-nums">{n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {problemRows.length > 0 ? (
                  <details className="mt-4 text-sm">
                    <summary className="cursor-pointer font-medium">{t('plan.problemRows')} ({problemRows.length})</summary>
                    <ul className="mt-2 max-h-80 space-y-0.5 overflow-y-auto font-mono text-xs">
                      {problemRows.slice(0, PROBLEM_ROWS_SHOWN).map((r) => (
                        <li key={`${r.line}-${r.questionId}`}>
                          {t('plan.line')} {r.line} · {r.questionId || '—'} · {t(`outcomes.${r.outcome}`)}
                        </li>
                      ))}
                    </ul>
                    {problemRows.length > PROBLEM_ROWS_SHOWN ? (
                      <p className="mt-1 text-xs text-ink-muted">{t('plan.more', { count: problemRows.length - PROBLEM_ROWS_SHOWN })}</p>
                    ) : null}
                  </details>
                ) : null}
                <Button className="mt-5" disabled={!ready || plan.willApprove === 0 || busy} onClick={() => dialog.current?.showModal()}>
                  {t('plan.approve', { count: plan.willApprove })}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </Card>
      </section>

      <dialog
        ref={dialog}
        aria-labelledby={`${id}-confirm-title`}
        className="m-auto max-w-lg rounded-card border border-line bg-surface p-6 text-ink shadow-xl backdrop:bg-black/40"
      >
        {plan && reviewer ? (
          <>
            <h3 id={`${id}-confirm-title`} className="font-heading text-xl font-semibold">
              {t('confirm.title', { count: plan.willApprove })}
            </h3>
            <p className="mt-3 text-sm">
              {t('confirm.body', { count: plan.willApprove, reviewer: reviewer.publicName, date: reviewedOn, source: sourceName.trim() })}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button loading={busy} onClick={record}>
                {t('confirm.yes', { count: plan.willApprove })}
              </Button>
              <Button variant="quiet" disabled={busy} onClick={() => dialog.current?.close()}>
                {t('confirm.cancel')}
              </Button>
            </div>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
