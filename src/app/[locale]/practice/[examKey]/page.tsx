import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Link, redirect } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getBlueprint, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { blueprintAvailability, facetsFromPool, practiceFacets } from '@/lib/attempts/availability';
import { getPool } from '@/lib/content/repository';
import { eligibleCount } from '@/lib/attempts/facets';
import { getCurrentUser } from '@/lib/auth/session';
import { StartPracticeForm, type PresetSkill } from '@/components/practice/start-practice-form';
import { getFormatter, getTranslations } from 'next-intl/server';
import { StartBlueprintButton } from '@/components/practice/start-blueprint-button';
import { pricingPath, startPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { featureForSession } from '@/lib/billing/plans';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Card,
  Container,
  FidelityBadge,
  PageHeader,
  StatusBadge,
} from '@/components/ui';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return EXAM_CONFIGS.map((config) => ({ examKey: config.examKey }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; examKey: string }>;
}): Promise<Metadata> {
  const { locale, examKey } = await params;
  const t = await getTranslations({ locale, namespace: 'practice.setup' });
  const config = getExamConfig(examKey);
  if (!config) return { title: t('metaFallbackTitle') };
  return {
    title: t('metaTitle', { exam: config.shortName }),
    description: t('metaDescription', { exam: config.name }),
    // Practice setup is a functional page, not editorial content.
    robots: { index: false, follow: true },
    alternates: languageAlternates(`/practice/${config.examKey}`, locale as Locale),
  };
}

export default async function PracticeSetupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; examKey: string }>;
  searchParams: Promise<{ domain?: string; skill?: string }>;
}) {
  const { locale, examKey } = await params;
  const query = await searchParams;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const facets = (await practiceFacets(db, config));
  const availability = (await blueprintAvailability(db, config));
  const hub = getHubForConfig(config.examKey);
  const user = await getCurrentUser();
  // Practice needs a plan that covers this exam (src/lib/billing). Without
  // one, the exam's short introduction offers the plans and the free
  // diagnostic instead.
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  if (!entitlements.can('practice', config.examKey)) redirect({ href: startPath(config.examKey), locale });

  const t = await getTranslations('practice');
  const format = await getFormatter();
  const formatMinutes = (seconds: number | null) =>
    seconds === null ? t('setup.untimed') : format.number(Math.round(seconds / 60), { style: 'unit', unit: 'minute', unitDisplay: 'short' });

  const others = availability.filter((a) => a.blueprint.id !== 'practice');
  const totalItems = eligibleCount(facets, {});

  // The questions this learner has never been shown, counted by the rule
  // session creation enforces for "new questions only". Offered only once
  // some have been shown: before that, every question is new.
  const practiceBlueprint = getBlueprint(config, 'practice');
  const unseenFacets =
    user && practiceBlueprint
      ? facetsFromPool((await getPool(db, config.examKey, user.id)).filter((item) => item.lastSeenAt === null), config, practiceBlueprint)
      : null;
  const offerUnseen = unseenFacets && eligibleCount(unseenFacets, {}) < totalItems ? unseenFacets : null;
  const domainChoices = config.domains.map((domain) => ({
    slug: domain.slug,
    name: domain.name,
    skills: domain.skills.map((skill) => ({ slug: skill.slug, name: skill.name })),
  }));

  // Links carry ?skill= or ?domain=. Accept only this exam's own taxonomy. An
  // older study-plan link passed a topic as ?skill=; it names the same thing,
  // so it is read as the topic it is.
  let presetSkill: PresetSkill | null = null;
  let presetDomain: string | null = null;
  let ignoredFilter: string | null = null;
  if (query.skill) {
    const owner = config.domains.find((domain) => domain.skills.some((skill) => skill.slug === query.skill));
    const skill = owner?.skills.find((s) => s.slug === query.skill);
    if (owner && skill) {
      presetSkill = { slug: skill.slug, name: skill.name, domainSlug: owner.slug, domainName: owner.name };
    } else if (config.domains.some((domain) => domain.slug === query.skill)) {
      presetDomain = query.skill;
    } else {
      ignoredFilter = query.skill;
    }
  }
  if (!presetSkill && !presetDomain && query.domain) {
    if (config.domains.some((domain) => domain.slug === query.domain)) presetDomain = query.domain;
    else ignoredFilter = query.domain;
  }

  return (
    <Container>
      <Breadcrumbs
        trail={[
          { href: '/', label: t('crumbs.home') },
          { href: '/exams', label: t('crumbs.exams') },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: t('crumbs.practise') },
        ]}
      />

      {/*
        A short lead, so the choices are on the first screen. The exam's full
        summary is at the end of the main column, after the formats. The
        summary used to be the lead; when the web font arrived it rewrapped
        and pushed everything below it (docs/REDESIGN.md §14).
      */}
      <PageHeader
        eyebrow={config.publisher}
        title={t('setup.title', { exam: config.name })}
        lead={t('setup.lead')}
      />


      {totalItems === 0 ? (
        <Alert tone="caution" title={t('setup.empty.title')}>
          <p>{t('setup.empty.body')}</p>
          {hub ? (
            <p className="mt-2">
              {t.rich('setup.empty.guide', {
                link: (chunks) => <Link href={`/exams/${hub.slug}/format`}>{chunks}</Link>,
              })}
            </p>
          ) : null}
        </Alert>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Card>
              <h2 className="text-xl">{t('setup.topic.title')}</h2>
              <p className="mt-1 text-sm text-ink-muted">{t('setup.topic.body')}</p>
              {ignoredFilter ? (
                <Alert tone="caution" className="mt-4">
                  {t('setup.topic.ignoredFilter', { exam: config.shortName })}
                </Alert>
              ) : null}
              <div className="mt-5">
                <StartPracticeForm
                  examKey={config.examKey}
                  examLabel={hub?.label ?? config.shortName}
                  blueprintId="practice"
                  facets={facets}
                  domains={domainChoices}
                  presetDomain={presetDomain}
                  presetSkill={presetSkill}
                  unseenFacets={offerUnseen}
                  guestNote={user && !user.isGuest ? null : (await getTranslations('common.guest'))('noteShort')}
                />
              </div>
            </Card>

            <h2 className="mb-4 mt-10 font-heading text-xl font-semibold">{t('setup.otherFormats')}</h2>
            <ul className="space-y-4">
              {others.map((entry) => (
                <Card as="li" key={entry.blueprint.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading text-lg font-semibold">{entry.blueprint.label}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{entry.blueprint.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <FidelityBadge fidelity={entry.blueprint.fidelity} />
                        <Badge tone="neutral">
                          {t('setup.questionCount', { count: entry.blueprint.parts.reduce((n, p) => n + p.itemCount, 0) })}
                        </Badge>
                        <Badge tone="neutral">
                          {entry.blueprint.timing === 'untimed'
                            ? t('setup.untimed')
                            : formatMinutes(
                                entry.blueprint.overallTimeLimitSeconds ??
                                  entry.blueprint.parts.reduce(
                                    (n, p) => n + (p.timeLimitSeconds ?? 0),
                                    0,
                                  ),
                              )}
                        </Badge>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {entry.available && !entitlements.can(featureForSession(entry.blueprint), config.examKey) ? (
                        <Link href={pricingPath(config.examKey, featureForSession(entry.blueprint))} className="text-sm font-semibold">
                          {t('setup.upgrade')}
                        </Link>
                      ) : entry.available ? (
                        <StartBlueprintButton
                          examKey={config.examKey}
                          blueprintId={entry.blueprint.id}
                          label={t('setup.start')}
                        />
                      ) : (
                        <StatusBadge status={entry.blockedBy === 'rules' ? 'notoffered' : 'notyet'} />
                      )}
                    </div>
                  </div>

                  {!entry.available && entry.reason ? (
                    <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">
                      <span className="font-medium">
                        {entry.blockedBy === 'rules' ? t('setup.whyNotOffered') : t('setup.notEnoughYet')}
                      </span>{' '}
                      {/* The rules reason is the research record's own wording; the content one is ours. */}
                      {entry.reason.kind === 'content'
                        ? t('setup.contentShortfall', { requested: entry.reason.requested, available: entry.reason.available })
                        : entry.reason.text}
                    </p>
                  ) : null}
                </Card>
              ))}
            </ul>

            <section aria-labelledby="about-exam-heading" className="mt-10">
              <h2 id="about-exam-heading" className="font-heading text-xl font-semibold">
                {t('setup.about.title')}
              </h2>
              <p className="mt-2 text-ink-muted">{config.summary}</p>
              {hub ? (
                <p className="mt-3">
                  <Link href={`/exams/${hub.slug}/format`}>{t('setup.about.formatLink')}</Link>
                </p>
              ) : null}
            </section>
          </div>

          {/*
            Links sit on lines of their own and counts are one text run: a link
            at the end of a wrapped sentence jumped to the next line when the
            web font arrived, the largest single move on this page.
          */}
          <aside className="space-y-5">
            <Card>
              <h2 className="font-heading text-lg font-semibold">{t('setup.bank.title')}</h2>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{format.number(totalItems)}</p>
              <p className="text-sm text-ink-muted">
                {t('setup.bank.coverage', {
                  count: totalItems,
                  covered: config.domains.filter((d) => eligibleCount(facets, { domain: d.slug }) > 0).length,
                  total: config.domains.length,
                })}
              </p>
              <p className="mt-3 text-sm text-ink-muted">{t('setup.bank.note')}</p>
              <p className="mt-2 text-sm">
                <Link href="/about/editorial-standards">{t('setup.bank.howChecked')}</Link>
              </p>
            </Card>

            {config.unverified.length > 0 ? (
              <Card>
                <h2 className="font-heading text-lg font-semibold">{t('setup.unverified.title')}</h2>
                <ul className="mt-2 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
                  {config.unverified.slice(0, 3).map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
                {hub ? (
                  <p className="mt-3 text-sm">
                    <Link href={`/exams/${hub.slug}/format`}>{t('setup.unverified.allSources')}</Link>
                  </p>
                ) : null}
              </Card>
            ) : null}
          </aside>
        </div>
      )}
    </Container>
  );
}
