# Laravel Backend Audit

Scope: `app/Http/**`, `app/Models/**`, `app/Providers/**`, `app/Services/**`,
`routes/web.php`, `routes/api.php`, `routes/auth.php`,
`database/seeders/AdminUserSeeder.php`, `database/seeders/RolesAndPermissionsSeeder.php`.

---

## Critical

### B1.C1 — SVG uploads accepted without sanitisation (stored XSS)
- File: `app/Http/Controllers/Admin/MediaController.php:20-26, 82-89`
- Code:
  ```php
  private const ALLOWED_MIME_TYPES = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  ];
  // ...
  $request->validate([
      'file' => ['required', 'file', 'max:10240',
          'mimetypes:' . implode(',', self::ALLOWED_MIME_TYPES)],
  ]);
  ```
- Issue: `image/svg+xml` is on the allow-list and the file is stored verbatim
  on the public disk and served from `Storage::disk('public')->url($path)`.
  No DOMPurify / SVG sanitiser runs. `clean()` (mews/purifier) is never invoked
  on uploaded files — only on richtext block content.
- Exploit: An admin (or any user with `manage media` permission, including the
  default `Editor` role per `RolesAndPermissionsSeeder.php:53`) uploads a
  malicious SVG containing `<script>fetch('/admin/users',{credentials:'include'})…</script>`
  or an `<iframe>`. When any other admin previews the file in the picker, opens
  the direct URL, or the SVG is embedded inline anywhere on the public site
  (block image fields accept the URL via picker), the script executes in the
  origin's context — bypassing CSP because the SVG is same-origin. With the
  Editor role granted `manage media`, this gives an Editor a path to escalate
  to Super Admin by phishing a Super Admin into opening the SVG.
- Fix: (a) drop `image/svg+xml` from `ALLOWED_MIME_TYPES`; OR (b) run
  `enshrined/svg-sanitize` on the file contents server-side before
  `storeAs(...)` and reject the upload if the sanitiser rewrites/removes
  anything dangerous; AND (c) serve uploads with
  `Content-Disposition: attachment` or via a controller that forces a strict
  CSP on the response (`script-src 'none'; sandbox`).
- Confidence: high

### B1.C2 — Default admin password fallback is `password`
- File: `database/seeders/AdminUserSeeder.php:16-26`
- Code:
  ```php
  if (app()->environment('production') && !env('ADMIN_SEED_PASSWORD')) { return; }
  $adminUser = User::firstOrCreate(
      ['email' => env('ADMIN_SEED_EMAIL', 'admin@example.com')],
      ['password' => Hash::make(env('ADMIN_SEED_PASSWORD', 'password')), …]
  );
  ```
- Issue: In any non-production environment, and in production whenever
  `ADMIN_SEED_PASSWORD` is set to a weak value, the seeder creates a
  Super-Admin user with the literal string `"password"` (8 chars, top of every
  wordlist) at `admin@example.com`. There is no length / strength check on the
  env-supplied value either — `AppServiceProvider::boot()` enforces
  `Password::defaults()` only for the user-facing reset/registration flow, not
  for `Hash::make()` calls inside seeders. Staging environments fronted by a
  shared DNS name with a real public route to `/admin/login` are the typical
  failure mode. The checklist asks for a 16-char random default.
- Exploit: Attacker hits `/admin/login` (or whatever `ADMIN_PATH` resolves to —
  default is `admin`), tries `admin@example.com` / `password`, and gets
  Super-Admin. `Gate::before(fn => hasRole('Super Admin'))` (`AuthServiceProvider.php:24`)
  then bypasses every permission check.
- Fix: Replace the fallback with a generator that requires user action:
  ```php
  $password = env('ADMIN_SEED_PASSWORD');
  if (!$password) {
      $password = Str::password(24);
      $this->command?->warn("Generated admin password: {$password} — store it now.");
  }
  if (strlen($password) < 16) {
      throw new \RuntimeException('ADMIN_SEED_PASSWORD must be at least 16 chars.');
  }
  ```
  Also fail-closed when `ADMIN_SEED_EMAIL` is `admin@example.com` to avoid
  predictable account names.
- Confidence: high

---

## High

### B2.H1 — `MediaController::destroy` accepts `?path=` from query string with weak prefix check
- File: `app/Http/Controllers/Admin/MediaController.php:122-138`
- Code:
  ```php
  } elseif ($path = $request->query('path')) {
      if (str_starts_with($path, self::UPLOAD_PATH . '/') && Storage::disk('public')->exists($path)) {
          Storage::disk('public')->delete($path);
      }
  }
  ```
- Issue: The check `str_starts_with($path, 'uploads/')` is the only guard, and
  `Storage::disk('public')` resolves paths relative to `storage/app/public`,
  but Laravel's filesystem layer **does** allow `..` traversal in some adapter
  configurations. More importantly, anyone with `manage media` (the Editor
  role) can delete *any* file inside `storage/app/public/uploads/**` — including
  legitimate Spatie media-library files that are stored under a different
  prefix but happen to be addressable via `uploads/...` if collisions exist,
  and any picker uploads belonging to other admins. There is no per-user
  ownership / audit log.
- Exploit:
  1. Editor logs in, calls `DELETE /admin/media?path=uploads/2026/05/site-logo-abc.png` →
     deletes the live site logo. No confirmation, no audit trail, no recovery.
  2. Probe `?path=uploads/../../private/...` — Laravel's flysystem **does**
     reject this in current versions, but the defence is one upstream lib bug
     away from being exploitable; pair this with the lack of `realpath`
     normalisation and you have a path-traversal-shaped foot-gun.
- Fix: Stop accepting `?path=` entirely — only allow deletion via the Spatie
  `Media` model id (the route `delete media/{medium?}` already binds the model).
  If raw-path deletion must remain, normalise with `realpath()`, assert the
  resolved path is strictly inside `storage_path('app/public/uploads')`,
  require a CSRF + signed URL, and emit an audit-log event.
- Confidence: high

### B3.H2 — Filename sanitisation derives base from `getClientOriginalName()`
- File: `app/Http/Controllers/Admin/MediaController.php:91-105`
- Code:
  ```php
  $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
  $safeBase  = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'image';
  $filename  = sprintf('%s-%s.%s', substr($safeBase, 0, 60), Str::random(6), $extension);
  $path = $file->storeAs(self::UPLOAD_PATH . '/' . date('Y/m'), $filename, ['disk' => 'public']);
  ```
- Issue: `Str::slug` neutralises path traversal in the basename, so this is
  *not* a traversal vuln. However, the **extension** comes straight from the
  client (`getClientOriginalExtension()`) — `mimetypes:` validation only
  inspects the upload's *content* MIME, it does not constrain the extension
  the file is stored with. An attacker who passes a JPEG header check can
  still ask for the file to be saved as `.phtml`, `.phar`, `.html`, `.svg`,
  etc. If the public disk is ever exposed via a webserver that maps `.phtml`
  to PHP (common Apache default), or `.html` for stored XSS, RCE / XSS follow.
- Exploit: Upload a polyglot file (valid GIF + PHP), `getClientOriginalName()
  = "shell.phtml"`. Stored as `shell-abc123.phtml` under `public/uploads/2026/05/`.
  Direct request to `/storage/uploads/2026/05/shell-abc123.phtml` runs PHP if
  Apache `AddHandler php` matches `.phtml`.
- Fix: Derive the extension from the validated MIME type, not from the client:
  ```php
  $extByMime = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp', 'image/svg+xml' => 'svg'];
  $extension = $extByMime[$file->getMimeType()] ?? 'bin';
  ```
  Combine with a deny-list at the webserver level
  (`location ~ \.(php|phar|phtml|html?)$ { deny all; }` inside `/storage/uploads/`).
- Confidence: high

### B4.H3 — Public uploads served from web-executable disk; no `X-Content-Type-Options` or PHP-execution block configured for `/storage`
- File: `app/Http/Controllers/Admin/MediaController.php:101-108`, plus
  `app/Http/Middleware/ContentSecurityPolicy.php` (CSP only applied to routes
  in the `csp` middleware group — `/storage/...` is served by the static
  handler and bypasses Laravel entirely).
- Issue: Uploads land in `storage/app/public/uploads/...` and are served from
  `Storage::disk('public')->url($path)` → `/storage/uploads/...`. The CSP and
  `X-Content-Type-Options: nosniff` headers from `ContentSecurityPolicy.php`
  only apply to routes in the `csp` middleware group. A direct GET to
  `/storage/uploads/2026/05/foo.svg` returns the SVG with no CSP, no
  `nosniff`, no `Content-Disposition: attachment` — making B1.C1 (SVG XSS)
  trivially exploitable and giving polyglot files (B3.H2) the best chance to
  be MIME-sniffed.
- Exploit: Combined with B1.C1 / B3.H2; the missing `nosniff` lets older
  browsers execute polyglot HTML/JS embedded in image bytes.
- Fix: Add a server-config rule:
  ```nginx
  location /storage/ {
      add_header X-Content-Type-Options "nosniff" always;
      add_header Content-Security-Policy "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox" always;
      location ~ \.(php|phar|phtml|html?|svg)$ {
          add_header Content-Disposition "attachment" always;
      }
  }
  ```
  Or proxy uploads through a controller that sets these headers.
- Confidence: medium

### A4.H4 — `SESSION_SECURE_COOKIE=null` (auto) — secure flag not enforced in prod
- File: `config/session.php` (`'secure' => env('SESSION_SECURE_COOKIE', null)`)
- Code:
  ```php
  'secure' => env('SESSION_SECURE_COOKIE', null), // null = auto (true when HTTPS, false otherwise)
  ```
- Issue: When the app is fronted by an HTTPS-terminating proxy and the proxy
  rewrites the request as HTTP internally, `null` defaults to `false` and the
  session cookie is sent without `Secure`. `TrustProxies::$proxies` is also
  set to `null` (`app/Http/Middleware/TrustProxies.php:15`), meaning Laravel
  does **not** trust any proxy by default and will see the request as HTTP.
  Result: production session cookies can be sniffed on a non-TLS hop or
  forced over plaintext via a downgrade.
- Exploit: Attacker on the same LAN as the LB (or with a MITM position)
  observes the `laravel_session` cookie on any HTTP request, replays it.
- Fix: (a) Set `SESSION_SECURE_COOKIE=true` in `.env` for production. (b) Set
  `TrustProxies::$proxies = '*'` (or the exact LB CIDR) so `isSecure()`
  returns `true` behind the LB. (c) Optional: add `same_site=strict` for the
  admin cookie subset.
- Confidence: high

### B3.H5 — `EngagementController` accepts arbitrary `content_id` without verifying the ID belongs to a *publicly visible* item; also leaks PII via `User-Agent` storage
- File: `app/Http/Controllers/Api/EngagementController.php:33-61`
- Code:
  ```php
  $query = $modelClass::where('id', $validated['content_id']);
  if (method_exists($modelClass, 'scopePublished')) { $query->published(); }
  if (!$query->exists()) { return response()->json(['message' => 'Content not found.'], 404); }
  // ...
  ContentEngagement::create([…, 'user_agent' => mb_substr((string) $request->userAgent(), 0, 500)]);
  ```
- Issue: For the `Page` model the `published()` scope only checks
  `where('status','published')` (`Page.php:62-65`); it does not check
  `is_homepage` / route reachability. So an attacker can rack up engagement
  on draft/scheduled pages that have any non-draft status. Also the
  `user_agent` is stored cleartext for every public visitor — that is PII
  under GDPR (item H2 in checklist) and the IP is hashed, but the UA is not.
- Exploit: `POST /api/engage {type:'view',content_type:'page',content_id:N}`
  in a tight loop (within `throttle:60,1` per IP — trivial via a botnet) to
  fake popularity / poison the "latest" / "featured" sort.
- Fix: (a) Hash or truncate `user_agent` to a coarse fingerprint instead of
  storing 500 chars. (b) For `Page`, also require the page to be reachable
  (e.g., have a non-null slug AND `status=published`). (c) Move the dedup
  window from 5 min to 24 h, and add a per-IP cap on writes.
- Confidence: medium

### A5.H6 — Login throttle: only one limiter; honeypot reveals timing
- File: `app/Http/Requests/Auth/LoginRequest.php:44-66`, `routes/web.php:77-80`
- Code:
  ```php
  // routes/web.php
  Route::post("login", [...])->middleware("throttle:5,1");
  // LoginRequest::authenticate()
  if (!empty($this->input('_confirm_email'))) {
      throw ValidationException::withMessages(['email' => trans('auth.failed')]);
  }
  $this->ensureIsNotRateLimited();
  if (! Auth::attempt(...)) { $this->recordFailedAttempt(); ... }
  ```
- Issue: The honeypot rejection happens *before* the rate-limit check, so a
  bot filling the honeypot consumes 0 of the 5 IP-throttle slots and 0 of the
  email-keyed lockout counter — meaning the bot can probe forever as long as
  it fills `_confirm_email`. Conversely, real-user lockout is keyed on
  `email|ip`, which lets an attacker DoS a known admin's account by spamming
  20 bad logins from many IPs (each IP gets its own counter, but the
  email-portion of the key is the same — any IP over 20 fails locks the user
  for 24 h).
- Exploit: (a) Bot enumeration: send `_confirm_email=x&email=victim@…&password=guess`
  in a tight loop — no throttling, no lockout, just a "failed" response. (b)
  Lockout DoS: hit `/admin/login` with `email=victim@org.com&password=wrong`
  enough times to trigger `LOCKOUT_STEPS[20] = 86400` — the legit user is
  locked out for a day.
- Fix: (a) Rate-limit *before* the honeypot check, and increment the counter
  on honeypot hits. (b) Switch lockout key from `email|ip` to just `ip` for
  the high-tier (24 h) step and only use `email` for short windows so an
  attacker can't lock victims out across the internet. (c) Add a CAPTCHA
  after 3 fails.
- Confidence: medium

### C4.H7 — `clean()` (HTMLPurifier) bypassed when `Setting::value` set directly without going through controller
- File: `app/Models/Setting.php:1-29`
- Code:
  ```php
  class Setting extends Model {
      use HasFactory, HasTranslations;
      protected $fillable = ['key', 'value', 'type', 'group'];
      public array $translatable = ['value'];
  ```
- Issue: `Setting::value` is translatable but has **no setter** equivalent to
  `ContentItem::setContentAttribute()`. Sanitisation only happens inside
  `SettingController::update()` based on `$setting->type === 'richtext'`. Any
  other code path that does `Setting::create(['value' => '<script>...'])`,
  or any seeder, or mass-assignment via `$request->all()` style code, will
  store unsanitised HTML and `clean()` will never run. The
  `HandleInertiaRequests` middleware shares a subset of settings on every
  page (`site_settings_all_shared` — `HandleInertiaRequests.php:108-130`),
  including `footer_copyright_text` which is rendered as HTML on the
  frontend.
- Exploit: Anyone with `manage settings` (currently only Super Admin) is the
  threat actor today. **However** if a future PR adds a different write path
  (CLI seeder, import job, API), or grants the `manage settings` permission
  to Editor, stored XSS in the footer affects every page.
- Fix: Move the sanitisation into the model's `setValueAttribute()` mutator
  so it runs on *every* write path — same pattern as `ContentItem::setContentAttribute()`.
- Confidence: medium

### A1.H8 — `RolesAndPermissionsSeeder` grants `Editor` blanket `manage media`
- File: `database/seeders/RolesAndPermissionsSeeder.php:47-59`
- Code:
  ```php
  $editorPermissions = [
      "view admin", "manage categories", "manage content items",
      "manage media",   // ← grants SVG upload + arbitrary path delete
      "manage quotes", "manage pages", "manage books", "manage scholars",
  ];
  ```
- Issue: Combined with B1.C1 (SVG XSS) and B2.H1 (path-based delete), every
  Editor effectively has stored-XSS-into-Super-Admin and "delete any
  uploaded file" capabilities. The principle of least privilege would split
  `manage media` into `upload media` (low risk after SVG fix) and
  `delete media` (admin-only).
- Exploit: See B1.C1 and B2.H1.
- Fix: Split the permission, or remove `manage media` from `$editorPermissions`
  until B1.C1 + B2.H1 are remediated.
- Confidence: high

### I4.H9 — Inertia shared `auth.user` exposes `email_verified_at`
- File: `app/Http/Middleware/HandleInertiaRequests.php:52-61`
- Code:
  ```php
  "auth" => [
      "user" => $request->user() ? [
          "id" => …, "name" => …,
          "email" => $request->user()->email,
          "email_verified_at" => $request->user()->email_verified_at,
      ] : null,
  ],
  ```
- Issue: Every Inertia response on every authenticated page ships
  `auth.user.email` and `auth.user.email_verified_at` to the browser. Email
  is fine (it's the admin's own login), but it makes user-enumeration
  trivial for any XSS bug elsewhere. More importantly, the prop is *not
  redacted* on the public-facing `/`, `/about`, `/contact`, etc. — the same
  middleware runs there. If a Super-Admin opens the public site in a tab
  while logged in, the page leaks their email into a shared/cached HTML
  payload (the `CacheFullPage` middleware has `$request->user() !== null`
  guard, so this is mostly moot — see Clean section — but the prop is
  still in every authenticated response).
- Exploit: Any client-side dependency with a postMessage / DOM XSS bug
  exfiltrates `window.__INITIAL__.props.auth.user.email`. Low-impact alone,
  high-impact as a stepping stone.
- Fix: Don't ship `email_verified_at` to the client (it's not used by any
  React page per the project memory). Consider only sharing `id` and `name`,
  and sourcing `email` from a dedicated `/admin/profile` endpoint.
- Confidence: low

---

## Medium

### A4.M1 — Password reset token throttle keyed only on IP, not on email
- File: `routes/web.php:87-89` (`throttle:5,1` on `password.email`)
- Issue: `5/min` per IP is fine for brute-forcing tokens, but doesn't prevent
  an attacker from spamming a target's inbox: 5 reset emails per minute from
  one IP × N IPs in a botnet → mailbox-flood / SES reputation hit.
- Fix: Add a per-email limiter inside `PasswordResetLinkController::store()`
  using the email as the cache key (e.g., 3 reset emails per hour per
  address).
- Confidence: medium

### C8.M2 — Page slug binding regex allows numeric-only slugs that can shadow named routes
- File: `routes/web.php:33-54`
- Code:
  ```php
  Route::get("/page/{slug}", [PageDisplayController::class, "show"])
      ->where("slug", "[a-zA-Z0-9-]+")
      ->name("page.show");
  ```
- Issue: The slug regex permits purely numeric slugs ("123") and slugs that
  collide with reserved Laravel patterns. Not a traversal vuln, but combined
  with `Page::is_homepage` toggling (only one page can be homepage), an
  Editor with `manage pages` can rename the published `about` page to slug
  `dashboard`, breaking the admin URL collision detection. Low immediate risk.
- Fix: Tighten regex to `[a-z][a-z0-9-]*` and disallow reserved slugs (`admin`,
  `api`, `storage`, `dashboard`) via a custom validation rule.
- Confidence: low

### C1.M3 — `ContentCategory::scopeOrderByTranslatable` interpolates `$column` and `$locale` directly into raw SQL
- File: `app/Models/ContentCategory.php:76-129`
- Code:
  ```php
  return $query->orderBy(DB::raw(
      "JSON_UNQUOTE(JSON_EXTRACT(`{$this->getTable()}`.`{$column}`, '$.\"{$locale}\"'))"
  ), $direction);
  ```
- Issue: The values *are* whitelisted (`$column` against `$this->translatable`,
  `$locale` against `config('translatable.locales')`, `$direction` against
  `'ASC'/'DESC'`). So this is **not exploitable today**. However, the pattern
  is fragile — anyone who later extends the controller to call this with a
  user-supplied `$column` outside the trait will inject SQL.
- Exploit: None as written.
- Fix: Replace `DB::raw` with `Eloquent`'s native JSON column syntax:
  ```php
  return $query->orderBy("{$column}->{$locale}", $direction);
  ```
  which uses parameter binding under the hood and removes the foot-gun.
- Confidence: low

### H1.M4 — `SetLocale` middleware logs every request at debug level with the locale
- File: `app/Http/Middleware/SetLocale.php:48,63,89,93,132`
- Issue: 5 `Log::debug(...)` calls on every request. In `APP_DEBUG=true` envs
  this floods `storage/logs/laravel.log` with PII-adjacent data (browser
  `Accept-Language` headers reveal user locale fingerprints) and makes
  log-rotation review noisier. Not a vuln, but checklist H2/H3 territory.
- Fix: Drop the `Log::debug` calls or guard with
  `if (config('app.debug')) { Log::debug(...); }` — Laravel already only
  emits debug logs when `LOG_LEVEL=debug`, but the calls still cost CPU.
- Confidence: low

### D2.M5 — Featured-image upload size cap (2 MB) inconsistent with picker (10 MB)
- File: `app/Http/Requests/Admin/StoreContentItemRequest.php:64-69` (2048 KB),
  `app/Http/Controllers/Admin/MediaController.php:86` (10240 KB)
- Issue: `StoreContentItemRequest` enforces `max:2048` for `featured_image`
  but the picker allows 10 MB. Editors will hit confusing 422 errors. Not a
  vuln but suggests no global file-size policy. Also no per-disk quota — a
  user with `manage media` can fill the disk by uploading the max repeatedly.
- Fix: Centralise upload limits in `config/media.php` and read from both
  call-sites; add a daily quota per user.
- Confidence: low

### F8.M6 — `TrustProxies::$proxies = null` (no proxies trusted by default)
- File: `app/Http/Middleware/TrustProxies.php:15`
- Issue: With `$proxies = null` Laravel ignores `X-Forwarded-*` headers
  entirely. Behind a reverse proxy (Cloudflare, nginx, ALB) this means: (a)
  `$request->ip()` returns the proxy IP not the real client → the engagement
  IP-hash, the contact-form IP-hash, and the login-throttle IP key all
  collapse to a single IP and become useless. (b) `$request->isSecure()`
  returns `false`, defeating the `Secure`-cookie auto-detection (see A4.H4).
- Fix: Set `$proxies = '*'` *only if you control the entire ingress path*,
  or list the LB CIDR. Document in deploy notes.
- Confidence: high (impact medium because it's deployment-dependent)

---

## Low

### B5.L1 — `dashboard` middleware uses `can:view admin` but seeder only grants it to Editor
- File: `routes/web.php:110-112`, `RolesAndPermissionsSeeder.php:47-49`
- Issue: Super Admin gets through via `Gate::before` in `AuthServiceProvider`,
  but if a future role is added without `view admin`, they'll be blocked from
  every admin route. Cosmetic.
- Fix: Document the expected baseline permission set per role.
- Confidence: low

### I2.L2 — Navigation `target=_blank` not paired with `rel="noopener noreferrer"` server-side
- File: `app/Http/Requests/Admin/StoreNavigationItemRequest.php:38`
  (`target` validated as `_self|_blank`)
- Issue: Validation accepts `_blank` but the *server* does not store/emit a
  `rel` attribute. The frontend (out of scope for this audit) must add it.
- Fix: Frontend concern — out of scope, but add a comment in the model.
- Confidence: low

### M2.L3 — Honeypot `_confirm_email` is a guessable field name
- File: `app/Http/Requests/Auth/LoginRequest.php:35`,
  `app/Http/Requests/StoreContactSubmissionRequest.php:29`
- Issue: A targeted bot will skip a field literally named "confirm email".
  Effective against generic spam, weak against targeted scrapers.
- Fix: Rotate the honeypot field name per deploy via env var, or pair it with
  a time-to-fill check.
- Confidence: low

---

## Clean

- **A2 session regen** — `app/Http/Controllers/Admin/Auth/AuthenticatedSessionController.php:39,53,55`
  calls `regenerate()` on login and `invalidate()` + `regenerateToken()` on
  logout. OK.
- **A1/A7 generic auth errors** — `LoginRequest::authenticate()` throws
  `auth.failed` for both honeypot hits and bad credentials, no user
  enumeration. OK.
- **A5 brute-force protection** — escalating lockout 1m → 15m → 1h → 24h is
  in place (`LoginRequest::LOCKOUT_STEPS`). OK (modulo A5.H6 caveats).
- **A8 logout invalidates session** — `Auth::guard('web')->logout()` +
  `session()->invalidate()` + `regenerateToken()`. OK.
- **A9 password reset rate-limited** — `throttle:5,1` on
  `password.email`/`password.store` (`routes/web.php:87-96`). OK (modulo M1).
- **A10 admin auth on every route** — every admin route under
  `Route::middleware(["auth"])->group(...)` (`routes/web.php:102`). OK.
- **B2 mass-assign** — every model in `app/Models/` declares `$fillable` and
  none uses `$guarded = []`. OK (User, Page, PageBlock, ContentItem, Book,
  Scholar, Quote, Language, Setting, SocialAccount, NavigationItem,
  ContentCategory, ContactSubmission, Subscriber, ContentEngagement —
  15/15).
- **B3/B5 permissions on every admin route** — every `Admin/*Controller`
  method calls `Gate::authorize(...)` or `$this->authorize(...)`, AND every
  resource route additionally gates via `->middleware('can:...')` in
  `routes/web.php:115-193`. Defence in depth. OK.
- **B1 IDOR** — admin controllers use route-model binding and either rely on
  the global permission gate or, for nested resources (`PageBlock`),
  explicitly verify `$block->page_id !== $page->id` before mutation
  (`PageBlockController.php:66,96,114`). OK.
- **C1 raw SQL** — only `DB::raw` usage is the `ContentCategory::scopeOrderByTranslatable`
  noted in M3, which whitelists every interpolated value. No `whereRaw` /
  `selectRaw` with user input found. OK.
- **C2 SSRF** — no `Http::get()`, `file_get_contents($url)`, or external URL
  fetcher anywhere in the audited controllers, services, or models. OK.
- **C3 FormRequest coverage** — every state-changing admin route has a
  dedicated `FormRequest` (StoreXxxRequest / UpdateXxxRequest) except `Book`,
  `Scholar`, `Quote::destroy`, `PageBlock::reorder`, all of which validate
  inline with appropriate rules. OK.
- **C4 richtext sanitisation on save** — `ContentItem::setContentAttribute()`
  runs `clean()` per locale; `PageBlock::sanitizeRichtextFields()` runs
  `clean()` for every `translatable_richtext` field declared in
  `BlockRegistry`; `SettingController::update()` runs `clean()` for
  `type=richtext` (caveat: H7). OK.
- **C5 dangerous URI schemes blocked** — `StoreNavigationItemRequest::rules()`
  rejects `javascript:`, `data:`, `vbscript:` URLs (lines 30-37).
  `BlockRegistry::validationRules()` enforces `regex:/^(https?:\/\/|\/)/` on
  every `*_link` / `*_url` field and on `image_url`/`link` inside card-list
  items. OK.
- **C6 URL validation** — `Book::cover_image_url`, `Book::buy_link`,
  `Scholar::photo_url`, `SocialAccount::url` use Laravel's `url` rule. OK.
- **C7 translatable JSON sanitised per locale** — the per-locale loops in
  `ContentItem::setContentAttribute`, `PageBlock::sanitizeRichtextFields`,
  and `SettingController::update` all iterate the translation array and
  `clean()` each value individually. OK.
- **C8 slug regex** — route patterns `[a-zA-Z0-9-]+` reject path-traversal
  and dot characters. OK (modulo M2).
- **D1 image MIME validated by content** — `mimetypes:` rule (not `mimes:`)
  inspects file content, not extension. OK (modulo SVG carve-out, B1.C1).
- **D2 size cap** — 10 MB cap on picker, 2 MB on featured-image. OK
  (inconsistent — see M5).
- **D4 random filename component** — `Str::random(6)` appended; OK (modulo
  B3.H2 extension issue).
- **D7 Spatie media-library destroy** — when `$medium` route-model binds, the
  Spatie `Media::delete()` cleans up the file via the package's lifecycle.
  OK for the medium-binding branch.
- **E1 CSRF** — `VerifyCsrfToken::$except = []` (no exemptions). All POST/PUT/
  DELETE routes go through the `web` middleware group which includes
  `VerifyCsrfToken`. OK.
- **E2 CSP** — `ContentSecurityPolicy.php` sets nonce-based `script-src`,
  `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`. OK.
- **E3 security headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS on
  HTTPS. OK (caveat B4.H3 about `/storage/` route bypassing this).
- **E4 Permissions-Policy** — disables camera, mic, geolocation, payment. OK.
- **E5 CORS** — `config/cors.php` allows only `env('APP_URL', 'http://localhost')`
  and only on `api/*` + `sanctum/csrf-cookie`. `supports_credentials = false`.
  OK.
- **F1 .env not in repo** — out of scope for this audit (no .env file in
  `app/` or `routes/`).
- **G1 password hashing** — `User::$casts['password' => 'hashed']` →
  Laravel's bcrypt with default cost (12+). `AppServiceProvider` enforces
  `Password::min(12)->letters()->mixedCase()->numbers()->symbols()->uncompromised()`
  for all reset/registration flows. OK.
- **G2 session encryption** — `config/session.php: 'encrypt' => true`. OK.
- **H1 admin actions logged** — Spatie permission package emits events; the
  Laravel `Lockout` event is dispatched on auth failures
  (`LoginRequest::recordFailedAttempt()`). OK (light coverage; could be
  richer).
- **I1 Inertia shared props** — `$request->user()` payload contains only
  `id`, `name`, `email`, `email_verified_at` — no password, no remember_token,
  no API tokens. OK (modulo H9 nit).
- **I4 sensitive caching** — `CacheFullPage` middleware skips caching when
  `$request->user() !== null` (line 35), strips `set-cookie` /
  `x-csrf-token` / `x-xsrf-token` from cached headers (lines 80-87), and
  varies on `X-Inertia` to never serve cached HTML to a JSON SPA request.
  OK.
- **M1 contact-form rate limit** — `throttle:5,1` group for `/contact` and
  `/subscribe` (`routes/web.php:58`). OK.
- **M2 honeypot** — `_confirm_email` honeypot on contact form
  (`StoreContactSubmissionRequest.php:29`) and login. OK (caveat L3).
- **M4 SSRF in social-feed** — `BlockDataResolver::resolveSocialMediaFeed`
  reads from local DB, no outbound HTTP. OK.
- **API rate limit** — `/api/engage` is `throttle:60,1`, RouteServiceProvider
  configures `api` limiter at 60/min per user-or-IP. OK.

---

End of audit.
