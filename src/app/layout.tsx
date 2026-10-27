/**
 * The document itself is rendered by app/[locale]/layout.tsx, which knows the
 * language for <html lang>. This root layout only passes children through, as
 * next-intl's routing requires.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
