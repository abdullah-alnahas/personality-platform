/**
 * HTML sanitization utility — works in both SSR (Node.js) and browser.
 *
 * Uses isomorphic-dompurify which provides DOMPurify in all environments
 * (uses jsdom under the hood for Node.js). This ensures HTML is sanitized
 * even in the initial SSR render, preventing stored XSS from executing
 * before React hydration.
 */
import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html) {
    if (!html) return "";
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
