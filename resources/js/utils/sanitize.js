/**
 * Client-side HTML sanitization utility (defense-in-depth).
 *
 * DOMPurify requires a browser DOM. For SSR (Node.js), we trust Laravel's
 * server-side HTMLPurifier and skip client-side sanitization.
 * In the browser, DOMPurify provides a second layer of defence.
 */
import DOMPurify from "dompurify";

export function sanitizeHtml(html) {
    if (!html) return "";
    if (typeof window === "undefined") return html;
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
