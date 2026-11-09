import { getTranslations } from 'next-intl/server';
import { coursePath, lessonCount, listCourses } from '@/lib/courses';
import { ButtonLink, Card } from '@/components/ui';

/** On an exam hub: the free course for that exam, when there is one. */
export async function CourseCard({ hubSlug, exam }: { hubSlug: string; exam: string }) {
  const course = listCourses().find((c) => c.hubSlug === hubSlug);
  if (!course) return null;
  const t = await getTranslations('courses.hub');
  return (
    <Card className="mb-10">
      <h2 className="font-heading text-lg font-semibold">{t('title', { exam })}</h2>
      <p className="mt-1 text-sm text-ink-muted">{t('body', { lessons: lessonCount(course) })}</p>
      <div className="mt-4">
        <ButtonLink href={coursePath(course)} size="sm">
          {t('open')}
        </ButtonLink>
      </div>
    </Card>
  );
}
