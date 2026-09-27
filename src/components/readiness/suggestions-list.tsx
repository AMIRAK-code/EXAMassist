import Link from 'next/link';
import type { Suggestion } from '@/lib/learning/suggestions';
import { startSuggestionAction } from '@/app/actions/planning';
import { Badge, Button, Card, SectionHeading, buttonClass } from '@/components/ui';

/**
 * Suggestions, apart from the evidence and labelled as such. Each says why,
 * which kind of practice it is, and starts exactly that.
 */

const KIND_LABEL: Record<Suggestion['kind'], string> = {
  new: 'New questions only',
  revision: 'Revision: may repeat questions',
  review: 'Review: repeats missed questions',
  timed: 'Timed',
};

export function SuggestionsList({ examKey, suggestions, planHref }: { examKey: string; suggestions: Suggestion[]; planHref: string }) {
  return (
    <section aria-labelledby="suggestions-heading">
      <SectionHeading
        id="suggestions-heading"
        title="Suggestions"
        description="What might help next, from the questions available now. These are suggestions, not measurements."
      />
      {suggestions.length === 0 ? (
        <p className="text-sm text-ink-muted">Nothing to suggest right now beyond the sessions in your plan.</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card as="li" key={suggestion.key}>
              <h3 className="font-heading text-lg font-semibold">{suggestion.title}</h3>
              <div className="mt-2">
                <Badge tone={suggestion.kind === 'new' ? 'accent' : 'neutral'}>{KIND_LABEL[suggestion.kind]}</Badge>
              </div>
              <div className="mt-3">
                {suggestion.start.type === 'link' ? (
                  <Link href={suggestion.start.href} className={buttonClass({ variant: 'secondary', size: 'sm' })}>
                    {suggestion.start.label}
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
                      Start {suggestion.start.length} question{suggestion.start.length === 1 ? '' : 's'}
                    </Button>
                  </form>
                )}
              </div>
              <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">Why: {suggestion.why}</p>
            </Card>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm">
        <Link href={planHref}>Your dated plan</Link>
      </p>
    </section>
  );
}
