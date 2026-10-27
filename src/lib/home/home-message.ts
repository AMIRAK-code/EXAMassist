import type { HomeMessage } from './home-data';

type Translate = (key: string, values?: Record<string, string | number>) => string;
type ListFormat = (items: string[], options: Intl.ListFormatOptions) => string;

/**
 * Renders a `home` message from home-data with the page's translator, joining
 * list values in the reader's language ("standard and law", "standard e law").
 */
export function homeText(t: Translate, list: ListFormat, message: HomeMessage): string {
  const values: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(message.values ?? {})) {
    values[name] = typeof value === 'object' ? list(value.list, { type: 'conjunction', style: 'long' }) : value;
  }
  return t(message.key, values);
}
