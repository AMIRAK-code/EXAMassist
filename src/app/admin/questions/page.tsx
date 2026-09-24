import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireEditorial } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig, labelsFor } from '@/lib/exams/registry';
import { loadContent } from '@/lib/content/loader';
import type { Question } from '@/lib/content/question-schema';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  ButtonLink,
  Card,
  Container,
  EmptyState,
  PageHeader,
} from '@/components/ui';
import { InlineMarkdown } from '@/components/content';

/**
 * The question inventory.
 *
 * Deliberately read-only. Content is authored in JSON under content/questions
 * and loaded by the seeder, so an inline editor here would be a second source
 * of truth and a way to change what a past attempt was scored against. What
 * this screen owes an editor is visibility: what state each item is in, who
 * reviewed it, whether a second person solved it independently, and which items
 * are quarantined and why.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Question inventory',
  robots: { index: false, follow: false },
};

const ROW_LIMIT = 300;

const STATES = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'published', label: 'Published' },
  { value: 'retired', label: 'Retired' },
  { value: 'quarantined', label: 'Quarantined' },
] as const;

const STATE_LABEL: Record<string, string> = Object.fromEntries(
  STATES.map((state) => [state.value, state.label]),
);

const STATE_TONE: Record<string, 'neutral' | 'accent' | 'positive' | 'caution' | 'negative'> = {
  draft: 'neutral',
  in_review: 'caution',
  published: 'positive',
  retired: 'neutral',
  quarantined: 'negative',
};

interface QuestionListRow {
  id: string;
  examKey: string;
  questionState: string;
  currentVersion: number;
  updatedAt: string;
  versionId: string | null;
  domainSlug: string | null;
  skillSlug: string | null;
  difficulty: string | null;
  difficultyBasis: string | null;
  versionState: string | null;
  author: string | null;
  reviewer: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  stemMd: string | null;
}

function day(value: string | null): string {
  return value ? value.slice(0, 10) : '—';
}

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; state?: string }>;
}) {
  // Redirects to sign-in when signed out (307), and 404s for a signed-in
  // learner, so the area's existence is never confirmed. See guards.ts.
  await requireEditorial('/admin/questions');

  const query = await searchParams;

  // Only values we recognise ever reach a query, and they are bound as
  // parameters regardless.
  const exam = EXAM_CONFIGS.some((config) => config.examKey === query.exam) ? query.exam! : '';
  const state = STATES.some((option) => option.value === query.state) ? query.state! : '';
  const filtered = exam !== '' || state !== '';

  const db = getDb();

  const conditions: string[] = [];
  const bindings: string[] = [];
  if (exam) {
    conditions.push('q.exam_key = ?');
    bindings.push(exam);
  }
  if (state) {
    conditions.push('q.state = ?');
    bindings.push(state);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const total = (
    db.prepare(`SELECT COUNT(*) AS n FROM questions q ${where}`).get(...bindings) as { n: number }
  ).n;

  const rows = db
    .prepare(
      `SELECT
         q.id               AS id,
         q.exam_key         AS examKey,
         q.state            AS questionState,
         q.current_version  AS currentVersion,
         q.updated_at       AS updatedAt,
         qv.id              AS versionId,
         qv.domain_slug     AS domainSlug,
         qv.skill_slug      AS skillSlug,
         qv.difficulty      AS difficulty,
         qv.difficulty_basis AS difficultyBasis,
         qv.state           AS versionState,
         qv.author          AS author,
         qv.reviewer        AS reviewer,
         qv.reviewed_at     AS reviewedAt,
         qv.review_notes    AS reviewNotes,
         qv.stem_md         AS stemMd
       FROM questions q
       LEFT JOIN question_versions qv
         ON qv.question_id = q.id AND qv.version = q.current_version
       ${where}
       ORDER BY
         CASE q.state WHEN 'quarantined' THEN 0 WHEN 'in_review' THEN 1 ELSE 2 END,
         q.exam_key,
         q.id
       LIMIT ${ROW_LIMIT}`,
    )
    .all(...bindings) as QuestionListRow[];

  // The authored files carry two things the database does not: the evidence of
  // an independent solve, and the quarantine reason. Reading them is best
  // effort — the screen still works without them.
  let files = new Map<string, Question>();
  let fileError: string | null = null;
  try {
    const loaded = loadContent();
    files = new Map(loaded.questions.map((entry) => [entry.question.id, entry.question]));
  } catch (error) {
    fileError = error instanceof Error ? error.message : 'The content files could not be read.';
  }
  const filesAvailable = fileError === null && files.size > 0;

  const labelCache = new Map<string, ReturnType<typeof labelsFor>>();
  function labels(examKey: string) {
    let cached = labelCache.get(examKey);
    if (!cached) {
      const config = getExamConfig(examKey);
      cached = config ? labelsFor(config) : { domains: {}, skills: {}, sections: {} };
      labelCache.set(examKey, cached);
    }
    return cached;
  }

  const quarantinedRows = rows.filter((row) => row.questionState === 'quarantined');

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Administration' },
    { label: 'Questions' },
  ];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow="Internal"
        title="Question inventory"
        lead="Every question at its current version, with who wrote it, who reviewed it, and whether a separate reviewer solved it blind before publication."
      />

      <Alert tone="info" title="Read-only by design">
        <p>
          Questions are edited as JSON files under <code>content/questions/&lt;exam&gt;/&lt;id&gt;.json</code>,
          reviewed in version control, checked by <code>npm run content:validate</code> and loaded with{' '}
          <code>npm run db:seed</code>. There is no inline editing here on purpose: a second place to
          change content would let a published item drift away from the text an earlier attempt was
          scored against.
        </p>
      </Alert>

      <section className="mt-8" aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="font-heading text-xl font-semibold">
          Filter
        </h2>
        <form method="get" action="/admin/questions" className="mt-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-exam" className="text-sm font-medium">
                Exam
              </label>
              <select
                id="filter-exam"
                name="exam"
                defaultValue={exam}
                className="min-h-11 w-full rounded border border-line-strong bg-surface px-3 py-2 text-ink sm:w-64"
              >
                <option value="">All exams</option>
                {EXAM_CONFIGS.map((config) => (
                  <option key={config.examKey} value={config.examKey}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="filter-state" className="text-sm font-medium">
                Publication state
              </label>
              <select
                id="filter-state"
                name="state"
                defaultValue={state}
                className="min-h-11 w-full rounded border border-line-strong bg-surface px-3 py-2 text-ink sm:w-56"
              >
                <option value="">All states</option>
                {STATES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">Apply filters</Button>
              {filtered ? (
                <Link href="/admin/questions" className="text-sm">
                  Clear filters
                </Link>
              ) : null}
            </div>
          </div>
        </form>

        <p className="mt-4 text-sm text-ink-muted">
          {total} question{total === 1 ? '' : 's'} match
          {total === 1 ? 'es' : ''} this filter
          {rows.length < total ? `; showing the first ${rows.length}` : ''}.
        </p>
      </section>

      {fileError ? (
        <Alert tone="caution" className="mt-8" title="Authored files could not be read">
          <p>
            The database rows below are complete, but the independent-solve record and quarantine
            reasons live in the JSON files and could not be loaded: {fileError}
          </p>
        </Alert>
      ) : null}

      {!filesAvailable && !fileError ? (
        <Alert tone="caution" className="mt-8" title="No authored files found">
          <p>
            Nothing was found under <code>content/questions</code> from this working directory, so the
            independent-solve and quarantine columns below cannot be filled in. The database counts are
            unaffected.
          </p>
        </Alert>
      ) : null}

      {quarantinedRows.length > 0 ? (
        <section className="mt-10" aria-labelledby="quarantine-heading">
          <h2 id="quarantine-heading" className="font-heading text-2xl font-semibold text-negative">
            Quarantined — needs a human decision
          </h2>
          <p className="mt-1 max-w-3xl text-ink-muted">
            These items are held out of every practice pool because something about them is disputed.
            They are never repaired by guessing at the intended answer: fix the JSON file, increment its
            version and re-seed, or replace the item and record what replaced it.
          </p>

          <ul className="mt-5 space-y-4">
            {quarantinedRows.map((row) => {
              const file = files.get(row.id);
              const reason = file?.quarantine?.reason ?? null;
              return (
                <Card as="li" key={`quarantine-${row.id}`} className="border-negative bg-negative-soft">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="negative">Quarantined</Badge>
                    <code className="text-sm">{row.id}</code>
                    <span className="text-sm text-ink-muted">{row.examKey}</span>
                  </div>
                  {row.stemMd ? (
                    <p className="mt-3 text-sm text-ink">
                      <InlineMarkdown source={row.stemMd.slice(0, 240)} />
                      {row.stemMd.length > 240 ? '…' : ''}
                    </p>
                  ) : null}
                  <dl className="mt-3 text-sm">
                    <dt className="font-medium">Why it is quarantined</dt>
                    <dd className="mt-1 text-ink-muted">
                      {reason ??
                        row.reviewNotes ??
                        (filesAvailable
                          ? 'No reason is recorded in the file. Content validation rejects that, so re-run npm run content:validate.'
                          : 'The reason is recorded in the authored JSON file, which could not be read here.')}
                    </dd>
                    {file?.quarantine?.replacedBy ? (
                      <>
                        <dt className="mt-3 font-medium">Replaced by</dt>
                        <dd className="mt-1 text-ink-muted">
                          <code>{file.quarantine.replacedBy}</code>
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </Card>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="inventory-heading">
        <h2 id="inventory-heading" className="font-heading text-2xl font-semibold">
          Inventory
        </h2>

        {rows.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title={filtered ? 'No questions match this filter' : 'No questions have been loaded'}
              action={
                filtered ? (
                  <ButtonLink href="/admin/questions" variant="secondary">
                    Clear filters
                  </ButtonLink>
                ) : undefined
              }
            >
              {filtered ? (
                <p>
                  Try a different exam or publication state. The bank is a starter library, so some
                  combinations are genuinely empty.
                </p>
              ) : (
                <p>
                  Run <code>npm run db:seed</code> to load the JSON files under{' '}
                  <code>content/questions</code> into this database.
                </p>
              )}
            </EmptyState>
          </div>
        ) : (
          <>
            <div
              role="region"
              aria-labelledby="inventory-heading"
              tabIndex={0}
              className="mt-5 relative overflow-x-auto rounded-card border border-line bg-surface"
            >
              <table className="w-full min-w-[68rem] border-collapse text-sm">
                <caption className="px-4 pt-4 text-start text-sm text-ink-muted">
                  Questions at their current version
                  {exam ? `, limited to ${getExamConfig(exam)?.name ?? exam}` : ''}
                  {state ? `, limited to the ${STATE_LABEL[state].toLowerCase()} state` : ''}.
                  Quarantined items are listed first and are also detailed above.
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Question
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Exam
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Domain
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Skill
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Difficulty
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      State
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Author
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Reviewer
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Reviewed
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      Independent solve
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const names = labels(row.examKey);
                    const file = files.get(row.id);
                    const solve = file?.review.independentSolve ?? null;
                    const quarantined = row.questionState === 'quarantined';
                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-line last:border-b-0 ${
                          quarantined ? 'bg-negative-soft' : ''
                        }`}
                      >
                        <th scope="row" className="px-4 py-3 text-start font-medium">
                          <code>{row.id}</code>
                          <span className="block text-xs font-normal text-ink-subtle">
                            v{row.currentVersion} · updated {day(row.updatedAt)}
                          </span>
                        </th>
                        <td className="px-4 py-3">{row.examKey}</td>
                        <td className="px-4 py-3">
                          {row.domainSlug ? (names.domains[row.domainSlug] ?? row.domainSlug) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {row.skillSlug ? (names.skills[row.skillSlug] ?? row.skillSlug) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {row.difficulty ? (
                            <>
                              <span className="capitalize">{row.difficulty}</span>
                              <span className="block text-xs text-ink-subtle">
                                {row.difficultyBasis === 'empirical' ? 'empirical' : 'editorial'}
                              </span>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={STATE_TONE[row.questionState] ?? 'neutral'}>
                            {STATE_LABEL[row.questionState] ?? row.questionState}
                          </Badge>
                          {row.versionState && row.versionState !== row.questionState ? (
                            <span className="block text-xs text-ink-subtle">
                              version row says{' '}
                              {STATE_LABEL[row.versionState] ?? row.versionState}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">{row.author ?? '—'}</td>
                        <td className="px-4 py-3">{row.reviewer ?? 'Not assigned'}</td>
                        <td className="px-4 py-3 tabular-nums">{day(row.reviewedAt)}</td>
                        <td className="px-4 py-3">
                          {!filesAvailable ? (
                            <span className="text-ink-subtle">Not available</span>
                          ) : solve ? (
                            <>
                              <Badge tone={solve.agreesWithKey ? 'positive' : 'negative'}>
                                {solve.agreesWithKey ? 'Recorded, key agreed' : 'Recorded, key disputed'}
                              </Badge>
                              <span className="block text-xs text-ink-subtle">
                                {solve.solvedBy} ·{' '}
                                {solve.uniquenessChecked
                                  ? 'uniqueness checked'
                                  : 'uniqueness unconfirmed'}
                              </span>
                            </>
                          ) : (
                            <Badge tone="caution">Not recorded</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {rows.length < total ? (
              <p className="mt-4 text-sm text-ink-muted">
                Showing the first {rows.length} of {total}. Narrow the filter by exam or state to see
                the rest.
              </p>
            ) : null}
          </>
        )}
      </section>
    </Container>
  );
}
