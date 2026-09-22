import { renderInlineMarkdown, renderMarkdown } from '@/lib/markdown';
import type { StimulusPayload } from '@/lib/content/repository';
import { StimulusView, type StimulusData } from './stimulus-view';

/**
 * Server-side rendering of authored content. Markdown and maths are turned
 * into sanitised HTML here, never in the browser.
 */

export function Markdown({
  source,
  className,
}: {
  source: string | null | undefined;
  className?: string;
}) {
  if (!source) return null;
  // renderMarkdown sanitises the Markdown-derived HTML before injecting the
  // trusted, server-generated KaTeX output. See src/lib/markdown.ts.
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />;
}

export function InlineMarkdown({ source }: { source: string | null | undefined }) {
  if (!source) return null;
  return <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(source) }} />;
}

/** Converts a stored stimulus into the shape the presentational view expects. */
export function toStimulusViewModel(stimulus: StimulusPayload) {
  return {
    id: stimulus.id,
    title: stimulus.title,
    bodyHtml: stimulus.bodyMd ? renderMarkdown(stimulus.bodyMd) : null,
    data: (stimulus.data as StimulusData | null) ?? null,
    accessibilityText: stimulus.accessibilityText,
  };
}

export function Stimulus({ stimulus }: { stimulus: StimulusPayload }) {
  return <StimulusView stimulus={toStimulusViewModel(stimulus)} />;
}
