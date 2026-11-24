import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { listReviewers } from '@/lib/content/human-review';
import { MAX_EXPORT_ROWS, MAX_ROWS, listExports, pendingQuestions } from '@/lib/content/review-batches';
import { Alert, Breadcrumbs, Container, PageHeader } from '@/components/ui';
import { BatchReview, type BatchExam } from './batch-review';

/**
 * Recording, in bulk, approvals that reviewers made outside the site
 * (administrators only): select questions awaiting review, or import the CSV
 * a reviewer returned, and record them in that reviewer's name after a dry
 * run. The rules are in src/lib/content/review-batches.ts.
 */

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.batchReview.meta' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function BatchReviewPage() {
  await requireAdmin('/admin/review/batch');
  const t = await getTranslations('admin.batchReview');
  const db = getDb();
  const [questions, exports, reviewers] = await Promise.all([pendingQuestions(db), listExports(db), listReviewers(db)]);

  const examKeys = new Set(questions.map((q) => q.examKey));
  const exams: BatchExam[] = EXAM_CONFIGS.filter((c) => examKeys.has(c.examKey)).map((config) => ({
    key: config.examKey,
    name: config.name,
    sections: config.sections.map((s) => ({ key: s.key, name: s.name })),
    domains: config.domains.map((d) => ({ slug: d.slug, name: d.name, sectionKey: d.sectionKey })),
  }));
  const active = reviewers
    .filter((r) => r.status === 'active')
    .map((r) => ({ userId: r.userId, publicName: r.publicName, publicCredentials: r.publicCredentials, examKeys: r.examKeys }));
  const unconfirmed = reviewers.filter((r) => r.status === 'pending-confirmation').length;

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Administration' },
    { href: '/admin/review', label: 'Human review' },
    { label: t('breadcrumb') },
  ];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
      <p className="-mt-4 mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/admin/review/batches">{t('batchesLink')}</Link>
        <Link href="/admin/review">{t('queueLink')}</Link>
      </p>

      {active.length === 0 ? (
        <Alert tone="caution" className="mb-8" title={t('noReviewers.title')}>
          <p>{t.rich('noReviewers.body', { link: (chunks) => <Link href="/admin/reviewers">{chunks}</Link> })}</p>
        </Alert>
      ) : null}
      {unconfirmed > 0 ? <p className="mb-6 text-sm text-ink-muted">{t('unconfirmed', { count: unconfirmed })}</p> : null}

      <BatchReview
        questions={questions}
        exams={exams}
        examNames={Object.fromEntries(EXAM_CONFIGS.map((c) => [c.examKey, getExamConfig(c.examKey)?.shortName ?? c.examKey]))}
        exports={exports.map((e) => ({ id: e.id, fileName: e.fileName, itemCount: e.itemCount, createdAt: e.createdAt }))}
        reviewers={active}
        today={new Date().toISOString().slice(0, 10)}
        maxRows={MAX_ROWS}
        maxExportRows={MAX_EXPORT_ROWS}
      />
    </Container>
  );
}
