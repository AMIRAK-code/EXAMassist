import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { listBatches, listExports } from '@/lib/content/review-batches';
import { Badge, Breadcrumbs, Container, EmptyState, PageHeader } from '@/components/ui';

/** Every batch of approvals entered on a reviewer's behalf, and every file sent to reviewers (administrators only). */

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.batches.meta' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function BatchesPage() {
  await requireAdmin('/admin/review/batches');
  const t = await getTranslations('admin.batches');
  const db = getDb();
  const [batches, exports] = await Promise.all([listBatches(db), listExports(db)]);
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Administration' },
    { href: '/admin/review', label: 'Human review' },
    { label: t('breadcrumb') },
  ];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow="Internal" title={t('title')} lead={t('lead')} />
      <p className="-mt-4 mb-8 text-sm">
        <Link href="/admin/review/batch">{t('back')}</Link>
      </p>

      {batches.length === 0 ? (
        <EmptyState headingLevel={2} title={t('empty')} />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[48rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-strong">
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('columns.recorded')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('columns.reviewer')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('columns.source')}</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">{t('columns.approvals')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('columns.status')}</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 align-top tabular-nums">
                    <Link href={`/admin/review/batches/${b.id}`}>{b.createdAt.slice(0, 16).replace('T', ' ')}</Link>
                  </td>
                  <td className="px-4 py-3 align-top">{b.reviewerName}</td>
                  <td className="px-4 py-3 align-top">
                    {b.source === 'csv' ? t('sourceCsv', { name: b.sourceName }) : t('sourceSelection', { name: b.sourceName })}
                  </td>
                  <td className="px-4 py-3 text-end align-top tabular-nums">{b.approvedCount}</td>
                  <td className="px-4 py-3 align-top">
                    {b.withdrawnAt ? (
                      <Badge tone="negative">{t('withdrawn', { date: b.withdrawnAt.slice(0, 10) })}</Badge>
                    ) : (
                      <Badge tone="positive">{t('active')}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-12" aria-labelledby="exports-heading">
        <h2 id="exports-heading" className="font-heading text-2xl font-semibold">{t('exportsHeading')}</h2>
        {exports.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">{t('exportsEmpty')}</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {exports.map((e) => (
              <li key={e.id}>
                {t('exportLine', { file: e.fileName, count: e.itemCount, date: e.createdAt.slice(0, 16).replace('T', ' ') })}{' '}
                <span className="font-mono text-xs text-ink-muted">{e.id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
