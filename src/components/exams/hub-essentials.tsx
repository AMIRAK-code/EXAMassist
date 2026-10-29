import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Blueprint } from '@/lib/assessment/types';
import type { Guide } from '@/lib/content/guides';
import type { ExamHub } from '@/lib/exams/registry';
import { Card } from '@/components/ui';

/**
 * The first thing an exam page answers: who it is for, what can actually be
 * practised here today, what it costs, and what it is not. Every line comes
 * from the open formats (`offered`) and the deployment's billing state, so the
 * page never promises a format that is closed or a price that does not apply.
 */
export async function HubEssentials({
  hub,
  offered,
  billingOn,
  guides,
}: {
  hub: ExamHub;
  offered: Blueprint[];
  billingOn: boolean;
  guides: Guide[];
}) {
  const t = await getTranslations('exams');
  const format = await getFormatter();
  const audiences = format.list(hub.audiences.map((audience) => t(`audience.${audience}`)), { type: 'conjunction' });

  const can = {
    practice: offered.some((b) => b.mode === 'practice' && b.timing === 'untimed'),
    timed: offered.some((b) => b.mode !== 'simulation' && b.timing !== 'untimed'),
    simulation: offered.some((b) => b.mode === 'simulation'),
  };
  const items: Array<{ key: string; node: React.ReactNode }> = [];
  if (can.practice) items.push({ key: 'practice', node: t('essentials.practice') });
  if (can.timed) items.push({ key: 'timed', node: t('essentials.timed') });
  if (can.simulation) items.push({ key: 'simulation', node: t('essentials.simulation') });
  if (offered.length > 0) items.push({ key: 'review', node: t('essentials.review') });
  items.push({
    key: 'access',
    node: billingOn
      ? t.rich('essentials.accessPaid', { link: (chunks) => <Link href="/pricing">{chunks}</Link> })
      : t('essentials.accessFree'),
  });

  return (
    <Card className="mb-10">
      <h2 className="font-heading text-xl font-semibold">{t('essentials.heading')}</h2>
      <p className="mt-2 text-sm text-ink-muted">{t('essentials.level', { audiences })}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.key} className="flex gap-2">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{item.node}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-muted">
        {t.rich('essentials.limits', {
          publisher: hub.publisher,
          link: (chunks) => <Link href="/about/how-scoring-works">{chunks}</Link>,
        })}
      </p>
      {guides.length > 0 ? (
        <>
          <h3 className="mt-6 font-heading text-lg font-semibold">{t('essentials.guidesHeading')}</h3>
          <ul className="mt-2 space-y-1.5">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} lang="en">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Card>
  );
}
