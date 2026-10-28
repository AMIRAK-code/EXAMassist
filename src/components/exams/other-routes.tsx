import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { HubRoute } from '@/lib/exams/registry';
import { getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { Badge, Card } from '@/components/ui';

/**
 * "Other ways to apply": admission routes into the same institution that a
 * different test serves, from a hub's `otherRoutes`. Each route links to the
 * hub of the config that serves it, when there is one.
 *
 * The interface strings live in the `exams` catalogue (`otherRoutes.*`,
 * `audience.*`); each route's programme and note are the institution's
 * published facts and stay as written.
 */

export function OtherRoutes({
  routes,
  institution,
  headingId = 'other-routes',
}: {
  routes: readonly HubRoute[];
  institution: string;
  headingId?: string;
}) {
  const t = useTranslations('exams');
  if (routes.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mb-12">
      <h2 id={headingId} className="mb-2 font-heading text-2xl font-semibold">
        {t('otherRoutes.heading')}
      </h2>
      <p className="mb-4 max-w-2xl text-ink-muted">{t('otherRoutes.lead', { institution })}</p>
      <ul className="grid gap-3 sm:grid-cols-2" aria-label={t('otherRoutes.listLabel', { institution })}>
        {routes.map((route) => {
          const config = route.configKey ? getExamConfig(route.configKey) : undefined;
          const hub = route.configKey ? getHubForConfig(route.configKey) : undefined;
          return (
            <Card as="li" key={`${route.programme}-${route.configKey ?? 'none'}`} className="flex flex-col">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <h3 className="min-w-0 font-heading text-lg font-semibold">
                  {config ? config.shortName : t('otherRoutes.noTest')}
                </h3>
                <Badge tone="neutral">{t(`audience.${route.audience}`)}</Badge>
              </div>
              <p className="eyebrow mt-1">{route.programme}</p>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{route.note}</p>
              {hub ? (
                <p className="mt-3 text-sm">
                  <Link href={`/exams/${hub.slug}`}>{t('otherRoutes.linkTo', { name: hub.name })}</Link>
                </p>
              ) : null}
            </Card>
          );
        })}
      </ul>
    </section>
  );
}
