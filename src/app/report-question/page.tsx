import type { Metadata } from 'next';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { ReportForm } from './report-form';

// A form, not editorial content.
export const metadata: Metadata = {
  title: 'Report a question',
  description: 'Tell us about a question that looks wrong, ambiguous or incomplete.',
  robots: { index: false, follow: true },
};

export default async function ReportQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Report a question' }]} />
      <PageHeader
        title="Report a question"
        lead="If a question looks wrong, ambiguous or incomplete, tell us. We would rather withdraw an item than leave a bad one in the bank."
      />

      <Card>
        <ReportForm initialQuestionId={id ?? ''} />
      </Card>

      <Card className="mt-6">
        <h2 className="font-heading text-lg font-semibold">What happens to your report</h2>
        <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm text-ink-muted">
          <li>An editor re-solves the question independently, without looking at the stored key.</li>
          <li>
            If the key is wrong, or a second answer is genuinely defensible, the question is
            <strong className="text-ink"> quarantined</strong>, not quietly corrected. Quarantined
            items leave the live bank immediately.
          </li>
          <li>
            A replacement is written and goes through the same blind independent solve before it is
            published.
          </li>
          <li>
            Results you have already seen do not change. Every attempt is pinned to the exact version
            of the question you were shown.
          </li>
        </ol>
        <p className="mt-4 text-sm text-ink-muted">
          You do not need an account to report a question, and we do not need your email address.
        </p>
      </Card>
    </Container>
  );
}
