import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { courseLessons, courseMinutes, coursePath, courseUpdatedOn, getCourse, lessonCount, lessonPath, listCourses } from '@/lib/courses';
import { getHub } from '@/lib/exams/registry';
import { freeTestPath } from '@/lib/billing/config';
import { CONTENT_LANG, pageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';
import { SITE, absoluteUrl, shareImages, siteUrl } from '@/lib/site';
import { pageTitle } from '@/lib/seo/title';
import { Markdown } from '@/components/content';
import { CourseMindMap } from '@/components/courses/course-mind-map';
import { Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema, courseSchema } from '@/components/seo/json-ld';

type Props = { params: Promise<{ locale: string; course: string }> };

/* Rendered at build time, like the lessons ([lesson]/page.tsx says why). */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return listCourses().map((course) => ({ course: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  const alternates = await pageAlternates(params, coursePath(course));
  return {
    title: pageTitle(course.metaTitle),
    description: course.description,
    alternates,
    openGraph: {
      url: alternates.canonical,
      title: `${course.metaTitle} | ${SITE.shortName}`,
      description: course.description,
      images: shareImages('site', course.title),
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const { locale, course: slug } = await params;
  setRequestLocale(locale);
  const course = getCourse(slug);
  if (!course) notFound();

  const t = await getTranslations('courses');
  const hub = getHub(course.hubSlug);
  const lessons = courseLessons(course);
  const url = (await pageAlternates(params, coursePath(course))).canonical;
  const trail = [
    { href: '/', label: t('breadcrumbs.home') },
    { href: '/courses', label: t('breadcrumbs.courses') },
    { label: course.title },
  ];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));
  const summary = t('course.summary', {
    units: course.units.length,
    lessons: lessonCount(course),
    hours: Math.max(1, Math.round(courseMinutes(course) / 60)),
  });

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), ldTrail),
          courseSchema({
            siteUrl: siteUrl(),
            url,
            name: course.title,
            description: course.description,
            about: hub?.name ?? course.title,
            dateModified: courseUpdatedOn(course),
            minutes: courseMinutes(course),
            syllabus: course.units.map((unit) => ({ name: unit.title, description: unit.summary })),
            lessons: lessons.map((lesson) => ({ name: lesson.title, url: absoluteUrl(lessonPath(course, lesson)) })),
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <div lang={CONTENT_LANG} className="max-w-3xl">
        <PageHeader eyebrow={t('course.eyebrow', { exam: hub?.label ?? course.examPublisher })} title={course.title} lead={course.description}>
          <p className="text-sm text-ink-subtle">{summary}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {lessons[0] ? <ButtonLink href={lessonPath(course, lessons[0])}>{t('course.start')}</ButtonLink> : null}
            {hub ? (
              <ButtonLink href={`/exams/${hub.slug}`} variant="secondary">
                {t('course.examGuide', { exam: hub.label })}
              </ButtonLink>
            ) : null}
          </div>
        </PageHeader>

        <Markdown source={course.introMd} className="prose-academic font-serif" />
      </div>

      {course.mindMap ? (
        <section aria-labelledby="course-map" className="mt-12">
          <h2 id="course-map" className="font-heading text-2xl font-semibold">
            {t('mindMap.title')}
          </h2>
          <p className="mt-1 max-w-3xl text-ink-muted">{t('mindMap.lead')}</p>
          <div className="mt-6" lang={CONTENT_LANG}>
            <CourseMindMap
              centre={course.mindMap.centre}
              centreNote={course.mindMap.centreNote}
              branches={course.units.map((unit) => ({
                id: unit.slug,
                title: unit.title,
                note: course.mindMap?.branchNotes?.[unit.slug],
                lessons: unit.lessons.map((lesson) => ({
                  title: lesson.title,
                  href: localizePath(lessonPath(course, lesson), locale as Locale),
                  time: t('course.minutes', { minutes: lesson.minutes }),
                })),
              }))}
              labels={{
                map: t('mindMap.map', { course: course.title }),
                hint: t('mindMap.hint'),
                lessonCounts: Object.fromEntries(course.units.map((unit) => [unit.slug, t('mindMap.lessons', { count: unit.lessons.length })])),
              }}
            />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="course-contents" className="mt-12">
        <h2 id="course-contents" className="font-heading text-2xl font-semibold">
          {t('course.contents')}
        </h2>
        <ol className="mt-6 space-y-6">
          {course.units.map((unit, unitIndex) => {
            const first = lessons.indexOf(unit.lessons[0]);
            return (
              <li key={unit.slug} id={unit.slug} className="scroll-mt-24">
                <Card as="section" className="sm:p-6">
                  <p className="eyebrow">{t('course.unit', { number: unitIndex + 1 })}</p>
                  <h3 lang={CONTENT_LANG} className="mt-1 font-heading text-xl font-semibold">
                    {unit.title}
                  </h3>
                  <p lang={CONTENT_LANG} className="mt-2 max-w-3xl text-ink-muted">
                    {unit.summary}
                  </p>
                  <ol className="mt-4 divide-y divide-line border-t border-line">
                    {unit.lessons.map((lesson, index) => (
                      <li key={lesson.slug} className="flex items-baseline gap-3 py-3">
                        <span className="w-7 shrink-0 text-end text-sm tabular-nums text-ink-subtle">{first + index + 1}.</span>
                        <span className="min-w-0 flex-1">
                          <Link lang={CONTENT_LANG} href={lessonPath(course, lesson)} className="font-semibold">
                            {lesson.title}
                          </Link>
                          <span lang={CONTENT_LANG} className="mt-0.5 block text-sm text-ink-muted">
                            {lesson.summary}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm text-ink-subtle">{t('course.minutes', { minutes: lesson.minutes })}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      <Card className="mt-10">
        <h2 className="font-heading text-lg font-semibold">{t('course.practiseTitle')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('course.practiseBody')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href={freeTestPath(course.examKeys[0])}>{t('course.freeDiagnostic')}</ButtonLink>
          <ButtonLink href="/courses" variant="secondary">
            {t('course.allCourses')}
          </ButtonLink>
        </div>
      </Card>

      <section aria-labelledby="course-sources" className="mt-10 max-w-3xl">
        <h2 id="course-sources" className="font-heading text-lg font-semibold">
          {t('course.sources')}
        </h2>
        <ol className="mt-3 space-y-2 text-sm">
          {course.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="noopener noreferrer" target="_blank" lang={CONTENT_LANG}>
                {source.label}
                <span className="sr-only"> {t('course.opensInNewTab')}</span>
              </a>{' '}
              <span className="text-ink-muted">— {source.publisher}</span>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  );
}
