# Remediation Summary

Per-file inventory of changes applied in the security-audit remediation pass.

## Backend (PHP)

| File | Change |
|------|--------|
| `app/Http/Controllers/Admin/MediaController.php` | Drop SVG from allowed MIMEs; derive stored extension from validated content-type; remove query-string `?path=` delete vector; new `sanitiseUploadPath()` rejects NUL/traversal/scheme/wrong-prefix/wrong-extension; both delete paths audit-logged via `Log::info` |
| `app/Http/Controllers/Auth/PasswordResetLinkController.php` | Per-email throttle (3/hour, sha256-of-lowercase-email cache key); silent fail on hit to avoid enumeration |
| `app/Http/Controllers/Api/EngagementController.php` | Page engagement now requires non-null slug; user-agent hashed to 64-char fingerprint instead of stored cleartext (≤500 chars previously) |
| `app/Http/Middleware/ContentSecurityPolicy.php` | Added `X-XSS-Protection: 0`; HSTS now includes `preload` |
| `app/Http/Middleware/HandleInertiaRequests.php` | `auth.user` payload reduced to `{id,name}` (dropped email + email_verified_at); Ziggy `query` removed from shared props |
| `app/Http/Middleware/SetLocale.php` | Removed 5 verbose `Log::debug` calls that flooded prod logs |
| `app/Http/Middleware/TrustProxies.php` | `$proxies` driven by `TRUSTED_PROXIES` env; supports comma-separated CIDR list; warns against `*` |
| `app/Http/Requests/Auth/LoginRequest.php` | Rate-limit runs before honeypot check; honeypot hits also call `recordFailedAttempt()` |
| `app/Models/ContentCategory.php` | `scopeOrderByTranslatable` rewritten with Eloquent JSON syntax (`->orderBy("col->locale", dir)`) — drops `DB::raw` interpolation foot-gun |
| `app/Models/Setting.php` | New `setValueAttribute()` mutator runs `clean()` on every richtext write path (seeders, imports, mass-assign) |
| `database/seeders/AdminUserSeeder.php` | Removed `'password'` fallback; production requires `ADMIN_SEED_PASSWORD ≥ 16` or skips; non-production generates 24-char password and prints it once; refuses to default `ADMIN_SEED_EMAIL` |
| `database/seeders/RolesAndPermissionsSeeder.php` | Removed `manage media` from default Editor permissions |
| `routes/web.php` | Admin route group wrapped in `->middleware(['csp'])` so admin pages get full security-header set |

## Frontend (JS)

| File | Change |
|------|--------|
| `resources/js/utils/sanitize.js` | New `safeUrl()` (allow-list scheme guard) + `safeBackgroundUrl()` (CSS-quote-safe URL guard) + DOMPurify `afterSanitizeAttributes` hook forcing `rel="noopener noreferrer"` on `target=_blank` |
| `resources/js/Components/RichTextEditor.jsx` | Quill `handleChange` now runs `sanitizeHtml()` on user input as defence in depth |
| `resources/js/Components/MediaPicker.jsx` | Preview gated by `safeUrl()`; `accept` MIME list drops SVG; helper text drops SVG |
| `resources/js/Components/Blocks/HeroBanner.jsx` | `safeUrl()` on `ctaLink` + `secondaryCtaLink` |
| `resources/js/Components/Blocks/PlatformCta.jsx` | `safeUrl()` on `ctaLink`; `safeBackgroundUrl()` on `pattern_image_url` |
| `resources/js/Components/Blocks/StatsCounter.jsx` | `safeBackgroundUrl()` on `background_image_url` |
| `resources/js/Components/Blocks/QuranVerse.jsx` | `safeUrl()` on CTA link; `safeBackgroundUrl()` replacing inline regex |
| `resources/js/Components/Blocks/BooksGrid.jsx` | `safeUrl()` on `book.buy_link` |
| `resources/js/Components/Blocks/SocialMediaFeed.jsx` | `safeUrl()` on `acc.url` |
| `resources/js/Components/Blocks/PillarCards.jsx` | `safeUrl()` on `cardLink` |
| `resources/js/Components/Blocks/LogoGrid.jsx` | `safeUrl()` on `link` and CTA `ctaLink` |
| `resources/js/Layouts/PublicLayout.jsx` | `safeUrl()` on NavLink, drawer links, header CTA, footer items, social-icon hrefs; `rel=noopener` always emitted on external anchors |
| `resources/js/Pages/Admin/Pages/Form.jsx` | `fetch()` adds `credentials: 'same-origin'` for consistency |
| `resources/js/Pages/Admin/Media/Index.jsx` | Delete handler tracks full media object and dispatches `path` in POST body for upload-source items (numeric ids still bind via route) |

## Configuration / docs

| File | Change |
|------|--------|
| `.env.example` | `APP_ENV=production`, `APP_DEBUG=false`, `LOG_LEVEL=warning`, `SESSION_SECURE_COOKIE=true`, `DB_USERNAME=app_user`, `ADMIN_SEED_*` forced empty, new `TRUSTED_PROXIES=` placeholder; security comments throughout |
| `phpunit.xml` | `DB_USERNAME` / `DB_PASSWORD` cleared; comment instructs supplying via `.env.testing` |
| `config/cors.php` | `allowed_methods` enumerated (`GET, POST, PUT, PATCH, DELETE, OPTIONS`) |
| `config/ziggy.php` | `admin.*` added to `except` |
| `storage/app/public/.htaccess` | New file. Denies `.php/.phar/.phtml/.svg/.html` etc; forces `nosniff` + sandboxed CSP + `Content-Disposition: attachment` for HTML/SVG/XML; disables PHP engine and `ExecCGI` |
| `docs/deployment-cpanel.md` | Least-privilege MySQL grant; `TRUSTED_PROXIES` instead of `$proxies='*'`; new file-mapping entry for storage `.htaccess` |
| `package-lock.json` | `npm audit fix` upgrade of axios / dompurify / follow-redirects |
| `public/sitemap.xml` | Untracked from git (already gitignored) |

## Verification artifacts

- `.audit/security_master_checklist.md` — 71-item checklist used as audit baseline
- `.audit/audit_backend.md` — 20 backend findings (2C/9H/6M/3L)
- `.audit/audit_frontend.md` — 11 frontend findings (0C/4H/4M/3L)
- `.audit/audit_config.md` — 18 config/infra findings (2C/6H/7M/3L)
- `.audit/verification_report.md` — independent re-audit of every fix
- `.audit/security_audit_report.md` — top-level report
- `.audit/remaining_risks.md` — 13 known-remaining items with priorities
