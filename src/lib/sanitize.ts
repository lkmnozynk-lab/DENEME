import sanitize from "sanitize-html";

/**
 * HTML sanitizer for rich-text (Tiptap) content saved by the admin, backed by
 * sanitize-html with a strict allowlist. Pure Node implementation (no jsdom),
 * so it loads reliably in serverless runtimes. External links are forced to
 * open safely (target=_blank, rel=noopener noreferrer nofollow).
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "u", "s",
  "h1", "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "code", "pre", "hr", "a",
];

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  return sanitize(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "target", "rel"] },
    // Only allow safe URL schemes for links.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Harden every anchor: open in a new tab with a safe rel.
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
    },
  }).trim();
}

/** Plain-text extraction for excerpts / reading-time estimates. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingMinutes(html: string): number {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
