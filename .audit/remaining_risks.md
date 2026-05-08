# Remaining Risks

Items the audit surfaced that were not closed in this pass. None are Critical or High after the remediations; all are Medium / Low / accepted-risk.

## Action required (operator)

### R1 — Live `.env` still has dev values (audit F-01)
Working-tree `.env` has `APP_DEBUG=true`, `APP_ENV=local`, `LOG_LEVEL=debug`, `DB_USERNAME=root`, `DB_PASSWORD=123`. The file is gitignored, so it will not ship to production via `git push`, but it WILL be deployed if you `rsync` the working tree. Before any prod deploy:

```bash
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=warning
SESSION_SECURE_COOKIE=true
TRUSTED_PROXIES=<your CDN/LB CIDR>
ADMIN_SEED_EMAIL=<unique mailbox you control>
ADMIN_SEED_PASSWORD=<random ≥16 chars>
DB_USERNAME=<least-privilege user>
DB_PASSWORD=<random ≥20 chars>
```

Recommendation: add a `php artisan about` smoke step to the deploy script that fails when `app.debug=true` and `app.env=production`.

### R2 — phpMyAdmin exposure (audit L1/L2)
phpMyAdmin must NOT be reachable from the public internet on a default URL. Either:
- bind it to localhost and tunnel via SSH, OR
- put it behind HTTP basic-auth + IP allow-list, OR
- delete the install entirely and use SSH + mysql CLI.

The deployment doc gates DB setup on phpMyAdmin which is fine for *initial setup*; production access should not rely on it.

### R3 — `public/robots.txt` discloses admin path (audit K-02)
`Disallow: /admin` confirms the admin URL even when `ADMIN_PATH` is renamed. Either render `robots.txt` dynamically from `config('admin.path')`, or remove the admin entry entirely.

## Code follow-ups (low priority)

| ID | Title | File | Recommended fix |
|----|-------|------|-----------------|
| C8.M2 | Page slug regex too permissive (allows numeric-only / reserved words) | `routes/web.php:34,38,53` | Tighten to `[a-z][a-z0-9-]*` and reject `admin/api/storage/dashboard` via custom validation rule |
| D2.M5 | Featured-image cap (2 MB) inconsistent with picker (10 MB) | `app/Http/Requests/Admin/StoreContentItemRequest.php:68` | Move to `config/media.php`, share between callers; add per-user daily quota |
| M2.L3 | Honeypot field name `_confirm_email` is guessable | `LoginRequest.php`, `StoreContactSubmissionRequest.php` | Rotate field name per deploy via env var; add time-to-fill check |
| F8.M6 | `TrustProxies::$proxies = '*'` still accepted when env explicitly set | `app/Http/Middleware/TrustProxies.php` | Refuse `*` when `app.env=production` (defence in depth — docs already discourage it) |

## Accepted risks

| ID | Why accepted |
|----|--------------|
| E-02 — `style-src 'unsafe-inline'` permanent | MUI v7 injects inline `<style>` tags. The fix is `StyledEngineProvider` SSR with nonce per request — non-trivial integration work. Short-term: documented and gated behind `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` so CSS-injection impact is contained. |
| E-03 — `script-src 'unsafe-inline'` when `APP_ENV=local` | Vite HMR needs inline runtime hooks in dev. Production path closes after F-01/F-03 (`.env.example` defaults to `production`). |
| F-07 — `public/hot` present on disk | Already gitignored; only ships if a deploy script syncs the working tree without honouring `.gitignore`. Add an explicit `--exclude='public/hot'` to deploy rsync. |

## Out of scope for this audit

- Multi-factor auth on admin login (suggested but not part of the original threat model)
- WAF / fail2ban-style intrusion detection (deployment-environment concern)
- Backup encryption + offsite rotation (operational)
- Penetration test by external firm (recommended once the platform handles real PII or accepts payments)

## Quick reference — defence layers in place after remediation

1. **Network/host:** TLS-only, HSTS preload eligible, CSP/Permissions-Policy/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/X-XSS-Protection on every response (public + admin).
2. **Auth:** escalating-lockout login limiter (1m → 24h), per-email password-reset throttle, no enumeration, generic auth errors, sessions regenerated on login/logout, encrypted at rest, `httpOnly + same_site=lax + secure (env-driven)`.
3. **Authorization:** Spatie roles + `Gate::authorize` on every admin action; default Editor role no longer holds `manage media`.
4. **Input:** `mews/purifier` + DOMPurify (server + client); URL allow-list (`safeUrl`); CSS URL allow-list (`safeBackgroundUrl`); Spatie translatable sanitised on every write path; Quill output sanitised on save.
5. **File uploads:** MIME-content validated (not extension); extension derived from MIME; SVG banned; storage disk denies PHP/HTML/SVG via `.htaccess`; `Content-Disposition: attachment` on potentially-script-bearing types.
6. **Dependencies:** `composer audit` clean; `npm audit` clean for prod (Quill HTML-export XSS remains in dev tooling, not exposed by the app).
7. **Operations:** admin actions audit-logged (media deletes, login lockout events); `.env`/`phpunit.xml` carry no secrets; `Trusted_Proxies` env-driven; deployment doc updated with least-privilege grants and Cloudflare CIDRs.
