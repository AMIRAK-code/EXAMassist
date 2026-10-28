import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';
import { listHubs } from '@/lib/exams/registry';
import { EditorialLine } from './editorial-line';

const LEARN = [
  { href: '/pricing', key: 'pricing' },
  { href: '/guides', key: 'guides' },
  { href: '/about/how-scoring-works', key: 'howOurScoringWorks' },
  { href: '/about/editorial-standards', key: 'editorialStandards' },
] as const;

const HELP = [
  { href: '/report-question', key: 'reportQuestion' },
  { href: '/about/privacy', key: 'privacy' },
  { href: '/about/terms', key: 'terms' },
] as const;

function Column({ id, title, items }: { id: string; title: string; items: Array<{ href: string; label: string }> }) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-inverse-muted">
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-ink-inverse no-underline hover:text-ink-inverse hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function SiteFooter() {
  const t = await getTranslations('common');
  const label = (items: ReadonlyArray<{ href: string; key: string }>) =>
    items.map((item) => ({ href: item.href, label: t(`footer.${item.key}` as 'footer.pricing') }));
  const exams = listHubs().map((hub) => ({ href: `/exams/${hub.slug}`, label: hub.name }));
  return (
    <footer data-site-chrome className="mt-auto bg-ink text-ink-inverse">
      <div className="mx-auto max-w-6xl px-4 py-14 text-sm sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p>
              {/* The white logo, made for dark grounds such as the footer's ink. */}
              <img src="/brand/uniexamer-logo-white.png" alt={SITE.name} width={125} height={30} className="block" />
            </p>
            <EditorialLine onInk className="mt-3 max-w-xs leading-relaxed text-ink-inverse-muted" />
          </div>
          <Column id="footer-exams" title={t('footer.exams')} items={exams} />
          <Column id="footer-learn" title={t('footer.learn')} items={label(LEARN)} />
          <Column id="footer-help" title={t('footer.help')} items={label(HELP)} />
        </div>

        <p className="mt-12 border-t border-rule-on-ink pt-6 text-xs leading-relaxed text-ink-inverse-subtle">
          {t('site.independenceNotice')}
        </p>
      </div>
    </footer>
  );
}
