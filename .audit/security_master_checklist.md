# Security Master Checklist — personality-platform

Stack: Laravel 10 (PHP 8.1+), Inertia.js, React 18 + MUI 7, MySQL via phpMyAdmin, Spatie media-library / permission / translatable, isomorphic-dompurify, mews/purifier, Laravel Sanctum, Vite.

Severity: **C** critical, **H** high, **M** medium, **L** low.

## A — Authentication & Session

- [ ] **A1 (C)** Default credentials on admin user (seeders) and weak password policy
- [ ] **A2 (H)** Session fixation: regenerate session ID on login/logout/role change
- [ ] **A3 (H)** Sanctum/CSRF: `EnsureFrontendRequestsAreStateful` covers SPA paths; CSRF token rotation
- [ ] **A4 (H)** Cookie flags: `secure`, `httpOnly`, `same_site=lax|strict`, `domain` scoping
- [ ] **A5 (M)** Login rate limiting / brute-force protection (`RateLimiter::for('login', ...)`)
- [ ] **A6 (M)** Remember-me token rotation on password change
- [ ] **A7 (L)** Generic auth error messages (avoid user enumeration)
- [ ] **A8 (M)** Logout invalidates session server-side, not just clears cookie
- [ ] **A9 (M)** Password reset link single-use, short TTL, rate-limited
- [ ] **A10 (H)** Admin routes behind auth + role/permission middleware on EVERY route

## B — Authorization & Access Control

- [ ] **B1 (C)** IDOR on admin resources (Page, ContentItem, Scholar, Book) — Policies enforce ownership/role
- [ ] **B2 (H)** Mass-assignment: every Eloquent model has `$fillable` (NOT `$guarded = []`)
- [ ] **B3 (H)** Policy/Gate registered for each resource and applied via `authorize()`
- [ ] **B4 (M)** No "soft" admin checks (relying solely on UI hiding)
- [ ] **B5 (H)** Role checks: `manage settings`, `manage media`, `manage pages` consistently applied

## C — Input Validation & Injection

- [ ] **C1 (C)** No raw SQL via `DB::raw`/`whereRaw` with user input — use bindings
- [ ] **C2 (C)** SSRF in any URL fetch (avatar, OG, logos) — validate scheme + private-IP block
- [ ] **C3 (H)** Validation rules cover every request input (FormRequest preferred)
- [ ] **C4 (H)** XSS: every rich-text field passes through `mews/purifier` server-side AND `sanitizeHtml` client-side
- [ ] **C5 (H)** No raw HTML injection on un-sanitised user content
- [ ] **C6 (M)** URL fields validated (`url` rule + scheme allowlist) before render as link
- [ ] **C7 (H)** Translatable JSON fields sanitize each locale value
- [ ] **C8 (M)** Slug generation rejects path-traversal characters

## D — File Upload & Media

- [ ] **D1 (C)** Upload endpoints reject non-image MIMEs (validate **content**, not extension)
- [ ] **D2 (H)** File size capped (e.g. ≤10 MB) and disk has quota
- [ ] **D3 (H)** Stored under non-executable path; `.htaccess` / nginx config blocks PHP execution in `public/uploads`
- [ ] **D4 (H)** Filename sanitised (random UUID); no user-controlled path components
- [ ] **D5 (M)** SVG uploads disabled OR sanitised (DOMPurify on server)
- [ ] **D6 (M)** EXIF/metadata stripping for images
- [ ] **D7 (H)** Path traversal: `delete` and `picker` operate on stored paths only, never raw input
- [ ] **D8 (H)** Spatie media-library temp uploads cleared

## E — CSRF / CORS / Security Headers

- [ ] **E1 (H)** CSRF middleware applied; `VerifyCsrfToken` exemption list minimal
- [ ] **E2 (H)** CSP with nonce (no `unsafe-inline`), `frame-ancestors 'none'` unless required
- [ ] **E3 (H)** HSTS (production), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] **E4 (M)** Permissions-Policy disables unused features
- [ ] **E5 (H)** CORS: `config/cors.php` not `*`, allowed origins explicit
- [ ] **E6 (M)** SameSite cookie + `X-XSS-Protection: 0`

## F — Configuration & Secrets

- [ ] **F1 (C)** `.env` not committed; `.env.example` is template only
- [ ] **F2 (C)** `APP_DEBUG=false`, `APP_ENV=production` for prod
- [ ] **F3 (C)** `APP_KEY` not the framework default
- [ ] **F4 (H)** `storage/logs` not web-accessible
- [ ] **F5 (H)** `phpMyAdmin` not exposed publicly OR behind VPN/IP allowlist + strong creds
- [ ] **F6 (M)** Database user least-privilege (no `GRANT ALL` to app user)
- [ ] **F7 (H)** Mail/queue/redis credentials rotated; not default
- [ ] **F8 (M)** Trusted proxies configured for correct IP behind LB

## G — Cryptography

- [ ] **G1 (H)** Passwords use bcrypt/argon2 (Laravel default ok, ensure cost ≥12)
- [ ] **G2 (M)** Session encryption (`SESSION_ENCRYPT=true`) on shared infra
- [ ] **G3 (M)** Sensitive DB fields encrypted at rest (e.g. PII, API tokens) via cast `encrypted`
- [ ] **G4 (L)** Crypto API: no `md5`/`sha1` for security-relevant hashing

## H — Logging & Monitoring

- [ ] **H1 (M)** Auth failures, privilege changes, admin actions logged
- [ ] **H2 (M)** No secrets/PII in logs (mask tokens/passwords)
- [ ] **H3 (L)** Log rotation; centralised log shipping

## I — Frontend (React/MUI)

- [ ] **I1 (H)** All raw-HTML React props consume pre-sanitised content (DOMPurify on the server, re-run client-side as defence in depth)
- [ ] **I2 (H)** External link `rel="noopener noreferrer"` on `target="_blank"`
- [ ] **I3 (H)** No prototype-pollution sinks (deep-merge on untrusted JSON keys)
- [ ] **I4 (M)** Inertia shared props don't leak server state (`auth.user.password`, tokens)
- [ ] **I5 (H)** `axios` requests include CSRF token; bearer tokens not stored in `localStorage`
- [ ] **I6 (M)** No dynamic-code evaluation on user input
- [ ] **I7 (M)** SVG/HTML user content rendered via DOMPurify with `FORBID_TAGS: ['script','iframe']`

## J — Dependencies & Supply-chain

- [ ] **J1 (C)** `composer audit` clean (no known CVEs in `composer.lock`)
- [ ] **J2 (C)** `npm audit --omit=dev` clean for prod deps
- [ ] **J3 (M)** Package-lock + composer-lock committed (reproducible)
- [ ] **J4 (M)** Vite/postinstall scripts vetted for arbitrary code (supply-chain)
- [ ] **J5 (L)** SBOM available

## K — Server / CI / CD

- [ ] **K1 (H)** Deploy excludes `.env`, `.git`, `storage/logs`, `tests/`, `node_modules` from web root
- [ ] **K2 (M)** Web root is `public/`, not project root
- [ ] **K3 (M)** Nginx `client_max_body_size` matches upload cap
- [ ] **K4 (H)** TLS enforced (HTTPS redirect)
- [ ] **K5 (M)** No directory listing
- [ ] **K6 (M)** Rate limiting at LB/WAF for API endpoints

## L — phpMyAdmin

- [ ] **L1 (C)** Not on a default URL (`/phpmyadmin`) reachable from public internet
- [ ] **L2 (H)** IP allowlist or HTTP basic-auth in front
- [ ] **L3 (H)** Strong DB user password; separate user from app DB user
- [ ] **L4 (M)** Auto-logout, 2FA if available

## M — Business Logic

- [ ] **M1 (M)** Rate-limit contact form / newsletter to prevent spam
- [ ] **M2 (M)** Honeypot or captcha on public forms
- [ ] **M3 (L)** Cache invalidation on permission changes
- [ ] **M4 (M)** No SSRF in social-feed fetcher / newsletter integrations

---
**Total items**: 71
