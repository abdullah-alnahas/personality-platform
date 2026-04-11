# Admin Panel Walkthrough: Building the Website from the Prototype

This guide walks a content editor through the admin panel to build the complete website shown in the prototype design. Every instruction references actual block types from `BlockRegistry.php` and actual field names from the admin forms.

---

## Table of Contents

1. [Before You Start](#1-before-you-start)
2. [Logging In](#2-logging-in)
3. [Site Settings](#3-site-settings)
4. [Content Setup (Categories, Items, Books, Scholars, Quotes)](#4-content-setup)
5. [Building the Homepage](#5-building-the-homepage)
6. [Building the About Page](#6-building-the-about-page)
7. [Building the Islam Initiative Page](#7-building-the-islam-initiative-page)
8. [Navigation Setup](#8-navigation-setup)
9. [Social Media Accounts](#9-social-media-accounts)
10. [Page Workflow: Create, Reorder, Preview, Publish](#10-page-workflow)

---

## 1. Before You Start

Have these ready:

- **The prototype design** open for reference (all three pages)
- **Admin access** -- URL and credentials (default: `admin@example.com` / `password`)
- **Content in three languages**: Arabic (AR), English (EN), Turkish (TR) for every text field
- **Images prepared**:
  - Sheikh portrait photo (PNG, ~600x800px)
  - Mosque background image (JPG, ~1920x1080px)
  - Logo images for partner organizations (PNG/SVG, ~200x100px each): Naba, Al-Bayariq, Talaqqi, Islaf
  - Book cover images (JPG/PNG, ~300x450px each)
  - Category images and news article images
- **Text content**: headings, descriptions, Quran verses, hadith texts, scholar names

Upload all images to `public/images/prototype/` on the server, or use the Media section in the admin panel to upload them and get their URLs.

---

## 2. Logging In

1. Navigate to `https://yourdomain.com/admin/login` (or your custom `ADMIN_PATH`)
2. Enter email and password
3. Click **Log In**
4. You will be redirected to the Dashboard at `/admin/dashboard`

The dashboard shows 8 stat cards:
- Content Items, Books, Scholars, Quotes, Categories, Pages, Social Accounts, Navigation Items

Below the stats, you see the 5 most recent content items.

---

## 3. Site Settings

Navigate to **Settings** (`/admin/settings`). Configure these settings to match the prototype:

### General Group

| Setting | AR Value | EN Value | TR Value |
|---------|----------|----------|----------|
| Site Name | `شعار` | `Sheikh Awn` | `Sheikh Awn` |
| Site Description | `إحياء الدين كله في العالم كله إلى قيام الساعة` | `Reviving the complete religion throughout the world until the Day of Resurrection` | `Kiyamete kadar dunyanin her yerinde dinin tamamini ihya etmek` |
| Footer Copyright Text | `© {year} شعار. جميع الحقوق محفوظة` | `© {year} Sheikh Awn. All rights reserved.` | `© {year} Sheikh Awn. Tum haklari saklidir.` |
| Maintenance Mode | Off | | |

The `{year}` placeholder is automatically replaced with the current year.

### Contact Group

| Setting | Value |
|---------|-------|
| Contact Email | Your actual contact email |
| Contact Phone | Your actual phone number |

### Branding Group

| Setting | Value |
|---------|-------|
| Logo URL | Path to your logo image (e.g., `/images/prototype/logo.png`) |
| Logo Width | `120` |

### SEO Defaults Group

| Setting | AR Value | EN Value |
|---------|----------|----------|
| Default SEO Title | `الشيخ عون معين القدومي` | `Sheikh Awn Al-Qaddoumi` |
| Default SEO Description | `الموقع الرسمي للشيخ عون معين القدومي` | `Official website of Sheikh Awn Al-Qaddoumi` |

Click **Save Settings** at the bottom of the page.

---

## 4. Content Setup

Before building pages, you need to create the content that some blocks auto-populate from the database.

### 4a. Content Categories

Navigate to **Categories** (`/admin/content-categories`). Create four categories matching the prototype:

Click **Create New** for each:

| # | Name (AR) | Name (EN) | Slug | Icon | Status |
|---|-----------|-----------|------|------|--------|
| 1 | `الإسلام` | `Islam` | `islam` | `mosque` | Published |
| 2 | `الإيمان` | `Faith` | `iman` | `favorite` | Published |
| 3 | `الإحسان` | `Ihsan` | `ihsan` | `auto_awesome` | Published |
| 4 | `علامات الساعة` | `Signs of the Hour` | `signs-of-the-hour` | `schedule` | Published |

For each category, fill in:
- **Name** fields for AR, EN, TR
- **Slug** (auto-generated from name, or enter manually)
- **Description** fields for AR, EN, TR
- **Quote** fields (the hadith quote associated with this category)
- **Icon** (Material Design icon name)
- **Status**: Published

### 4b. Content Items

Navigate to **Content** (`/admin/content-items`). Create articles for each category. Each item needs:

- **Title** (AR, EN, TR)
- **Excerpt** (AR, EN, TR) -- short description shown in cards
- **Body** (AR, EN, TR) -- full article content (rich text editor)
- **Category** -- select from the dropdown
- **Status**: Published
- **Publish Date**: set to a date (used for sorting)
- **Featured Image**: upload via the file picker

Create at least 3-4 items per category so the `category_grid` and `latest_news` blocks have content to display.

### 4c. Books

Navigate to **Books** (`/admin/books`). Create books matching the prototype's books section:

Click **Create New** for each book:

| Title (AR) | Title (EN) | Cover Image URL | Display Order | Status |
|-----------|-----------|-----------------|---------------|--------|
| `الأسماء النبوية` | `The Prophetic Names` | `/images/prototype/book-asma.jpg` | 1 | Published |
| `صوت البيان` | `Voice of Clarity` | `/images/prototype/book-bayan.jpg` | 2 | Published |
| `الحج` | `Hajj` | `/images/prototype/book-hajj.jpg` | 3 | Published |
| `الأسس النبوية` | `Prophetic Foundations` | `/images/prototype/book-ossos.jpg` | 4 | Published |

For each book, fill in:
- **Title** (AR, EN, TR)
- **Subtitle** (AR, EN, TR) -- optional
- **Description** (AR, EN, TR) -- optional
- **Cover Image URL** -- path to the cover image
- **Buy Link** -- optional URL to purchase
- **Category** -- e.g., the book's subject category
- **Display Order** -- controls sort order (lower = first)
- **Is Featured** -- toggle on for highlighted books
- **Status**: Published

### 4d. Scholars

Navigate to **Scholars** (`/admin/scholars`). Create scholars grouped by region:

Click **Create New** for each scholar. The fields are:

- **Name** (AR, EN, TR) -- the scholar's name
- **Group Name** (AR, EN, TR) -- the region label (e.g., AR: `الأردن`, EN: `Jordan`)
- **Group Key** -- a lowercase key that groups scholars together (e.g., `jordan`, `yemen`, `hejaz`)
- **Bio** (AR, EN, TR) -- optional biography
- **Photo URL** -- optional path to scholar photo
- **Display Order** -- controls order within the group
- **Status**: Published

Create scholars for each region shown in the prototype:

**Jordan** (`group_key: jordan`): Create entries for each Jordanian scholar listed.
**Yemen** (`group_key: yemen`): Create entries for each Yemeni scholar listed.
**Hejaz** (`group_key: hejaz`): Create entries for each Hejazi scholar listed.

The `scholar_cards` block groups them by `group_key` and shows tabbed navigation between regions.

### 4e. Quotes

Navigate to **Quotes** (`/admin/quotes`). Create quotes that appear in the `featured_quote` blocks:

Click **Create New** for each:

| Text (AR) | Source (AR) | Is Featured | Status |
|-----------|-------------|-------------|--------|
| `إحياء الدين كله في العالم كله إلى قيام الساعة` | `الشيخ عون معين القدومي` | Yes | Published |
| `العلم ميراث الأنبياء، والعلماء ورثة الأنبياء` | `حديث شريف` | No | Published |
| `من سلك طريقاً يلتمس فيه علماً سهّل الله له به طريقاً إلى الجنة` | `حديث شريف - صحيح مسلم` | No | Published |

Fill in all three languages for **Text** and **Source** fields.

---

## 5. Building the Homepage

### Step 1: Create the Page

1. Navigate to **Pages** (`/admin/pages`)
2. Click **Create New**
3. Fill in:
   - **Title (AR)**: `الرئيسية`
   - **Title (EN)**: `Home`
   - **Title (TR)**: `Ana Sayfa`
   - **Slug**: `home`
   - **Status**: Published
   - **Is Homepage**: Toggle ON (if available in the form)
4. Click **Save**

### Step 2: Add Blocks

After saving the page, you will be on the page edit screen showing the block list. Click **Add Block** to add each block. For each block below, follow these steps:

1. Click **Add Block**
2. Select the **Block Type** from the dropdown
3. Fill in the **Content Fields** (with AR, EN, TR values)
4. Configure the **Configuration** section (colors, layout, padding)
5. Set **Status** to `Published`
6. Click **Create Block**

---

### Block 1: Hero Banner (Mosque Background)

This is the large opening section with the mosque background and the mission statement.

| Field | Value |
|-------|-------|
| **Block Type** | `hero_banner` (Hero Banner) |
| **Heading (AR)** | `إحياء الدين كله في العالم كله إلى قيام الساعة` |
| **Heading (EN)** | `Reviving the entire religion in the entire world until the Day of Judgment` |
| **Heading (TR)** | `Kiyamete kadar tum dunyada tum dini ihya etmek` |
| **Subtitle (AR)** | `<p>في إحياء الدين كله في العالم كله، مسيرة علم وعمل ودعوة إلى الله تعالى</p>` |
| **Subtitle (EN)** | `<p>A journey of knowledge, action, and calling to Allah the Almighty</p>` |
| **Background Image Url** | `/images/prototype/mosque-bg.jpg` |
| **Portrait Image Url** | (leave empty for centered layout) |
| **Cta Text (AR)** | `الشيخ عون القدومي` |
| **Cta Link** | `/page/about` |
| **Overlay Opacity** | `0.6` |
| **Display Order** | `0` |
| **Status** | Published |

**Configuration:**

Use the **Deep Green Centered** preset button, or set manually:

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |
| Layout | Centered |
| Show Islamic Decorations | ON |
| Decoration Color | `rgba(201, 169, 78, 0.15)` (or `#C9A94E`) |
| Full Width | ON |
| Vertical Padding | Extra Large |

---

### Block 2: Islam Section -- Featured Quote

The section heading "Islam" with the hadith quote below it.

| Field | Value |
|-------|-------|
| **Block Type** | `featured_quote` (Featured Quote) |
| **Heading (AR)** | `الإسلام` |
| **Heading (EN)** | `Islam` |
| **Custom Text (AR)** | `طلب العلم فريضة على كل مسلم` |
| **Custom Text (EN)** | `Seeking knowledge is an obligation upon every Muslim` |
| **Custom Source (AR)** | `حديث نبوي شريف` |
| **Custom Source (EN)** | `Prophetic Hadith` |
| **Display Order** | `1` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Text Color | `#2B3D2F` |
| Vertical Padding | Large |

---

### Block 3: Islam Section -- Category Grid

Shows articles from the Islam category.

| Field | Value |
|-------|-------|
| **Block Type** | `category_grid` (Category Grid) |
| **Heading (AR)** | (leave empty -- the featured_quote above serves as the heading) |
| **Description (AR)** | `ذات المعرفة الشرعية والتأصيل العلمي في مجالات الفقه الإسلامي والمذاهب الأربعة` |
| **Category Id** | Select **Islam** from the dropdown |
| **Max Items** | `4` |
| **Display Order** | `2` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Columns | 4 |
| Vertical Padding | Medium |

---

### Block 4: Iman Section -- Featured Quote

| Field | Value |
|-------|-------|
| **Block Type** | `featured_quote` |
| **Heading (AR)** | `الإيمان` |
| **Heading (EN)** | `Faith` |
| **Custom Text (AR)** | `لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه` |
| **Custom Source (AR)** | `حديث نبوي شريف - صحيح البخاري` |
| **Display Order** | `3` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |
| Vertical Padding | Large |

---

### Block 5: Iman Section -- Category Grid

| Field | Value |
|-------|-------|
| **Block Type** | `category_grid` |
| **Description (AR)** | `برامج ومبادرات لتقوية الإيمان وتزكية النفوس` |
| **Category Id** | Select **Faith** from the dropdown |
| **Max Items** | `4` |
| **Display Order** | `4` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |
| Columns | 4 |

---

### Block 6: Ihsan Section -- Quran Verse

This is the Quran verse block with the calligraphic verse display.

| Field | Value |
|-------|-------|
| **Block Type** | `quran_verse` (Quran Verse) |
| **Section Heading (AR)** | `الإحسان` |
| **Section Heading (EN)** | `Ihsan` |
| **Verse Text (AR)** | `هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِهِ وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ وَإِن كَانُوا مِن قَبْلُ لَفِي ضَلَالٍ مُّبِينٍ` |
| **Surah Name (AR)** | `سورة الجمعة` |
| **Surah Name (EN)** | `Surah Al-Jumu'ah` |
| **Verse Reference** | `62:2` |
| **Secondary Text (AR)** | (optional hadith text) |
| **Display Order** | `5` |
| **Status** | Published |

For the **Bottom Items** (the small linked items at the bottom of the verse block), click **Add Card** three times and fill in:

| Card | Heading (AR) | Heading (EN) |
|------|-------------|-------------|
| 1 | `مسابقة الذكر` | `Dhikr Competition` |
| 2 | `قافلة في القرآن` | `Quran Caravan` |
| 3 | `الأوراد` | `Daily Adhkar` |

**Configuration:**

Use the **Dark Green Card** preset, or set manually:

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Text Color | `#ffffff` |
| Layout | Card on Background |
| Accent Color | `#C9A94E` |
| Ornamental Frame | ON |
| Vertical Padding | Extra Large |

---

### Block 7: Ihsan Section -- Category Grid

| Field | Value |
|-------|-------|
| **Block Type** | `category_grid` |
| **Description (AR)** | `برامج ومبادرات في مجال الإحسان والتزكية` |
| **Category Id** | Select **Ihsan** from the dropdown |
| **Max Items** | `4` |
| **Display Order** | `6` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Columns | 4 |

---

### Block 8: Signs of the Hour -- Featured Quote

| Field | Value |
|-------|-------|
| **Block Type** | `featured_quote` |
| **Heading (AR)** | `علامات الساعة` |
| **Heading (EN)** | `Signs of the Hour` |
| **Custom Text (AR)** | `بادروا بالأعمال فتناً كقطع الليل المظلم، يصبح الرجل مؤمناً ويمسي كافراً، ويمسي مؤمناً ويصبح كافراً، يبيع دينه بعرض من الدنيا` |
| **Custom Source (AR)** | `حديث نبوي شريف - صحيح مسلم` |
| **Display Order** | `7` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |
| Vertical Padding | Large |

---

### Block 9: Signs of the Hour -- Category Grid

| Field | Value |
|-------|-------|
| **Block Type** | `category_grid` |
| **Description (AR)** | `فقه التحولات والفتن وعلامات الساعة الكبرى والصغرى` |
| **Category Id** | Select **Signs of the Hour** from the dropdown |
| **Max Items** | `4` |
| **Display Order** | `8` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |
| Columns | 4 |

---

### Block 10: Latest News

| Field | Value |
|-------|-------|
| **Block Type** | `latest_news` (Latest News) |
| **Heading (AR)** | `آخر الأخبار` |
| **Heading (EN)** | `Latest News` |
| **Category Id** | (leave empty to show all categories) |
| **Max Items** | `3` |
| **Display Order** | `9` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#ffffff` |
| Columns | 3 |

---

### Block 11: Social Media Feed

| Field | Value |
|-------|-------|
| **Block Type** | `social_media_feed` (Social Media Feed) |
| **Heading (AR)** | `جديد التواصل الاجتماعي` |
| **Heading (EN)** | `Social Media Updates` |
| **Max Items** | `6` |
| **Display Order** | `10` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |

This block auto-populates from the Social Accounts you configured in section 9.

---

### Block 12: Featured Quote (Random)

This block shows a random published quote each time the page loads.

| Field | Value |
|-------|-------|
| **Block Type** | `featured_quote` |
| **Heading** | (leave all languages empty) |
| **Quote Id** | (leave empty -- no quote selected = random quote) |
| **Display Order** | `11` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |
| Vertical Padding | Extra Large |

---

### Block 13: Newsletter CTA

| Field | Value |
|-------|-------|
| **Block Type** | `newsletter_cta` (Newsletter CTA) |
| **Heading (AR)** | `نسعد بتواصلكم` |
| **Heading (EN)** | `We are delighted to hear from you` |
| **Subtitle (AR)** | `اشترك لتلقي آخر التحديثات والمحتوى العلمي` |
| **Subtitle (EN)** | `Subscribe to receive the latest updates and scholarly content` |
| **Placeholder Text (AR)** | `أدخل بريدك الإلكتروني` |
| **Placeholder Text (EN)** | `Enter your email` |
| **Button Text (AR)** | `اشترك` |
| **Button Text (EN)** | `Subscribe` |
| **Display Order** | `12` |
| **Status** | Published |

**Configuration:**

Use the **Islamic Green** preset, or set manually:

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |
| Full Width | ON |

---

## 6. Building the About Page

### Step 1: Create the Page

1. Navigate to **Pages** (`/admin/pages`)
2. Click **Create New**
3. Fill in:
   - **Title (AR)**: `نبذة`
   - **Title (EN)**: `About`
   - **Slug**: `about`
   - **Status**: Published
4. Click **Save**

### Step 2: Add Blocks

The about page in the prototype has these sections. Add them as blocks:

---

### Block 1: Hero Banner (Sheikh Portrait)

| Field | Value |
|-------|-------|
| **Block Type** | `hero_banner` |
| **Heading (AR)** | `عون معين القدّومي` |
| **Heading (EN)** | `Awn Mueen Al-Qaddoumi` |
| **Subtitle (AR)** | `<p>داعية إسلامي من الأردن، والمشرف العام على معهد العمارج للدراسات الشرعية...</p>` |
| **Portrait Image Url** | `/images/prototype/sheikh-portrait.png` |
| **Display Order** | `0` |
| **Status** | Published |

**Configuration:**

Use the **Islamic Dark** preset:

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |
| Layout | Split (Portrait + Text) |
| Show Islamic Decorations | ON |
| Decoration Color | `#C9A94E` |
| Full Width | ON |

---

### Block 2: Scholar Cards ("His Scholars and Chain of Transmission")

| Field | Value |
|-------|-------|
| **Block Type** | `scholar_cards` (Scholar / Teacher Cards) |
| **Heading (AR)** | `شيوخه وسنده` |
| **Heading (EN)** | `His Scholars and Chain of Transmission` |
| **Description (AR)** | `<p>تلقى العلوم الشرعية الدينية دراسة وإجازة على عدد من علماء أهل السنة والجماعة...</p>` |
| **Display Order** | `1` |
| **Status** | Published |

**Configuration:**

Use the **Cream Background** preset:

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Text Color | `#2B3D2F` |
| Full Width | ON |
| Vertical Padding | Extra Large |

This block auto-populates from the Scholars you created in section 4d. The scholars are grouped by their `group_key` and displayed as tabs (Jordan, Yemen, Hejaz).

---

### Block 3: Logo Grid ("His Works and Activities")

| Field | Value |
|-------|-------|
| **Block Type** | `logo_grid` (Logo Grid) |
| **Heading (AR)** | `أعماله ونشاطاته` |
| **Heading (EN)** | `His Works and Activities` |
| **Subtitle (AR)** | `مشاريع وأعمال` |
| **Display Order** | `2` |
| **Status** | Published |

Click **Add Logo** four times and fill in:

| # | Name (AR) | Name (EN) | Logo Image URL | Link URL |
|---|-----------|-----------|----------------|----------|
| 1 | `نبع` | `Naba` | `/images/prototype/logo-naba.png` | (optional) |
| 2 | `البيارق` | `Al-Bayariq` | `/images/prototype/logo-bayariq.png` | (optional) |
| 3 | `تلقي` | `Talaqqi` | `/images/prototype/logo-talaqqi.png` | (optional) |
| 4 | `إسلاف` | `Islaf` | `/images/prototype/logo-islaf.png` | (optional) |

**Configuration:**

Use the **Dark Islamic** preset:

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |
| Columns | 4 |
| Full Width | ON |
| Grayscale Logos | OFF |

---

### Block 4: Newsletter CTA

Same as homepage Block 13. See [Block 13 above](#block-13-newsletter-cta).

---

## 7. Building the Islam Initiative Page

The third page in the prototype is a detailed page for the Islam initiative.

### Step 1: Create the Page

1. Navigate to **Pages** (`/admin/pages`)
2. Click **Create New**
3. Fill in:
   - **Title (AR)**: `الإسلام`
   - **Title (EN)**: `Islam`
   - **Slug**: `islam-initiative`
   - **Status**: Published
4. Click **Save**

### Step 2: Add Blocks

---

### Block 1: Hero Banner (Kaaba Image)

| Field | Value |
|-------|-------|
| **Block Type** | `hero_banner` |
| **Heading (AR)** | `الإسلام` |
| **Heading (EN)** | `Islam` |
| **Subtitle (AR)** | `<p>منهجية أهل السنة بالسند المتصل</p>` |
| **Background Image Url** | `/images/prototype/kaaba-bg.jpg` |
| **Display Order** | `0` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |
| Layout | Centered |
| Show Islamic Decorations | ON |
| Full Width | ON |

---

### Block 2: Text with Image ("Al-Ilm Al-Wajib")

| Field | Value |
|-------|-------|
| **Block Type** | `text_with_image` (Text with Image) |
| **Heading (AR)** | `العلم الواجب` |
| **Heading (EN)** | `Obligatory Knowledge` |
| **Body (AR)** | `<p>دورة العلم الواجب، صممت لتعريف المشتركين على أهم الأمور التي تتعلق بأركان الدين...</p>` |
| **Image Url** | (leave empty or add relevant image) |
| **Image Position** | `right` |
| **Cta Text (AR)** | `تعلم الآن` |
| **Cta Link** | `/page/ilm-wajib` |
| **Display Order** | `1` |
| **Status** | Published |

You can also add **Items** (bullet points) by clicking **Add Item**:

| Item Text (AR) |
|----------------|
| `أركان الدين والإيمان والإسلام والإحسان` |
| `بكافة الأمور والعلوم الواجبة على كل مسلم أن يتعلمها ويعمل بها` |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#ffffff` |
| Vertical Padding | Large |

---

### Block 3: Stats Counter ("Religious Literacy in Numbers")

| Field | Value |
|-------|-------|
| **Block Type** | `stats_counter` (Stats Counter) |
| **Heading (AR)** | `محو الأمية الدينية في أرقام` |
| **Heading (EN)** | `Religious Literacy in Numbers` |
| **Display Order** | `2` |
| **Status** | Published |

Click **Add Stat** three times:

| # | Value | Label (AR) | Label (EN) | Suffix (AR) |
|---|-------|-----------|-----------|-------------|
| 1 | `40` | `طالب علم` | `Students` | `ألف` |
| 2 | `10` | `دورة` | `Courses` | `ألف` |
| 3 | `140` | `معلم` | `Teachers` | (empty) |

**Configuration:**

Use the **Cream Light** preset:

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Text Color | `#2B3D2F` |
| Accent Color | `#2B3D2F` |
| Columns | 3 |
| Vertical Padding | Large |

---

### Block 4: Rich Text ("Academic and Da'wah Qualification")

| Field | Value |
|-------|-------|
| **Block Type** | `rich_text` (Rich Text) |
| **Body (AR)** | Full Arabic text about the qualification program, including `<h2>التأهيل العلمي والدعوي</h2>` and paragraphs |
| **Display Order** | `3` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |

---

### Block 5: Stats Counter ("Qualification in Numbers")

Similar to Block 3 but with different numbers:

| # | Value | Label (AR) | Suffix (AR) |
|---|-------|-----------|-------------|
| 1 | `70` | `طالب علم` | `ألف` |
| 2 | `10` | `دورة` | `ألف` |
| 3 | `50` | `علماء` | `%` |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#2B3D2F` |
| Text Color | `#ffffff` |
| Accent Color | `#C9A94E` |
| Columns | 3 |

---

### Block 6: Text with Image ("Talaqqi Platform")

| Field | Value |
|-------|-------|
| **Block Type** | `text_with_image` |
| **Heading (AR)** | `تلقي` |
| **Heading (EN)** | `Talaqqi` |
| **Body (AR)** | `<p>المنصة العلمية</p><p>تلقي هي منصة تعليمية متخصصة في تقديم العلوم الشرعية...</p>` |
| **Image Url** | `/images/prototype/logo-talaqqi.png` |
| **Image Position** | `left` |
| **Cta Text (AR)** | `تعلم الآن` |
| **Display Order** | `4` |
| **Status** | Published |

**Configuration:**

| Config Field | Value |
|-------------|-------|
| Background Color | `#F5F0E8` |
| Vertical Padding | Extra Large |

---

### Block 7: Books Grid ("Publications")

| Field | Value |
|-------|-------|
| **Block Type** | `books_grid` (Books / Publications) |
| **Heading (AR)** | `مؤلفات` |
| **Heading (EN)** | `Publications` |
| **Max Items** | `4` |
| **Display Order** | `5` |
| **Status** | Published |

**Configuration:**

Use the **Dark Islamic** preset:

| Config Field | Value |
|-------------|-------|
| Background Color | `#1E2A22` |
| Text Color | `#ffffff` |
| Columns | 4 |
| Vertical Padding | Extra Large |

This block auto-populates from the Books you created in section 4c.

---

## 8. Navigation Setup

Navigate to **Navigation** (`/admin/navigation-items`).

### Header Navigation

Create these items with **Menu Location** set to `Header`:

| # | Label (AR) | Label (EN) | URL | Order | Parent |
|---|-----------|-----------|-----|-------|--------|
| 1 | `الرئيسية` | `Home` | `/` | 0 | (none) |
| 2 | `عن الشيخ عون` | `About Sheikh Awn` | `/page/about` | 1 | (none) |
| 3 | `المبادرات` | `Initiatives` | `#` | 2 | (none) |
| 4 | `ما الجديد؟` | `What's New?` | `/search` | 3 | (none) |

For the **Initiatives** dropdown children, create items with **Parent** set to the "Initiatives" item:

| Label (AR) | Label (EN) | URL | Order | Parent |
|-----------|-----------|-----|-------|--------|
| `مبادرة الإسلام` | `Islam Initiative` | `/page/islam-initiative` | 0 | Initiatives |
| `مبادرة الإيمان` | `Iman Initiative` | `#iman` | 1 | Initiatives |
| `مبادرة الإحسان` | `Ihsan Initiative` | `#ihsan` | 2 | Initiatives |
| `مبادرة الساعة` | `Signs Initiative` | `#saa` | 3 | Initiatives |

### Footer Column 1: "About the Platform"

Set **Menu Location** to `Footer Column 1`:

| Label (AR) | Label (EN) | URL | Order |
|-----------|-----------|-----|-------|
| `عن الشيخ عون` | `About Sheikh Awn` | `/page/about` | 0 |
| `تابعنا` | `Follow Us` | `#social` | 1 |

### Footer Column 2: "Initiatives"

Set **Menu Location** to `Footer Column 2`:

| Label (AR) | Label (EN) | URL | Order |
|-----------|-----------|-----|-------|
| `مبادرات الإسلام` | `Islam` | `/page/islam-initiative` | 0 |
| `مبادرات الإيمان` | `Iman` | `#iman` | 1 |
| `مبادرات الإحسان` | `Ihsan` | `#ihsan` | 2 |
| `مبادرات الساعة` | `Signs` | `#saa` | 3 |

### Footer Column 3: "Related Links"

Set **Menu Location** to `Footer Column 3`:

| Label (AR) | Label (EN) | URL | Order |
|-----------|-----------|-----|-------|
| `منصة تلقي` | `Talaqqi Platform` | `#talaqqi` | 0 |
| `الإكسير` | `Al-Ikseer` | `#ikseer` | 1 |
| `إسلاف` | `Islaf` | `#islaf` | 2 |
| `دار معين` | `Dar Muin` | `#darmuin` | 3 |

### Footer Column 4: "Support"

Set **Menu Location** to `Footer Column 4`:

| Label (AR) | Label (EN) | URL | Order |
|-----------|-----------|-----|-------|
| `سياسة الخصوصية` | `Privacy Policy` | `/privacy` | 0 |
| `شروط الاستخدام` | `Terms of Use` | `/terms` | 1 |
| `تواصل معنا` | `Contact Us` | `/contact` | 2 |

For every navigation item, fill in all three language labels (AR, EN, TR), set **Target** to `_self`, and set **Status** to `Published`.

---

## 9. Social Media Accounts

Navigate to **Social** (`/admin/social-accounts`). Create entries for each platform:

| Platform | URL | Account Name (AR) | Display Order | Status |
|----------|-----|-------------------|---------------|--------|
| `youtube` | `https://youtube.com/@sheikhawn` | `الشيخ عون القدومي` | 1 | Active |
| `facebook` | `https://facebook.com/sheikhawn` | `الشيخ عون القدومي` | 2 | Active |
| `instagram` | `https://instagram.com/sheikhawn` | `الشيخ عون القدومي` | 3 | Active |
| `telegram` | `https://t.me/sheikhawn` | `الشيخ عون القدومي` | 4 | Active |
| `x` | `https://x.com/sheikhawn` | `الشيخ عون القدومي` | 5 | Active |

These accounts are displayed by the `social_media_feed` block and in the footer social icons.

---

## 10. Page Workflow

### Creating a New Page

1. Go to **Pages** (`/admin/pages`)
2. Click **Create New**
3. Fill in Title (AR, EN, TR), Slug, Meta Description
4. Set Status to **Published** (or **Draft** to work on it before publishing)
5. Click **Save**

### Adding Blocks to a Page

1. From the Pages list, click **Edit** on a page
2. You will see the list of existing blocks with their order
3. Click **Add Block** to create a new block
4. Select the Block Type, fill in content, configure styling
5. Set Display Order (0 = first, 1 = second, etc.)
6. Set Status to **Published**
7. Click **Create Block**

### Editing a Block

1. From the page edit screen, click **Edit** next to any block
2. Modify content or configuration
3. Click **Update Block**

Note: The **Block Type** cannot be changed after creation. If you need a different block type, delete the block and create a new one.

### Reordering Blocks

Blocks are displayed in the order specified by their **Display Order** value (lowest first). To reorder:

1. From the page edit screen, use the **Reorder** feature
2. Drag blocks to the desired position
3. The display order values are automatically updated

### Deleting a Block

1. From the page edit screen, click **Delete** next to a block
2. Confirm the deletion

### Previewing the Page

After adding and publishing blocks, visit the public URL to see the result:
- Homepage: `https://yourdomain.com/`
- About page: `https://yourdomain.com/page/about`
- Any page: `https://yourdomain.com/page/{slug}`

### Using Style Presets

When editing a block, look for the **Quick Presets** buttons in the Configuration section. These apply pre-defined color and layout combinations with one click:

- **hero_banner**: "Islamic Dark", "Deep Green Centered", "Cream Light"
- **pillar_cards**: "Dark Cards on Green", "Light Cards on Cream"
- **quran_verse**: "Deep Blue Overlay", "Dark Green Card"
- **logo_grid**: "Dark Islamic", "Cream Background"
- **newsletter_cta**: "Islamic Green", "Gold Accent"
- **featured_quote**: "Dark Elegance", "Islamic Green"
- **stats_counter**: "Islamic Green", "Deep Dark", "Cream Light"
- **books_grid**: "Dark Islamic", "Deep Navy"
- **scholar_cards**: "Cream Background", "Dark Green"

After applying a preset, you can still fine-tune individual config values.

### Color Reference

| Name | Hex | Usage |
|------|-----|-------|
| Dark Green | `#2B3D2F` | Primary brand color, headers, dark sections |
| Deep Dark Green | `#1E2A22` | Footer, alternating dark sections |
| Gold | `#C9A94E` | Accents, decorations, ornamental elements |
| Cream | `#F5F0E8` | Light section backgrounds |
| White | `#ffffff` | Text on dark backgrounds, clean sections |
| Deep Blue | `#1a237e` | Quran verse overlay backgrounds |
