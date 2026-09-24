import Link from 'next/link';
import { INDEPENDENCE_NOTICE, SITE } from '@/lib/site';
import { listHubs } from '@/lib/exams/registry';
import { EditorialLine } from './editorial-line';

const LEARN = [
  { href: '/guides', label: 'Guides' },
  { href: '/about/how-scoring-works', label: 'How our scoring works' },
  { href: '/about/editorial-standards', label: 'Editorial standards' },
];

const HELP = [
  { href: '/report-question', label: 'Report a question' },
  { href: '/about/privacy', label: 'Privacy' },
  { href: '/about/terms', label: 'Terms' },
];

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

export function SiteFooter() {
  const exams = listHubs().map((hub) => ({ href: `/exams/${hub.slug}`, label: hub.name }));
  return (
    <footer className="mt-auto bg-ink text-ink-inverse">
      <div className="mx-auto max-w-6xl px-4 py-14 text-sm sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-extrabold tracking-[-0.04em]">
              {SITE.name}
              <span aria-hidden="true" className="text-accent-on-ink">
                .
              </span>
            </p>
            <EditorialLine onInk className="mt-3 max-w-xs leading-relaxed text-ink-inverse-muted" />
          </div>
          <Column id="footer-exams" title="Exams" items={exams} />
          <Column id="footer-learn" title="Learn" items={LEARN} />
          <Column id="footer-help" title="Help" items={HELP} />
        </div>

        <p className="mt-12 border-t border-rule-on-ink pt-6 text-xs leading-relaxed text-ink-inverse-subtle">
          {INDEPENDENCE_NOTICE}
        </p>
      </div>
    </footer>
  );
}
