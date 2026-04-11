# Deploying Personality Platform on Shared Hosting (cPanel)

This guide walks you through deploying this Laravel + Inertia.js + React application on a shared hosting environment with cPanel and phpMyAdmin. Every step references this project's actual files and commands.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Database Setup via phpMyAdmin](#2-database-setup-via-phpmyadmin)
3. [Build the Frontend Locally](#3-build-the-frontend-locally)
4. [Upload Files](#4-upload-files)
5. [Modify public_html/index.php](#5-modify-public_htmlindexphp)
6. [Configure .env](#6-configure-env)
7. [Run Setup Commands](#7-run-setup-commands)
8. [File Permissions](#8-file-permissions)
9. [Storage Symlink Workaround](#9-storage-symlink-workaround)
10. [Troubleshooting](#10-troubleshooting)
11. [Deploying Updates](#11-deploying-updates)

---

## 1. Prerequisites

Before you begin, confirm your hosting meets these requirements:

| Requirement | Minimum | How to Check |
|-------------|---------|--------------|
| PHP | 8.1+ | cPanel > Select PHP Version |
| MySQL | 8.0+ | cPanel > MySQL Databases |
| Composer | Any | SSH: `composer --version` |
| SSH access | Required | cPanel > Terminal, or SSH client |

**Required PHP Extensions** (from `composer.json`):

- `pdo_mysql`
- `mbstring`
- `openssl`
- `tokenizer`
- `xml`
- `ctype`
- `json`
- `bcmath`
- `fileinfo` (required by Spatie Media Library)
- `gd` or `imagick` (for image processing)
- `exif` (for image orientation)

Most shared hosts enable these by default. Check in cPanel > Select PHP Version > Extensions.

---

## 2. Database Setup via phpMyAdmin

1. Log in to **cPanel**
2. Go to **MySQL Databases**
3. Under "Create New Database", enter a name (e.g., `youraccount_personality`) and click **Create Database**
4. Under "MySQL Users", create a new user with a **strong, random password** (20+ characters). Write this down.
5. Under "Add User To Database", select the user and database, click **Add**, then grant **ALL PRIVILEGES** and click **Make Changes**
6. Open **phpMyAdmin** from cPanel
7. Select your new database in the left sidebar
8. Click the **Operations** tab
9. Under "Collation", select **utf8mb4_unicode_ci** and click **Go**

Write down these three values -- you will need them for `.env`:
- Database name (e.g., `youraccount_personality`)
- Database username (e.g., `youraccount_admin`)
- Database password

---

## 3. Build the Frontend Locally

The frontend must be compiled before uploading. On your **local machine** (not the server), run:

```bash
cd personality-platform
npm install
npm run build
```

This creates the `public/build/` directory containing compiled CSS and JavaScript. The `npm run build` command runs both the client build and SSR build (`vite build && vite build --ssr`).

> **Important**: Do NOT run `npm install` or `npm run build` on shared hosting. Most shared hosts lack the memory and Node.js version required.

---

## 4. Upload Files

Upload the project using cPanel File Manager or an FTP client (FileZilla, WinSCP, etc.).

### Directory structure on the server

```
/home/youraccount/
    personality-platform/         <-- Laravel app (ABOVE public_html)
        app/
        bootstrap/
        config/
        database/
        lang/
        resources/
        routes/
        storage/
        vendor/
        .env
        artisan
        composer.json
        ...
    public_html/                  <-- Your domain's document root
        build/                    <-- from public/build/
        images/                   <-- from public/images/
        vendor/                   <-- from public/vendor/ (Ziggy, etc.)
        .htaccess                 <-- from public/.htaccess
        favicon.ico               <-- from public/favicon.ico (if any)
        index.php                 <-- from public/index.php (MODIFIED - see below)
        robots.txt                <-- from public/robots.txt (if any)
```

### What goes where

| Source (local) | Destination (server) |
|---------------|---------------------|
| `public/build/` | `public_html/build/` |
| `public/images/` | `public_html/images/` |
| `public/vendor/` | `public_html/vendor/` |
| `public/.htaccess` | `public_html/.htaccess` |
| `public/index.php` | `public_html/index.php` (will be modified) |
| `public/robots.txt` | `public_html/robots.txt` |
| Everything else | `~/personality-platform/` |

> **Do NOT upload** `node_modules/`, `.git/`, or `tests/` to the server.

---

## 5. Modify public_html/index.php

Edit `public_html/index.php` to point to your app directory above `public_html`. Open the file and change these two lines:

**Before** (original):
```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

**After** (modified for shared hosting):
```php
require __DIR__.'/../personality-platform/vendor/autoload.php';
$app = require_once __DIR__.'/../personality-platform/bootstrap/app.php';
```

The rest of `index.php` stays the same. Save the file.

---

## 6. Configure .env

In `~/personality-platform/`, copy `.env.example` to `.env`:

```bash
cd ~/personality-platform
cp .env.example .env
```

Then edit `.env` with the values below. Every variable this project uses is listed here:

```env
# ── Application ──────────────────────────────────────────────
APP_NAME="Sheikh Awn Platform"
APP_ENV=production
APP_KEY=                          # Will be generated in step 7
APP_DEBUG=false                   # CRITICAL: must be false in production
APP_URL=https://yourdomain.com    # Your actual domain, with https

# ── Admin Panel ──────────────────────────────────────────────
# Change to a non-obvious path to prevent scanners from finding your login page
ADMIN_PATH=admin

# ── Logging ──────────────────────────────────────────────────
LOG_CHANNEL=daily                 # Rotates log files daily
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=warning                 # Use 'warning' or 'error' in production

# ── Database ─────────────────────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=localhost                 # Usually 'localhost' on shared hosting
DB_PORT=3306
DB_DATABASE=youraccount_personality    # From step 2
DB_USERNAME=youraccount_admin          # From step 2
DB_PASSWORD=your_strong_unique_password # From step 2 (20+ random chars)

# ── Cache & Sessions ────────────────────────────────────────
BROADCAST_DRIVER=log
CACHE_DRIVER=file                 # 'file' works on shared hosting
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync             # 'sync' = no queue worker needed
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true        # Set true if using HTTPS (recommended)

# ── Redis (skip if not available) ────────────────────────────
MEMCACHED_HOST=127.0.0.1
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# ── Mail ─────────────────────────────────────────────────────
MAIL_MAILER=smtp
MAIL_HOST=mail.yourdomain.com     # Your hosting's SMTP server
MAIL_PORT=465                     # Usually 465 (SSL) or 587 (TLS)
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=ssl               # 'ssl' for port 465, 'tls' for port 587
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

# ── Vite ─────────────────────────────────────────────────────
VITE_APP_NAME="${APP_NAME}"

# ── Admin Seeder (optional, for initial deploy only) ─────────
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_NAME="Admin User"
ADMIN_SEED_PASSWORD=              # Leave empty to use default 'password' (change immediately after login)
```

> [!CAUTION]
> - **`APP_DEBUG=false`** is mandatory. Setting it to `true` on a public server exposes full stack traces, `.env` values, database credentials, and file paths to any visitor who triggers an error.
> - **Change the admin password** immediately after first login. The seeder creates `admin@example.com` with password `password`.
> - **`DB_PASSWORD`** must be a strong, unique, randomly generated password (20+ characters). Never reuse a password from another service.

---

## 7. Run Setup Commands

SSH into your server (cPanel > Terminal, or SSH client) and run these commands **in this exact order**:

```bash
cd ~/personality-platform

# 1. Generate application encryption key
php artisan key:generate

# 2. Run database migrations and seed initial data
php artisan migrate --seed --force

# 3. Create the storage symlink (see section 9 if this fails)
php artisan storage:link

# 4. Cache configuration for performance
php artisan config:cache

# 5. Cache routes for performance
php artisan route:cache

# 6. Cache compiled views for performance
php artisan view:cache
```

The `--force` flag on `migrate` is required in production (Laravel refuses to run migrations without it when `APP_ENV=production`).

The `--seed` flag runs all seeders defined in `DatabaseSeeder.php`:
1. `RolesAndPermissionsSeeder` -- creates roles and permissions
2. `AdminUserSeeder` -- creates the admin account
3. `SettingsSeeder` -- creates site settings
4. `PrototypeHomepageSeeder` -- creates homepage with 13 sample blocks
5. `PrototypeAboutPageSeeder` -- creates about page with 7 sample blocks
6. `PrototypeIslamCategorySeeder` -- creates Islam initiative category page
7. `PrototypeNavigationSeeder` -- creates header and footer navigation links
8. `PrototypeBooksAndScholarsSeeder` -- creates sample books and scholars

---

## 8. File Permissions

Laravel needs write access to `storage/` and `bootstrap/cache/`:

```bash
cd ~/personality-platform
chmod -R 775 storage bootstrap/cache
```

If you get permission errors after this, your hosting may require the web server user to own these directories. Contact your host or try:

```bash
chown -R $(whoami):$(whoami) storage bootstrap/cache
```

---

## 9. Storage Symlink Workaround

The `php artisan storage:link` command creates a symbolic link from `public/storage` to `storage/app/public`. On shared hosting, this link needs to point to your `public_html` directory instead.

**If `php artisan storage:link` worked** (no errors), you are done. But the symlink points to `personality-platform/public/storage`, not `public_html/storage`. You need to manually create it:

```bash
# Remove the auto-created symlink (it points to the wrong place)
rm -f ~/personality-platform/public/storage

# Create the symlink in public_html instead
ln -s ~/personality-platform/storage/app/public ~/public_html/storage
```

Verify it works by visiting `https://yourdomain.com/storage/` -- you should see the contents of `storage/app/public/` (which may be empty initially).

**If symlinks are not supported** on your host, you can copy files manually or configure a cron job. But most modern shared hosts support symlinks.

---

## 10. Troubleshooting

### 500 Internal Server Error

1. Check the Laravel log file:
   ```bash
   tail -50 ~/personality-platform/storage/logs/laravel.log
   ```
2. Common causes:
   - `.env` file missing or `APP_KEY` not set -- run `php artisan key:generate`
   - Database credentials wrong -- verify `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
   - File permissions on `storage/` -- run `chmod -R 775 storage bootstrap/cache`
   - PHP version too low -- check cPanel > Select PHP Version

### Blank White Page

1. Check if `APP_DEBUG` is accidentally set to `true` (it should show an error then). If it is `false` and you see a blank page:
   ```bash
   tail -50 ~/personality-platform/storage/logs/laravel.log
   ```
2. Ensure `public_html/index.php` has the correct paths to `vendor/autoload.php` and `bootstrap/app.php`
3. Ensure `public_html/build/` directory exists and contains the compiled assets

### Images Not Loading

1. Verify image files exist in `public_html/images/prototype/`
2. Check the storage symlink: `ls -la ~/public_html/storage` -- it should point to `~/personality-platform/storage/app/public`
3. For uploaded images (via admin media manager), ensure the storage symlink is correctly configured (section 9)

### Mixed Content Warnings (HTTPS)

If your site uses HTTPS but assets load via HTTP:

1. Ensure `APP_URL` in `.env` starts with `https://`
2. Add this to your `.env`:
   ```
   SESSION_SECURE_COOKIE=true
   ```
3. Clear the config cache:
   ```bash
   php artisan config:cache
   ```
4. If behind a reverse proxy or Cloudflare, add to `app/Http/Middleware/TrustProxies.php`:
   ```php
   protected $proxies = '*';
   ```

### Admin Login Not Working

1. Verify you are navigating to the correct URL: `https://yourdomain.com/admin/login` (or your custom `ADMIN_PATH`)
2. If you changed `ADMIN_PATH` in `.env`, clear caches:
   ```bash
   php artisan route:clear
   php artisan config:clear
   ```
3. If you forgot the password, reset it via SSH:
   ```bash
   cd ~/personality-platform
   php artisan tinker
   ```
   Then in tinker:
   ```php
   $user = \App\Models\User::where('email', 'admin@example.com')->first();
   $user->password = bcrypt('your-new-password');
   $user->save();
   exit;
   ```

### Cache Issues After Content Changes

If content changes in the admin panel do not appear on the public site:

```bash
cd ~/personality-platform
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

The application uses observer-based cache invalidation (11 observers clear related cache keys automatically), but if something gets stuck, this manual clear resolves it.

---

## 11. Deploying Updates

When you have new code to deploy:

### On your local machine

```bash
cd personality-platform
npm install
npm run build
```

### Upload changed files

Upload only the files that changed. Common update scenarios:

**Code changes (PHP/JS):**
- Upload changed files in `app/`, `config/`, `routes/`, `resources/`
- Upload `public/build/` (rebuilt assets)
- Upload `composer.lock` if dependencies changed

**Dependency changes:**
- Upload `vendor/` directory (or run `composer install --no-dev --optimize-autoloader` via SSH if Composer is available)

### On the server (via SSH)

```bash
cd ~/personality-platform

# If composer.lock changed:
composer install --no-dev --optimize-autoloader

# Run new migrations (if any)
php artisan migrate --force

# Clear and rebuild all caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan cache:clear
```

> **Tip**: If you only changed content (no code changes), you do not need to redeploy. Content changes are managed entirely through the admin panel.
