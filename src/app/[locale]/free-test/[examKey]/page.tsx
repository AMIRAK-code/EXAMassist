import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { examTestName, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { freeTestFor, freeTestPreview } from '@/lib/attempts/service';
import { freeTestPath, pricingPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { SubmitButton } from '@/components/submit-button';
import { startFreeTestAction } from './actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; examKey: string }>;
}): Promise<Metadata> {
  const { locale, examKey } = await params;
  const t = await getTranslations({ locale, namespace: 'practice.freeTest' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
    alternates: languageAlternates(`/free-test/${examKey}`, locale as Locale),
  };
}

/** Notices the start action can send back here (see ./actions.ts). */
const NOTICES = new Set(['rate-limited', 'insufficient-content']);

/**
 * The free diagnostic for one exam: the same fixed questions for every
 * account, one per exam. Visitors and guests are asked to create an account
 * first (DIAGNOSTIC_NEEDS_ACCOUNT in src/lib/billing/plans.ts).
 */
export default async function FreeTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; examKey: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { locale, examKey } = await params;
  const { notice } = await searchParams;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const user = await getCurrentUser();
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  // Nothing to choose between when everything is open to this learner.
  if (entitlements.can('practice', config.examKey)) redirect({ href: `/practice/${config.examKey}`, locale });

  const t = await getTranslations('practice');
  const copy = (key: string, values?: Record<string, string | number>) => t(`freeTest.${key}`, values);

  const hub = getHubForConfig(config.examKey);
  const preview = await freeTestPreview(db, config.examKey);
  const here = freeTestPath(config.examKey);
  const plans = pricingPath(config.examKey);
  const mayTake = entitlements.can('diagnostic', config.examKey);
  const taken = user && mayTake ? await freeTestFor(db, user.id, config.examKey) : null;

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('crumbs.home') },
          { href: '/exams', label: t('crumbs.exams') },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: t('crumbs.freeDiagnostic') },
        ]}
      />
      <PageHeader
        eyebrow={config.publisher}
        title={copy('title', { exam: examTestName(config) })}
        lead={
          preview
            ? preview.minutes
              ? copy('leadTimed', { questions: preview.questions, sections: preview.sections, minutes: preview.minutes })
              : copy('leadUntimed', { questions: preview.questions, sections: preview.sections })
            : undefined
        }
      />

      {notice && NOTICES.has(notice) ? (
        <Alert tone="caution" className="mb-6" role="alert">
          <p>{copy(`notices.${notice}`)}</p>
        </Alert>
      ) : null}

      {!mayTake ? (
        <Card padding="lg">
          <h2 className="font-heading text-xl font-semibold">{copy('account.title')}</h2>
          <p className="mt-2 text-ink-muted">{copy('account.body')}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={`/sign-up?next=${encodeURIComponent(here)}`}>{copy('account.signUp')}</ButtonLink>
            <ButtonLink href={`/sign-in?next=${encodeURIComponent(here)}`} variant="secondary">
              {copy('account.signIn')}
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm">
            <Link href={hub ? `/?exam=${encodeURIComponent(hub.slug)}#top` : '/#top'}>{copy('account.sample')}</Link>
          </p>
        </Card>
      ) : taken ? (
        <Card padding="lg">
          {taken.status === 'in_progress' ? (
            <>
              <h2 className="font-heading text-xl font-semibold">{copy('waiting.title')}</h2>
              <p className="mt-2 text-ink-muted">{copy('waiting.body')}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={`/attempt/${taken.id}`}>{copy('waiting.action')}</ButtonLink>
                <ButtonLink href={plans} variant="secondary">
                  {copy('plans')}
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-heading text-xl font-semibold">{copy('taken.title')}</h2>
              <p className="mt-2 text-ink-muted">{copy('taken.body')}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={plans}>{copy('plans')}</ButtonLink>
                <ButtonLink href={`/attempt/${taken.id}/results`} variant="secondary">
                  {copy('taken.results')}
                </ButtonLink>
              </div>
            </>
          )}
        </Card>
      ) : preview ? (
        <Card padding="lg">
          <h2 className="font-heading text-xl font-semibold">{preview.blueprint.label}</h2>
          <ul className="mt-3 list-disc space-y-1.5 ps-5 text-ink-muted">
            <li>{copy('preview.sameForEveryone')}</li>
            <li>
              {preview.minutes
                ? copy(
                    `preview.${preview.blueprint.timing === 'per_part' ? 'perPart' : 'overall'}${preview.blueprint.pauseBehaviour === 'clock_pauses' ? 'Pauses' : ''}`,
                  )
                : copy('preview.untimed')}
            </li>
            <li>{copy('preview.results')}</li>
          </ul>
          <form action={startFreeTestAction} className="mt-6">
            <input type="hidden" name="examKey" value={config.examKey} />
            <SubmitButton pendingLabel={copy('preview.starting')}>{copy('preview.start')}</SubmitButton>
          </form>
        </Card>
      ) : (
        <Alert tone="caution" title={copy('notReady.title')}>
          <p>{copy('notReady.body', { exam: config.shortName })}</p>
          {hub ? (
            <p className="mt-2">
              <Link href={`/exams/${hub.slug}/format`}>{copy('notReady.guide')}</Link>
            </p>
          ) : null}
        </Alert>
      )}

      <p className="mt-8 text-sm text-ink-muted">
        {t.rich('freeTest.footer', { link: (chunks) => <Link href={plans}>{chunks}</Link> })}
      </p>
    </Container>
  );
}
