import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Suggestion } from '@/lib/learning/suggestions';
import { renderText } from '@/lib/learning/text';
import { startSuggestionAction } from '@/app/actions/planning';
import { Badge, Button, Card, SectionHeading, buttonClass } from '@/components/ui';

/**
 * Suggestions, apart from the evidence and labelled as such. Each says why,
 * which kind of practice it is, and starts exactly that.
 */

export function SuggestionsList({ examKey, suggestions, planHref }: { examKey: string; suggestions: Suggestion[]; planHref: string }) {
  const t = useTranslations('learning');
  return (
    <section aria-labelledby="suggestions-heading">
      <SectionHeading
        id="suggestions-heading"
        title={t('suggestionsList.title')}
        description={t('suggestionsList.description')}
      />
      {suggestions.length === 0 ? (
        <p className="text-sm text-ink-muted">{t('suggestionsList.none')}</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card as="li" key={suggestion.key}>
              <h3 className="font-heading text-lg font-semibold">{renderText(t, suggestion.title)}</h3>
              <div className="mt-2">
                <Badge tone={suggestion.kind === 'new' ? 'accent' : 'neutral'}>{t(`kind.${suggestion.kind}`)}</Badge>
              </div>
              <div className="mt-3">
                {suggestion.start.type === 'link' ? (
                  <Link href={suggestion.start.href} className={buttonClass({ variant: 'secondary', size: 'sm' })}>
                    {renderText(t, suggestion.start.label)}
                  </Link>
                ) : (
                  <form action={startSuggestionAction}>
                    <input type="hidden" name="examKey" value={examKey} />
                    <input type="hidden" name="kind" value={suggestion.start.type === 'review' ? 'review' : suggestion.kind} />
                    {suggestion.start.type === 'practice' && suggestion.start.domainSlug ? (
                      <input type="hidden" name="domain" value={suggestion.start.domainSlug} />
                    ) : null}
                    <input type="hidden" name="length" value={suggestion.start.length} />
                    <Button type="submit" size="sm" variant="secondary">
                      {t('suggestionsList.start', { count: suggestion.start.length })}
                    </Button>
                  </form>
                )}
              </div>
              <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">
                {t('why', { reason: renderText(t, suggestion.why) })}
              </p>
            </Card>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm">
        <Link href={planHref}>{t('suggestionsList.planLink')}</Link>
      </p>
    </section>
  );
}
