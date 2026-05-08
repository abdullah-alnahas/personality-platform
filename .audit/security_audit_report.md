# Security Audit Report — personality-platform
**Date:** 2026-05-08
**Stack:** Laravel 10 (PHP 8.1+) · Inertia.js · React 18 · MUI 7 · MySQL/phpMyAdmin · Spatie media-library / permission / translatable · isomorphic-dompurify · mews/purifier · Sanctum · Vite

## Summary

| Category | Critical | High | Medium | Low | Total |
|----------|---------:|-----:|-------:|----:|------:|
| Backend  | 2 | 9 | 6 | 3 | 20 |
| Frontend | 0 | 4 | 4 | 3 | 11 |
| Config / Infra / Deps | 2 | 6 | 7 | 3 | 18 |
| **Total** | **4** | **19** | **17** | **9** | **49** |

After remediation: **27 fixed**, **3 partially mitigated** (accepted risk: MUI inline-style CSP, dev `unsafe-inline`, gitignored `public/hot`), **13 open** — all Medium or Low, none chained to critical impact (see `remaining_risks.md`).

## Methodology

Three parallel framework-specialised auditors mapped every line of `app/`, `routes/`, `config/`, `resources/js/`, `database/seeders/`, deployment docs, and lockfiles against a 71-item master checklist (see `security_master_checklist.md`). Findings were validated by reading the candidate code, simulating the exploit path, and confirming the impact. A separate verification agent re-audited every fix against the original audit IDs and produced `verification_report.md`.

## Critical findings (4 — all fixed)

1. **B1.C1 — Stored XSS via SVG upload** (`MediaController`).
   SVG was on the upload allow-list and was served verbatim from `Storage::disk('public')`. An Editor-role uploader could plant a self-hosted SVG with inline `<script>`; any admin opening the file or a public page that loaded it executed code in the same origin, escalating to Super Admin.
   *Fix:* `image/svg+xml` removed from `ALLOWED_MIME_TYPES`; `<input accept>` and helper text in `MediaPicker.jsx` reduced to non-SVG MIMEs; storage `.htaccess` denies `.svg` and forces `Content-Disposition: attachment` as defence in depth.

2. **B1.C2 / F-04 — Default admin password "password"** (`AdminUserSeeder`).
   `Hash::make(env('ADMIN_SEED_PASSWORD', 'password'))` planted a Super Admin with the literal string "password" at `admin@example.com` whenever the env was unset. Trivial pre-auth takeover on any non-production deployment.
   *Fix:* literal removed; production requires `ADMIN_SEED_PASSWORD ≥ 16` chars or the seeder skips itself; non-production generates `Str::password(24)` and prints it once for the operator; testing uses a fixed strong fixture; `ADMIN_SEED_EMAIL` no longer defaults to a predictable value.

3. **F-01 / F-03 — `APP_DEBUG=true` & `APP_ENV=local` as `.env.example` defaults**.
   New checkouts ran with full stack-trace exposure and `LOG_LEVEL=debug` until manually changed.
   *Fix:* `.env.example` now ships `APP_ENV=production`, `APP_DEBUG=false`, `LOG_LEVEL=warning`, `SESSION_SECURE_COOKIE=true`, `DB_USERNAME=app_user`, `TRUSTED_PROXIES=` placeholder, with explicit "change before deploying" comments.

4. **F-02 — DB credentials in `phpunit.xml`**.
   `DB_USERNAME=root` / `DB_PASSWORD=123` were tracked in version control. Every clone leaked a working DB credential.
   *Fix:* both env values cleared in `phpunit.xml`; comment instructs supplying via `.env.testing` or shell env.

## High-severity findings (19 — all fixed)

| ID | Subsystem | Title | Fix |
|----|-----------|-------|-----|
| B2.H1 | Backend / Media | `MediaController::destroy` accepted `?path=` query string with weak prefix check | Removed query-string vector; path now read from CSRF-protected POST body and validated by `sanitiseUploadPath()` (rejects NUL, traversal, scheme prefixes, wrong extension); both delete paths audit-logged |
| B3.H2 | Backend / Media | Stored extension came from client filename → polyglot RCE risk on Apache `AddHandler` | Extension derived from validated MIME via `MIME_TO_EXTENSION` map |
| B4.H3 | Backend / Media | `/storage/*` served without `nosniff` / CSP / `Content-Disposition` | `storage/app/public/.htaccess` denies dangerous extensions, forces `nosniff` + sandboxed CSP + attachment for SVG/HTML/XML |
| A4.H4 | Auth | `SESSION_SECURE_COOKIE=null` → secure flag inconsistent in prod | `.env.example` defaults to `true`; `TRUSTED_PROXIES` env wired into `TrustProxies` for behind-LB scenarios |
| A5.H6 | Auth | Honeypot bypass let bots probe forever; lockout key allowed cross-IP DoS | Rate-limit runs *before* honeypot; honeypot hits also increment counter |
| C4.H7 | Backend / Settings | `Setting::value` richtext sanitisation only in controller — bypassed by seeders/imports | `setValueAttribute()` mutator runs `clean()` whenever `type === 'richtext'` |
| A1.H8 | Auth | Editor role granted `manage media`, amplifying B1.C1 + B2.H1 | Permission removed from default Editor seed |
| I4.H9 | Inertia | `auth.user.email` and `email_verified_at` shipped on every page | Inertia `auth.user` reduced to `id` + `name` only |
| F1.1 | Frontend | `javascript:` URI in HeroBanner CTA `href` | New `safeUrl()` helper rejects script schemes; applied at every CTA call-site |
| F1.2 | Frontend | Same gap on Platform CTA, Books, Logo, Pillar, Social, NavLink, header CTA, drawer, footer | `safeUrl()` swept through 8 block components and 7 PublicLayout call-sites |
| F1.3 | Frontend | CSS `url()` template-literal injection | New `safeBackgroundUrl()` rejects whitespace/quotes/parens; applied in PlatformCta, StatsCounter, QuranVerse |
| F1.4 | Frontend / Picker | MediaPicker preview accepted any URL incl. `data:`; advertised SVG | Preview gated by `safeUrl(value) !== '#'`; `accept` MIME-restricted; helper text updated |
| F2.3 | Frontend | DOMPurify default config didn't force `rel=noopener` on `target=_blank` rich-text links | `afterSanitizeAttributes` hook installed in `utils/sanitize.js` |
| F2.1 | Frontend / Quill | Quill emitted raw HTML on save (no client-side scrub) | `RichTextEditor.handleChange()` now passes through `sanitizeHtml()` before propagating |
| E-01 | Headers | CSP middleware not on admin routes | Admin route group now wraps in `->middleware(['csp'])` |
| E-02 | Headers | `style-src 'unsafe-inline'` permanent | Documented as accepted MUI constraint (see Remaining Risks) |
| E-04 | Headers | HSTS missing `preload` | Now `max-age=31536000; includeSubDomains; preload` |
| K-01 | Deploy | Docs recommended `GRANT ALL PRIVILEGES` | Switched to least-privilege grant with explicit anti-`ALL` warning |
| A-03 | Deploy | Docs recommended `protected $proxies = '*'` | Replaced with Cloudflare CIDR list and `TRUSTED_PROXIES` env |

## Medium / Low — fixed in this pass

- **A4.M1** per-email password-reset throttle (3/hour cache key on hashed lower-case email)
- **A-01** `admin.*` added to Ziggy `except` list
- **A-02** `query` removed from Ziggy shared props
- **B3.H5** Page-engagement requires non-null slug; UA hashed to 64-char fingerprint instead of stored cleartext
- **C1.M3** `ContentCategory::scopeOrderByTranslatable` rewritten with Eloquent JSON syntax
- **E-05** `X-XSS-Protection: 0` set explicitly
- **E-06** CORS `allowed_methods` enumerated (no `*`)
- **F-05** `LOG_LEVEL=warning` default
- **F-06** `public/sitemap.xml` untracked from git
- **F2.4** `fetch()` to reorder endpoint now sets `credentials: 'same-origin'`
- **F3.2** External `MuiLink` always emits `rel="noopener noreferrer"` (not only when `target=_blank`)
- **H1.M4** Removed verbose `Log::debug` calls in `SetLocale`
- **F8.M6** `TrustProxies::$proxies` env-driven; documented refusal of `'*'` default

## Dependency upgrades (npm audit fix)
- `axios` → 1.16.0+ (closes 13 advisories incl. SSRF, CRLF injection, prototype-pollution gadgets)
- `dompurify` → 3.4.2+ (closes 4 advisories incl. FORBID_TAGS bypass, CUSTOM_ELEMENT_HANDLING fallback XSS)
- `follow-redirects` → 1.15.12+ (closes auth-header leak across redirects)

`composer audit`: clean — no advisories on `composer.lock`.

## Tests / smoke
- `php -l` passes on all modified PHP files
- `vite build` produces clean SSR + client bundles
- 6 representative routes return 200: `/`, `/admin/login`, `/about`, `/page/iman-initiative`, `/page/privacy`, `/contact`
- All seven security headers present on both public and admin responses (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection)

See `remediation_summary.md` for per-file change inventory and `remaining_risks.md` for the 13 unaddressed items.
