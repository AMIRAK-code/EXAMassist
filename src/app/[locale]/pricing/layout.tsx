import type { ReactNode } from 'react';
import { ClientMessages } from '@/i18n/client-messages';

/** The plans page is public: send only what its offer component uses. */
export default function PricingLayout({ children }: { children: ReactNode }) {
  return <ClientMessages pick={['common', 'billing']}>{children}</ClientMessages>;
}
