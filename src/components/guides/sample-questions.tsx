import { getTranslations } from 'next-intl/server';
import { InlineMarkdown, Markdown } from '@/components/content';
import type { SampleQuestionSet } from '@/lib/content/guides';

/**
 * Worked sample questions in a guide, rendered on the server.
 *
 * Each answer sits in a native <details> element: closed by default so a
 * reader can try the question first, operable with the keyboard and by
 * screen readers without any script, and present in the HTML for anyone who
 * reads the page without opening it. The labels use the article's language
 * (English for every guide today), not the interface's, because they sit
 * inside the article.
 */
export async function SampleQuestions({ set, lang = 'en' }: { set: SampleQuestionSet; lang?: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'guides.samples' });
  let number = 0;
  const numbered = set.sections.map((section) => ({
    ...section,
    questions: section.questions.map((question) => ({ ...question, number: (number += 1) })),
  }));

  return (
    <>
      <nav aria-labelledby="sample-contents" className="my-8 rounded-card border border-line bg-surface p-5">
        <h2 id="sample-contents" className="font-heading text-lg font-semibold">
          {t('contents')}
        </h2>
        <ol className="mt-3 space-y-3 text-sm">
          {numbered.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="font-semibold">
                {section.heading}
              </a>
              <ol className="mt-1 space-y-1 ps-4">
                {section.questions.map((question) => (
                  <li key={question.id}>
                    <a href={`#${question.id}`}>
                      {t('question', { number: question.number })}: {question.title}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </nav>

      {numbered.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-12">
          <h2 id={section.id} className="scroll-mt-24 font-heading text-2xl font-semibold">
            {section.heading}
          </h2>
          <Markdown source={section.introMd} className="prose-academic mt-3 font-serif" />

          {section.questions.map((question) => {
            const key = question.options.find((option) => option.id === question.answer);
            const wrong = question.options.filter((option) => option.id !== question.answer);
            return (
              <div key={question.id} className="mt-8 rounded-card border border-line bg-surface p-5 sm:p-6">
                <h3 id={question.id} className="scroll-mt-24 font-heading text-xl font-semibold">
                  {t('question', { number: question.number })}: {question.title}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{t('topic', { topic: question.topic })}</p>

                {question.stimulusMd ? (
                  <Markdown source={question.stimulusMd} className="prose-academic mt-4 overflow-x-auto font-serif" />
                ) : null}
                <Markdown source={question.stemMd} className="prose-academic mt-4 font-serif" />

                <ol aria-label={t('options', { number: question.number })} className="mt-4 space-y-2 font-serif">
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
                  <summary className="cursor-pointer px-4 py-3 font-semibold text-accent">{t('show')}</summary>
                  <div className="border-t border-line px-4 pb-4">
                    <p className="mt-3 font-semibold">
                      {t('answer', { option: question.answer })}{' '}
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
                    <h4 className="mt-4 font-heading font-semibold">{t('lesson')}</h4>
                    <p className="mt-1 font-serif">
                      <InlineMarkdown source={question.lesson} />
                    </p>
                  </div>
                </details>
              </div>
            );
          })}
        </section>
      ))}

      <Markdown source={set.afterMd} className="prose-academic mt-12 font-serif" />
    </>
  );
}
