import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { ReportForm } from './report-form';

type Params = Promise<{ locale: string }>;

// A form, not editorial content.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.reportQuestion.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: (await pageAlternates(params, '/report-question')),
    robots: { index: false, follow: true },
  };
}

export default async function ReportQuestionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { id } = await searchParams;
  const t = await getTranslations('about');

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: t('shared.home') }, { label: t('reportQuestion.title') }]} />
      <PageHeader title={t('reportQuestion.title')} lead={t('reportQuestion.lead')} />

      <Card>
        <ReportForm initialQuestionId={id ?? ''} />
      </Card>

      <Card className="mt-6">
        <h2 className="font-heading text-lg font-semibold">{t('reportQuestion.process.heading')}</h2>
        <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm text-ink-muted">
          <li>{t('reportQuestion.process.resolve')}</li>
          <li>
            {t.rich('reportQuestion.process.quarantine', {
              strong: (chunks) => <strong className="text-ink">{chunks}</strong>,
            })}
          </li>
          <li>{t('reportQuestion.process.replacement')}</li>
          <li>{t('reportQuestion.process.pinned')}</li>
        </ol>
        <p className="mt-4 text-sm text-ink-muted">{t('reportQuestion.process.noAccount')}</p>
      </Card>
    </Container>
  );
}
