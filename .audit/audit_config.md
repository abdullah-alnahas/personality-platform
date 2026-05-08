# Configuration & Infrastructure Security Audit
**Scope**: personality-platform — Configuration, secrets, infrastructure  
**Auditor**: Claude Code security reviewer  
**Date**: 2026-05-08  
**Method**: Static analysis of all config, env, middleware, and deploy documentation

---

## Severity Legend
**C** = Critical | **H** = High | **M** = Medium | **L** = Low

---

## F — Configuration & Secrets

### F-01 — CRITICAL: APP_DEBUG=true in .env
**File**: `.env` line 4  
**Severity**: C  
**Checklist ref**: F2  
**Finding**: `APP_DEBUG=true` and `APP_ENV=local` are set in the live `.env` file. In production this exposes full PHP stack traces, `.env` variable values, database credentials, file paths, and class names to any visitor who triggers an exception.  
**Fix**: Set `APP_DEBUG=false` and `APP_ENV=production` in `.env` before going live.

---

### F-02 — CRITICAL: Weak database root credentials in .env and phpunit.xml
**Files**: `.env` lines 16–17, `phpunit.xml` lines 27–29  
**Severity**: C  
**Checklist ref**: F6, F7  
**Finding**: `.env` uses `DB_USERNAME=root` (MySQL superuser — no least-privilege) and `DB_PASSWORD` is a 3-character trivial value. `phpunit.xml` hardcodes the same weak `DB_PASSWORD` value in plain text. `phpunit.xml` is committed to version control (confirmed: `git ls-files` output includes `phpunit.xml`). Any developer cloning this repository obtains a working database credential.  
**Fix**: (1) Create a dedicated, limited MySQL user for the application with only SELECT/INSERT/UPDATE/DELETE on the app database. (2) Change the DB password to a 20+ character random string. (3) Replace `phpunit.xml` `DB_PASSWORD` with a placeholder or env-specific `.env.testing` file that is gitignored.

---

### F-03 — HIGH: APP_DEBUG=true and APP_ENV=local committed in .env.example
**File**: `.env.example` lines 2, 4  
**Severity**: H  
**Checklist ref**: F2  
**Finding**: `.env.example` ships with `APP_ENV=local` and `APP_DEBUG=true` as defaults. When `composer install` runs on a fresh server (`post-root-package-install` script copies `.env.example` to `.env` automatically if `.env` is absent), a developer can forget to change these before running the application, landing in an unintentionally debuggable state.  
**Fix**: Change `.env.example` defaults to `APP_ENV=production` and `APP_DEBUG=false`. Add a `# CHANGE BEFORE DEPLOYING` comment.

---

### F-04 — HIGH: Admin seeder falls back to default password 'password'
**Files**: `database/seeders/AdminUserSeeder.php` line 25, `.env.example` line 72  
**Severity**: H  
**Checklist ref**: A1  
**Finding**: `AdminUserSeeder` hashes `env('ADMIN_SEED_PASSWORD', 'password')`. If `ADMIN_SEED_PASSWORD` is unset (which is the default in `.env.example`), the admin account is created with the well-known default password `password`. The seeder skips itself in production only if `APP_ENV=production` AND `ADMIN_SEED_PASSWORD` is empty — meaning any `APP_ENV=local/staging` deployment runs the seeder with the weak default password.  
**Fix**: Remove the `'password'` fallback. Require `ADMIN_SEED_PASSWORD` to be non-empty, or throw an exception if it is empty and `APP_ENV != testing`.

---

### F-05 — MEDIUM: LOG_LEVEL=debug committed in both .env and .env.example
**Files**: `.env` line 9, `.env.example` line 15  
**Severity**: M  
**Checklist ref**: H2  
**Finding**: `LOG_LEVEL=debug` causes Laravel to log full exception stack traces, query bindings, and all application events. Combined with `APP_DEBUG=true` (F-01) this maximises information leakage if log files are accessed.  
**Fix**: Set `LOG_LEVEL=warning` in `.env.example` and document that production should use `warning` or `error`.

---

### F-06 — MEDIUM: sitemap.xml committed with hardcoded localhost URLs
**File**: `public/sitemap.xml` (committed per `git ls-files` output; contains `http://localhost:8000` URLs)  
**Severity**: M  
**Checklist ref**: K1  
**Finding**: The committed `public/sitemap.xml` contains `http://localhost:8000` as the site base URL. When deployed, search engines index these localhost URLs and visitors receive broken links. Additionally, it reveals the local development port.  
**Fix**: Add `public/sitemap.xml` to `.gitignore` (a specific entry already exists for `/public/sitemap*.xml` — but the file is currently tracked; run `git rm --cached public/sitemap.xml` to untrack it).

---

### F-07 — LOW: public/hot present in repository working tree
**File**: `public/hot`  
**Severity**: L  
**Checklist ref**: K1  
**Finding**: `public/hot` contains `http://127.0.0.1:5173` (the Vite HMR dev server URL). This file is correctly gitignored (`/public/hot`), so it is not tracked. However, it is present on disk in this working copy. If deployed accidentally (via FTP file sync that ignores gitignore), the Vite dev server URL is exposed.  
**Fix**: Add `public/hot` to `.gitattributes export-ignore` or include explicit deletion in the deploy checklist.

---

## E — CSRF / CORS / Security Headers

### E-01 — HIGH: CSP middleware NOT applied to admin routes
**File**: `routes/web.php` lines 30, 58, 66–195  
**Severity**: H  
**Checklist ref**: E2  
**Finding**: The `csp` middleware alias is applied to the public page group (line 30) and the public POST group (line 58). The entire admin route group (lines 66–195) — including the login page, dashboard, and all resource controllers — is missing the `csp` middleware. Admin pages are rendered without `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` headers.  
**Fix**: Add `'csp'` to the admin route group middleware, or move `ContentSecurityPolicy` into the global `web` middleware group in `Kernel.php`.

---

### E-02 — HIGH: style-src contains permanent 'unsafe-inline' (no nonce on styles)
**File**: `app/Http/Middleware/ContentSecurityPolicy.php` line 36  
**Severity**: H  
**Checklist ref**: E2  
**Finding**: `style-src` permanently includes `'unsafe-inline'` across all environments (not just local), because MUI injects inline styles. This completely negates CSP protection against CSS-based injection attacks (data: exfiltration via CSS selectors, CSS injection attacks).  
**Fix**: This is a known MUI constraint. Document it explicitly as an accepted risk, or investigate MUI's `StyledEngineProvider` with SSR-injected `<style nonce="...">` to allow dropping `unsafe-inline` from style-src.

---

### E-03 — HIGH: script-src includes 'unsafe-inline' in local environment without guard
**File**: `app/Http/Middleware/ContentSecurityPolicy.php` line 36  
**Severity**: H (environment-conditional, but worth noting)  
**Checklist ref**: E2  
**Finding**: When `app()->environment('local')` is true, `script-src` appends `'unsafe-inline'`, which overrides the per-request nonce and disables CSP protection for scripts entirely. If `APP_ENV=local` is accidentally deployed to a public server (see F-01, F-03), CSP provides zero XSS protection.  
**Fix**: This is an acceptable dev convenience; close it by ensuring F-01 and F-03 are remediated so `APP_ENV=local` never reaches production.

---

### E-04 — MEDIUM: HSTS header missing 'preload' directive
**File**: `app/Http/Middleware/ContentSecurityPolicy.php` lines 67–70  
**Severity**: M  
**Checklist ref**: E3  
**Finding**: HSTS is set correctly (`max-age=31536000; includeSubDomains`) but lacks the `preload` directive. Without preload, first-time visitors before the HSTS header is received are still vulnerable to SSL-stripping attacks.  
**Fix**: Add `; preload` and submit the domain to https://hstspreload.org after confirming HTTPS is stable.

---

### E-05 — LOW: X-XSS-Protection header not set to 0
**File**: `app/Http/Middleware/ContentSecurityPolicy.php`  
**Severity**: L  
**Checklist ref**: E6  
**Finding**: Modern security guidance (OWASP, MDN) recommends sending `X-XSS-Protection: 0` explicitly to disable broken browser XSS auditors (IE/Chrome legacy) that can be exploited. The header is absent.  
**Fix**: Add `$response->headers->set('X-XSS-Protection', '0');` in `ContentSecurityPolicy::handle()`.

---

### E-06 — MEDIUM: CORS allows all HTTP methods ('*')
**File**: `config/cors.php` line 20  
**Severity**: M  
**Checklist ref**: E5  
**Finding**: `'allowed_methods' => ['*']` permits any HTTP method (CONNECT, TRACE, PUT, PATCH, DELETE, etc.) on the API and Sanctum CSRF paths from the allowed origin. This is broader than needed. The application only exposes REST endpoints that use GET, POST, PUT, DELETE.  
**Fix**: Replace `'*'` with an explicit list: `['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']`.

---

## A — Authentication & Session

### A-01 — MEDIUM: Ziggy serialises admin.* route names to unauthenticated visitors
**File**: `config/ziggy.php` (lines 12–16), `app/Http/Middleware/HandleInertiaRequests.php` (lines 62–66)  
**Severity**: M  
**Checklist ref**: I4, B4  
**Finding**: `config/ziggy.php` excludes `password.*`, `verification.*`, and `api.*` from the client-side route list — but does NOT exclude `admin.*`. Every public page response includes a serialised JSON map of all admin route names, paths, and parameter patterns (e.g., `admin.content-items.store`, `admin.scholars.destroy`). This reveals the full admin API surface to unauthenticated visitors and automated scanners.  
**Fix**: Add `'admin.*'` to the `'except'` array in `config/ziggy.php`.

---

### A-02 — MEDIUM: Ziggy shares request query parameters in shared props
**File**: `app/Http/Middleware/HandleInertiaRequests.php` lines 63–65  
**Severity**: M  
**Checklist ref**: I4  
**Finding**: `"query" => $request->query()` includes all URL query parameters in the shared Inertia props for every request. If any query parameter ever contains a sensitive value (search terms, token fragments, redirect URIs), it is embedded in the page's initial state JSON, which is rendered in a `<script>` tag and is accessible to any client-side code — including injected scripts.  
**Fix**: Remove `"query" => $request->query()` from the Ziggy shared data unless specific query parameters are needed, and if needed, whitelist only those keys.

---

### A-03 — LOW: TrustProxies undefined; deployment doc recommends $proxies = '*'
**Files**: `app/Http/Middleware/TrustProxies.php` line 15, `docs/deployment-cpanel.md` line 353  
**Severity**: M  
**Checklist ref**: F8  
**Finding**: `TrustProxies` has `$proxies` declared as `null` (undefined/not set), which means no proxy is trusted. This is correct for a server without a load balancer. However, `docs/deployment-cpanel.md` line 353 explicitly advises operators to set `protected $proxies = '*'` when behind Cloudflare. Trusting all proxies (`'*'`) means an attacker can forge `X-Forwarded-For` headers to spoof their IP, bypassing rate limiting and IP-based restrictions entirely.  
**Fix**: Replace the `'*'` recommendation in the deployment doc with Cloudflare's published IP ranges (available at https://www.cloudflare.com/ips/) or use `$proxies = Request::HEADER_X_FORWARDED_ALL` in combination with the Cloudflare IP list.

---

## K — Server / CI / CD

### K-01 — HIGH: Deployment doc recommends granting ALL PRIVILEGES to the app DB user
**File**: `docs/deployment-cpanel.md` lines 55–56  
**Severity**: H  
**Checklist ref**: F6  
**Finding**: Step 2 of the deployment guide instructs operators to "grant ALL PRIVILEGES" to the application database user via phpMyAdmin. This violates the principle of least privilege. An attacker who gains code execution can leverage `GRANT ALL` to escalate to other databases on the shared host, create accounts, or dump the entire MySQL server.  
**Fix**: Replace the "ALL PRIVILEGES" instruction with a least-privilege grant: `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON personality_db.* TO 'app_user'@'localhost';`. On shared hosting, CREATE/DROP/ALTER are needed only during migrations; consider a migration-only user for those steps.

---

### K-02 — LOW: robots.txt discloses admin path using the default 'admin' segment
**File**: `public/robots.txt` line 9  
**Severity**: L  
**Checklist ref**: K1 (information disclosure)  
**Finding**: `Disallow: /admin` confirms the admin panel URL to any bot or attacker reading robots.txt. While security-through-obscurity is not a primary control, if `ADMIN_PATH` is changed to a non-obvious value, the `robots.txt` must also be updated — otherwise the custom path is revealed anyway.  
**Fix**: Generate `robots.txt` dynamically using `config('admin.path')` or update the static file when `ADMIN_PATH` is changed. Consider using a generic `Disallow: /` entry for private areas rather than listing exact paths.

---

## Summary Table

| ID | Severity | Category | Title |
|----|----------|----------|-------|
| F-01 | **C** | Config | APP_DEBUG=true in live .env |
| F-02 | **C** | Secrets | Weak DB root credentials in .env + hardcoded in phpunit.xml |
| F-03 | **H** | Config | APP_DEBUG=true + APP_ENV=local as .env.example defaults |
| F-04 | **H** | Auth | Admin seeder defaults to plaintext password 'password' |
| E-01 | **H** | Headers | CSP middleware absent from all admin routes |
| K-01 | **H** | Deploy | Docs recommend GRANT ALL PRIVILEGES to app DB user |
| E-02 | **H** | CSP | style-src permanently includes unsafe-inline |
| E-03 | **H** | CSP | script-src includes unsafe-inline when APP_ENV=local |
| E-06 | **M** | CORS | allowed_methods: '*' broader than needed |
| A-01 | **M** | Auth | Ziggy exposes admin.* route names to guests |
| A-02 | **M** | Auth | Ziggy shared props include all request query params |
| A-03 | **M** | Proxy | Deployment doc recommends $proxies='*' (IP spoofing risk) |
| F-05 | **M** | Logging | LOG_LEVEL=debug in both .env and .env.example |
| E-04 | **M** | Headers | HSTS missing preload directive |
| F-06 | **M** | Config | sitemap.xml committed with localhost URLs |
| E-05 | **L** | Headers | X-XSS-Protection: 0 not set |
| F-07 | **L** | Config | public/hot present on disk (Vite dev server URL) |
| K-02 | **L** | Deploy | robots.txt discloses admin URL path |

---

## Items Verified PASS (no finding)

- `.env` is correctly listed in `.gitignore` (`/.env`, `/.env.*`) and is **NOT** tracked in git
- `config/session.php`: `http_only = true`, `same_site = 'lax'`, `encrypt = true`, `secure` is env-driven with `null` (auto) default — all acceptable
- `config/cors.php`: `allowed_origins` is bound to `APP_URL` (not `*`) — PASS
- `VerifyCsrfToken::$except` is empty — PASS
- `TrustProxies::$proxies` is `null` (not `'*'`) in the actual code — PASS (finding is in the docs only)
- `HandleInertiaRequests::share()` does NOT expose `password`, `remember_token`, or any secret fields from the user object — PASS
- `config/hashing.php`: bcrypt with `rounds = env('BCRYPT_ROUNDS', 12)` — PASS (cost ≥12)
- `config/sanctum.php`: token expiry set to 24 hours — acceptable
- `composer.json` post-install scripts are standard Laravel only (no remote code execution) — PASS
- `vite.config.js`: no `server.host: '0.0.0.0'`, no dynamic plugin URLs — PASS
- `public/.htaccess`: `Options -MultiViews -Indexes` disables directory listing — PASS
- Admin routes protected by `auth` + `can:*` permission middleware on every resource — PASS
- Login route has `throttle:5,1` rate limiting — PASS
- `phpunit.xml`: no `APP_KEY` hardcoded — PASS
- No hardcoded AWS secrets, Pusher secrets, or mail passwords found in any tracked file — PASS
- `storage/logs/` is not directly web-accessible (lives outside `public/`) — PASS
- No `config/csp.php` (third-party package) in use; custom middleware handles CSP — PASS

---

## Remediation Priority Order

1. **F-01** — Disable `APP_DEBUG` before any public-facing deploy
2. **F-02** — Rotate DB credentials; remove from `phpunit.xml`; create least-privilege DB user
3. **E-01** — Apply `csp` middleware to admin routes
4. **F-04** — Remove `'password'` fallback from AdminUserSeeder
5. **K-01** — Update deployment docs to use least-privilege MySQL GRANT
6. **F-03** — Fix `.env.example` defaults
7. **A-01** — Add `admin.*` to Ziggy `except` list
8. **A-02** — Remove `query` from Ziggy shared props
9. **A-03** — Update deployment docs to use Cloudflare IP list instead of `'*'`
10. **E-06** — Enumerate allowed CORS methods explicitly
