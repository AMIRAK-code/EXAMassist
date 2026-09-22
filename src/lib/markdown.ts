import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import katex from 'katex';

/**
 * Renders authored Markdown with KaTeX maths to HTML, server-side.
 *
 * Order matters. Maths is pulled out first and replaced by inert placeholders,
 * the remaining Markdown is rendered and then sanitised, and only afterwards is
 * the KaTeX output injected. So the sanitiser never has to allow the large
 * surface of KaTeX's markup, and nothing that came from the Markdown can reach
 * the page unsanitised.
 */

const PLACEHOLDER_PREFIX = 'zzmathzz';

interface MathToken {
  placeholder: string;
  html: string;
}

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
  } catch {
    // Never break a page over a malformed formula: show the source instead.
    const escaped = tex.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<code class="math-error">${escaped}</code>`;
  }
}

function extractMath(source: string): { text: string; tokens: MathToken[] } {
  const tokens: MathToken[] = [];
  let index = 0;

  // Display maths first, so $$...$$ is not mistaken for two inline spans.
  let text = source.replace(/\$\$([\s\S]+?)\$\$/g, (_match, tex: string) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${index++}zz`;
    tokens.push({ placeholder, html: renderMath(tex.trim(), true) });
    return `\n\n${placeholder}\n\n`;
  });

  // Inline maths. An escaped \$ is a literal dollar sign and is left alone.
  text = text.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (_match, before: string, tex: string) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${index++}zz`;
    tokens.push({ placeholder, html: renderMath(tex.trim(), false) });
    return `${before}${placeholder}`;
  });

  return { text, tokens };
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
    'a', 'hr', 'span', 'div', 'figure', 'figcaption',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel', 'target'],
    th: ['scope', 'colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    span: ['class'],
    div: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  // Authored content may link out to official sources; make those links safe.
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? '';
      const external = /^https?:\/\//.test(href);
      return {
        tagName,
        attribs: external
          ? { ...attribs, rel: 'noopener noreferrer', target: '_blank' }
          : attribs,
      };
    },
  },
  disallowedTagsMode: 'discard',
};

marked.setOptions({ gfm: true, breaks: false });

/** Renders a Markdown string to sanitised HTML with maths typeset. */
export function renderMarkdown(source: string | null | undefined): string {
  if (!source) return '';

  const { text, tokens } = extractMath(source);
  const rendered = marked.parse(text, { async: false }) as string;
  let html = sanitizeHtml(rendered, SANITIZE_OPTIONS);

  for (const token of tokens) {
    html = html.split(token.placeholder).join(token.html);
  }
  return html;
}

/** Renders a short inline string (option text, table cells) without block wrappers. */
export function renderInlineMarkdown(source: string | null | undefined): string {
  if (!source) return '';
  const { text, tokens } = extractMath(source);
  const rendered = marked.parseInline(text, { async: false }) as string;
  let html = sanitizeHtml(rendered, SANITIZE_OPTIONS);
  for (const token of tokens) {
    html = html.split(token.placeholder).join(token.html);
  }
  return html;
}

/**
 * Plain text for meta descriptions and structured data: no markup, no maths
 * markup, collapsed whitespace.
 */
export function toPlainText(source: string | null | undefined, maxLength = 300): string {
  if (!source) return '';
  const withoutMath = source.replace(/\$\$[\s\S]+?\$\$/g, ' ').replace(/\$[^$\n]+?\$/g, ' ');
  const stripped = sanitizeHtml(marked.parse(withoutMath, { async: false }) as string, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const text = stripped.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
}
