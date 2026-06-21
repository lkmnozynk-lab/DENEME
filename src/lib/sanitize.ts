import DOMPurify from "isomorphic-dompurify";

/**
 * HTML sanitizer for rich-text (Tiptap) content saved by the admin, backed by
 * DOMPurify with a strict allowlist. External links are forced to open safely
 * (target=_blank, rel=noopener noreferrer nofollow).
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "u", "s",
  "h1", "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "code", "pre", "hr", "a",
];

// Register once: harden anchors after attribute sanitization.
let hookAdded = false;
function ensureHook() {
  if (hookAdded) return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("href")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer nofollow");
    }
  });
  hookAdded = true;
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  ensureHook();
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
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
