import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { EXAM_HUBS, getConfigsForHub, getHub } from '@/lib/exams/registry';
import type { SectionConfig } from '@/lib/assessment/types';
import { blueprintAvailability, examCoverage } from '@/lib/attempts/availability';
import { SITE, absoluteUrl, shareImages, siteUrl } from '@/lib/site';
import {
  Alert,
  Breadcrumbs,
  ButtonLink,
  Card,
  Container,
  DefinitionList,
  FidelityBadge,
  PageHeader,
  StatusBadge,
} from '@/components/ui';
import { OtherRoutes } from '@/components/exams/other-routes';
import { JsonLd, articleSchema, breadcrumbSchema, webPageSchema } from '@/components/seo/json-ld';
import { headers } from 'next/headers';
import { countPageView } from '@/lib/analytics/funnel';
import { getCurrentUser } from '@/lib/auth/session';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { BOCCONI_HUB_SLUG, bocconiLandingData } from '@/lib/exams/bocconi-landing';
import { BOCCONI_FACTS_CHECKED_ON } from '@/lib/exams/bocconi-facts';
import { BocconiLanding } from '@/components/exams/bocconi-landing';

export const dynamic = 'force-dynamic';

/** Every user-facing string on this page, in one place for translation. */
const copy = {
  fallbackTitle: 'Exam',
  title: (hubName: string) => `${hubName}: format, timing and scoring`,
  breadcrumbHome: 'Home',
  breadcrumbExams: 'Exams',
  term: {
    version: 'Version covered',
    cycle: 'Admissions cycle',
    verifiedOn: 'Verified on',
    scoring: 'Scoring',
    wrongAnswers: 'Wrong answers',
  },
  scoringFallback: 'See the format guide',
  penalised: (points: number, omitted: number) =>
    `Penalised (${points} per wrong answer); a blank scores ${omitted}`,
  noPenalty: 'No penalty — never leave a question blank',
  structureHeading: 'Structure',
  structureRegion: (configName: string) => `Structure of the ${configName}`,
  structureCaption: (configName: string, publisher: string) =>
    `Sections of the ${configName}, with question counts, time limits and calculator policy as published by ${publisher}.`,
  column: { section: 'Section', questions: 'Questions', time: 'Time', calculator: 'Calculator' },
  notPublished: 'Not published',
  minutes: (value: number) => `${value} min`,
  calculator: {
    none: 'Not permitted',
    onscreen: 'On-screen only',
    onscreen_and_personal: 'On-screen and approved personal',
    personal_only: 'Approved personal only',
    not_applicable: '—',
    unverified: 'Not verified',
  } satisfies Record<SectionConfig['calculator'], string>,
  formatGuideLink: 'Read the full format and scoring guide, with every source →',
  practiseHeading: 'Practise this exam',
  coverage: (items: number, covered: number, total: number) =>
    `${items} reviewed questions across ${covered} of ${total} topics. The questions are original and AI-assisted; each was solved blind by a separate AI reviewer before publication.`,
  howChecked: 'How questions are checked',
  noFormatsTitle: 'No practice formats are open yet for this exam',
  noFormatsBody:
    'The question bank is still too small to fill any format without repeating a question. The guide above is complete and sourced in the meantime.',
  notOpenHeading: 'Not open yet',
  rulesNotVerified: 'the rules it needs are not verified',
  needsMore: (shortfall: number) => `needs ${shortfall} more reviewed question${shortfall === 1 ? '' : 's'}`,
  whyOpen: 'Why each format is or is not open',
  everyFormat: 'Every exam’s formats',
  practiseVariant: (shortName: string) => `Practise ${shortName}`,
  startPractising: 'Start practising',
  formatGuideButton: 'Format and scoring guide',
  noSimulationTitle: 'Why there is no full-length simulation',
} as const;

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
  if (!hub) return { title: copy.fallbackTitle };
  if (hub.slug === BOCCONI_HUB_SLUG) return bocconiMetadata();

  const title = copy.title(hub.name);
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
      images: shareImages(`exam-${hub.slug}`, title),
    },
  };
}

/**
 * The Bocconi page is the site's page for Bocconi test preparation, so its
 * title and description say that, with the live question count.
 */
async function bocconiMetadata(): Promise<Metadata> {
  const counts = (await Promise.all(getConfigsForHub(BOCCONI_HUB_SLUG).map((c) => examCoverage(getDb(), c)))).reduce(
    (sum, c) => sum + c.publishedItems,
    0,
  );
  const title = BOCCONI_TITLE;
  const description = `Prepare for the Bocconi Online Test, undergraduate or Law, with ${counts} original practice questions, worked explanations, timed 50-question sets and a free test. Independent of Bocconi.`;
  const url = absoluteUrl(`/exams/${BOCCONI_HUB_SLUG}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${title} | ${SITE.shortName}`,
      description,
      type: 'website',
      images: shareImages(`exam-${BOCCONI_HUB_SLUG}`, title),
    },
  };
}

const BOCCONI_TITLE = 'Bocconi Test Preparation: Practice Questions and a Free Test';

function minutes(value: number | null): string {
  return value === null ? copy.notPublished : copy.minutes(value);
}

export default async function ExamHubPage({ params }: { params: Promise<{ hub: string }> }) {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) notFound();

  const db = getDb();
  const configs = getConfigsForHub(slug);
  const trail = [
    { href: '/', label: copy.breadcrumbHome },
    { href: '/exams', label: copy.breadcrumbExams },
    { label: hub.name },
  ];
  // A daily total of views, by coarse source; nothing about the visitor is kept.
  await countPageView(db, 'landing_view', hub.slug, await headers());

  if (hub.slug === BOCCONI_HUB_SLUG) {
    const user = await getCurrentUser();
    const entitlements = await loadEntitlements(db, user?.id ?? null);
    const fullAccess = entitlements.can('practice', 'bocconi-undergraduate') && entitlements.can('practice', 'bocconi-law');
    const data = await bocconiLandingData(db);
    const url = absoluteUrl(`/exams/${hub.slug}`);
    return (
      <Container>
        <JsonLd
          data={[
            breadcrumbSchema(siteUrl(), trail),
            webPageSchema({
              siteUrl: siteUrl(),
              url,
              name: BOCCONI_TITLE,
              description: `Independent preparation for the Bocconi Online Test and the Bocconi Law test: ${data.totalQuestions} original practice questions with worked explanations, results by area, timed sets and a free test.`,
              // The date the Bocconi facts on the page were last checked against Bocconi's own pages.
              dateModified: BOCCONI_FACTS_CHECKED_ON,
              about: 'Bocconi Online Test',
            }),
          ]}
        />
        <Breadcrumbs trail={trail} />
        <BocconiLanding data={data} hasFullAccess={fullAccess} billingOn={entitlements.enforced} />
      </Container>
    );
  }

  const verifiedOn = configs[0]?.verifiedOn ?? '';

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: absoluteUrl(`/exams/${hub.slug}`),
            headline: copy.title(hub.name),
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

      {/*
        No lead: the tagline repeated the summary below it, and gained a line
        when the interface font arrived, pushing the page down (0.0199 in the
        worst case, docs/REDESIGN.md §18). It stays the page's description, and
        the format guide's "In short".
      */}
      <PageHeader eyebrow={hub.publisher} title={hub.name} />

      {/* The direct answer, first: what this exam is, in one block. */}
      {(await Promise.all(configs.map(async (config) => {
        const coverage = (await examCoverage(db, config));
        const availability = (await blueprintAvailability(db, config));
        const offered = availability.filter((a) => a.available);
        const unavailable = availability.filter((a) => !a.available);

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

            {/*
              From 768 px the summary and its details sit side by side, so the
              summary reflowing on a font swap has nothing beneath it in view.
            */}
            <Card className="mb-6 md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-x-6">
              <p className="text-ink">{config.summary}</p>
              <div className="mt-4 md:mt-0">
                <DefinitionList
                  items={[
                    { term: copy.term.version, value: config.versionLabel },
                    { term: copy.term.cycle, value: config.admissionsCycle },
                    {
                      term: copy.term.verifiedOn,
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
                      term: copy.term.scoring,
                      value: config.scoring.officialScale
                        ? `${config.scoring.officialScale.label}, ${config.scoring.officialScale.min}–${config.scoring.officialScale.max}`
                        : copy.scoringFallback,
                    },
                    {
                      term: copy.term.wrongAnswers,
                      value:
                        config.scoring.pointsIncorrect < 0
                          ? copy.penalised(config.scoring.pointsIncorrect, config.scoring.pointsOmitted)
                          : copy.noPenalty,
                    },
                  ]}
                />
              </div>
            </Card>

            {/* Structure table */}
            <h3 className="mb-3 font-heading text-xl font-semibold">{copy.structureHeading}</h3>
            {/* Focusable, so the table can be scrolled sideways from the keyboard on a narrow screen. */}
            <div
              role="region"
              aria-label={copy.structureRegion(config.name)}
              tabIndex={0}
              className="mb-6 relative overflow-x-auto rounded-card border border-line bg-surface"
            >
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">{copy.structureCaption(config.name, config.publisher)}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {copy.column.section}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {copy.column.questions}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {copy.column.time}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {copy.column.calculator}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.sections.map((section) => (
                    <tr key={section.key} className="border-b border-line last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        {section.name}
                      </th>
                      <td className="px-4 py-3">{section.officialQuestionCount ?? copy.notPublished}</td>
                      <td className="px-4 py-3 tabular-nums">{minutes(section.officialTimeMinutes)}</td>
                      <td className="px-4 py-3">{copy.calculator[section.calculator]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mb-8">
              <Link href={`/exams/${hub.slug}/format`}>{copy.formatGuideLink}</Link>
            </p>

            {/* Practice */}
            <h3 className="mb-3 font-heading text-xl font-semibold">{copy.practiseHeading}</h3>
            <p className="mb-4 text-ink-muted">
              {copy.coverage(coverage.publishedItems, coverage.domainsCovered, coverage.domainsTotal)}{' '}
              <Link href="/about/editorial-standards">{copy.howChecked}</Link>
            </p>

            {offered.length === 0 ? (
              <Alert tone="caution" title={copy.noFormatsTitle}>
                {copy.noFormatsBody}
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

            {offered.length > 0 && unavailable.length > 0 ? (
              <div className="mt-4 rounded-card border border-line bg-surface-sunken p-4">
                <h4 className="text-sm font-semibold">{copy.notOpenHeading}</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {unavailable.map((entry) => (
                    <li key={entry.blueprint.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <StatusBadge status={entry.blockedBy === 'rules' ? 'notoffered' : 'notyet'} />
                      <span className="font-medium">{entry.blueprint.label}</span>
                      <span className="text-ink-muted">
                        {entry.blockedBy === 'rules' ? copy.rulesNotVerified : copy.needsMore(entry.shortfall)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">
                  <Link href={`/practice/${config.examKey}`}>{copy.whyOpen}</Link>
                  {' · '}
                  <Link href="/exams#formats">{copy.everyFormat}</Link>
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={`/practice/${config.examKey}`}>
                {configs.length > 1 ? copy.practiseVariant(config.shortName) : copy.startPractising}
              </ButtonLink>
              <ButtonLink href={`/exams/${hub.slug}/format`} variant="secondary">
                {copy.formatGuideButton}
              </ButtonLink>
            </div>

            {/* What is not simulated */}
            {!config.capabilities.fullSimulation.available ? (
              <Alert tone="info" title={copy.noSimulationTitle} className="mt-6">
                {(config.capabilities.fullSimulation as { reason: string }).reason}
              </Alert>
            ) : null}
          </section>
        );
      })))}

      {/* Routes into the same institution that another hub's test serves. */}
      <OtherRoutes routes={hub.otherRoutes ?? []} institution={hub.publisher} />
    </Container>
  );
}
