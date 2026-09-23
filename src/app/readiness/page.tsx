import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireSignedIn } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { buildReadiness, getExamTarget } from '@/lib/learning/queries';
import { ReadinessReport } from '@/components/readiness/readiness-report';
import { TargetForm } from '@/components/readiness/target-form';
import { Breadcrumbs, Card, Container, EmptyState, ButtonLink, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Are you ready?',
  description: 'How your practice measures against the exam you are preparing for.',
  robots: { index: false, follow: false },
};

/** The exam this learner has actually been working on. */
function inferExamKey(db: ReturnType<typeof getDb>, userId: string): string | null {
  const row = db
    .prepare(
      `SELECT exam_key AS examKey
       FROM attempts
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .get(userId) as { examKey: string } | undefined;
  return row?.examKey ?? null;
}

export default async function ReadinessPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const user = await requireSignedIn('/readiness');
  const { exam } = await searchParams;
  const db = getDb();

  const examKey = exam ?? user.targetExamKey ?? inferExamKey(db, user.id);
  const config = examKey ? getExamConfig(examKey) : undefined;

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { label: 'Readiness' },
  ];

  if (!config) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader
          title="Are you ready?"
          lead="Choose the exam you are preparing for, and this page will measure your practice against it."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {EXAM_CONFIGS.map((option) => (
            <Card as="li" key={option.examKey}>
              <h2 className="text-lg">
                <Link href={`/readiness?exam=${option.examKey}`} className="no-underline hover:underline">
                  {option.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{option.publisher}</p>
            </Card>
          ))}
        </ul>
      </Container>
    );
  }

  const target = getExamTarget(db, user.id, config.examKey);
  const assessment = buildReadiness(db, user.id, config, target?.targetScore ?? null);
  const hub = getHubForConfig(config.examKey);

  return (
    <Container>
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow={config.publisher}
        title="Are you ready?"
        lead={`Everything below is measured from your own answers for ${config.shortName}. It describes your preparation, not a predicted exam score.`}
      />

      {/* Switching exams */}
      {EXAM_CONFIGS.length > 1 ? (
        <nav aria-label="Choose an exam" className="mb-8 flex flex-wrap gap-2">
          {EXAM_CONFIGS.map((option) => {
            const active = option.examKey === config.examKey;
            return (
              <Link
                key={option.examKey}
                href={`/readiness?exam=${option.examKey}`}
                aria-current={active ? 'page' : undefined}
                className={`rounded-sm border px-3 py-1.5 text-sm no-underline ${
                  active
                    ? 'border-accent bg-accent-soft font-medium text-accent-strong'
                    : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
                }`}
              >
                {option.shortName}
              </Link>
            );
          })}
        </nav>
      ) : null}

      {assessment.answeredTotal === 0 ? (
        <div className="space-y-8">
          <EmptyState
            title={`No answers yet for ${config.shortName}`}
            action={<ButtonLink href={`/practice/${config.examKey}`}>Start practising</ButtonLink>}
          >
            <p>
              This page measures your readiness from questions you have actually answered. Answer some
              and it becomes meaningful — there is nothing useful we could tell you before that.
            </p>
          </EmptyState>

          <TargetForm
            examKey={config.examKey}
            scale={config.scoring.officialScale}
            currentScore={target?.targetScore ?? null}
            currentDate={target?.targetDate ?? null}
          />
        </div>
      ) : (
        <div className="space-y-10">
          <ReadinessReport assessment={assessment} config={config} />

          <TargetForm
            examKey={config.examKey}
            scale={config.scoring.officialScale}
            currentScore={target?.targetScore ?? null}
            currentDate={target?.targetDate ?? null}
          />

          <Card>
            <h2 className="text-lg">Keep going</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href={`/practice/${config.examKey}`}>Practise {config.shortName}</ButtonLink>
              <ButtonLink href="/study-plan" variant="secondary">
                Study plan
              </ButtonLink>
              <ButtonLink href="/review" variant="secondary">
                Mistake notebook
              </ButtonLink>
              {hub ? (
                <ButtonLink href={`/exams/${hub.slug}/format`} variant="secondary">
                  What the exam actually looks like
                </ButtonLink>
              ) : null}
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
}
