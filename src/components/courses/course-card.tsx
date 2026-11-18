import NextLink from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { LOCALE_INFO, isLocale, DEFAULT_LOCALE } from '@/i18n/locales';
import { courseLessons, coursesForHub, getCourse, lessonCount, lessonLang } from '@/lib/courses/catalogue';
import { courseHref, courseLangFor } from '@/lib/courses/languages';
import { getExamConfig } from '@/lib/exams/registry';
import { Card, buttonClass } from '@/components/ui';

/**
 * On an exam hub: the free course for each exam on it, with its first lesson
 * and, behind a disclosure, every lesson by unit. The lesson links are in the
 * HTML even while closed, so each lesson is one link from the hub, which is
 * the page search engines already know.
 *
 * Courses exist in English and their own translations only
 * (src/lib/courses/languages.ts), so each course is shown, and linked, in the
 * version for this interface language: the IMAT course in Italian on the
 * Italian hub, every other course in English.
 */
export async function CourseCard({ hubSlug, exam }: { hubSlug: string; exam: string }) {
  const current = await getLocale();
  const locale = isLocale(current) ? current : DEFAULT_LOCALE;
  const slugs = coursesForHub(hubSlug).map((course) => course.slug);
  if (slugs.length === 0) return null;
  const t = await getTranslations('courses.hub');
  const pageLang = LOCALE_INFO[locale].htmlLang;
  // A lang attribute only where the text is in another language than the page.
  const langOf = (lang: string) => (lang === pageLang ? undefined : lang);

  return (
    <div className={`mb-10 grid items-start gap-4 ${slugs.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
      {slugs.map((slug) => {
        const course = getCourse(slug, courseLangFor(slug, locale))!;
        const lessons = courseLessons(course);
        const first = lessons[0];
        // A hub with several courses names each by its own exam (TOLC-I, TOLC-E, TOLC-F).
        const name = slugs.length > 1 ? (getExamConfig(course.examKeys[0])?.shortName ?? exam) : exam;
        return (
          <Card key={slug}>
            <h2 className="font-heading text-lg font-semibold">{t('title', { exam: name })}</h2>
            <p className="mt-1 text-sm text-ink-muted">{t('body', { lessons: lessonCount(course) })}</p>
            {first ? (
              <p className="mt-3 text-sm">
                {t('startWith')}{' '}
                <NextLink href={courseHref(locale, slug, first.slug)} lang={langOf(lessonLang(first))}>
                  {first.title}
                </NextLink>
              </p>
            ) : null}
            <div className="mt-4">
              <NextLink href={courseHref(locale, slug)} className={buttonClass({ size: 'sm' })}>
                {t('open')}
              </NextLink>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-accent">{t('allLessons', { lessons: lessons.length })}</summary>
              {course.units.map((unit) => (
                <div key={unit.slug} className="mt-3">
                  <h3 lang={langOf(course.lang ?? 'en')} className="text-sm font-semibold">
                    {unit.title}
                  </h3>
                  <ul className="mt-1 space-y-1 text-sm">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <NextLink href={courseHref(locale, slug, lesson.slug)} lang={langOf(lessonLang(lesson))}>
                          {lesson.title}
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </details>
          </Card>
        );
      })}
    </div>
  );
}
