import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import type { QuestionVersionRow } from '@/lib/db/rows';
import { requireReviewAccess } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { toReviewable } from '@/lib/content/repository';
import { loadContent } from '@/lib/content/loader';
import { describeAnswerKey, keyOptionIds } from '@/lib/learning/answers';
import {
  REVIEW_CRITERIA,
  REVIEWABLE_STATES,
  approvalStatus,
  authorIdentities,
  isOwnWork,
  questionAuditTrail,
  reviewHistory,
  standingApprovalFor,
  verifiedFingerprint,
} from '@/lib/content/human-review';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/content/review-queue';
import { Alert, Badge, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { Markdown, Stimulus } from '@/components/content';
import { ReviewForm } from './review-form';

/**
 * One question, as a reviewer needs to judge it: rendered exactly as learners
 * see it, with the answer key, explanation, the notes on each wrong choice,
 * where it sits in the exam's published syllabus, what the automated checks
 * found (clearly labelled as automated), and every earlier decision.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Review a question',
  robots: { index: false, follow: false },
};

const CRITERION_LABEL: Record<(typeof REVIEW_CRITERIA)[number], string> = {
  'answer-key': 'Answer key',
  explanation: 'Explanation',
  wording: 'Wording',
  'syllabus-alignment': 'Syllabus alignment',
};

export default async function ReviewQuestionPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params;
  const { user, reviewer } = await requireReviewAccess(`/admin/review/${questionId}`);
  const db = getDb();

  const question = (await db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId)) as
    | { id: string; exam_key: string; current_version: number; state: string }
    | undefined;
  if (!question) notFound();
  const isStaff = user.role === 'admin' || user.role === 'editor';
  if (!isStaff && !reviewer?.examKeys.includes(question.exam_key)) notFound();

  const row = (await db
    .prepare('SELECT * FROM question_versions WHERE question_id = ? AND version = ?')
    .get(questionId, question.current_version)) as QuestionVersionRow | undefined;
  if (!row) notFound();

  const config = getExamConfig(row.exam_key) ?? EXAM_CONFIGS[0];
  const section = config.sections.find((s) => s.key === row.section_key);
  const domain = config.domains.find((d) => d.slug === row.domain_slug);
  const skill = domain?.skills.find((s) => s.slug === row.skill_slug);
  const reviewable = await toReviewable(db, row, 'en');
  const keyIds = keyOptionIds(reviewable.answerKey) ?? [];
  const fingerprint = await verifiedFingerprint(db, row);
  const approval = await standingApprovalFor(db, row.id);
  const history = await reviewHistory(db, questionId);
  const trail = await questionAuditTrail(db, questionId);
  const latestOnContent = history.find((h) => h.questionVersionId === row.id && h.reviewFingerprint === fingerprint.stored) ?? null;
  const status = approvalStatus(question.state, approval !== null, latestOnContent?.outcome ?? null);

  // The automated evidence lives in the authored file; best effort, as on the inventory page.
  let solve: { solvedBy: string; agreesWithKey: boolean; uniquenessChecked: boolean; workingNotes: string } | null = null;
  let aiAssisted: boolean | null = null;
  try {
    const file = loadContent().questions.find((entry) => entry.question.id === questionId)?.question;
    if (file && file.version === row.version) {
      solve = file.review.independentSolve;
      aiAssisted = file.provenance.aiAssisted;
    }
  } catch {
    solve = null;
  }

  const ownWork = reviewer ? isOwnWork(reviewer, { email: user.email, displayName: user.displayName }, authorIdentities(row)) : false;
  const blocked: string | null = !reviewer
    ? 'You are not an authorised reviewer, so you can read this page but not record a decision.'
    : reviewer.status !== 'active'
      ? 'Confirm your public credentials on the review queue page before recording a decision.'
      : !reviewer.examKeys.includes(row.exam_key)
        ? 'You are not authorised to review questions for this exam.'
        : ownWork
          ? 'You are recorded as an author or editor of this question, so someone else must review it.'
          : !(REVIEWABLE_STATES as readonly string[]).includes(question.state)
            ? `A question in the "${question.state}" state cannot be reviewed.`
            : !fingerprint.stored
              ? 'This version has no content fingerprint yet; it must be re-seeded before it can be reviewed.'
              : !fingerprint.matches
                ? 'The stored content does not match its fingerprint, so it was changed outside the content workflow. Nobody can approve it until it is re-seeded.'
                : null;

  const crumbs = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Administration' },
    { href: '/admin/review', label: 'Human review' },
    { label: questionId },
  ];

  return (
    <Container size="wide">
      <Breadcrumbs trail={crumbs} />
      <PageHeader eyebrow={`${config.name} · version ${row.version}`} title={questionId} />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
        <Badge tone="neutral">Content file state: {question.state}</Badge>
        {aiAssisted ? <Badge tone="neutral">AI-assisted draft</Badge> : null}
      </div>

      {approval ? (
        <Alert tone="positive" className="mb-8" title="Human-approved as it stands">
          <p>
            Approved by {approval.reviewerName} ({approval.reviewerCredentials}) on {approval.reviewedOn}, for version{' '}
            {approval.questionVersion} with exactly this content.
          </p>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="as-seen-heading">
            <h2 id="as-seen-heading" className="font-heading text-2xl font-semibold">
              As learners see it
            </h2>
            <Card className="mt-4" padding="lg">
              {reviewable.stimulus ? (
                <div className="question-text mb-5">
                  <Stimulus stimulus={reviewable.stimulus} reading />
                </div>
              ) : null}
              {reviewable.instructionsMd ? (
                <Markdown source={reviewable.instructionsMd} className="prose-academic question-text mb-3 text-sm text-ink-muted" />
              ) : null}
              <Markdown source={reviewable.stemMd} className="prose-academic question-body question-text mb-5" />
              {reviewable.options.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {reviewable.options.map((option) => {
                    const isKey = keyIds.includes(option.id);
                    const rationale = reviewable.distractorRationale[option.id];
                    return (
                      <li key={option.id} className={`rounded-card border p-3 ${isKey ? 'border-positive-line bg-positive-soft' : 'border-line'}`}>
                        <div className="flex gap-3">
                          <span className="font-semibold">{option.label}</span>
                          <Markdown source={option.textMd} className="question-text min-w-0 flex-1" />
                          {isKey ? <Badge tone="positive">Key</Badge> : null}
                        </div>
                        {rationale ? (
                          <div className="mt-2 border-t border-line pt-2 text-ink-muted">
                            <span className="text-xs font-semibold uppercase tracking-wide">Why it is wrong</span>
                            <Markdown source={rationale} className="question-text mt-1" />
                          </div>
                        ) : !isKey ? (
                          <p className="mt-2 text-xs text-negative">No distractor note recorded for this choice.</p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {reviewable.accessibilityText ? (
                <p className="mt-4 text-xs text-ink-muted">
                  <span className="font-semibold">Screen-reader text:</span> {reviewable.accessibilityText}
                </p>
              ) : null}
            </Card>
          </section>

          <section aria-labelledby="key-heading">
            <h2 id="key-heading" className="font-heading text-2xl font-semibold">
              Answer key and explanation
            </h2>
            <Card className="mt-4" padding="lg">
              <p className="text-sm">
                <span className="font-semibold">Keyed answer:</span> {describeAnswerKey(reviewable.answerKey, reviewable.options)}
              </p>
              <Markdown source={reviewable.explanationMd} className="prose-academic question-text mt-4 text-sm" />
              <p className="mt-4 text-xs text-ink-subtle">
                Difficulty: {row.difficulty} ({row.difficulty_basis === 'empirical' ? 'marked empirical' : 'an editorial judgement, not calibrated'}) ·
                estimated {row.estimated_seconds} s
              </p>
            </Card>
          </section>

          <section aria-labelledby="syllabus-heading">
            <h2 id="syllabus-heading" className="font-heading text-2xl font-semibold">
              Syllabus alignment
            </h2>
            <Card className="mt-4" padding="lg">
              <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[minmax(8rem,auto)_1fr]">
                <dt className="font-medium text-ink-muted">Section</dt>
                <dd>
                  {section?.name ?? row.section_key}
                  {section?.responseTypes.includes(row.response_type as never) ? '' : ' (this response type is not listed for the section)'}
                </dd>
                <dt className="font-medium text-ink-muted">Domain</dt>
                <dd>
                  {domain?.name ?? row.domain_slug}
                  {domain?.officialShare ? ` — official share: ${domain.officialShare}` : ''}
                  {domain?.description ? <span className="block text-ink-muted">{domain.description}</span> : null}
                </dd>
                <dt className="font-medium text-ink-muted">Skill</dt>
                <dd>
                  {skill?.name ?? row.skill_slug}
                  {skill?.description ? <span className="block text-ink-muted">{skill.description}</span> : null}
                </dd>
                <dt className="font-medium text-ink-muted">Response type</dt>
                <dd>{row.response_type}</dd>
                {domain?.source ? (
                  <>
                    <dt className="font-medium text-ink-muted">Taxonomy source</dt>
                    <dd className="break-all">{domain.source}</dd>
                  </>
                ) : null}
              </dl>
            </Card>
          </section>

          <section aria-labelledby="qa-heading">
            <h2 id="qa-heading" className="font-heading text-2xl font-semibold">
              Automated checks (not human review)
            </h2>
            <Card className="mt-4" padding="lg">
              <p className="text-sm text-ink-muted">
                These are machine checks and an AI blind solve. They are why the item reached this queue; they do not
                replace your judgement and are never shown to learners as review.
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[minmax(8rem,auto)_1fr]">
                <dt className="font-medium text-ink-muted">Author (as recorded)</dt>
                <dd>{row.author}</dd>
                <dt className="font-medium text-ink-muted">AI blind solve</dt>
                <dd>
                  {solve ? (
                    <>
                      {solve.agreesWithKey ? 'Agreed with the key' : 'Disagreed with the key'} ·{' '}
                      {solve.uniquenessChecked ? 'uniqueness checked' : 'uniqueness not confirmed'} · by {solve.solvedBy}
                      <span className="mt-1 block whitespace-pre-wrap text-ink-muted">{solve.workingNotes}</span>
                    </>
                  ) : (
                    <span className="text-ink-muted">Not recorded, or the authored file could not be read here.</span>
                  )}
                </dd>
              </dl>
            </Card>
          </section>
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="decide-heading">
            <h2 id="decide-heading" className="font-heading text-xl font-semibold">
              Your decision
            </h2>
            <div className="mt-4">
              {blocked ? (
                <Alert tone="info">
                  <p>{blocked}</p>
                </Alert>
              ) : (
                <ReviewForm questionVersionId={row.id} reviewFingerprint={fingerprint.stored!} criteria={REVIEW_CRITERIA.map((c) => ({ value: c, label: CRITERION_LABEL[c] }))} />
              )}
            </div>
          </section>

          <section aria-labelledby="integrity-heading">
            <h2 id="integrity-heading" className="font-heading text-xl font-semibold">
              Content fingerprint
            </h2>
            <p className="mt-2 break-all font-mono text-xs text-ink-muted">{fingerprint.stored ?? 'none'}</p>
            <p className="mt-1 text-xs text-ink-muted">
              {fingerprint.matches
                ? 'Matches the text served now. An approval is tied to it: any edit voids the approval.'
                : 'Does not match the text served now.'}
            </p>
          </section>

          <section aria-labelledby="history-heading">
            <h2 id="history-heading" className="font-heading text-xl font-semibold">
              Review history
            </h2>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">No human review has been recorded for any version of this question.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {history.map((entry) => {
                  const current = entry.questionVersionId === row.id && entry.reviewFingerprint === fingerprint.stored;
                  return (
                    <li key={entry.id} className="rounded-card border border-line p-3 text-sm">
                      <p className="font-semibold">
                        {entry.outcome === 'approved' ? 'Approved' : 'Changes requested'} · v{entry.questionVersion}
                        {current ? '' : ' (earlier content)'}
                      </p>
                      <p className="text-ink-muted">
                        {entry.reviewerName} ({entry.reviewerCredentials}), {entry.reviewedOn}
                      </p>
                      <p className="text-xs text-ink-subtle">Checked: {entry.checked.map((c) => CRITERION_LABEL[c]).join(', ') || 'nothing listed'}</p>
                      {entry.notes ? <p className="mt-1 whitespace-pre-wrap">{entry.notes}</p> : null}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <section aria-labelledby="audit-heading">
            <h2 id="audit-heading" className="font-heading text-xl font-semibold">
              Publication and content log
            </h2>
            {trail.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">Nothing logged yet (entries start with the first seed after migration 014).</p>
            ) : (
              <ol className="mt-3 space-y-2 text-xs text-ink-muted">
                {trail.slice(0, 30).map((entry, index) => (
                  <li key={`${entry.createdAt}-${index}`}>
                    <span className="font-mono">{entry.createdAt.slice(0, 16).replace('T', ' ')}</span> {entry.action}{' '}
                    {entry.payload ? JSON.stringify(entry.payload) : ''}
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-xs">
              <Link href="/admin/review">Back to the queue</Link>
            </p>
          </section>
        </aside>
      </div>
    </Container>
  );
}
