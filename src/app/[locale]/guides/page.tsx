import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { listGuides } from '@/lib/content/guides';
import { getHub } from '@/lib/exams/registry';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { languageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';

const PATH = '/guides';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'guides.index.meta' });
  const alternates = languageAlternates(PATH, locale as Locale);
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph: {
      images: shareImages('site', t('title')),
      url: alternates.canonical,
      title: `${t('title')} | ${SITE.shortName}`,
      description: t('description'),
    },
  };
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');
  const format = await getFormatter();
  const guides = listGuides();
  const trail = [{ href: '/', label: t('breadcrumbs.home') }, { label: t('breadcrumbs.guides') }];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), ldTrail)} />
      <Breadcrumbs trail={trail} />
      {/*
        The description follows the list: as a lead it gained a line when the
        interface font arrived and pushed every guide down (docs/REDESIGN.md §18).
      */}
      <PageHeader title={t('index.title')} />

      <ul className="space-y-4">
        {guides.map((guide) => {
          const hub = getHub(guide.hubSlug);
          return (
            <Card as="li" key={guide.slug}>
              <p className="eyebrow">
                {t('index.eyebrow', {
                  hub: hub?.name ?? t('general'),
                  readingTime: t('readingTime', { minutes: guide.readingMinutes }),
                })}
              </p>
              <h2 className="mt-1 font-heading text-xl font-semibold">
                <Link href={`/guides/${guide.slug}`} className="no-underline hover:underline">
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-2 text-ink-muted">{guide.answer}</p>
              <p className="mt-3 text-xs text-ink-subtle">
                {t.rich('index.updated', {
                  date: format.dateTime(new Date(`${guide.updatedOn}T00:00:00Z`), {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  }),
                  time: (chunks) => <time dateTime={guide.updatedOn}>{chunks}</time>,
                })}
              </p>
            </Card>
          );
        })}
      </ul>

      <p className="mt-8 max-w-2xl text-ink-muted">{t('index.meta.description')}</p>
    </Container>
  );
}
