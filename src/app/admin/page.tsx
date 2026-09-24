import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireEditorial } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getHubForConfig } from '@/lib/exams/registry';
import { examCoverage } from '@/lib/attempts/availability';
import { Alert, Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';

/**
 * Content administration overview.
 *
 * Internal, role-gated and never indexed. Everything here is read-only: the
 * question bank's source of truth is the JSON under content/questions, which is
 * reviewed in version control and re-seeded. This screen exists to show what
 * the pipeline currently holds and what is waiting on a human.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Content administration',
  robots: { index: false, follow: false },
};

const PIPELINE = [
  {
    state: 'draft',
    label: 'Draft',
    blurb: 'Written, not yet offered for review. Anything a model helped draft enters here.',
  },
  {
    state: 'in_review',
    label: 'In review',
    blurb: 'Waiting for a blind solve by a separate reviewer and a uniqueness check.',
  },
  {
    state: 'published',
    label: 'Published',
    blurb: 'Reviewed and live in the practice pool. Editing one means a new version row.',
  },
  {
    state: 'retired',
    label: 'Retired',
    blurb: 'Withdrawn from selection. Past attempts keep the version they were shown.',
  },
  {
    state: 'quarantined',
    label: 'Quarantined',
    blurb: 'Held back because something is disputed. Never silently repaired.',
  },
] as const;

interface StateCountRow {
  state: string;
  n: number;
}
interface ExamStateCountRow {
  examKey: string;
  state: string;
  n: number;
}
interface KeyCountRow {
  examKey: string;
  n: number;
}
interface StatusCountRow {
  status: string;
  n: number;
}

function isoDay(value: string): string {
  return value.slice(0, 10);
}

export default async function AdminOverviewPage() {
  // Redirects to sign-in when signed out (307), and 404s for a signed-in
  // learner, so the area's existence is never confirmed. See guards.ts.
  await requireEditorial('/admin');

  const db = getDb();

  const questionStates = db
    .prepare('SELECT state AS state, COUNT(*) AS n FROM questions GROUP BY state')
    .all() as StateCountRow[];

  const versionStates = db
    .prepare('SELECT state AS state, COUNT(*) AS n FROM question_versions GROUP BY state')
    .all() as StateCountRow[];

  const perExamStates = db
    .prepare(
      'SELECT exam_key AS examKey, state AS state, COUNT(*) AS n FROM questions GROUP BY exam_key, state',
    )
    .all() as ExamStateCountRow[];

  const versionsPerExam = db
    .prepare('SELECT exam_key AS examKey, COUNT(*) AS n FROM question_versions GROUP BY exam_key')
    .all() as KeyCountRow[];

  const flagStatuses = db
    .prepare('SELECT status AS status, COUNT(*) AS n FROM content_flags GROUP BY status')
    .all() as StatusCountRow[];

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentAttempts = (
    db.prepare('SELECT COUNT(*) AS n FROM attempts WHERE created_at >= ?').get(since) as { n: number }
  ).n;
  const submittedRecently = (
    db
      .prepare("SELECT COUNT(*) AS n FROM attempts WHERE created_at >= ? AND status = 'submitted'")
      .get(since) as { n: number }
  ).n;
  const totalAttempts = (db.prepare('SELECT COUNT(*) AS n FROM attempts').get() as { n: number }).n;

  const questionCount = (n: string) => questionStates.find((r) => r.state === n)?.n ?? 0;
  const versionCount = (n: string) => versionStates.find((r) => r.state === n)?.n ?? 0;
  const flagCount = (s: string) => flagStatuses.find((r) => r.status === s)?.n ?? 0;

  const totalQuestions = questionStates.reduce((sum, row) => sum + row.n, 0);
  const totalVersions = versionStates.reduce((sum, row) => sum + row.n, 0);
  const openFlags = flagCount('open');
  const quarantined = questionCount('quarantined');

  const perExam = EXAM_CONFIGS.map((config) => {
    const mine = perExamStates.filter((row) => row.examKey === config.examKey);
    const byState = (state: string) => mine.find((row) => row.state === state)?.n ?? 0;
    const coverage = examCoverage(db, config);
    return {
      config,
      hub: getHubForConfig(config.examKey),
      draft: byState('draft'),
      inReview: byState('in_review'),
      published: byState('published'),
      retired: byState('retired'),
      quarantined: byState('quarantined'),
      versions: versionsPerExam.find((row) => row.examKey === config.examKey)?.n ?? 0,
      coverage,
    };
  });

  const trail = [{ href: '/', label: 'Home' }, { label: 'Administration' }];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow="Internal"
        title="Content administration"
        lead="What the question bank currently holds, what is waiting on a human, and how much of each exam's taxonomy is actually covered."
      />

      <Alert tone="info" title="This area is read-only">
        <p>
          Questions are authored as JSON files under <code>content/questions</code>, validated by{' '}
          <code>npm run content:validate</code> and loaded with <code>npm run db:seed</code>. Nothing
          here edits content, so the file in version control is always the truth. Content reports are
          the one thing you resolve from the browser.
        </p>
      </Alert>

      <section className="mt-10" aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="font-heading text-2xl font-semibold">
          Editorial pipeline
        </h2>
        <p className="mt-1 max-w-3xl text-ink-muted">
          Counts are of questions in the <code>questions</code> table, which holds one row per question
          at its current version. The {totalVersions} rows in <code>question_versions</code> include
          every historical version, because a published item is never edited in place.
        </p>

        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PIPELINE.map((stage, index) => {
            const count = questionCount(stage.state);
            const needsAttention = stage.state === 'quarantined' && count > 0;
            return (
              <Card
                as="li"
                key={stage.state}
                className={needsAttention ? 'border-negative bg-negative-soft' : undefined}
              >
                <p className="text-xs uppercase tracking-wide text-ink-subtle">
                  Stage {index + 1} of {PIPELINE.length}
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold">{stage.label}</h3>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{count}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {count === 1 ? 'question' : 'questions'} &middot; {versionCount(stage.state)} version
                  {versionCount(stage.state) === 1 ? '' : 's'}
                </p>
                <p className="mt-3 text-sm text-ink-muted">{stage.blurb}</p>
                {needsAttention ? (
                  <p className="mt-3 text-sm font-medium text-negative">
                    Needs a human decision.{' '}
                    <Link href="/admin/questions?state=quarantined">Review quarantined items</Link>
                  </p>
                ) : null}
              </Card>
            );
          })}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="attention-heading">
        <h2 id="attention-heading" className="font-heading text-2xl font-semibold">
          Waiting on someone
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <h3 className="font-heading text-lg font-semibold">Open content reports</h3>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{openFlags}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {flagCount('accepted')} accepted, {flagCount('rejected')} rejected so far.
            </p>
            <div className="mt-4">
              <ButtonLink href="/admin/flags" size="sm" variant={openFlags > 0 ? 'primary' : 'secondary'}>
                {openFlags > 0 ? 'Triage reports' : 'View reports'}
              </ButtonLink>
            </div>
          </Card>

          <Card>
            <h3 className="font-heading text-lg font-semibold">Quarantined</h3>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{quarantined}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Held back rather than repaired by guesswork. Each one records why.
            </p>
            <div className="mt-4">
              <ButtonLink
                href="/admin/questions?state=quarantined"
                size="sm"
                variant={quarantined > 0 ? 'primary' : 'secondary'}
              >
                {quarantined > 0 ? 'Review them' : 'None to review'}
              </ButtonLink>
            </div>
          </Card>

          <Card>
            <h3 className="font-heading text-lg font-semibold">In review</h3>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{questionCount('in_review')}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Awaiting a blind solve by a separate reviewer before publication.
            </p>
            <div className="mt-4">
              <ButtonLink href="/admin/questions?state=in_review" size="sm" variant="secondary">
                See the queue
              </ButtonLink>
            </div>
          </Card>

          <Card>
            <h3 className="font-heading text-lg font-semibold">Attempts, last 7 days</h3>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{recentAttempts}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {submittedRecently} submitted. {totalAttempts} attempts recorded in total.
            </p>
            <p className="mt-3 text-sm text-ink-subtle">
              Counted since {isoDay(since)}. Volume only &mdash; no learner is identified here.
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="coverage-heading">
        <h2 id="coverage-heading" className="font-heading text-2xl font-semibold">
          Coverage by exam
        </h2>
        <p className="mt-1 max-w-3xl text-ink-muted">
          &ldquo;Published&rdquo; is what the selection pool can actually draw on; the topic column is
          how many of the exam&rsquo;s configured domains have at least one published question. A thin
          bank is shown as a thin bank.
        </p>

        <div
          role="region"
          aria-labelledby="coverage-heading"
          tabIndex={0}
          className="mt-5 relative overflow-x-auto rounded-card border border-line bg-surface"
        >
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <caption className="px-4 pt-4 text-start text-sm text-ink-muted">
              Question counts by exam and publication state, with taxonomy coverage. {totalQuestions}{' '}
              questions across {EXAM_CONFIGS.length} exam configurations.
            </caption>
            <thead>
              <tr className="border-b border-line-strong text-start">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  Exam
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  Published
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  In review
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  Draft
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  Retired
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  Quarantined
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  Versions
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  Topics covered
                </th>
              </tr>
            </thead>
            <tbody>
              {perExam.map((row) => (
                <tr key={row.config.examKey} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-start font-medium">
                    <Link href={`/admin/questions?exam=${encodeURIComponent(row.config.examKey)}`}>
                      {row.config.name}
                    </Link>
                    <span className="block text-xs text-ink-subtle">
                      {row.config.examKey}
                      {row.hub ? ` · ${row.hub.publisher}` : ''}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-end tabular-nums">{row.published}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.inReview}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.draft}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.retired}</td>
                  <td className="px-4 py-3 text-end tabular-nums">
                    {row.quarantined > 0 ? (
                      <Badge tone="negative">{row.quarantined} quarantined</Badge>
                    ) : (
                      <span>0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.versions}</td>
                  <td className="px-4 py-3 text-end tabular-nums">
                    {row.coverage.domainsCovered} / {row.coverage.domainsTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalQuestions === 0 ? (
          <Alert tone="caution" className="mt-5" title="The bank is empty">
            <p>
              No questions have been loaded. Run <code>npm run db:seed</code> to load the JSON files
              under <code>content/questions</code> into this database.
            </p>
          </Alert>
        ) : null}
      </section>
    </Container>
  );
}
