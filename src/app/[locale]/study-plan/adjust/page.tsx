import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getPathname, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { requireSignedIn } from '@/lib/auth/guards';
import { getExamConfig } from '@/lib/exams/registry';
import {
  activePlan,
  examDateFor,
  planAdjustment,
  recordCompletions,
  sessionLabel,
  type PlannedSession,
  type PlanSessionRow,
} from '@/lib/learning/plan';
import { formatDate, formatDay, parsePlanDate, parseWeeklyMinutes } from '@/lib/learning/plan-inputs';
import { renderText, type Msg } from '@/lib/learning/text';
import { applyAdjustmentAction } from '@/app/actions/planning';
import { Breadcrumbs, Button, ButtonLink, Card, Container, DefinitionList, PageHeader, Stat } from '@/components/ui';
import { PlanningNotice } from '@/components/planning/planning-views';
import { KindBadge, PlanInputsForm } from '@/components/planning/plan-parts';

/**
 * "Adjust my remaining plan": a preview of every change, applied only when
 * the learner says so, and only if it is still exactly this preview.
 *
 * Completed and skipped sessions are history and are not touched. Missed
 * ones are recorded as missed and their topics scheduled first. Future
 * sessions not yet started are replaced by a schedule from today, from the
 * current evidence and the questions available now; unchanged ones stay.
 */

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'learning.adjust.meta' });
  return {
    title: t('title'),
    alternates: (await pageAlternates(params, '/study-plan/adjust')),
    robots: { index: false, follow: false },
  };
}

type Query = { exam?: string | string[]; minutes?: string | string[]; date?: string | string[]; notice?: string | string[] };
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** A removed and an added session of the same kind and focus read as one session moving. */
function pairMoves(removed: PlanSessionRow[], added: PlannedSession[]) {
  const moves: Array<{ from: PlanSessionRow; to: PlannedSession }> = [];
  const addedLeft = [...added];
  const removedLeft: PlanSessionRow[] = [];
  for (const session of removed) {
    const index = addedLeft.findIndex((a) => a.kind === session.kind && a.domainSlug === session.domainSlug && a.skillSlug === session.skillSlug);
    if (index >= 0) moves.push({ from: session, to: addedLeft.splice(index, 1)[0] });
    else removedLeft.push(session);
  }
  return { moves, removed: removedLeft, added: addedLeft };
}

export default async function AdjustPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Query>;
}) {
  const { locale } = await params;
  const user = await requireSignedIn('/study-plan/adjust');
  const query = await searchParams;
  const config = getExamConfig(one(query.exam) ?? '');
  if (!config) return redirect({ href: '/study-plan', locale });
  const db = getDb();
  // Adjusting a plan is part of a paid plan for this exam; the plan view explains.
  if (!(await loadEntitlements(db, user.id)).can('study_plan', config.examKey)) {
    return redirect({ href: `/study-plan?exam=${encodeURIComponent(config.examKey)}`, locale });
  }
  let plan = (await activePlan(db, user.id, config.examKey));
  if (!plan) return redirect({ href: `/study-plan?exam=${encodeURIComponent(config.examKey)}&notice=no-plan`, locale });
  if ((await recordCompletions(db, user.id, plan)) > 0) plan = (await activePlan(db, user.id, config.examKey))!;
  const t = await getTranslations('learning');

  // Inputs: what the learner asked to preview, else the plan's own, with the
  // exam date as it is now (it may have changed since the plan was made).
  const weeklyMinutes = parseWeeklyMinutes(one(query.minutes)) ?? plan.weeklyMinutes;
  const askedDate = one(query.date);
  const current = (await examDateFor(db, user.id, config.examKey)).examDate;
  const parsed = parsePlanDate(askedDate !== undefined ? askedDate : current);
  const examDate = parsed === 'invalid' ? null : parsed;
  const dateNote =
    parsed === 'invalid'
      ? askedDate !== undefined
        ? t('adjust.dateNotAfterToday')
        : t('adjust.datePassed', { date: formatDate(current!, locale) })
      : null;

  const { preview, digest } = (await planAdjustment(db, user.id, plan, { weeklyMinutes, examDate }));
  const { moves, removed, added } = pairMoves(preview.removed, preview.added);
  const carried = [
    ...new Set(
      preview.missed
        .filter((s) => s.kind === 'new' || s.kind === 'revision')
        .map((s) => renderText(t, sessionLabel(config, s))),
    ),
  ];
  const inputsChanged = weeklyMinutes !== plan.weeklyMinutes || examDate !== plan.examDate;
  const changes = preview.missed.length + preview.removed.length + preview.added.length;
  const planHref = `/study-plan?exam=${encodeURIComponent(config.examKey)}`;

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('crumbs.home') },
          { href: '/dashboard', label: t('crumbs.dashboard') },
          { href: planHref, label: t('crumbs.studyPlan') },
          { label: t('crumbs.adjust') },
        ]}
      />
      <PageHeader eyebrow={config.publisher} title={t('adjust.title')} />
      <PlanningNotice code={query.notice} className="mb-6" />

      <section aria-labelledby="changes-heading" className="mb-10">
        <h2 id="changes-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('adjust.changesTitle')}
        </h2>
        <Card>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Stat label={t('adjust.stats.missed')} value={preview.missed.length} />
            <Stat label={t('adjust.stats.moved')} value={moves.length} />
            <Stat label={t('adjust.stats.added')} value={added.length} />
            <Stat label={t('adjust.stats.removed')} value={removed.length} />
          </div>
          <div className="mt-5 border-t border-line pt-5">
            <DefinitionList
              items={[
                { term: t('adjust.terms.unchanged'), value: t('adjust.terms.unchangedValue', { count: preview.kept }) },
                { term: t('adjust.terms.history'), value: t('adjust.terms.historyValue', { count: preview.history }) },
                {
                  term: t('adjust.terms.schedule'),
                  value: t('studyPlan.terms.range', {
                    from: formatDay(preview.startsOn, locale),
                    to: formatDay(preview.endsOn, locale, true),
                  }),
                },
                {
                  term: t('studyPlan.terms.examDate'),
                  value: examDate ? formatDate(examDate, locale) : t('studyPlan.terms.none'),
                },
                { term: t('studyPlan.terms.eachWeek'), value: t('studyPlan.terms.minutes', { minutes: weeklyMinutes }) },
              ]}
            />
          </div>
          {changes > 0 || inputsChanged ? (
            <form action={applyAdjustmentAction} className="mt-5 flex flex-wrap gap-3">
              <input type="hidden" name="examKey" value={config.examKey} />
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="digest" value={digest} />
              <input type="hidden" name="weeklyMinutes" value={weeklyMinutes} />
              <input type="hidden" name="examDate" value={examDate ?? ''} />
              <Button type="submit">{t('adjust.apply')}</Button>
              <ButtonLink href={planHref} variant="secondary">
                {t('adjust.keep')}
              </ButtonLink>
            </form>
          ) : (
            <div className="mt-5">
              <p className="text-sm text-ink-muted">{t('adjust.nothing')}</p>
              <ButtonLink href={planHref} variant="secondary" className="mt-3">
                {t('adjust.back')}
              </ButtonLink>
            </div>
          )}
        </Card>
      </section>

      <section aria-labelledby="inputs-heading" className="mb-10">
        <h2 id="inputs-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('adjust.inputsTitle')}
        </h2>
        <Card>
          <PlanInputsForm
            action={getPathname({ href: '/study-plan/adjust', locale })}
            examKey={config.examKey}
            examDate={examDate}
            weeklyMinutes={weeklyMinutes}
            submitLabel={t('adjust.updatePreview')}
            dateHint={t('adjust.dateHint')}
          />
          {dateNote ? <p className="mt-4 text-sm text-caution">{dateNote}</p> : null}
        </Card>
      </section>

      <section aria-labelledby="details-heading">
        <h2 id="details-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('adjust.detailsTitle')}
        </h2>
        <div className="space-y-8">
          <ChangeList title={t('adjust.missedTitle')} empty={t('adjust.missedEmpty')}>
            {preview.missed.map((s) => (
              <Row key={s.id} day={s.scheduledOn} label={sessionLabel(config, s)} kind={s.kind} />
            ))}
          </ChangeList>
          {carried.length > 0 ? (
            <div>
              <h3 className="font-heading text-lg font-semibold">{t('adjust.carriedTitle')}</h3>
              <p className="mt-1 text-sm text-ink-muted">{t('adjust.carried', { sessions: carried.join('; ') })}</p>
            </div>
          ) : null}
          <ChangeList title={t('adjust.movedTitle')} empty={t('adjust.movedEmpty')}>
            {moves.map(({ from, to }) => (
              <Row key={from.id} day={to.scheduledOn} previous={from.scheduledOn} label={sessionLabel(config, to)} kind={to.kind} />
            ))}
          </ChangeList>
          <ChangeList title={t('adjust.addedTitle')} empty={t('adjust.addedEmpty')}>
            {added.map((s) => (
              <Row key={`${s.scheduledOn}-${s.sequence}`} day={s.scheduledOn} label={sessionLabel(config, s)} kind={s.kind} />
            ))}
          </ChangeList>
          <ChangeList title={t('adjust.removedTitle')} empty={t('adjust.removedEmpty')}>
            {removed.map((s) => (
              <Row key={s.id} day={s.scheduledOn} label={sessionLabel(config, s)} kind={s.kind} />
            ))}
          </ChangeList>
        </div>
      </section>
    </Container>
  );
}

function ChangeList({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <div>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      {children.length === 0 ? (
        <p className="mt-1 text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-card border border-line bg-surface">{children}</ul>
      )}
    </div>
  );
}

function Row({ day, previous, label, kind }: { day: string; previous?: string; label: Msg; kind: PlannedSession['kind'] }) {
  const t = useTranslations('learning');
  const locale = useLocale();
  return (
    <li className="px-4 py-3">
      <p className="text-sm font-semibold tabular-nums text-ink-muted">
        {previous ? (
          <>
            <time dateTime={previous}>{formatDay(previous, locale)}</time> <span aria-hidden="true">→</span>
            <span className="sr-only"> {t('adjust.movesTo')} </span> <time dateTime={day}>{formatDay(day, locale)}</time>
          </>
        ) : (
          <time dateTime={day}>{formatDay(day, locale)}</time>
        )}
      </p>
      <p className="mt-1 font-medium">{renderText(t, label)}</p>
      <div className="mt-2">
        <KindBadge kind={kind} />
      </div>
    </li>
  );
}
