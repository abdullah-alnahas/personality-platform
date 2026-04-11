# Personality Platform

> [!CAUTION]
> **Before deploying to production, you MUST do both of these or your site will be compromised:**
>
> 1. **Set `APP_DEBUG=false` in `.env`** — `true` exposes full stack traces, config values, and environment variables to any visitor who triggers an error.
> 2. **Use a strong, unique `DB_PASSWORD`** — the default seeder creates `admin@example.com / password`. Change the admin password and use a randomly generated DB password (20+ chars, mixed). Never reuse a password from another service.
>
> See [Configure `.env`](#4-configure-env) in the deployment section for the full checklist.

A dynamic CMS and page builder for Islamic educational websites. Build full pages visually using drag-and-drop blocks — no code required for content editors.

Built with Laravel + Inertia.js + React + Material-UI. Supports Arabic, English, and Turkish with full RTL support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 10, PHP 8.1+ |
| Frontend | React 18, Inertia.js, Material-UI (MUI) |
| Build | Vite |
| Database | MySQL 8+ |
| Key Packages | Spatie (permissions, media-library, translatable, sluggable), Laravel Breeze |

## What It Does

**For content editors** — A page builder with 15 block types. Create pages by stacking blocks (hero banners, text sections, card grids, Quran verses, logo grids, etc.) and configuring them via the admin panel.

**For visitors** — A fast, cached public website with Islamic design language (dark green palette, gold accents, Amiri calligraphic headings, RTL support).

### Block Types

| Block | Description |
|-------|------------|
| `hero_banner` | Full-width hero with two layouts: centered or split (portrait + text). Supports decorative Islamic star overlays. |
| `text_with_image` | Text content alongside an image, with configurable image position (left/right). |
| `pillar_cards` | Grid of cards with headings, quotes, and bullet items. Light or dark variant. |
| `quran_verse` | Quranic verse display with Bismillah, ornamental dividers, hadith secondary text. Overlay or card-on-background layout. |
| `category_grid` | Auto-populated grid from a content category. |
| `latest_news` | Auto-populated latest content items. |
| `featured_quote` | Highlighted quote block. |
| `social_media_feed` | Display linked social media accounts. |
| `newsletter_cta` | Email subscription call-to-action. |
| `rich_text` | Free-form rich text content (WYSIWYG). |
| `logo_grid` | Row of logos/partner images with optional links and grayscale hover effect. |
| `stats_counter` | Animated counters displaying key statistics. |
| `books_grid` | Auto-populated grid of books with cover images and buy links. |
| `scholar_cards` | Scholars grouped by region/country with tabbed navigation. |
| `spacer` | Configurable vertical spacing. |

Each block has translatable content fields (Arabic, English, Turkish) and configurable styling (background color, text color, columns, padding, etc.).

---

## Local Development Setup

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 18+ and npm
- MySQL 8+

### Step 1: Install Dependencies

```bash
cd personality-platform
composer install
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database connection:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=personality_platform
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Step 3: Create the Database

Create the database in MySQL before running migrations:

```sql
CREATE DATABASE personality_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

If using **phpMyAdmin**: click "New" in the sidebar, enter `personality_platform`, select `utf8mb4_unicode_ci` collation, and click "Create".

### Step 4: Run Migrations and Seed Data

```bash
php artisan migrate --seed
```

This runs all seeders in order and creates:
- Default admin user (`admin@example.com` / `password`)
- Roles and permissions (Spatie)
- Site settings
- Two prototype pages (Home + About) with sample blocks
- Four content categories (الإسلام, الإيمان, الإحسان, علامات الساعة) with sample items
- Books and scholars with grouped/tabbed display
- Quotes for the featured quote block
- Social media accounts and navigation structure

To seed individual prototype data:

```bash
php artisan db:seed --class=PrototypeHomepageSeeder
php artisan db:seed --class=PrototypeAboutPageSeeder
php artisan db:seed --class=PrototypeBooksAndScholarsSeeder
php artisan db:seed --class=PrototypeNavigationSeeder
```

### Step 5: Build and Run

**Development** (with hot reload):

```bash
npm run dev
php artisan serve
```

Visit `http://127.0.0.1:8000`

**Production build**:

```bash
npm run build
```

### Step 6: Add Images (Optional)

Place your images in `public/images/prototype/`:
- `sheikh-portrait.png` — portrait photo for the hero banner
- `mosque-bg.jpg` — background image for the Quran verse block
- `logo-naba.png`, `logo-bayariq.png`, `logo-talaqqi.png`, `logo-islaf.png` — logos for the works section

Without these images, the page still renders correctly; the image areas will simply be empty.

---

## Deployment on Shared Hosting (cPanel / phpMyAdmin)

### 1. Database Setup via phpMyAdmin

1. Log in to **phpMyAdmin** from your hosting panel (cPanel, Plesk, etc.)
2. Click **"New"** in the left sidebar to create a new database
3. Name it (e.g., `personality_platform`), select **utf8mb4_unicode_ci** collation
4. Click **Create**
5. Note down the database name, username, and password from your hosting panel (cPanel > MySQL Databases)

### 2. Upload Files

Upload the entire project to your hosting via FTP or File Manager. The typical structure:

```
/home/youraccount/
    public_html/          <-- point your domain here
        index.php         <-- from public/index.php (modified)
        build/            <-- from public/build/
        images/           <-- from public/images/
        ...
    personality-platform/ <-- the rest of the Laravel app
        app/
        config/
        database/
        resources/
        vendor/
        ...
```

**Important**: The `public/` folder contents go into `public_html/`. Everything else goes into a folder *above* `public_html/`.

### 3. Update `public_html/index.php`

Edit the paths at the top of `index.php` to point to your app directory:

```php
require __DIR__.'/../personality-platform/vendor/autoload.php';
$app = require_once __DIR__.'/../personality-platform/bootstrap/app.php';
```

### 4. Configure `.env`

Copy `.env.example` to `.env` in the app directory and update:

```
APP_ENV=production
APP_DEBUG=false          # MUST be false — true leaks stack traces and env vars to visitors
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_strong_unique_password  # Use 20+ random chars — never reuse a password
```

> [!CAUTION]
> - `APP_DEBUG=true` on a public server is a critical vulnerability. Every unhandled exception shows full stack traces including `.env` values, database credentials, and source file paths.
> - The seeder creates `admin@example.com / password`. Log in immediately after first deploy and change the password via the admin panel.

### 5. Run Setup Commands

SSH into your server (or use cPanel Terminal):

```bash
cd ~/personality-platform
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 6. File Permissions

```bash
chmod -R 775 storage bootstrap/cache
```

---

## Admin Panel

The admin URL path defaults to `admin` — access at `http://yourdomain.com/admin/login`.

To harden the setup, change this to a non-obvious segment by setting `ADMIN_PATH` in `.env`:

```
ADMIN_PATH=my-secret-path
```

After changing it, run `php artisan route:clear && php artisan config:clear`. The login button is not shown in the public navigation — navigate directly to the URL.

| Section | URL | Description |
|---------|-----|-------------|
| Dashboard | `/admin/dashboard` | Stats overview (pages, books, scholars, quotes, etc.) + recent items |
| Pages | `/admin/pages` | Create/edit pages, manage blocks per page |
| Blocks | `/admin/pages/{id}/blocks` | Add, edit, reorder, delete blocks on a page |
| Navigation | `/admin/navigation-items` | Header and footer menu links (4 footer columns supported) |
| Settings | `/admin/settings` | Site name, description, copyright, SEO defaults |
| Content | `/admin/content-items` | Articles, publications, and other content |
| Categories | `/admin/content-categories` | Content categorization |
| Books | `/admin/books` | Book library with cover images and buy links |
| Scholars | `/admin/scholars` | Scholars grouped by region with optional photo |
| Quotes | `/admin/quotes` | Quotes for featured quote blocks |
| Social | `/admin/social-accounts` | Linked social media accounts |
| Languages | `/admin/languages` | Manage available interface languages |
| Media | `/admin/media` | Uploaded media file browser |

### Admin Block Editor Features

- **Color picker** — visual color selection for background/text/accent colors
- **Style presets** — one-click application of pre-defined styles ("Islamic Dark", "Cream Light", etc.)
- **Columns config** — dropdown to set grid columns (1-6) for card and grid blocks
- **Logo editor** — simplified interface for logo_grid with image preview
- **Layout selector** — centered/split for heroes, overlay/card for Quran verses
- **Islamic decorations toggle** — enable/disable scattered star overlays

---

## Project Structure

```
app/
    Services/
        BlockRegistry.php       # Central registry of all 15 block types and their field definitions
        BlockDataResolver.php   # Hydrates dynamic blocks with DB data (cached)
    Http/Controllers/
        Admin/
            DashboardController.php  # Real stats (8 counts) + recent content items
            PageController.php
            PageBlockController.php
            BookController.php
            ScholarController.php
            QuoteController.php
            SocialAccountController.php
            LanguageController.php
            MediaController.php
    Observers/                  # 12 observers — cache invalidation on every model change
                                # Clears both keyed and shared (*_shared) Inertia prop caches

resources/js/
    Components/
        Blocks/                 # 15 block components + BlockRenderer.jsx
        Decorative/             # IslamicStar, ScatteredStars, OrnamentalDivider, DotPattern
    Layouts/
        PublicLayout.jsx        # Header + dark footer with RTL support
        AdminLayout.jsx
    Pages/
        PageDisplay.jsx         # Public page renderer
        Admin/
            Dashboard.jsx       # Stats dashboard with 8 stat cards
            PageBlocks/Form.jsx # Block editor with all field types, color pickers, presets

database/
    seeders/
        PrototypeHomepageSeeder.php         # Homepage with full block set
        PrototypeAboutPageSeeder.php        # About page (4 blocks)
        PrototypeBooksAndScholarsSeeder.php # Books + scholar groups
        PrototypeIslamCategorySeeder.php    # 4 categories + content items
        PrototypeNavigationSeeder.php       # Header + footer navigation
```

---

## Multilingual Support

All content fields support three languages: **Arabic (ar)**, **English (en)**, and **Turkish (tr)**.

- Translatable fields are stored as JSON: `{"en": "Hello", "ar": "مرحبا", "tr": "Merhaba"}`
- RTL is automatically detected and applied for Arabic
- Heading fonts get ~15% larger sizing in RTL mode
- Language switcher is available in both the header and mobile drawer

---

## License

MIT
