import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireEditorial } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig, labelsFor } from '@/lib/exams/registry';
import { getCandidates } from '@/lib/content/repository';
import { buildCoverageReport, COVERAGE_PLAN, type CoverageNeed, type ExamCoverageReport } from '@/lib/content/coverage';
import { Alert, Badge, Breadcrumbs, Button, Card, Container, PageHeader, Stat, fieldClass } from '@/components/ui';

/**
 * Blueprint coverage and the authoring backlog, from this database.
 *
 * Counts only what new sessions can use: published AND human-approved
 * (human-review.ts), with the engine's own selection and eligibility rules
 * (coverage.ts). The same report runs offline as `npm run content:coverage`.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blueprint coverage',
  robots: { index: false, follow: false },
};

const STATUS_TEXT = {
  open: { label: 'Open', tone: 'positive' },
  'content-short': { label: 'Closed: not enough approved content', tone: 'caution' },
  'rules-blocked': { label: 'Closed: exam rules not verified', tone: 'neutral' },
  'essay-out-of-scope': { label: 'Essay format (outside this plan)', tone: 'neutral' },
} as const;

const PRIORITY_TITLE: Record<CoverageNeed['priority'], string> = {
  1: 'Priority 1 — blocking an existing format',
  2: `Priority 2 — ${COVERAGE_PLAN.targetDisjointSets} non-overlapping sets per format`,
  3: 'Priority 3 — topic-practice depth',
};

export default async function CoveragePage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  await requireEditorial('/admin/coverage');
  const query = await searchParams;
  const db = getDb();
  const exam = EXAM_CONFIGS.some((c) => c.examKey === query.exam) ? query.exam! : '';
  const configs = exam ? EXAM_CONFIGS.filter((c) => c.examKey === exam) : EXAM_CONFIGS;
  const reports: ExamCoverageReport[] = [];
  for (const config of configs) reports.push(buildCoverageReport(config, await getCandidates(db, config.examKey)));

  const trail = [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Administration' }, { label: 'Coverage' }];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Internal"
        title="Blueprint coverage"
        lead="What each practice format can run from human-approved questions, how many complete non-overlapping sets that gives, and exactly what is needed next."
      />

      <Alert tone="info" className="mb-8" title="How to read this">
        <p>
          Only published, human-approved questions count. Questions sharing a passage count as one unit across sets, and
          near-duplicate variants as one. “Pending review” is what approving questions already waiting for a reviewer would
          supply; “to author” is what remains after that. {COVERAGE_PLAN.targetDisjointSets} sets per format is a planning
          target, not an exam requirement. A simulation stays closed while its exam rules are unverified, however much content
          exists; essay formats are outside this plan.
        </p>
      </Alert>

      <form method="get" action="/admin/coverage" className="mb-8 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="coverage-exam" className="text-sm font-medium">Exam</label>
          <select id="coverage-exam" name="exam" defaultValue={exam} className={fieldClass('sm:w-72')}>
            <option value="">All exams</option>
            {EXAM_CONFIGS.map((config) => (
              <option key={config.examKey} value={config.examKey}>{config.name}</option>
            ))}
          </select>
        </div>
        <Button type="submit">Show</Button>
      </form>

      {reports.map((report) => {
        const config = getExamConfig(report.examKey)!;
        const names = labelsFor(config);
        return (
          <section key={report.examKey} className="mb-14" aria-labelledby={`exam-${report.examKey}`}>
            <h2 id={`exam-${report.examKey}`} className="font-heading text-2xl font-semibold">
              {report.examName}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card><Stat labelAs="h3" label="Human-approved (served)" value={report.counts.approved} /></Card>
              <Card><Stat labelAs="h3" label="Awaiting human review" value={report.counts['awaiting-human-review']} /></Card>
              <Card><Stat labelAs="h3" label="In automated review" value={report.counts['in-automated-review']} /></Card>
              <Card><Stat labelAs="h3" label="Quarantined" value={report.counts.quarantined} /></Card>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              {report.approvedIndependent} independent approved unit(s) after collapsing variants; {report.variantGroupsWithSeveralMembers} group(s)
              of near-duplicate variants in the bank.{' '}
              <Link href={`/admin/review?exam=${encodeURIComponent(report.examKey)}`}>Open the review queue for this exam</Link>
            </p>

            <div role="region" aria-labelledby={`formats-${report.examKey}`} tabIndex={0} className="mt-5 overflow-x-auto rounded-card border border-line bg-surface">
              <table className="w-full min-w-[56rem] border-collapse text-sm">
                <caption id={`formats-${report.examKey}`} className="px-4 pt-4 text-start text-sm text-ink-muted">
                  Formats, with the engine’s own sufficiency check on the approved pool.
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Format</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Status</th>
                    <th scope="col" className="px-4 py-3 text-end font-semibold">Items per set</th>
                    <th scope="col" className="px-4 py-3 text-end font-semibold">Short now</th>
                    <th scope="col" className="px-4 py-3 text-end font-semibold">Disjoint sets now</th>
                    <th scope="col" className="px-4 py-3 text-end font-semibold">…if pending approved</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Passages</th>
                  </tr>
                </thead>
                <tbody>
                  {report.blueprints.map((bp) => (
                    <tr key={bp.id} className="border-b border-line last:border-b-0 align-top">
                      <th scope="row" className="px-4 py-3 text-start font-medium">
                        {bp.label}
                        <span className="block text-xs font-normal text-ink-subtle">
                          {bp.id} · {bp.mode}
                          {bp.measurement ? ' · measured (public samples excluded)' : ''} · repeats avoided for {bp.repeatWindowDays} days
                        </span>
                        {bp.rulesReason ? <span className="mt-1 block text-xs font-normal text-ink-muted">{bp.rulesReason}</span> : null}
                      </th>
                      <td className="px-4 py-3">
                        <Badge tone={STATUS_TEXT[bp.status].tone}>{STATUS_TEXT[bp.status].label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-end tabular-nums">{bp.itemsPerSet}</td>
                      <td className="px-4 py-3 text-end tabular-nums">{bp.shortfallNow}</td>
                      <td className="px-4 py-3 text-end tabular-nums">
                        {bp.disjointSetsNow} / {bp.targetSets}
                      </td>
                      <td className="px-4 py-3 text-end tabular-nums">{bp.disjointSetsIfPendingApproved}</td>
                      <td className="px-4 py-3 text-xs">
                        {bp.passageParts.length === 0
                          ? '—'
                          : bp.passageParts.map((p) => `${p.label}: ${p.approvedPassages} approved passage(s)`).join('; ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {([1, 2, 3] as const).map((priority) => {
              const needs = report.needs.filter((n) => n.priority === priority);
              if (needs.length === 0) return null;
              return (
                <div key={priority} className="mt-6">
                  <h3 className="text-lg font-semibold">{PRIORITY_TITLE[priority]}</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {needs.slice(0, 25).map((need, index) => (
                      <li key={`${priority}-${index}`} className="rounded-card border border-line bg-surface p-3">
                        <span className="font-semibold tabular-nums">{need.needed}</span> item(s) ·{' '}
                        {need.domains.map((d) => names.domains[d] ?? d).join(', ') || 'any domain'}
                        {need.skills.length ? ` · ${need.skills.map((s) => names.skills[s] ?? s).join(', ')}` : ''}
                        {need.responseTypes.length ? ` · ${need.responseTypes.join(', ')}` : ''}
                        {priority === 3 && need.difficulties.length ? ` · bands short: ${need.difficulties.join(', ')}` : ''}
                        <span className="block text-ink-muted">
                          {need.coveredByPendingReview} by approving pending questions, {need.toAuthor} to author
                          {need.stimulus && need.stimulus.passagesToWrite > 0
                            ? ` (about ${need.stimulus.passagesToWrite} passage(s) of ~${need.stimulus.questionsPerPassage} questions)`
                            : ''}
                          {need.inAutomatedReview ? `; ${need.inAutomatedReview} more in automated review` : ''}. {need.reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {needs.length > 25 ? <p className="mt-2 text-xs text-ink-muted">And {needs.length - 25} more; see npm run content:coverage.</p> : null}
                </div>
              );
            })}
          </section>
        );
      })}
    </Container>
  );
}
