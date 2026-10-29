import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { listReviewers } from '@/lib/content/human-review';
import { Alert, Badge, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { GrantReviewerForm, RevokeReviewer } from './reviewer-admin';

/**
 * Who may approve questions (administrators only).
 *
 * Authorising a reviewer here is a statement that the person is qualified for
 * the exams listed. Write the credentials line with them, as they want it
 * shown publicly; they must confirm it themselves before they can review.
 * Never authorise a placeholder, a shared account or an AI.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reviewers',
  robots: { index: false, follow: false },
};

export default async function ReviewersPage() {
  const admin = await requireAdmin('/admin/reviewers');
  const reviewers = await listReviewers(getDb());
  const trail = [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Administration' }, { label: 'Reviewers' }];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Internal"
        title="Reviewers"
        lead="The people authorised to approve questions. Only their approval of a question's exact current content makes it available to learners."
      />

      <Alert tone="caution" className="mb-8" title="Authorise only real, qualified people">
        <p>
          The person needs their own account. Their name and credentials are shown publicly beside every question they
          approve, so agree the wording with them; they confirm it before they can review. List every name they write or
          edit content under, so they can never approve their own work.
        </p>
      </Alert>

      <section aria-labelledby="current-heading">
        <h2 id="current-heading" className="font-heading text-2xl font-semibold">
          Current reviewers
        </h2>
        {reviewers.length === 0 ? (
          <p className="mt-3 text-ink-muted">No reviewer has been authorised yet, so no question can be approved and none is served.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviewers.map((reviewer) => (
              <Card as="li" key={reviewer.userId}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{reviewer.publicName}</span>
                  <Badge tone={reviewer.status === 'active' ? 'positive' : reviewer.status === 'revoked' ? 'negative' : 'caution'}>
                    {reviewer.status === 'active' ? 'Active' : reviewer.status === 'revoked' ? 'Withdrawn' : 'Awaiting their confirmation'}
                  </Badge>
                  {reviewer.grantedBy === reviewer.userId ? <Badge tone="caution">Self-authorised</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-ink-muted">{reviewer.publicCredentials}</p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {reviewer.email} · {reviewer.examKeys.map((key) => getExamConfig(key)?.shortName ?? key).join(', ')} · authorised{' '}
                  {reviewer.grantedAt.slice(0, 10)}
                  {reviewer.authorAliases.length > 0 ? ` · also writes as: ${reviewer.authorAliases.join(', ')}` : ''}
                  {reviewer.revokedAt ? ` · withdrawn ${reviewer.revokedAt.slice(0, 10)}: ${reviewer.revokeReason ?? ''}` : ''}
                </p>
                {reviewer.status !== 'revoked' ? (
                  <div className="mt-3">
                    <RevokeReviewer userId={reviewer.userId} name={reviewer.publicName} />
                  </div>
                ) : null}
              </Card>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12" aria-labelledby="grant-heading">
        <h2 id="grant-heading" className="font-heading text-2xl font-semibold">
          Authorise a reviewer
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-ink-muted">
          Granting again to an existing reviewer replaces their exams and wording and asks them to confirm again.
          {` You are signed in as ${admin.email ?? 'an administrator'}.`}
        </p>
        <div className="mt-4 max-w-2xl">
          <GrantReviewerForm exams={EXAM_CONFIGS.map((config) => ({ key: config.examKey, name: config.name }))} />
        </div>
      </section>
    </Container>
  );
}
