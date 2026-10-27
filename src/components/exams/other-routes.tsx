import { Link } from '@/i18n/navigation';
import type { Audience, HubRoute } from '@/lib/exams/registry';
import { getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { Badge, Card } from '@/components/ui';

/**
 * "Other ways to apply": admission routes into the same institution that a
 * different test serves, from a hub's `otherRoutes`. Each route links to the
 * hub of the config that serves it, when there is one.
 *
 * Every user-facing string is in `copy`, so the component can be translated
 * in one place.
 */

export const copy = {
  heading: 'Other ways to apply',
  lead: (institution: string) =>
    `${institution} also accepts the following for the same programmes. Each note gives only what ${institution} publishes, with the minimum it states where it states one.`,
  audience: {
    undergraduate: 'Undergraduate',
    law: 'Law',
    graduate: 'Graduate',
  } satisfies Record<Audience, string>,
  noTest: 'No test required',
  linkTo: (hubName: string) => `${hubName}: format, scoring and practice`,
  listLabel: (institution: string) => `Other admission routes into ${institution}`,
} as const;

export function OtherRoutes({
  routes,
  institution,
  headingId = 'other-routes',
}: {
  routes: readonly HubRoute[];
  institution: string;
  headingId?: string;
}) {
  if (routes.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mb-12">
      <h2 id={headingId} className="mb-2 font-heading text-2xl font-semibold">
        {copy.heading}
      </h2>
      <p className="mb-4 max-w-2xl text-ink-muted">{copy.lead(institution)}</p>
      <ul className="grid gap-3 sm:grid-cols-2" aria-label={copy.listLabel(institution)}>
        {routes.map((route) => {
          const config = route.configKey ? getExamConfig(route.configKey) : undefined;
          const hub = route.configKey ? getHubForConfig(route.configKey) : undefined;
          return (
            <Card as="li" key={`${route.programme}-${route.configKey ?? 'none'}`} className="flex flex-col">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <h3 className="min-w-0 font-heading text-lg font-semibold">
                  {config ? config.shortName : copy.noTest}
                </h3>
                <Badge tone="neutral">{copy.audience[route.audience]}</Badge>
              </div>
              <p className="eyebrow mt-1">{route.programme}</p>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{route.note}</p>
              {hub ? (
                <p className="mt-3 text-sm">
                  <Link href={`/exams/${hub.slug}`}>{copy.linkTo(hub.name)}</Link>
                </p>
              ) : null}
            </Card>
          );
        })}
      </ul>
    </section>
  );
}
