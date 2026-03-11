<?php

namespace Database\Seeders;

use App\Models\ContentCategory;
use App\Models\ContentItem;
use App\Models\Page;
use App\Models\PageBlock;
use App\Models\Quote;
use App\Models\SocialAccount;
use Illuminate\Database\Seeder;

/**
 * Seeds the homepage matching the prototype design exactly.
 *
 * Creates:
 *  - 4 content categories (الإسلام, الإيمان, الإحسان, علامات الساعة)
 *  - Sample content items per category
 *  - Quotes for the random quote block
 *  - Social media accounts
 *  - Homepage with 13 blocks matching the prototype layout
 *
 * Run: php artisan db:seed --class=PrototypeHomepageSeeder
 */
class PrototypeHomepageSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedCategories();
        $this->seedContentItems();
        $this->seedQuotes();
        $this->seedSocialAccounts();
        $this->seedHomepage();
    }

    // ─────────────────────────────────────────────
    // Categories
    // ─────────────────────────────────────────────
    protected function seedCategories(): void
    {
        $categories = [
            [
                'name' => ['ar' => 'الإسلام', 'en' => 'Islam', 'tr' => 'İslam'],
                'slug' => 'islam',
                'description' => [
                    'ar' => 'مشاريع ومبادرات ومقالات في مجال الإسلام',
                    'en' => 'Projects, initiatives, and articles on Islam',
                    'tr' => 'İslam alanında projeler, girişimler ve makaleler',
                ],
                'quote' => [
                    'ar' => 'طلب العلم فريضة على كل مسلم',
                    'en' => 'Seeking knowledge is an obligation upon every Muslim',
                    'tr' => 'İlim talep etmek her Müslümana farzdır',
                ],
                'icon' => 'mosque',
                'order' => 1,
            ],
            [
                'name' => ['ar' => 'الإيمان', 'en' => 'Faith', 'tr' => 'İman'],
                'slug' => 'iman',
                'description' => [
                    'ar' => 'مشاريع ومبادرات ومقالات في مجال الإيمان',
                    'en' => 'Projects, initiatives, and articles on Faith',
                    'tr' => 'İman alanında projeler, girişimler ve makaleler',
                ],
                'quote' => [
                    'ar' => 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
                    'en' => 'None of you truly believes until he loves for his brother what he loves for himself',
                    'tr' => 'Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz',
                ],
                'icon' => 'favorite',
                'order' => 2,
            ],
            [
                'name' => ['ar' => 'الإحسان', 'en' => 'Ihsan', 'tr' => 'İhsan'],
                'slug' => 'ihsan',
                'description' => [
                    'ar' => 'مشاريع ومبادرات ومقالات في مجال الإحسان',
                    'en' => 'Projects, initiatives, and articles on Ihsan (Excellence)',
                    'tr' => 'İhsan alanında projeler, girişimler ve makaleler',
                ],
                'quote' => [
                    'ar' => 'هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِهِ وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ',
                    'en' => 'It is He who has sent among the unlettered a Messenger from themselves reciting to them His verses and purifying them and teaching them the Book and wisdom',
                    'tr' => 'Ümmîlere, içlerinden, kendilerine âyetlerini okuyan, onları temizleyen, onlara kitabı ve hikmeti öğreten bir peygamber gönderen O\'dur',
                ],
                'icon' => 'auto_awesome',
                'order' => 3,
            ],
            [
                'name' => ['ar' => 'علامات الساعة', 'en' => 'Signs of the Hour', 'tr' => 'Kıyamet Alametleri'],
                'slug' => 'signs-of-the-hour',
                'description' => [
                    'ar' => 'مشاريع ومبادرات ومقالات في علامات الساعة',
                    'en' => 'Projects, initiatives, and articles on the Signs of the Hour',
                    'tr' => 'Kıyamet alametleri alanında projeler, girişimler ve makaleler',
                ],
                'quote' => [
                    'ar' => 'بادروا بالأعمال فتناً كقطع الليل المظلم، يصبح الرجل مؤمناً ويمسي كافراً، ويمسي مؤمناً ويصبح كافراً، يبيع دينه بعرض من الدنيا',
                    'en' => 'Hasten to do good deeds before trials come like patches of dark night',
                    'tr' => 'Karanlık gece parçaları gibi fitneler gelmeden önce salih amellere koşun',
                ],
                'icon' => 'schedule',
                'order' => 4,
            ],
        ];

        foreach ($categories as $data) {
            ContentCategory::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'quote' => $data['quote'],
                    'icon' => $data['icon'],
                    'order' => $data['order'],
                    'status' => 'published',
                ]
            );
        }

        $this->command->info('Categories seeded: 4');
    }

    // ─────────────────────────────────────────────
    // Content Items (sample items per category)
    // ─────────────────────────────────────────────
    protected function seedContentItems(): void
    {
        $items = [
            // ── الإسلام ──
            [
                'category_slug' => 'islam',
                'title' => ['ar' => 'التفقه في الدين', 'en' => 'Understanding the Religion', 'tr' => 'Dinde Derinleşmek'],
                'excerpt' => ['ar' => 'ذات المعرفة الشرعية والتأصيل العلمي في مجالات الفقه الإسلامي', 'en' => 'Islamic jurisprudence and scholarly grounding', 'tr' => 'İslam fıkhında ilmi derinlik'],
                'slug' => 'understanding-the-religion',
            ],
            [
                'category_slug' => 'islam',
                'title' => ['ar' => 'مشروع التلقي', 'en' => 'Talaqqi Project', 'tr' => 'Telakki Projesi'],
                'excerpt' => ['ar' => 'مشروع لتعليم العلوم الشرعية عبر التلقي المباشر من العلماء', 'en' => 'A project for teaching Islamic sciences through direct learning from scholars', 'tr' => 'Alimlerden doğrudan öğrenme yoluyla İslami ilimleri öğretme projesi'],
                'slug' => 'talaqqi-project',
            ],
            [
                'category_slug' => 'islam',
                'title' => ['ar' => 'فقه التحولات', 'en' => 'Jurisprudence of Transformations', 'tr' => 'Dönüşümler Fıkhı'],
                'excerpt' => ['ar' => 'فهم التحولات المعاصرة في ضوء الشريعة الإسلامية', 'en' => 'Understanding contemporary transformations in light of Islamic law', 'tr' => 'İslam hukuku ışığında çağdaş dönüşümleri anlamak'],
                'slug' => 'jurisprudence-of-transformations',
            ],
            [
                'category_slug' => 'islam',
                'title' => ['ar' => 'واحة معين', 'en' => 'Mu\'een Oasis', 'tr' => 'Muîn Vahası'],
                'excerpt' => ['ar' => 'مبادرة لنشر العلم الشرعي وخدمة المجتمع', 'en' => 'An initiative for spreading Islamic knowledge and community service', 'tr' => 'İslami bilgiyi yayma ve topluma hizmet girişimi'],
                'slug' => 'mueen-oasis',
            ],
            // ── الإيمان ──
            [
                'category_slug' => 'iman',
                'title' => ['ar' => 'شعبة الإحسان', 'en' => 'Branch of Ihsan', 'tr' => 'İhsan Şubesi'],
                'excerpt' => ['ar' => 'برنامج لتزكية النفس وتقوية الإيمان', 'en' => 'A program for self-purification and strengthening faith', 'tr' => 'Nefis tezkiyesi ve imanı güçlendirme programı'],
                'slug' => 'branch-of-ihsan',
            ],
            [
                'category_slug' => 'iman',
                'title' => ['ar' => 'رحلة الإيمان', 'en' => 'Journey of Faith', 'tr' => 'İman Yolculuğu'],
                'excerpt' => ['ar' => 'رحلات علمية وإيمانية لتعزيز الإيمان واليقين', 'en' => 'Scholarly and spiritual journeys to strengthen faith and certainty', 'tr' => 'İman ve yakini güçlendirmek için ilmi ve manevi yolculuklar'],
                'slug' => 'journey-of-faith',
            ],
            [
                'category_slug' => 'iman',
                'title' => ['ar' => 'مؤسسة البراش', 'en' => 'Al-Barash Foundation', 'tr' => 'El-Beraş Vakfı'],
                'excerpt' => ['ar' => 'مؤسسة خيرية وتعليمية لخدمة المجتمع الإسلامي', 'en' => 'A charitable and educational foundation serving the Muslim community', 'tr' => 'Müslüman topluma hizmet eden hayır ve eğitim vakfı'],
                'slug' => 'al-barash-foundation',
            ],
            // ── الإحسان ──
            [
                'category_slug' => 'ihsan',
                'title' => ['ar' => 'مسابقة الذكر', 'en' => 'Dhikr Competition', 'tr' => 'Zikir Yarışması'],
                'excerpt' => ['ar' => 'مسابقات في الذكر والتلاوة والمداومة على العبادة', 'en' => 'Competitions in remembrance, recitation, and worship consistency', 'tr' => 'Zikir, kıraat ve ibadette devamlılık yarışmaları'],
                'slug' => 'dhikr-competition',
            ],
            [
                'category_slug' => 'ihsan',
                'title' => ['ar' => 'برنامج التزكية', 'en' => 'Tazkiyah Program', 'tr' => 'Tezkiye Programı'],
                'excerpt' => ['ar' => 'برنامج شامل لتزكية النفوس وتطهير القلوب', 'en' => 'A comprehensive program for spiritual purification', 'tr' => 'Kapsamlı nefis tezkiyesi programı'],
                'slug' => 'tazkiyah-program',
            ],
            [
                'category_slug' => 'ihsan',
                'title' => ['ar' => 'الأوراد والأذكار', 'en' => 'Daily Adhkar', 'tr' => 'Günlük Zikirler'],
                'excerpt' => ['ar' => 'الأوراد اليومية والأذكار المأثورة من السنة النبوية', 'en' => 'Daily prayers and adhkar from the Prophetic tradition', 'tr' => 'Peygamber geleneğinden günlük dualar ve zikirler'],
                'slug' => 'daily-adhkar',
            ],
            // ── علامات الساعة ──
            [
                'category_slug' => 'signs-of-the-hour',
                'title' => ['ar' => 'فقه التحولات', 'en' => 'Jurisprudence of Change', 'tr' => 'Değişim Fıkhı'],
                'excerpt' => ['ar' => 'فهم التحولات الكبرى في ضوء أحاديث آخر الزمان', 'en' => 'Understanding major shifts in light of end-times prophecies', 'tr' => 'Ahir zaman hadisleri ışığında büyük dönüşümleri anlamak'],
                'slug' => 'jurisprudence-of-change',
            ],
            [
                'category_slug' => 'signs-of-the-hour',
                'title' => ['ar' => 'الفتن وعلاماتها', 'en' => 'Trials and Their Signs', 'tr' => 'Fitneler ve Alametleri'],
                'excerpt' => ['ar' => 'دراسة الفتن وعلامات الساعة في ضوء القرآن والسنة', 'en' => 'Studying trials and signs of the Hour in light of Quran and Sunnah', 'tr' => 'Kur\'an ve Sünnet ışığında fitneler ve kıyamet alametlerini inceleme'],
                'slug' => 'trials-and-signs',
            ],
            [
                'category_slug' => 'signs-of-the-hour',
                'title' => ['ar' => 'البشائر الإلهية', 'en' => 'Divine Glad Tidings', 'tr' => 'İlahi Müjdeler'],
                'excerpt' => ['ar' => 'البشائر والعلامات الدالة على نصر الأمة', 'en' => 'Signs and glad tidings indicating the victory of the Ummah', 'tr' => 'Ümmetin zaferini müjdeleyen işaretler ve alametler'],
                'slug' => 'divine-glad-tidings',
            ],
        ];

        foreach ($items as $itemData) {
            $category = ContentCategory::where('slug', $itemData['category_slug'])->first();
            if (!$category) {
                continue;
            }

            ContentItem::updateOrCreate(
                ['slug' => $itemData['slug']],
                [
                    'content_category_id' => $category->id,
                    'title' => $itemData['title'],
                    'excerpt' => $itemData['excerpt'],
                    'status' => 'published',
                    'publish_date' => now()->subDays(rand(1, 60)),
                ]
            );
        }

        $this->command->info('Content items seeded: ' . count($items));
    }

    // ─────────────────────────────────────────────
    // Quotes
    // ─────────────────────────────────────────────
    protected function seedQuotes(): void
    {
        $quotes = [
            [
                'text' => [
                    'ar' => 'إحياء الدين كله في العالم كله إلى قيام الساعة',
                    'en' => 'Reviving the entire religion in the entire world until the Day of Judgment',
                    'tr' => 'Kıyamete kadar tüm dünyada tüm dini ihya etmek',
                ],
                'source' => [
                    'ar' => 'الشيخ عون معين القدومي',
                    'en' => 'Sheikh Awn Mueen Al-Qaddoumi',
                    'tr' => 'Şeyh Avn Muin El-Kaddumi',
                ],
                'is_featured' => true,
            ],
            [
                'text' => [
                    'ar' => 'العلم ميراث الأنبياء، والعلماء ورثة الأنبياء',
                    'en' => 'Knowledge is the inheritance of the Prophets, and scholars are the heirs of the Prophets',
                    'tr' => 'İlim peygamberlerin mirasıdır ve alimler peygamberlerin varisleridir',
                ],
                'source' => [
                    'ar' => 'حديث شريف',
                    'en' => 'Prophetic Hadith',
                    'tr' => 'Hadis-i Şerif',
                ],
                'is_featured' => false,
            ],
            [
                'text' => [
                    'ar' => 'من سلك طريقاً يلتمس فيه علماً سهّل الله له به طريقاً إلى الجنة',
                    'en' => 'Whoever takes a path seeking knowledge, Allah will make easy for him a path to Paradise',
                    'tr' => 'Kim ilim öğrenmek için bir yola girerse, Allah ona cennetin yolunu kolaylaştırır',
                ],
                'source' => [
                    'ar' => 'حديث شريف - صحيح مسلم',
                    'en' => 'Prophetic Hadith - Sahih Muslim',
                    'tr' => 'Hadis-i Şerif - Sahih-i Müslim',
                ],
                'is_featured' => false,
            ],
        ];

        foreach ($quotes as $quoteData) {
            Quote::updateOrCreate(
                ['text->ar' => $quoteData['text']['ar']],
                [
                    'text' => $quoteData['text'],
                    'source' => $quoteData['source'],
                    'is_featured' => $quoteData['is_featured'],
                    'status' => 'published',
                ]
            );
        }

        $this->command->info('Quotes seeded: ' . count($quotes));
    }

    // ─────────────────────────────────────────────
    // Social Accounts
    // ─────────────────────────────────────────────
    protected function seedSocialAccounts(): void
    {
        $accounts = [
            ['platform' => 'youtube', 'url' => 'https://youtube.com/@sheikhawn', 'account_name' => ['ar' => 'الشيخ عون القدومي', 'en' => 'Sheikh Awn', 'tr' => 'Şeyh Avn'], 'display_order' => 1],
            ['platform' => 'facebook', 'url' => 'https://facebook.com/sheikhawn', 'account_name' => ['ar' => 'الشيخ عون القدومي', 'en' => 'Sheikh Awn', 'tr' => 'Şeyh Avn'], 'display_order' => 2],
            ['platform' => 'instagram', 'url' => 'https://instagram.com/sheikhawn', 'account_name' => ['ar' => 'الشيخ عون القدومي', 'en' => 'Sheikh Awn', 'tr' => 'Şeyh Avn'], 'display_order' => 3],
            ['platform' => 'telegram', 'url' => 'https://t.me/sheikhawn', 'account_name' => ['ar' => 'الشيخ عون القدومي', 'en' => 'Sheikh Awn', 'tr' => 'Şeyh Avn'], 'display_order' => 4],
            ['platform' => 'x', 'url' => 'https://x.com/sheikhawn', 'account_name' => ['ar' => 'الشيخ عون القدومي', 'en' => 'Sheikh Awn', 'tr' => 'Şeyh Avn'], 'display_order' => 5],
        ];

        foreach ($accounts as $acc) {
            SocialAccount::updateOrCreate(
                ['platform' => $acc['platform']],
                [
                    'url' => $acc['url'],
                    'account_name' => $acc['account_name'],
                    'display_order' => $acc['display_order'],
                    'status' => 'active',
                ]
            );
        }

        $this->command->info('Social accounts seeded: ' . count($accounts));
    }

    // ─────────────────────────────────────────────
    // Homepage blocks
    // ─────────────────────────────────────────────
    protected function seedHomepage(): void
    {
        $page = Page::updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => [
                    'en' => 'Home',
                    'ar' => 'الرئيسية',
                    'tr' => 'Ana Sayfa',
                ],
                'meta_fields' => [
                    'description' => 'الموقع الرسمي للشيخ عون معين القدومي',
                ],
                'status' => 'published',
                'is_homepage' => true,
            ]
        );

        $page->blocks()->delete();
        $order = 0;

        // Fetch category IDs for category_grid blocks
        $islamCat = ContentCategory::where('slug', 'islam')->first();
        $imanCat = ContentCategory::where('slug', 'iman')->first();
        $ihsanCat = ContentCategory::where('slug', 'ihsan')->first();
        $signsCat = ContentCategory::where('slug', 'signs-of-the-hour')->first();

        // ═══════════════════════════════════════════
        // Block 1: Hero Banner (centered, mosque bg)
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'إحياء الدين كله في العالم كله إلى قيام الساعة',
                    'en' => 'Reviving the entire religion in the entire world until the Day of Judgment',
                    'tr' => 'Kıyamete kadar tüm dünyada tüm dini ihya etmek',
                ],
                'subtitle' => [
                    'ar' => '<p>في إحياء الدين كله في العالم كله، مسيرة علم وعمل ودعوة إلى الله تعالى</p>',
                    'en' => '<p>A journey of knowledge, action, and calling to Allah the Almighty — reviving the religion in all the world</p>',
                    'tr' => '<p>Allah Teâlâ\'ya davet, ilim ve amel yolculuğu — tüm dünyada dini ihya etmek</p>',
                ],
                'background_image_url' => '/images/prototype/mosque-bg.jpg',
                'portrait_image_url' => '',
                'cta_text' => [
                    'ar' => 'الشيخ عون القدومي',
                    'en' => 'Sheikh Awn Al-Qaddoumi',
                    'tr' => 'Şeyh Avn El-Kaddumi',
                ],
                'cta_link' => '/page/about',
                'overlay_opacity' => 0.6,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '550px',
                'text_color' => '#ffffff',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(201, 169, 78, 0.15)',
                'background_color' => '#1E2A22',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 2: الإسلام — Featured Quote (Hadith)
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'featured_quote',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'الإسلام',
                    'en' => 'Islam',
                    'tr' => 'İslam',
                ],
                'custom_text' => [
                    'ar' => 'طلب العلم فريضة على كل مسلم',
                    'en' => 'Seeking knowledge is an obligation upon every Muslim',
                    'tr' => 'İlim talep etmek her Müslümana farzdır',
                ],
                'custom_source' => [
                    'ar' => 'حديث نبوي شريف',
                    'en' => 'Prophetic Hadith',
                    'tr' => 'Hadis-i Şerif',
                ],
            ],
            'config' => [
                'style' => 'light',
                'background_color' => '#F5F0E8',
                'text_color' => '#2B3D2F',
                'accent_color' => '#C9A94E',
                'padding_y' => 'lg',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 3: الإسلام — Category Grid
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => '',
                    'en' => '',
                    'tr' => '',
                ],
                'description' => [
                    'ar' => 'ذات المعرفة الشرعية والتأصيل العلمي في مجالات الفقه الإسلامي والمذاهب الأربعة',
                    'en' => 'Scholarly knowledge and academic grounding in Islamic jurisprudence and the four schools of thought',
                    'tr' => 'İslam fıkhı ve dört mezhepte ilmi bilgi ve akademik temel',
                ],
                'category_id' => $islamCat?->id,
                'max_items' => 4,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#F5F0E8',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 4: الإيمان — Featured Quote (Hadith)
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'featured_quote',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'الإيمان',
                    'en' => 'Faith',
                    'tr' => 'İman',
                ],
                'custom_text' => [
                    'ar' => 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
                    'en' => 'None of you truly believes until he loves for his brother what he loves for himself',
                    'tr' => 'Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz',
                ],
                'custom_source' => [
                    'ar' => 'حديث نبوي شريف - صحيح البخاري',
                    'en' => 'Prophetic Hadith - Sahih al-Bukhari',
                    'tr' => 'Hadis-i Şerif - Sahih-i Buhari',
                ],
            ],
            'config' => [
                'style' => 'dark',
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'accent_color' => '#C9A94E',
                'padding_y' => 'lg',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 5: الإيمان — Category Grid
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => '',
                    'en' => '',
                    'tr' => '',
                ],
                'description' => [
                    'ar' => 'برامج ومبادرات لتقوية الإيمان وتزكية النفوس',
                    'en' => 'Programs and initiatives for strengthening faith and purifying souls',
                    'tr' => 'İmanı güçlendirme ve nefisleri arındırma programları ve girişimleri',
                ],
                'category_id' => $imanCat?->id,
                'max_items' => 4,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 6: الإحسان — Quran Verse
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'quran_verse',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'section_heading' => [
                    'ar' => 'الإحسان',
                    'en' => 'Ihsan',
                    'tr' => 'İhsan',
                ],
                'verse_text' => [
                    'ar' => 'هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِهِ وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ وَإِن كَانُوا مِن قَبْلُ لَفِي ضَلَالٍ مُّبِينٍ',
                    'en' => 'It is He who has sent among the unlettered a Messenger from themselves reciting to them His verses and purifying them and teaching them the Book and wisdom — although they were before in clear error',
                    'tr' => 'Ümmîlere, içlerinden, kendilerine âyetlerini okuyan, onları temizleyen, onlara kitabı ve hikmeti öğreten bir peygamber gönderen O\'dur. Hâlbuki onlar, bundan önce apaçık bir sapıklık içinde idiler',
                ],
                'surah_name' => [
                    'ar' => 'سورة الجمعة',
                    'en' => 'Surah Al-Jumu\'ah',
                    'tr' => 'Cuma Suresi',
                ],
                'verse_reference' => '62:2',
                'secondary_text' => [
                    'ar' => 'لم يحصلوا على هذا الإحسان، فمثلاً: عندي يتلون إلى التلاوات والمواعظ والاخلاق وإنما',
                    'en' => '',
                    'tr' => '',
                ],
                'secondary_source' => ['ar' => '', 'en' => '', 'tr' => ''],
                'background_image_url' => '',
                'cta_text' => ['ar' => '', 'en' => '', 'tr' => ''],
                'cta_link' => '',
                'bottom_items' => [
                    ['heading' => ['ar' => 'مسابقة الذكر', 'en' => 'Dhikr Competition', 'tr' => 'Zikir Yarışması'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['ar' => 'قافلة في القرآن', 'en' => 'Quran Caravan', 'tr' => 'Kur\'an Kafilesi'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['ar' => 'الأوراد', 'en' => 'Daily Adhkar', 'tr' => 'Zikirler'], 'image_url' => '', 'link' => ''],
                ],
            ],
            'config' => [
                'text_color' => '#ffffff',
                'background_color' => '#F5F0E8',
                'ornamental_frame' => true,
                'padding_y' => 'xl',
                'layout' => 'card',
                'accent_color' => '#C9A94E',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 7: الإحسان — Category Grid
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => '',
                    'en' => '',
                    'tr' => '',
                ],
                'description' => [
                    'ar' => 'برامج ومبادرات في مجال الإحسان والتزكية',
                    'en' => 'Programs and initiatives in Ihsan and spiritual purification',
                    'tr' => 'İhsan ve manevi arınma alanında programlar ve girişimler',
                ],
                'category_id' => $ihsanCat?->id,
                'max_items' => 4,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#F5F0E8',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 8: علامات الساعة — Featured Quote (Hadith)
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'featured_quote',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'علامات الساعة',
                    'en' => 'Signs of the Hour',
                    'tr' => 'Kıyamet Alametleri',
                ],
                'custom_text' => [
                    'ar' => 'بادروا بالأعمال فتناً كقطع الليل المظلم، يصبح الرجل مؤمناً ويمسي كافراً، ويمسي مؤمناً ويصبح كافراً، يبيع دينه بعرض من الدنيا',
                    'en' => 'Hasten to do good deeds before trials come like patches of dark night — a man wakes up as a believer and goes to sleep as a disbeliever',
                    'tr' => 'Karanlık gece parçaları gibi fitneler gelmeden önce salih amellere koşun',
                ],
                'custom_source' => [
                    'ar' => 'حديث نبوي شريف - صحيح مسلم',
                    'en' => 'Prophetic Hadith - Sahih Muslim',
                    'tr' => 'Hadis-i Şerif - Sahih-i Müslim',
                ],
            ],
            'config' => [
                'style' => 'dark',
                'background_color' => '#1E2A22',
                'text_color' => '#ffffff',
                'accent_color' => '#C9A94E',
                'padding_y' => 'lg',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 9: علامات الساعة — Category Grid
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => '',
                    'en' => '',
                    'tr' => '',
                ],
                'description' => [
                    'ar' => 'فقه التحولات والفتن وعلامات الساعة الكبرى والصغرى',
                    'en' => 'Jurisprudence of trials and the major and minor signs of the Hour',
                    'tr' => 'Fitneler fıkhı ve büyük ve küçük kıyamet alametleri',
                ],
                'category_id' => $signsCat?->id,
                'max_items' => 4,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#1E2A22',
                'text_color' => '#ffffff',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 10: آخر الأخبار — Latest News
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'latest_news',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'آخر الأخبار',
                    'en' => 'Latest News',
                    'tr' => 'Son Haberler',
                ],
                'max_items' => 3,
            ],
            'config' => [
                'columns' => 3,
                'background_color' => '#ffffff',
                'show_images' => true,
                'show_excerpt' => true,
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 11: جديد التواصل الاجتماعي — Social Media Feed
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'social_media_feed',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'جديد التواصل الاجتماعي',
                    'en' => 'Social Media Updates',
                    'tr' => 'Sosyal Medya Güncellemeleri',
                ],
                'max_items' => 6,
            ],
            'config' => [
                'background_color' => '#1E2A22',
                'text_color' => '#ffffff',
                'show_icons' => true,
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 12: اقتباسات — Featured Quote (Random)
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'featured_quote',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => '',
                    'en' => '',
                    'tr' => '',
                ],
                // No quote_id → resolves to random published quote
            ],
            'config' => [
                'style' => 'dark',
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'accent_color' => '#C9A94E',
                'padding_y' => 'xl',
            ],
        ]);

        // ═══════════════════════════════════════════
        // Block 13: نسعد بتواصلكم — Newsletter CTA
        // ═══════════════════════════════════════════
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'newsletter_cta',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'ar' => 'نسعد بتواصلكم',
                    'en' => 'We are delighted to hear from you',
                    'tr' => 'Sizden haber almaktan memnuniyet duyarız',
                ],
                'subtitle' => [
                    'ar' => 'اشترك لتلقي آخر التحديثات والمحتوى العلمي',
                    'en' => 'Subscribe to receive the latest updates and scholarly content',
                    'tr' => 'En son güncellemeleri ve ilmi içerikleri almak için abone olun',
                ],
                'placeholder_text' => [
                    'ar' => 'أدخل بريدك الإلكتروني',
                    'en' => 'Enter your email',
                    'tr' => 'E-postanızı girin',
                ],
                'button_text' => [
                    'ar' => 'اشترك',
                    'en' => 'Subscribe',
                    'tr' => 'Abone Ol',
                ],
            ],
            'config' => [
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'full_width' => true,
            ],
        ]);

        $this->command->info("Prototype homepage seeded with {$order} blocks.");
    }
}
