/**
 * Sanitisation helpers — safe in both SSR (Node) and browser.
 *
 * Uses isomorphic-dompurify so the same sanitisation runs during the initial
 * server render (preventing pre-hydration XSS) and on the client.
 *
 * Three exports:
 *   - sanitizeHtml(html)        — DOMPurify on rich-text HTML
 *   - safeUrl(url)              — allow-list scheme guard for anchor href
 *   - safeBackgroundUrl(url)    — allow-list guard + CSS-quote-safe for url()
 */
import DOMPurify from "isomorphic-dompurify";

// Add a one-shot hook to force rel="noopener noreferrer" on every link the
// sanitiser emits with target="_blank". DOMPurify keeps the hook registered
// for the lifetime of the module (idempotent across calls).
let hookInstalled = false;
function ensureHook() {
    if (hookInstalled) return;
    if (typeof DOMPurify.addHook === "function") {
        DOMPurify.addHook("afterSanitizeAttributes", (node) => {
            if (!node || node.tagName !== "A") return;
            if (node.getAttribute("target") === "_blank") {
                node.setAttribute("rel", "noopener noreferrer");
            }
        });
        hookInstalled = true;
    }
}

export function sanitizeHtml(html) {
    if (!html) return "";
    ensureHook();
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

/**
 * Allow-list URL guard for use in `<a href={safeUrl(value)}>`.
 *
 * Permits: absolute http/https, root-relative ("/foo"), in-page anchors
 * ("#foo"), mailto: and tel: schemes. Rejects everything else (including
 * the script-execution schemes javascript:, data:, vbscript:, file:).
 *
 * Returns "#" when the value is missing or rejected so that a click is a
 * no-op rather than a navigation to an attacker-controlled URI.
 */
export function safeUrl(raw) {
    if (typeof raw !== "string") return "#";
    const value = raw.trim();
    if (value === "") return "#";
    if (/^(javascript|data|vbscript|file):/i.test(value)) return "#";
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith("/")) return value;
    if (value.startsWith("#")) return value;
    if (/^(mailto:|tel:)/i.test(value)) return value;
    return "#";
}

/**
 * URL guard for `background-image: url(...)` interpolation. Returns null
 * when the value cannot be safely embedded — callers must check for null
 * and skip the background rule entirely.
 *
 * Rejects strings containing characters that could break out of the
 * url("…") quoting context (`"`, `'`, `)`, `\`, control chars, whitespace).
 */
export function safeBackgroundUrl(raw) {
    if (typeof raw !== "string") return null;
    const value = raw.trim();
    if (value === "") return null;
    if (/[\s"'()\\<>]/.test(value)) return null;
    if (!/^(https?:\/\/|\/)/i.test(value)) return null;
    return value;
}
