import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { funnelReport } from '@/lib/analytics/funnel';
import { listHubs } from '@/lib/exams/registry';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';

/**
 * The per-exam funnel, from the daily totals in funnel_counts and the free
 * tests in the attempts table (src/lib/analytics/funnel.ts). Totals only: no
 * row here says anything about a person. Admins only, never indexed.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Funnel',
  robots: { index: false, follow: false },
};

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function FunnelPage({ searchParams }: { searchParams: Promise<{ hub?: string; days?: string }> }) {
  await requireAdmin('/admin/funnel');
  const query = await searchParams;
  const hubs = listHubs();
  const hub = hubs.find((h) => h.slug === query.hub) ?? hubs.find((h) => h.slug === 'bocconi-online-test') ?? hubs[0];
  const days = Math.min(Math.max(Number.parseInt(query.days ?? '28', 10) || 28, 1), 366);
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - (days - 1) * DAY_MS).toISOString().slice(0, 10);
  const report = await funnelReport(getDb(), { hubSlug: hub.slug, examKeys: hub.configKeys, from, to });

  const rate = (n: number, d: number) => (d > 0 ? `${Math.round((n / d) * 1000) / 10}%` : '—');
  const steps = [
    { label: 'Exam page views (people, not crawlers)', value: report.landingTotal, of: null },
    { label: 'Plans page views from this exam', value: report.pricingViews, of: report.landingTotal },
    { label: 'Free tests started', value: report.freeTestStarts, of: report.landingTotal },
    { label: 'Free tests finished', value: report.freeTestCompletions, of: report.freeTestStarts },
    { label: 'Checkouts started from this exam', value: report.checkoutStarts, of: report.pricingViews },
    { label: 'Plans bought from this exam', value: report.purchases, of: report.checkoutStarts },
  ];

  return (
    <Container>
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/admin', label: 'Administration' }, { label: 'Funnel' }]} />
      <PageHeader
        eyebrow="Internal"
        title={`${hub.name}: funnel`}
        lead={`UTC days ${from} to ${to}. Daily totals only; nothing here identifies a person.`}
      />

      <p className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {hubs.map((h) => (
          <Link key={h.slug} href={`/admin/funnel?hub=${h.slug}&days=${days}`} aria-current={h.slug === hub.slug ? 'page' : undefined}>
            {h.label}
          </Link>
        ))}
        <span className="text-ink-muted">·</span>
        {[7, 28, 90].map((d) => (
          <Link key={d} href={`/admin/funnel?hub=${hub.slug}&days=${d}`}>
            {d} days
          </Link>
        ))}
      </p>

      <Card>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Funnel steps for {hub.name}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 text-left font-semibold">Step</th>
              <th scope="col" className="py-2 text-right font-semibold">Total</th>
              <th scope="col" className="py-2 text-right font-semibold">Of the step before it</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr key={step.label} className="border-b border-line last:border-0">
                <th scope="row" className="py-2 text-left font-normal">{step.label}</th>
                <td className="py-2 text-right tabular-nums">{step.value}</td>
                <td className="py-2 text-right tabular-nums">{step.of === null ? '' : rate(step.value, step.of)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <h2 className="mt-8 font-heading text-xl font-semibold">Where exam page visits came from</h2>
      <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        {Object.entries(report.landingViews)
          .filter(([source]) => source !== 'n/a')
          .map(([source, value]) => (
            <li key={source} className="flex justify-between rounded-card border border-line px-3 py-2">
              <span>{SOURCE_LABEL[source] ?? source}</span>
              <span className="tabular-nums">{value}</span>
            </li>
          ))}
      </ul>

      <p className="mt-8 max-w-3xl text-sm text-ink-muted">
        Free-test steps count accounts that started or finished the free test in this period, whatever page they came
        from. Plans and checkouts count only visits that carried this exam. Which search queries led here is in Google
        Search Console and Bing Webmaster Tools, not in these totals; see docs/BOCCONI-SEARCH.md.
      </p>
    </Container>
  );
}

const SOURCE_LABEL: Record<string, string> = {
  search: 'Search engines',
  ai: 'AI assistants',
  internal: 'This site',
  other: 'Other sites',
  direct: 'No referrer',
};
