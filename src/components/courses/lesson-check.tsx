import { getTranslations } from 'next-intl/server';
import { InlineMarkdown, Markdown } from '@/components/content';
import { CONTENT_LANG } from '@/i18n/alternates';
import type { CheckQuestion } from '@/lib/courses/types';

/**
 * A lesson's short check, rendered on the server. As in a guide's sample
 * questions (src/components/guides/sample-questions.tsx), each answer sits in
 * a native <details>: closed so the reader tries first, usable without
 * script, and present in the static HTML the deploy saves.
 */
export async function LessonCheck({ questions }: { questions: CheckQuestion[] }) {
  const t = await getTranslations({ locale: CONTENT_LANG, namespace: 'courses.lesson' });
  return (
    <section aria-labelledby="check" className="mt-12">
      <h2 id="check" className="font-heading text-2xl font-semibold">
        {t('check')}
      </h2>
      <p className="mt-1 text-ink-muted">{t('checkIntro')}</p>

      {questions.map((question, index) => {
        const number = index + 1;
        const key = question.options.find((option) => option.id === question.answer);
        const wrong = question.options.filter((option) => option.id !== question.answer);
        return (
          <div key={question.id} className="mt-6 rounded-card border border-line bg-surface p-5 sm:p-6">
            <h3 id={question.id} className="scroll-mt-24 font-heading text-lg font-semibold">
              {t('question', { number })}: {question.title}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">{question.topic}</p>
            {question.stimulusMd ? <Markdown source={question.stimulusMd} className="prose-academic mt-4 overflow-x-auto font-serif" /> : null}
            <Markdown source={question.stemMd} className="prose-academic mt-4 font-serif" />

            <ol aria-label={t('options', { number })} className="mt-4 space-y-2 font-serif">
              {question.options.map((option) => (
                <li key={option.id} className="flex gap-3 rounded-md border border-line px-3 py-2">
                  <span className="font-semibold">{option.id}.</span>
                  <span>
                    <InlineMarkdown source={option.text} />
                  </span>
                </li>
              ))}
            </ol>

            <details className="sample-answer mt-5 rounded-md border border-line-strong">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-accent">{t('showAnswer')}</summary>
              <div className="border-t border-line px-4 pb-4">
                <p className="mt-3 font-semibold">
                  {t('theAnswer', { option: question.answer })}{' '}
                  <span className="font-normal">
                    <InlineMarkdown source={key?.text} />
                  </span>
                </p>
                <h4 className="mt-4 font-heading font-semibold">{t('working')}</h4>
                <Markdown source={question.workingMd} className="prose-academic mt-1 font-serif" />
                <h4 className="mt-4 font-heading font-semibold">{t('wrongOptions')}</h4>
                <ul className="mt-2 space-y-2 font-serif">
                  {wrong.map((option) => (
                    <li key={option.id}>
                      <span className="font-semibold">{option.id}.</span> <InlineMarkdown source={option.note} />
                    </li>
                  ))}
                </ul>
                <h4 className="mt-4 font-heading font-semibold">{t('carryOver')}</h4>
                <p className="mt-1 font-serif">
                  <InlineMarkdown source={question.lesson} />
                </p>
              </div>
            </details>
          </div>
        );
      })}
    </section>
  );
}
