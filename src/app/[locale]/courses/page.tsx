import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { courseMinutes, coursePath, lessonCount, listCourses } from '@/lib/courses';
import { getHub } from '@/lib/exams/registry';
import { CONTENT_LANG, pageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import { pageTitle } from '@/lib/seo/title';
import { Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

const PATH = '/courses';

type Props = { params: Promise<{ locale: string }> };

/* Rendered at build time, like the lessons ([course]/[lesson]/page.tsx says why). */
export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'courses.index.meta' });
  const alternates = await pageAlternates(params, PATH);
  return {
    title: pageTitle(t('title')),
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

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('courses');
  const courses = listCourses();
  const trail = [{ href: '/', label: t('breadcrumbs.home') }, { label: t('breadcrumbs.courses') }];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), ldTrail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader title={t('index.title')} lead={t('index.lead')} />

      <ul className="grid gap-4 md:grid-cols-3">
        {courses.map((course) => {
          const hub = getHub(course.hubSlug);
          return (
            <Card as="li" key={course.slug} className="flex flex-col">
              <p className="eyebrow">{hub?.label ?? course.examPublisher}</p>
              <h2 lang={CONTENT_LANG} className="mt-1 font-heading text-xl font-semibold">
                <Link href={coursePath(course)} className="no-underline hover:underline">
                  {course.title}
                </Link>
              </h2>
              <p lang={CONTENT_LANG} className="mt-2 flex-1 text-ink-muted">
                {course.description}
              </p>
              <p className="mt-3 text-sm text-ink-subtle">
                {t('index.summary', {
                  units: course.units.length,
                  lessons: lessonCount(course),
                  hours: Math.max(1, Math.round(courseMinutes(course) / 60)),
                })}
              </p>
              <div className="mt-4">
                <ButtonLink href={coursePath(course)} size="sm" aria-label={t('index.open', { course: course.title })}>
                  {t('course.start')}
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </ul>

      <p className="mt-8 max-w-2xl text-ink-muted">{t('index.freeNote')}</p>
      {locale !== 'en' ? <p className="mt-2 max-w-2xl text-sm text-ink-subtle">{t('index.english')}</p> : null}
    </Container>
  );
}
