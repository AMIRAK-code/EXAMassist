import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { listHubs, requireExamConfig } from '@/lib/exams/registry';
import { examCoverage } from '@/lib/attempts/availability';
import { buildHomeData } from '@/lib/home/home-data';
import { FormatAvailabilityTable } from '@/components/exams/format-availability';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

const TITLE = 'Admission exams we cover';
const DESCRIPTION =
  'Format, timing, scoring and practice for the Bocconi Online Test, Digital SAT, Enhanced ACT, LSAT, GMAT and GRE, with undergraduate, law and graduate requirements kept separate.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/exams') },
  openGraph: { url: absoluteUrl('/exams'), title: `${TITLE} | ${SITE.shortName}`, description: DESCRIPTION },
};

const AUDIENCE_LABEL: Record<string, string> = {
  undergraduate: 'Undergraduate',
  law: 'Law',
  graduate: 'Graduate',
};

export default async function ExamsPage() {
  const db = getDb();
  const trail = [{ href: '/', label: 'Home' }, { label: 'Exams' }];

  const groups: Array<{ audience: string; label: string; blurb: string }> = [
    {
      audience: 'undergraduate',
      label: 'Undergraduate admission',
      blurb: 'Tests taken before a first degree, including the Bocconi bachelor route.',
    },
    {
      audience: 'law',
      label: 'Law admission',
      blurb: 'The LSAT for JD admission, and the Bocconi law variant, which is a different test from the bachelor form.',
    },
    {
      audience: 'graduate',
      label: 'Graduate and business admission',
      blurb: 'Tests taken after a first degree, for master’s and MBA programmes.',
    },
  ];

  const { matrix, asOf } = buildHomeData(db);

  const hubs = listHubs().map((hub) => {
    const configs = hub.configKeys.map(requireExamConfig);
    const coverage = configs.map((config) => examCoverage(db, config));
    return {
      hub,
      configs,
      items: coverage.reduce((total, c) => total + c.publishedItems, 0),
      domainsCovered: coverage.reduce((total, c) => total + c.domainsCovered, 0),
      domainsTotal: coverage.reduce((total, c) => total + c.domainsTotal, 0),
    };
  });

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), trail)} />
      <Breadcrumbs trail={trail} />

      <PageHeader
        title={TITLE}
        lead="Each guide records what the test maker actually publishes: sections, question counts, timing, navigation rules, calculator policy and scoring, with the source and the date we checked it."
      />

      {groups.map((group) => {
        const groupHubs = hubs.filter((entry) => entry.hub.audiences.includes(group.audience as never));
        if (groupHubs.length === 0) return null;

        return (
          <section key={group.audience} className="mb-12" aria-labelledby={`group-${group.audience}`}>
            <h2 id={`group-${group.audience}`} className="font-heading text-2xl font-semibold">
              {group.label}
            </h2>
            <p className="mt-1 max-w-2xl text-ink-muted">{group.blurb}</p>

            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {groupHubs.map(({ hub, configs, items, domainsCovered, domainsTotal }) => (
                <Card as="li" key={hub.slug} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-xl font-semibold">
                      <Link href={`/exams/${hub.slug}`} className="no-underline hover:underline">
                        {hub.name}
                      </Link>
                    </h3>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                      {hub.audiences.map((audience) => (
                        <Badge key={audience} tone="neutral">
                          {AUDIENCE_LABEL[audience]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">{hub.publisher}</p>
                  <p className="mt-3 flex-1 text-sm text-ink-muted">{hub.tagline}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                    <div>
                      <dt className="text-ink-muted">Reviewed questions</dt>
                      <dd className="font-medium tabular-nums">{items}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted">Topics covered</dt>
                      <dd className="font-medium tabular-nums">
                        {domainsCovered} / {domainsTotal}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ButtonLink href={`/exams/${hub.slug}`} size="sm">
                      Exam guide
                    </ButtonLink>
                    {configs.map((config) => (
                      <ButtonLink
                        key={config.examKey}
                        href={`/practice/${config.examKey}`}
                        size="sm"
                        variant="secondary"
                      >
                        {configs.length > 1 ? `Practise ${config.shortName}` : 'Practise'}
                      </ButtonLink>
                    ))}
                  </div>

                  {configs.some((c) => !c.capabilities.fullSimulation.available) ? (
                    <p className="mt-3 text-xs text-ink-subtle">
                      Full-length simulation not offered yet — see the guide for why.
                    </p>
                  ) : null}
                </Card>
              ))}
            </ul>
          </section>
        );
      })}

      <section id="formats" aria-labelledby="formats-heading" className="mb-12">
        <h2 id="formats-heading" className="font-heading text-2xl font-semibold">
          Formats and availability
        </h2>
        <p className="mt-1 max-w-2xl text-ink-muted">
          A format opens only when the exam’s rules are verified and the reviewed bank can fill it
          without repeating a question. These counts come from the live bank.
        </p>
        <FormatAvailabilityTable matrix={matrix} asOf={asOf} />
      </section>
    </Container>
  );
}
