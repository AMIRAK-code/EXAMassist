import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { courseLessons, coursePath, getLesson, lessonPath, listCourses, practicePath } from '@/lib/courses';
import { getExamConfig } from '@/lib/exams/registry';
import { freeTestPath } from '@/lib/billing/config';
import { CONTENT_LANG, pageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';
import { SITE, absoluteUrl, shareImages, siteUrl } from '@/lib/site';
import { Markdown } from '@/components/content';
import { LessonCheck } from '@/components/courses/lesson-check';
import { Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema, lessonSchema } from '@/components/seo/json-ld';

type Props = { params: Promise<{ locale: string; course: string; lesson: string }> };

/*
 * Every lesson is rendered at build time, in every language, and served from
 * there. Rendering one on the Worker (its Markdown and KaTeX, and the whole
 * course catalogue it is loaded with) took several times the CPU the Workers
 * Free plan allows a request, so almost every lesson failed with error 1102.
 * Nothing here depends on the visitor: the layout treats this render as one
 * shared by everyone (src/lib/seo/static-pages.ts, isSharedRender).
 */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return listCourses().flatMap((course) => courseLessons(course).map((lesson) => ({ course: course.slug, lesson: lesson.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) return {};
  const { course, lesson } = found;
  const alternates = await pageAlternates(params, lessonPath(course, lesson));
  const title = `${lesson.title} | ${course.title}`;
  return {
    title,
    description: lesson.summary,
    alternates,
    openGraph: {
      type: 'article',
      url: alternates.canonical,
      title: `${title} | ${SITE.shortName}`,
      description: lesson.summary,
      images: shareImages('site', lesson.title),
    },
  };
}

/** The skill's name as the exam config gives it, for the practice button. */
function topicName(examKey: string, domain: string, skill?: string): string {
  const found = getExamConfig(examKey)?.domains.find((d) => d.slug === domain);
  return (skill ? found?.skills.find((s) => s.slug === skill)?.name : undefined) ?? found?.name ?? domain;
}

export default async function LessonPage({ params }: Props) {
  const { locale, course: courseSlug, lesson: lessonSlug } = await params;
  setRequestLocale(locale);
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) notFound();
  const { course, unit, lesson, number, previous, next } = found;

  const t = await getTranslations('courses');
  // Labels inside the lesson are in the lesson's language, like a guide's.
  const tl = await getTranslations({ locale: CONTENT_LANG, namespace: 'courses.lesson' });
  const total = courseLessons(course).length;
  const path = lessonPath(course, lesson);
  const url = (await pageAlternates(params, path)).canonical;
  const trail = [
    { href: '/', label: t('breadcrumbs.home') },
    { href: '/courses', label: t('breadcrumbs.courses') },
    { href: coursePath(course), label: course.title },
    { label: lesson.title },
  ];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));
  const topic = topicName(lesson.practice.examKey, lesson.practice.domain, lesson.practice.skill);
  const checkedOn = lesson.review.independentCheckOn ?? course.updatedOn;

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), ldTrail),
          lessonSchema({
            siteUrl: siteUrl(),
            url,
            name: lesson.title,
            description: lesson.summary,
            courseUrl: absoluteUrl(coursePath(course)),
            courseName: course.title,
            teaches: lesson.objectives,
            minutes: lesson.minutes,
            datePublished: course.publishedOn,
            dateModified: checkedOn > course.updatedOn ? checkedOn : course.updatedOn,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <article lang={CONTENT_LANG}>
        <header className="mb-8">
          <PageHeader eyebrow={tl('position', { number, total, unit: unit.title })} title={lesson.title} lead={lesson.summary} />
          <p className="-mt-4 text-sm text-ink-subtle">{tl('minutes', { minutes: lesson.minutes })}</p>
        </header>

        <section aria-labelledby="objectives" className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
          <h2 id="objectives" className="eyebrow text-accent-ink">
            {tl('objectives')}
          </h2>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="idea" className="mt-10">
          <h2 id="idea" className="font-heading text-2xl font-semibold">
            {tl('idea')}
          </h2>
          <Markdown source={lesson.teachMd} className="prose-academic mt-2 font-serif" />
        </section>

        <section aria-labelledby="examples" className="mt-12">
          <h2 id="examples" className="font-heading text-2xl font-semibold">
            {tl('examples')}
          </h2>
          {lesson.examples.map((example, index) => (
            <div key={example.id} className="mt-6 rounded-card border border-line bg-surface p-5 sm:p-6">
              <h3 id={example.id} className="scroll-mt-24 font-heading text-xl font-semibold">
                {tl('example', { number: index + 1 })}: {example.title}
              </h3>
              <Markdown source={example.problemMd} className="prose-academic mt-3 font-serif" />
              <ol className="mt-4 space-y-3 border-s-2 border-line ps-4 font-serif">
                {example.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3">
                    <span aria-hidden="true" className="shrink-0 font-sans text-sm font-semibold tabular-nums text-ink-subtle">
                      {stepIndex + 1}.
                    </span>
                    <Markdown source={step} className="prose-academic min-w-0 flex-1" />
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-md bg-accent-soft px-4 py-3">
                <p className="font-sans text-sm font-semibold text-accent-ink">{tl('answer')}</p>
                <Markdown source={example.answerMd} className="prose-academic mt-1 font-serif" />
              </div>
            </div>
          ))}
        </section>

        <section aria-labelledby="traps" className="mt-12">
          <h2 id="traps" className="font-heading text-2xl font-semibold">
            {tl('traps')}
          </h2>
          <ul className="mt-4 space-y-4">
            {lesson.traps.map((trap) => (
              <li key={trap.title} className="rounded-card border border-caution-line bg-caution-soft p-5">
                <h3 className="font-heading text-lg font-semibold">{trap.title}</h3>
                <Markdown source={trap.md} className="prose-academic mt-1 font-serif" />
              </li>
            ))}
          </ul>
        </section>

        <LessonCheck questions={lesson.check} />

        <section aria-labelledby="takeaways" className="mt-12">
          <h2 id="takeaways" className="font-heading text-2xl font-semibold">
            {tl('takeaways')}
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-5 font-serif">
            {lesson.takeaways.map((takeaway) => (
              <li key={takeaway}>
                <Markdown source={takeaway} className="prose-academic [&>p]:m-0" />
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-sm text-ink-muted">{tl('original')}</p>
        <p className="mt-2 text-sm text-ink-muted">{tl('authorship')}</p>
      </article>

      <Card className="mt-10">
        <h2 className="font-heading text-lg font-semibold">{t('practice.title')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('practice.body')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href={practicePath(lesson)}>{t('practice.button', { topic })}</ButtonLink>
          <ButtonLink href={freeTestPath(lesson.practice.examKey)} variant="secondary">
            {t('practice.freeDiagnostic')}
          </ButtonLink>
        </div>
      </Card>

      <nav aria-label={t('nav.label')} className="mt-8 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link href={lessonPath(course, previous)} className="rounded-card border border-line p-4 no-underline hover:border-line-strong">
            <span className="block text-sm text-ink-subtle">← {t('nav.previous')}</span>
            <span lang={CONTENT_LANG} className="mt-1 block font-semibold">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={lessonPath(course, next)} className="rounded-card border border-line p-4 text-end no-underline hover:border-line-strong">
            <span className="block text-sm text-ink-subtle">{t('nav.next')} →</span>
            <span lang={CONTENT_LANG} className="mt-1 block font-semibold">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
      <div className="mt-6">
        <ButtonLink href={`${coursePath(course)}#${unit.slug}`} variant="secondary" size="sm">
          {t('nav.backToCourse')}
        </ButtonLink>
      </div>
    </Container>
  );
}
