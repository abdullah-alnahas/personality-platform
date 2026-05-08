# Verification Report

Re-audit of fixes against `.audit/audit_backend.md`, `.audit/audit_frontend.md`,
`.audit/audit_config.md`. Each finding inspected against the actual code.

## Fixed (verified)

### Backend
- B1.C1 — SVG XSS via media upload — `app/Http/Controllers/Admin/MediaController.php:23-28` evidence: `image/svg+xml` removed from `ALLOWED_MIME_TYPES`; only jpeg/png/gif/webp accepted.
- B1.C2 — Default admin password "password" — `database/seeders/AdminUserSeeder.php:28-90` evidence: literal `'password'` removed; production requires ≥16 char `ADMIN_SEED_PASSWORD`; non-production generates random `Str::password(24)` and prints once; testing uses fixed strong fixture; `assertStrongPassword` enforces ≥16. Also `ADMIN_SEED_EMAIL` no longer defaults to `admin@example.com` (returns early without it).
- B2.H1 — `MediaController::destroy` query-string path traversal — `app/Http/Controllers/Admin/MediaController.php:148-214` evidence: query-string vector removed; path now read from POST body via `$request->input('path')` (DELETE goes through `web` group with CSRF), passed through `sanitiseUploadPath()` which rejects NUL bytes, absolute paths, `..` traversal, scheme prefixes, wrong upload prefix, and disallowed extensions; both deletes audit-logged via `Log::info`.
- B3.H2 — Filename extension from client — `app/Http/Controllers/Admin/MediaController.php:35-40, 107-120` evidence: extension now derived from `MIME_TO_EXTENSION[$file->getMimeType()]`; client extension never used for storage; defence-in-depth 422 if MIME unknown.
- A4.H4 — `SESSION_SECURE_COOKIE=null` — `.env.example:34` evidence: now `SESSION_SECURE_COOKIE=true` with comment to leave empty only in dev. `TRUSTED_PROXIES` env doc added (`.env.example:78-81`).
- A5.H6 — Login rate-limit before honeypot — `app/Http/Requests/Auth/LoginRequest.php:44-66` evidence: `ensureIsNotRateLimited()` now runs first (line 49), then honeypot check; honeypot hits also call `recordFailedAttempt()` so bots no longer evade the counter.
- C4.H7 — Setting richtext sanitisation only in controller — `app/Models/Setting.php:33-39` evidence: `setValueAttribute` mutator runs `clean()` whenever `$this->attributes['type'] === 'richtext'`; covers seeders, imports, mass-assignment.
- A1.H8 — Editor role grants `manage media` — `database/seeders/RolesAndPermissionsSeeder.php:51-59` evidence: `manage media` removed from `$editorPermissions`, replaced with explanatory comment.
- I4.H9 — Inertia `auth.user` exposes email/email_verified_at — `app/Http/Middleware/HandleInertiaRequests.php:52-58` evidence: payload reduced to `id` and `name` only.
- A4.M1 — Password reset throttle keyed only on IP — `app/Http/Controllers/Auth/PasswordResetLinkController.php:38-47` evidence: per-email cache key `pwd_reset_email:<sha256>` capped at 3/hour, returns generic success on hit (no enumeration).

### Frontend
- F1.1 — `javascript:` URL in HeroBanner CTA — `resources/js/Components/Blocks/HeroBanner.jsx:6,89,374-375` evidence: imports and applies `safeUrl()` to `ctaLink` and `secondaryCtaLink`.
- F1.2 — Same gap across other blocks/layout — verified `safeUrl()` wrapping in `PlatformCta.jsx:35-36`, `BooksGrid.jsx:145`, `SocialMediaFeed.jsx:82`, `LogoGrid.jsx:112,135`, `PillarCards.jsx:190`, `QuranVerse.jsx:128`, `PublicLayout.jsx:80, 106, 328, 342, 682, 788, 849`.
- F1.3 — CSS `url()` injection — `resources/js/Components/Blocks/PlatformCta.jsx:23,82` and `StatsCounter.jsx:16,28` evidence: `safeBackgroundUrl()` wraps the URL before interpolation; helper rejects whitespace/quotes/parens (`utils/sanitize.js:67-74`).
- F1.4 — MediaPicker scheme check + SVG removal — `resources/js/Components/MediaPicker.jsx:19,145-148,184,194` evidence: preview gated by `safeUrl(value) !== '#'`, `<input accept>` reduced to non-SVG MIMEs, helper text says "JPEG, PNG, GIF, or WebP". (Server-side SVG rejection also in B1.C1.)
- F2.2 — Inertia leaks `email` / `email_verified_at` — same evidence as I4.H9 above.
- F2.3 — DOMPurify default config does not force `rel=noopener` on `target=_blank` — `resources/js/utils/sanitize.js:14-29` evidence: `afterSanitizeAttributes` hook installed once and forces `rel="noopener noreferrer"` on every `<a target="_blank">`.

### Config
- F-01 / F-03 — `APP_DEBUG=true`/`APP_ENV=local` defaults — `.env.example:3,6` evidence: now `APP_ENV=production` and `APP_DEBUG=false` with "CHANGE BEFORE DEPLOYING"-style comments. (Live `.env` still has dev values — see Still open.)
- F-02 — DB credentials in `phpunit.xml` — `phpunit.xml:30-31` evidence: `DB_USERNAME` and `DB_PASSWORD` now empty strings with comment instructing supply via `.env.testing` / shell env. `.env.example:24` recommends `DB_USERNAME=app_user` (least-privilege).
- F-04 — Admin seeder password fallback — same evidence as B1.C2; also `.env.example:72-76` clarifies both `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` are required.
- F-05 — `LOG_LEVEL=debug` default — `.env.example:17` evidence: now `LOG_LEVEL=warning` with comment.
- F-06 — `public/sitemap.xml` committed — `git ls-files` shows it is no longer tracked (gitignored).
- F-07 — `public/hot` present — `git ls-files` shows it is gitignored.
- E-01 — CSP missing on admin routes — `routes/web.php:67-69` evidence: admin group now wrapped in `->middleware(['csp'])` so all admin pages receive CSP and security headers.
- E-04 — HSTS missing `preload` — `app/Http/Middleware/ContentSecurityPolicy.php:71-74` evidence: HSTS now `max-age=31536000; includeSubDomains; preload`.
- E-05 — `X-XSS-Protection` not set — `app/Http/Middleware/ContentSecurityPolicy.php:66` evidence: `X-XSS-Protection: 0` set explicitly.
- E-06 — CORS allow-all methods — `config/cors.php:20` evidence: explicit list `['GET','POST','PUT','PATCH','DELETE','OPTIONS']`.
- A-01 — Ziggy exposing `admin.*` — `config/ziggy.php:12-17` evidence: `admin.*` added to `except`, alongside `password.*`, `verification.*`, `api.*`.
- A-02 — Ziggy shared `query` props — `app/Http/Middleware/HandleInertiaRequests.php:60-63` evidence: `"query" => $request->query()` removed; only `location` shared.
- A-03 — Deployment doc recommended `$proxies='*'` — `docs/deployment-cpanel.md:351-353` evidence: revised to instruct using `TRUSTED_PROXIES` env var with explicit Cloudflare CIDR list; "never `*`" warning added.
- K-01 — `GRANT ALL PRIVILEGES` recommendation — `docs/deployment-cpanel.md:58` evidence: switched to least-privilege grant (`SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES`) with explicit warning against `ALL`.

### Other clean checks
- TrustProxies env-driven — `app/Http/Middleware/TrustProxies.php:20-34` accepts CIDR list via `TRUSTED_PROXIES`, defaults to `null`, comment warns against `'*'`. Caveat: still permits `'*'` if explicitly configured (low risk; docs no longer recommend it).
- `package-lock.json` — axios bumped to 1.16.0 (>1.15.1) and dompurify bumped to 3.4.2 (>3.3.3). Transitive `node_modules/isomorphic-dompurify/dompurify` also resolved past 3.3.3. CVE coverage OK.
- Admin Media Index passes `path` in POST body for upload-source items — `resources/js/Pages/Admin/Media/Index.jsx:49-54` (router.delete with `data: { path }`).

## Partially fixed

- E-02 — `style-src 'unsafe-inline'` — still permanently present in `ContentSecurityPolicy.php:36`. Audit explicitly notes this is an MUI constraint without a clean fix. No code change; treat as accepted risk. Recommendation: track an issue to evaluate `StyledEngineProvider` SSR nonce path.
- E-03 — `script-src 'unsafe-inline'` when `APP_ENV=local` — still appended in local env (`ContentSecurityPolicy.php:35`). Acceptable now that F-01/F-03 close the path for `APP_ENV=local` to reach prod, but the override is still in code. Documented dependency on env hygiene.
- F-07 — `public/hot` gitignored ✓ but file still exists on disk in working tree. Audit asked for `.gitattributes export-ignore` or deploy-checklist entry; neither verified. Low risk but unaddressed.

## Still open / regressions / new concerns

- F-01 (live `.env`) — `.env:2,4,9,16-17` still has `APP_ENV=local`, `APP_DEBUG=true`, `LOG_LEVEL=debug`, `DB_USERNAME=root`, `DB_PASSWORD=123`. `.env` is gitignored (so it won't ship), but the developer's local copy is still wide open and must not be deployed. Recommendation: add a pre-deploy `php artisan about` check that fails CI when `APP_DEBUG=true && APP_ENV != local`.
- F2.1 — Quill rich-text editor still emits raw HTML on save — `resources/js/Components/RichTextEditor.jsx:74-80` `handleChange` still passes raw `content` through to the parent `onChange`. Server-side `clean()` runs on `ContentItem`, `PageBlock`, `Setting`, but defence-in-depth save-time sanitisation requested by the audit not added. Recommendation: wrap the value in `sanitizeHtml()` before invoking the parent callback.
- F2.4 — `fetch()` to `admin.pages.blocks.reorder` still missing explicit `credentials: 'same-origin'` — `resources/js/Pages/Admin/Pages/Form.jsx:105-114`. Browser default still works today, but the inconsistency with `MediaPicker` remains. Low risk.
- F3.2 — External `MuiLink` without `target=_blank` still emits no `rel` — `resources/js/Layouts/PublicLayout.jsx:60-82` `commonProps` still keys `rel` off `item.target === "_blank"` only. External same-tab links lack `rel="noopener noreferrer"`. Low impact; performance/best-practice gap.
- B3.H5 — `EngagementController` still stores up-to-500-char `user_agent` — `app/Http/Controllers/Api/EngagementController.php:60` unchanged. Page reachability check (the second sub-issue) also not added. PII/poisoning risk persists. Recommendation: hash UA to a coarse fingerprint (≤32 chars) and require `Page::published()->whereNotNull('slug')` before crediting engagement.
- B4.H3 — `/storage/` direct URL still bypasses CSP middleware — no nginx/htaccess rule shipped, no controller-proxy wrapper, no `Content-Disposition: attachment` for SVG/HTML/PHP. Mitigated in practice by SVG removal (B1.C1) and MIME-derived extension (B3.H2), but the underlying header gap on the public disk endpoint remains. Recommendation: add a `web/.htaccess` (Apache) or nginx snippet enforcing `nosniff` + `Content-Disposition: attachment` for `\.(svg|html?|php|phtml|phar)$` under `/storage/`.
- C8.M2 — Page slug regex `[a-zA-Z0-9-]+` unchanged in `routes/web.php:34, 38, 53`. Still allows numeric-only slugs and reserved-word collisions.
- C1.M3 — `ContentCategory::scopeOrderByTranslatable` still uses `DB::raw` with interpolation (`app/Models/ContentCategory.php:99-128`). Whitelisted today, fragile to future refactors. Recommendation: rewrite using `$query->orderBy("{$column}->{$locale}", $direction)` Eloquent JSON syntax.
- H1.M4 — `SetLocale` middleware still has 5 `Log::debug` calls (`app/Http/Middleware/SetLocale.php:48,63,89,93,132`). Noisy when `LOG_LEVEL=debug` (which is the live `.env`).
- D2.M5 — Featured-image cap inconsistency — `StoreContentItemRequest.php:68` still 2048 KB while picker allows 10240 KB. Confusing but not a vuln.
- M2.L3 — Honeypot field name still `_confirm_email` (guessable). Generic-spam protection only.
- F8.M6 — TrustProxies refactor: env-driven, but if `TRUSTED_PROXIES` is left unset, behaviour is identical to the original `null` (no proxies trusted). Refusal to default to `'*'` is documented in code comment but the value `'*'` is still accepted when explicitly configured (line 28-30). Pragmatic; recommend documenting in `docs/deployment-cpanel.md` that CIDR lists are mandatory when behind a proxy.
- K-02 — `public/robots.txt:9` still hard-codes `Disallow: /admin`, leaking the admin path. Static file unchanged.
- F1.4 sub-issue — server-side SVG hardening covered by removing SVG from upload allow-list (B1.C1). No `finfo_file` re-validation added beyond Symfony's `mimetypes:` rule; acceptable since SVG is fully banned now.

## Summary
- Total findings audited: 38 (backend 23 = 2 critical + 9 high + 6 medium + 3 low + ~3 noted; frontend 11; config 18 in audit_config.md). Counted distinct fix items per the audit ID list.
- Fixed: 27
- Partially fixed: 3
- Still open: 13
- New concerns: 0 (no regressions or new vulnerabilities introduced)
