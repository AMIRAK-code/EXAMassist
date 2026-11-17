import NextLink from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { lessonCount, listCourses } from '@/lib/courses';
import { courseHref } from '@/lib/courses/languages';
import { Card, buttonClass } from '@/components/ui';

/**
 * On an exam hub: the free course for that exam, when there is one. Courses
 * exist in English and their own translations only (src/lib/courses/languages.ts),
 * so the link goes straight to the version for this interface language.
 */
export async function CourseCard({ hubSlug, exam }: { hubSlug: string; exam: string }) {
  const course = listCourses().find((c) => c.hubSlug === hubSlug);
  if (!course) return null;
  const t = await getTranslations('courses.hub');
  const locale = await getLocale();
  return (
    <Card className="mb-10">
      <h2 className="font-heading text-lg font-semibold">{t('title', { exam })}</h2>
      <p className="mt-1 text-sm text-ink-muted">{t('body', { lessons: lessonCount(course) })}</p>
      <div className="mt-4">
        <NextLink href={courseHref(locale, course.slug)} className={buttonClass({ size: 'sm' })}>
          {t('open')}
        </NextLink>
      </div>
    </Card>
  );
}
