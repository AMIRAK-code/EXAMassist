import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import type { QuestionVersionRow } from '@/lib/db/rows';
import { UnauthorizedError, requireUser, type AuthUser } from '@/lib/auth/session';
import { getExamConfig, labelsFor } from '@/lib/exams/registry';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { startAttempt } from '@/lib/attempts/service';
import { getQuestionVersions, toReviewable, type ReviewableQuestion } from '@/lib/content/repository';
import { responseSchema, type AnswerKey, type Response } from '@/lib/assessment/types';
import { Markdown, Stimulus } from '@/components/content';
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

/**
 * The mistake notebook.
 *
 * Every row here comes from the acting user's own attempts: the question as it
 * was shown, what they answered, what the key says, and the explanation the
 * editorial team wrote. Nothing is inferred and nothing is scored again.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mistake notebook',
  description: 'Every question you got wrong or left blank, with the answer and the explanation.',
  // Private page. Authorization is the protection; this is only an indexing hint.
  robots: { index: false, follow: false },
};

const FILTERS = [
  { key: 'incorrect', label: 'Wrong or blank' },
  { key: 'bookmarked', label: 'Bookmarked' },
  { key: 'due', label: 'Due to revisit' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

const MAX_ROWS = 40;

async function requireLearner(nextPath: string): Promise<AuthUser> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
    }
    throw error;
  }
}

function parseFilter(value: string | undefined): FilterKey {
  return FILTERS.some((filter) => filter.key === value) ? (value as FilterKey) : 'incorrect';
}

interface ItemRow {
  questionId: string;
  questionVersionId: string;
  responseJson: string | null;
  responseStatus: 'unanswered' | 'answered';
  isCorrect: 0 | 1 | null;
  seenAt: string | null;
  attemptId: string;
  examKey: string;
  bookmarked: number | null;
}

function parseResponse(json: string | null): Response | null {
  if (!json) return null;
  try {
    const parsed = responseSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function describeResponse(
  response: Response | null,
  options: Array<{ id: string; label: string }>,
): string {
  if (!response) return 'Left blank';
  const labelFor = (id: string) => options.find((option) => option.id === id)?.label ?? id;

  switch (response.type) {
    case 'single_select':
      return `Option ${labelFor(response.optionId)}`;
    case 'multi_select':
      return response.optionIds.length > 0
        ? `Options ${response.optionIds.map(labelFor).join(', ')}`
        : 'Left blank';
    case 'numeric_entry':
      return response.raw.trim().length > 0 ? response.raw : 'Left blank';
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Option ${response.choice}`;
    case 'two_part':
      return response.selections.length > 0
        ? response.selections.map((s) => `${s.columnId}: ${labelFor(s.optionId)}`).join('; ')
        : 'Left blank';
    case 'essay':
      return response.text.trim().length > 0
        ? 'You wrote a response — it is kept with that session’s results.'
        : 'Left blank';
  }
}

function describeAnswerKey(key: AnswerKey, options: Array<{ id: string; label: string }>): string {
  const labelFor = (id: string) => options.find((option) => option.id === id)?.label ?? id;

  switch (key.type) {
    case 'single_select':
      return `Option ${labelFor(key.optionId)}`;
    case 'multi_select':
      return `Options ${key.optionIds.map(labelFor).join(' and ')}`;
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Option ${key.choice}`;
    case 'numeric_entry': {
      const first = key.accepted[0];
      if (!first) return '—';
      if (first.kind === 'range') return `Any value from ${first.min} to ${first.max}`;
      if (first.kind === 'tolerance') return `${first.value} (± ${first.tolerance})`;
      return String(first.value);
    }
    case 'two_part':
      return key.selections.map((s) => `${s.columnId}: ${labelFor(s.optionId)}`).join('; ');
    case 'essay':
      return 'Essays are not automatically scored. Compare what you wrote with the rubric.';
  }
}

function correctOptionIds(key: AnswerKey): string[] {
  if (key.type === 'single_select') return [key.optionId];
  if (key.type === 'multi_select') return key.optionIds;
  if (key.type === 'two_part') return key.selections.map((selection) => selection.optionId);
  return [];
}

function formatDate(iso: string | null): string {
  if (!iso) return 'date not recorded';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'date not recorded';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Server actions
// ---------------------------------------------------------------------------

/**
 * Adds or removes a bookmark. The question must be one this user has actually
 * been shown: an id posted from anywhere else is ignored rather than trusted.
 */
async function toggleBookmarkAction(formData: FormData): Promise<void> {
  'use server';
  const user = await requireUser();
  const db = getDb();

  const questionId = String(formData.get('questionId') ?? '');
  const filter = parseFilter(String(formData.get('filter') ?? ''));
  if (!questionId) return;

  const owned = db
    .prepare(
      `SELECT a.exam_key AS examKey
         FROM attempt_items ai
         JOIN attempts a ON a.id = ai.attempt_id
        WHERE a.user_id = ? AND ai.question_id = ?
        LIMIT 1`,
    )
    .get(user.id, questionId) as { examKey: string } | undefined;
  if (!owned) return;

  const existing = db
    .prepare('SELECT 1 AS present FROM bookmarks WHERE user_id = ? AND question_id = ?')
    .get(user.id, questionId) as { present: number } | undefined;

  if (existing) {
    db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?').run(
      user.id,
      questionId,
    );
  } else {
    db.prepare(
      `INSERT INTO bookmarks (user_id, question_id, exam_key, note, created_at)
       VALUES (?, ?, ?, NULL, ?)
       ON CONFLICT(user_id, question_id) DO NOTHING`,
    ).run(user.id, questionId, owned.examKey, new Date().toISOString());
  }

  revalidatePath('/review');
  redirect(`/review?filter=${filter}`);
}

/** Starts a fresh untimed practice session on the skills in the current view. */
async function practiseAgainAction(formData: FormData): Promise<void> {
  'use server';
  const user = await requireUser();
  const db = getDb();

  const examKey = String(formData.get('examKey') ?? '');
  const config = getExamConfig(examKey);
  if (!config) redirect('/review');

  const known = new Set(config.domains.flatMap((domain) => domain.skills.map((skill) => skill.slug)));
  const skills = String(formData.get('skills') ?? '')
    .split(',')
    .map((slug) => slug.trim())
    .filter((slug) => slug.length > 0 && known.has(slug))
    .slice(0, 20);

  const requested = Number(formData.get('length') ?? 10);
  const length = Number.isFinite(requested) ? Math.max(5, Math.min(20, Math.round(requested))) : 10;

  const fallback = `/practice/${examKey}${
    skills[0] ? `?skill=${encodeURIComponent(skills[0])}` : ''
  }`;

  const limit = checkRateLimit(db, 'attemptStart', `user:${user.id}`);
  if (!limit.allowed) redirect(fallback);

  let attemptId: string | null = null;
  try {
    const result = startAttempt(db, {
      userId: user.id,
      examKey,
      blueprintId: 'practice',
      overrides: { skills: skills.length > 0 ? skills : undefined, difficulty: 'mixed', length },
    });
    attemptId = result.attemptId;
  } catch {
    // Not enough reviewed questions for that narrow a request, or the format is
    // not offered: send the learner to the setup screen, which explains why.
    attemptId = null;
  }

  redirect(attemptId ? `/attempt/${attemptId}` : fallback);
}

// ---------------------------------------------------------------------------

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await requireLearner('/review');
  const query = await searchParams;
  const filter = parseFilter(query.filter);
  const db = getDb();
  const nowIso = new Date().toISOString();

  const counts = {
    incorrect: (
      db
        .prepare(
          `SELECT COUNT(DISTINCT ai.question_id) AS n
             FROM attempt_items ai
             JOIN attempts a ON a.id = ai.attempt_id
            WHERE a.user_id = ? AND a.status IN ('submitted', 'expired')
              AND (ai.is_correct = 0 OR ai.response_status = 'unanswered')`,
        )
        .get(user.id) as { n: number }
    ).n,
    bookmarked: (
      db.prepare('SELECT COUNT(*) AS n FROM bookmarks WHERE user_id = ?').get(user.id) as {
        n: number;
      }
    ).n,
    due: (
      db
        .prepare(
          `SELECT COUNT(*) AS n
             FROM review_queue
            WHERE user_id = ? AND last_result <> 'correct' AND due_at <= ?`,
        )
        .get(user.id, nowIso) as { n: number }
    ).n,
  } satisfies Record<FilterKey, number>;

  const params: unknown[] = [user.id, user.id];
  let clause = '';
  if (filter === 'incorrect') {
    clause = `AND (ai.is_correct = 0 OR ai.response_status = 'unanswered')`;
  } else if (filter === 'bookmarked') {
    clause = `AND EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_id = ? AND b.question_id = ai.question_id)`;
    params.push(user.id);
  } else {
    clause =
      `AND EXISTS (SELECT 1 FROM review_queue rq
                    WHERE rq.user_id = ? AND rq.question_id = ai.question_id
                      AND rq.last_result <> 'correct' AND rq.due_at <= ?)`;
    params.push(user.id, nowIso);
  }

  const rows = db
    .prepare(
      `SELECT
         ai.question_id         AS questionId,
         ai.question_version_id AS questionVersionId,
         ai.response_json       AS responseJson,
         ai.response_status     AS responseStatus,
         ai.is_correct          AS isCorrect,
         COALESCE(ai.last_answered_at, a.submitted_at, a.created_at) AS seenAt,
         a.id                   AS attemptId,
         a.exam_key             AS examKey,
         (SELECT 1 FROM bookmarks b WHERE b.user_id = ? AND b.question_id = ai.question_id) AS bookmarked
       FROM attempt_items ai
       JOIN attempts a ON a.id = ai.attempt_id
       WHERE a.user_id = ? AND a.status IN ('submitted', 'expired')
       ${clause}
       ORDER BY COALESCE(ai.last_answered_at, a.submitted_at, a.created_at) DESC
       LIMIT 400`,
    )
    .all(...params) as ItemRow[];

  // One entry per question, keeping the most recent encounter.
  const seen = new Set<string>();
  const unique: ItemRow[] = [];
  for (const row of rows) {
    if (seen.has(row.questionId)) continue;
    seen.add(row.questionId);
    unique.push(row);
  }
  const visible = unique.slice(0, MAX_ROWS);

  const versions = getQuestionVersions(
    db,
    visible.map((row) => row.questionVersionId),
  );

  interface Entry {
    row: ItemRow;
    question: ReviewableQuestion;
    version: QuestionVersionRow;
  }

  const entries: Entry[] = [];
  for (const row of visible) {
    const version = versions.get(row.questionVersionId);
    if (!version) continue;
    try {
      entries.push({ row, question: toReviewable(db, version), version });
    } catch {
      // A question whose stored answer key no longer parses is skipped rather
      // than rendered half-built; it stays visible in that session's results.
      continue;
    }
  }

  // Skills present in this view, per exam, for the "practise these again" form.
  const byExam = new Map<string, { skills: Map<string, string>; count: number }>();
  for (const entry of entries) {
    const config = getExamConfig(entry.row.examKey);
    if (!config) continue;
    const labels = labelsFor(config);
    const bucket = byExam.get(entry.row.examKey) ?? { skills: new Map<string, string>(), count: 0 };
    bucket.skills.set(entry.question.skillSlug, labels.skills[entry.question.skillSlug] ?? entry.question.skillSlug);
    bucket.count += 1;
    byExam.set(entry.row.examKey, bucket);
  }

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { label: 'Mistake notebook' },
  ];

  const emptyCopy: Record<FilterKey, { title: string; body: string }> = {
    incorrect: {
      title: 'Nothing wrong to review',
      body: 'Questions you get wrong or leave blank in a finished session appear here, with the answer and the full explanation.',
    },
    bookmarked: {
      title: 'No bookmarks yet',
      body: 'Bookmark a question from this page and it will be kept here, whether you answered it correctly or not.',
    },
    due: {
      title: 'Nothing due right now',
      body: 'A question you miss comes back after a short interval. When one is due, it appears here.',
    },
  };

  return (
    <Container>
      <Breadcrumbs trail={trail} />

      <PageHeader
        title="Mistake notebook"
        lead="Every question you got wrong or left blank, most recent first, with your answer, the correct answer and the explanation."
      />

      <nav aria-label="Filter your notebook" className="mb-6">
        <ul className="flex flex-wrap gap-2">
          {FILTERS.map((option) => {
            const active = option.key === filter;
            return (
              <li key={option.key}>
                <Link
                  href={`/review?filter=${option.key}`}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 rounded border px-3 py-2 text-sm no-underline ${
                    active
                      ? 'border-accent bg-accent-soft font-semibold text-accent-strong'
                      : 'border-line bg-surface text-ink hover:bg-surface-sunken'
                  }`}
                >
                  {option.label}
                  <span className="tabular-nums text-ink-muted">({counts[option.key]})</span>
                  {active ? <span className="sr-only">(current view)</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {entries.length === 0 ? (
        <EmptyState
          title={emptyCopy[filter].title}
          action={<ButtonLink href="/dashboard">Back to dashboard</ButtonLink>}
        >
          <p>{emptyCopy[filter].body}</p>
        </EmptyState>
      ) : (
        <>
          {/* Practise the same skills again. */}
          <Card className="mb-8">
            <h2 className="font-serif text-xl font-semibold">Practise these again</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Starts a new untimed practice session drawn from the skills in this view. Different
              questions, same skills.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[...byExam.entries()].map(([examKey, bucket]) => {
                const config = getExamConfig(examKey);
                if (!config) return null;
                return (
                  <form key={examKey} action={practiseAgainAction}>
                    <input type="hidden" name="examKey" value={examKey} />
                    <input type="hidden" name="skills" value={[...bucket.skills.keys()].join(',')} />
                    <input type="hidden" name="length" value={Math.min(10, Math.max(5, bucket.count))} />
                    <Button type="submit">
                      {byExam.size > 1
                        ? `Practise these ${config.shortName} skills again`
                        : 'Practise these skills again'}
                    </Button>
                  </form>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-ink-subtle">
              If the reviewed bank does not hold enough questions for that combination, you are taken
              to the practice setup screen, which says what is available.
            </p>
          </Card>

          {unique.length > visible.length ? (
            <Alert tone="info" className="mb-6">
              Showing the {MAX_ROWS} most recent of {unique.length} questions in this view.
            </Alert>
          ) : null}

          <ol className="space-y-6">
            {entries.map(({ row, question }) => {
              const response = parseResponse(row.responseJson);
              const answered = row.responseStatus === 'answered';
              const correct = row.isCorrect === 1;
              const config = getExamConfig(row.examKey);
              const keyOptionIds = correctOptionIds(question.answerKey);

              return (
                <li key={`${row.attemptId}-${row.questionId}`}>
                  <Card>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge tone={correct ? 'positive' : answered ? 'negative' : 'neutral'}>
                        {correct ? 'Correct' : answered ? 'Incorrect' : 'Left blank'}
                      </Badge>
                      {config ? <Badge tone="neutral">{config.shortName}</Badge> : null}
                      {row.bookmarked ? <Badge tone="accent">Bookmarked</Badge> : null}
                      <span className="text-sm text-ink-muted">
                        Last seen {formatDate(row.seenAt)}
                      </span>
                    </div>

                    <h2 className="sr-only">Question from {formatDate(row.seenAt)}</h2>

                    {question.stimulus ? (
                      <div className="mb-4">
                        <Stimulus stimulus={question.stimulus} />
                      </div>
                    ) : null}

                    {question.instructionsMd ? (
                      <Markdown
                        source={question.instructionsMd}
                        className="prose-academic mb-2 text-sm text-ink-muted"
                      />
                    ) : null}

                    <Markdown source={question.stemMd} className="prose-academic question-body mb-4" />

                    {question.options.length > 0 ? (
                      <ul className="mb-4 space-y-1.5 text-sm">
                        {question.options.map((option) => {
                          const chosen =
                            response?.type === 'single_select'
                              ? response.optionId === option.id
                              : response?.type === 'multi_select'
                                ? response.optionIds.includes(option.id)
                                : response?.type === 'two_part'
                                  ? response.selections.some((s) => s.optionId === option.id)
                                  : false;
                          const isKey = keyOptionIds.includes(option.id);
                          const rationale = question.distractorRationale[option.id];

                          return (
                            <li key={option.id} className="rounded border border-line p-2.5">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-semibold text-ink-muted">{option.label}.</span>
                                <Markdown source={option.textMd} className="min-w-0 flex-1" />
                                {chosen ? <Badge tone="accent">Your answer</Badge> : null}
                                {isKey ? <Badge tone="positive">Correct answer</Badge> : null}
                              </div>
                              {rationale ? (
                                <Markdown
                                  source={rationale}
                                  className="mt-1.5 ps-6 text-ink-muted"
                                />
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}

                    <dl className="mb-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[minmax(8rem,auto)_1fr]">
                      <dt className="font-medium text-ink-muted">Your answer</dt>
                      <dd className="text-ink">{describeResponse(response, question.options)}</dd>
                      <dt className="font-medium text-ink-muted">Correct answer</dt>
                      <dd className="text-ink">
                        {describeAnswerKey(question.answerKey, question.options)}
                      </dd>
                    </dl>

                    <div className="rounded-card bg-surface-sunken p-4">
                      <h3 className="mb-1 font-serif text-base font-semibold">Explanation</h3>
                      <Markdown
                        source={question.explanationMd}
                        className="prose-academic text-sm"
                      />
                      <p className="mt-3 text-xs text-ink-subtle">
                        Difficulty label: {question.difficultyBasis} judgement, not calibrated
                        against response data.
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <form action={toggleBookmarkAction}>
                        <input type="hidden" name="questionId" value={row.questionId} />
                        <input type="hidden" name="filter" value={filter} />
                        <Button type="submit" variant="secondary" size="sm">
                          {row.bookmarked ? 'Remove bookmark' : 'Bookmark this question'}
                        </Button>
                      </form>
                      <Link
                        href={`/attempt/${row.attemptId}/results`}
                        className="text-sm no-underline hover:underline"
                      >
                        See the session this came from
                      </Link>
                      {config ? (
                        <Link
                          href={`/practice/${row.examKey}?skill=${encodeURIComponent(question.skillSlug)}`}
                          className="text-sm no-underline hover:underline"
                        >
                          Practise this skill
                        </Link>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/dashboard" variant="secondary">
          Back to dashboard
        </ButtonLink>
        <ButtonLink href="/study-plan" variant="secondary">
          Study plan
        </ButtonLink>
      </div>
    </Container>
  );
}
