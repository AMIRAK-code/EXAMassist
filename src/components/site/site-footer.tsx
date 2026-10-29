import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CONTACT, SITE, SOCIAL_LINKS } from '@/lib/site';
import { SUPPORT } from '@/lib/support';
import { listHubs } from '@/lib/exams/registry';
import { EditorialLine } from './editorial-line';
import { MailIcon, SocialIcon } from './social-icons';

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

const FOOTER_LINK = 'text-ink-inverse no-underline hover:text-ink-inverse hover:underline';
const FOOTER_HEADING = 'mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-inverse-muted';

function Column({
  id,
  title,
  items,
  children,
}: {
  id: string;
  title: string;
  items: Array<{ href: string; label: string }>;
  children?: ReactNode;
}) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className={FOOTER_HEADING}>
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={FOOTER_LINK}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {children}
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

            <h2 id="footer-follow" className={`mt-8 ${FOOTER_HEADING}`}>
              {t('footer.follow')}
            </h2>
            <ul aria-labelledby="footer-follow" className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.key}>
                  {/* rel="me" ties each profile to this site for the services that check it. */}
                  <a href={link.href} rel="me noopener" className={`inline-flex items-center gap-2 ${FOOTER_LINK}`}>
                    <SocialIcon name={link.key} />
                    {link.key === 'blog' ? t('footer.blog') : link.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-ink-inverse-muted">
              {t('footer.enquiries')}{' '}
              <a href={`mailto:${CONTACT.info}`} className={FOOTER_LINK}>
                {CONTACT.info}
              </a>
            </p>
          </div>
          <Column id="footer-exams" title={t('footer.exams')} items={exams} />
          <Column id="footer-learn" title={t('footer.learn')} items={label(LEARN)} />
          <Column id="footer-help" title={t('footer.help')} items={label(HELP)}>
            <div className="mt-6">
              <h3 className={FOOTER_HEADING}>{t('footer.support.title')}</h3>
              <a href={`mailto:${CONTACT.support}`} className={`inline-flex items-center gap-2 break-all ${FOOTER_LINK}`}>
                <MailIcon />
                {CONTACT.support}
              </a>
              <p className="mt-2 max-w-xs leading-relaxed text-ink-inverse-muted">{t('footer.support.note', { days: SUPPORT.firstReplyBusinessDays })}</p>
              <p className="mt-2">
                <Link href="/about/support" className={FOOTER_LINK}>
                  {t('footer.support.link')}
                </Link>
              </p>
            </div>
          </Column>
        </div>

        <p className="mt-12 border-t border-rule-on-ink pt-6 text-xs leading-relaxed text-ink-inverse-subtle">
          {t('site.independenceNotice')}
        </p>
      </div>
    </footer>
  );
}
