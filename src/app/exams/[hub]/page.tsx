import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { EXAM_HUBS, getConfigsForHub, getHub } from '@/lib/exams/registry';
import { blueprintAvailability, examCoverage } from '@/lib/attempts/availability';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import {
  Alert,
  Badge,
  Breadcrumbs,
  ButtonLink,
  Card,
  Container,
  DefinitionList,
  FidelityBadge,
  PageHeader,
} from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return EXAM_HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string }>;
}): Promise<Metadata> {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) return { title: 'Exam' };

  const title = `${hub.name}: format, timing and scoring`;
  const description = hub.tagline;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/exams/${hub.slug}`) },
    openGraph: {
      url: absoluteUrl(`/exams/${hub.slug}`),
      title: `${title} | ${SITE.shortName}`,
      description,
      type: 'article',
    },
  };
}

function minutes(value: number | null): string {
  return value === null ? 'Not published' : `${value} min`;
}

export default async function ExamHubPage({ params }: { params: Promise<{ hub: string }> }) {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) notFound();

  const db = getDb();
  const configs = getConfigsForHub(slug);
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/exams', label: 'Exams' },
    { label: hub.name },
  ];

  const verifiedOn = configs[0]?.verifiedOn ?? '';

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: absoluteUrl(`/exams/${hub.slug}`),
            headline: `${hub.name}: format, timing and scoring`,
            description: hub.tagline,
            // Real dates only: this is the date the facts were verified.
            datePublished: verifiedOn,
            dateModified: verifiedOn,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <PageHeader eyebrow={hub.publisher} title={hub.name} lead={hub.tagline} />

      {/* The direct answer, first: what this exam is, in one block. */}
      {configs.map((config) => {
        const coverage = examCoverage(db, config);
        const availability = blueprintAvailability(db, config);
        const offered = availability.filter((a) => a.available);

        return (
          <section
            key={config.examKey}
            aria-labelledby={`config-${config.examKey}`}
            className="mb-12"
          >
            {configs.length > 1 ? (
              <h2 id={`config-${config.examKey}`} className="mb-3 font-heading text-2xl font-semibold">
                {config.name}
              </h2>
            ) : (
              <h2 id={`config-${config.examKey}`} className="sr-only">
                {config.name}
              </h2>
            )}

            <Card className="mb-6">
              <p className="text-ink">{config.summary}</p>
              <div className="mt-4">
                <DefinitionList
                  items={[
                    { term: 'Version covered', value: config.versionLabel },
                    { term: 'Admissions cycle', value: config.admissionsCycle },
                    {
                      term: 'Verified on',
                      value: (
                        <time dateTime={config.verifiedOn}>
                          {new Date(config.verifiedOn).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                      ),
                    },
                    {
                      term: 'Scoring',
                      value: config.scoring.officialScale
                        ? `${config.scoring.officialScale.label}, ${config.scoring.officialScale.min}–${config.scoring.officialScale.max}`
                        : 'See the format guide',
                    },
                    {
                      term: 'Wrong answers',
                      value:
                        config.scoring.pointsIncorrect < 0
                          ? `Penalised (${config.scoring.pointsIncorrect} per wrong answer); a blank scores ${config.scoring.pointsOmitted}`
                          : 'No penalty — never leave a question blank',
                    },
                  ]}
                />
              </div>
            </Card>

            {/* Structure table */}
            <h3 className="mb-3 font-heading text-xl font-semibold">Structure</h3>
            <div className="mb-6 relative overflow-x-auto rounded-card border border-line bg-surface">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Sections of the {config.name}, with question counts, time limits and calculator
                  policy as published by {config.publisher}.
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      Section
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      Questions
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      Time
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      Calculator
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.sections.map((section) => (
                    <tr key={section.key} className="border-b border-line last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        {section.name}
                      </th>
                      <td className="px-4 py-3">{section.officialQuestionCount ?? 'Not published'}</td>
                      <td className="px-4 py-3 tabular-nums">{minutes(section.officialTimeMinutes)}</td>
                      <td className="px-4 py-3">
                        {section.calculator === 'none'
                          ? 'Not permitted'
                          : section.calculator === 'onscreen'
                            ? 'On-screen only'
                            : section.calculator === 'onscreen_and_personal'
                              ? 'On-screen and approved personal'
                              : section.calculator === 'personal_only'
                                ? 'Approved personal only'
                                : section.calculator === 'not_applicable'
                                  ? '—'
                                  : 'Not verified'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mb-8">
              <Link href={`/exams/${hub.slug}/format`}>
                Read the full format and scoring guide, with every source →
              </Link>
            </p>

            {/* Practice */}
            <h3 className="mb-3 font-heading text-xl font-semibold">Practise this exam</h3>
            <p className="mb-4 text-ink-muted">
              {coverage.publishedItems} reviewed questions across {coverage.domainsCovered} of{' '}
              {coverage.domainsTotal} topics. The questions are original and AI-assisted; each was
              solved blind by a separate AI reviewer before publication.{' '}
              <Link href="/about/editorial-standards">How questions are checked</Link>
            </p>

            {offered.length === 0 ? (
              <Alert tone="caution" title="No practice formats are open yet for this exam">
                The question bank is still too small to fill any format without repeating a question.
                The guide above is complete and sourced in the meantime.
              </Alert>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {offered.map((entry) => (
                  <Card as="li" key={entry.blueprint.id}>
                    <h4 className="font-heading text-lg font-semibold">{entry.blueprint.label}</h4>
                    <p className="mt-1 text-sm text-ink-muted">{entry.blueprint.description}</p>
                    <div className="mt-3">
                      <FidelityBadge fidelity={entry.blueprint.fidelity} />
                    </div>
                  </Card>
                ))}
              </ul>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={`/practice/${config.examKey}`}>
                {configs.length > 1 ? `Practise ${config.shortName}` : 'Start practising'}
              </ButtonLink>
              <ButtonLink href={`/exams/${hub.slug}/format`} variant="secondary">
                Format and scoring guide
              </ButtonLink>
            </div>

            {/* What is not simulated */}
            {!config.capabilities.fullSimulation.available ? (
              <Alert tone="info" title="Why there is no full-length simulation" className="mt-6">
                {(config.capabilities.fullSimulation as { reason: string }).reason}
              </Alert>
            ) : null}
          </section>
        );
      })}
    </Container>
  );
}
