import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { getExamConfig } from '@/lib/exams/registry';
import { batchItems, getBatch } from '@/lib/content/review-batches';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { WithdrawBatch } from './withdraw-batch';

/** One recorded batch: who decided, who entered it, from what, and its questions; withdraw it if it was recorded in error. */

export const dynamic = 'force-dynamic';

const SHOWN = 2000;

type Params = Promise<{ locale: string; batchId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.batches.meta' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function BatchPage({ params }: { params: Params }) {
  const { batchId } = await params;
  await requireAdmin(`/admin/review/batches/${encodeURIComponent(batchId)}`);
  const t = await getTranslations('admin.batches');
  const db = getDb();
  const batch = await getBatch(db, batchId);
  if (!batch) notFound();
  const items = await batchItems(db, batch.id, SHOWN);
  const who = async (userId: string | null) =>
    userId ? (((await db.prepare('SELECT email FROM users WHERE id = ?').get(userId)) as { email: string | null } | undefined)?.email ?? userId) : '—';

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Administration' },
    { href: '/admin/review/batches', label: t('breadcrumb') },
    { label: batch.id.slice(0, 8) },
  ];
  const facts: Array<[string, React.ReactNode]> = [
    [t('detail.reviewer'), batch.reviewerName],
    [t('detail.reviewedOn'), batch.reviewedOn],
    [t('detail.recordedBy'), batch.recordedByEmail ?? batch.recordedBy],
    [t('detail.recordedAt'), batch.createdAt.replace('T', ' ').slice(0, 19)],
    [t('detail.source'), batch.source === 'csv' ? t('sourceCsv', { name: batch.sourceName }) : t('sourceSelection', { name: batch.sourceName })],
    [t('detail.sha'), batch.sourceSha256 ? <span className="break-all font-mono text-xs">{batch.sourceSha256}</span> : '—'],
    [t('detail.export'), batch.exportId ? <span className="font-mono text-xs">{batch.exportId}</span> : '—'],
    [t('detail.count'), batch.approvedCount],
  ];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow="Internal" title={t('detail.title', { id: batch.id.slice(0, 8) })} />

      {batch.withdrawnAt ? (
        <Alert tone="caution" className="mb-6" title={t('withdrawn', { date: batch.withdrawnAt.slice(0, 10) })}>
          <p>{t('detail.withdrawnBy', { who: await who(batch.withdrawnBy), date: batch.withdrawnAt.slice(0, 10), reason: batch.withdrawReason ?? '' })}</p>
        </Alert>
      ) : null}

      <Card padding="lg">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[minmax(12rem,auto)_1fr]">
          {facts.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="font-medium text-ink-muted">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {batch.withdrawnAt ? null : (
          <div className="mt-6">
            <WithdrawBatch batchId={batch.id} count={batch.approvedCount} />
          </div>
        )}
      </Card>

      <section className="mt-10" aria-labelledby="items-heading">
        <h2 id="items-heading" className="font-heading text-2xl font-semibold">{t('detail.questions')}</h2>
        {batch.approvedCount > items.length ? (
          <p className="mt-2 text-sm text-ink-muted">{t('detail.questionsMore', { shown: items.length, total: batch.approvedCount })}</p>
        ) : null}
        <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.questionId}>
              <Link href={`/admin/review/${encodeURIComponent(item.questionId)}`} className="font-mono text-xs">{item.questionId}</Link>{' '}
              <span className="text-xs text-ink-muted">v{item.version} · {getExamConfig(item.examKey)?.shortName ?? item.examKey}</span>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
