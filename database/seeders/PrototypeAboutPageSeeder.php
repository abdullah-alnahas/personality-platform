<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds a prototype "About" page with Quran verse, rich text, and newsletter blocks.
 * Run: php artisan db:seed --class=PrototypeAboutPageSeeder
 */
class PrototypeAboutPageSeeder extends Seeder
{
    public function run(): void
    {
        $page = Page::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => [
                    'en' => 'About',
                    'ar' => 'نبذة',
                    'tr' => 'Hakkında',
                ],
                'meta_fields' => [
                    'description' => 'Learn about Sheikh Awn Al-Qaddoumi',
                ],
                'status' => 'published',
            ]
        );

        $page->blocks()->delete();
        $order = 0;

        // ─── Hero Banner (centered) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'About Sheikh Awn',
                    'ar' => 'عن الشيخ عون',
                    'tr' => 'Şeyh Avn Hakkında',
                ],
                'subtitle' => [
                    'en' => '<p>A lifetime dedicated to Islamic knowledge and service</p>',
                    'ar' => '<p>حياة مكرسة للعلم الشرعي والخدمة</p>',
                    'tr' => '<p>İslami bilgi ve hizmete adanmış bir ömür</p>',
                ],
                'background_image_url' => '',
                'portrait_image_url' => '',
                'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                'cta_link' => '',
                'overlay_opacity' => 0.5,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '350px',
                'text_color' => '#ffffff',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(181, 210, 107, 0.15)',
                'background_color' => '#4A6741',
            ],
        ]);

        // ─── Quran Verse (card layout) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'quran_verse',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'section_heading' => [
                    'en' => '',
                    'ar' => 'من القرآن الكريم',
                    'tr' => '',
                ],
                'verse_text' => [
                    'en' => 'Indeed, those who have believed and done righteous deeds - the Most Merciful will appoint for them affection.',
                    'ar' => 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَنُ وُدًّا',
                    'tr' => 'Şüphesiz, iman edip salih ameller işleyenler için Rahmân, (gönüllere) bir sevgi koyacaktır.',
                ],
                'surah_name' => [
                    'en' => 'Surah Maryam',
                    'ar' => 'سورة مريم',
                    'tr' => 'Meryem Suresi',
                ],
                'verse_reference' => '19:96',
                'secondary_text' => [
                    'en' => 'The Messenger of Allah (peace be upon him) said: "When Allah loves a servant, He calls Gabriel and says: I love so-and-so, so love him."',
                    'ar' => 'قال رسول الله صلى الله عليه وسلم: إذا أحبَّ اللهُ عبداً نادى جبريلَ: إنَّ اللهَ يحبُّ فلاناً فأحِبَّه',
                    'tr' => 'Resulullah (sav) buyurdu: "Allah bir kulunu sevdiğinde Cebrail\'e seslenir: Allah falancayı seviyor, sen de sev."',
                ],
                'secondary_source' => [
                    'en' => 'Hadith - Sahih al-Bukhari',
                    'ar' => 'حديث شريف - صحيح البخاري',
                    'tr' => 'Hadis - Sahih-i Buhari',
                ],
                'background_image_url' => '',
                'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                'cta_link' => '',
                'bottom_items' => [
                    ['heading' => ['en' => 'Quran', 'ar' => 'القرآن', 'tr' => 'Kur\'an'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['en' => 'Hadith', 'ar' => 'الحديث', 'tr' => 'Hadis'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['en' => 'Fiqh', 'ar' => 'الفقه', 'tr' => 'Fıkıh'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['en' => 'Tazkiyah', 'ar' => 'التزكية', 'tr' => 'Tezkiye'], 'image_url' => '', 'link' => ''],
                ],
            ],
            'config' => [
                'text_color' => '#ffffff',
                'background_color' => '#2D4128',
                'ornamental_frame' => true,
                'padding_y' => 'xl',
                'layout' => 'card',
                'accent_color' => '#B5D26B',
            ],
        ]);

        // ─── Text + Portrait (biography section, matches prototype) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'text_with_image',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Awn Mueen Al-Qaddoumi',
                    'ar' => 'عون معين القدّومي',
                    'tr' => 'Avn Muin El-Kaddumi',
                ],
                'body' => [
                    'en' => '<p>An Islamic scholar and preacher from Jordan, the General Supervisor of the Al-Ma\'arij Institute for Sharia Studies and the Al-Hawra\' Institute for Qualification and Building in Jordan. He is a founder and partner in a number of institutional dawah works, with a wide presence in media, television, radio, and youth and religious activities.</p><p>He has participated in journeys and dawah conferences across the Islamic world, with several authored works in various Sharia and dawah fields. Born in Amman on Friday, 11 Ramadan 1402 AH (2 July 1982 CE).</p>',
                    'ar' => '<p>داعية إسلامي من الأردن، والمشرف العام على معهد المعارج للدراسات الشرعية، ومعهد الحوراء للتأهيل والبناء في الأردن، ومؤسس ومشارك لعدد من الأعمال الدعوية المؤسسية، له حضوره الواسع في الإعلام والبرامج التلفزيونية والإذاعية والفعاليات الشبابية والدينية.</p><p>وله مشاركات في رحلات ومؤتمرات دعوية على مستوى العالم الإسلامي، وله مؤلفات عدة في مجالات شرعية ودعوية متعددة. ولد في عمّان الجمعة ١١ رمضان ١٤٠٢ هـ الموافق ٢ تموز ١٩٨٢.</p>',
                    'tr' => '<p>Ürdünlü İslam alimi ve davetçi. Ürdün\'deki El-Maaric Şeriat Çalışmaları Enstitüsü ve El-Hevra Yetiştirme ve İnşa Enstitüsü\'nün Genel Müdürü. Birçok kurumsal davet çalışmasının kurucusu ve ortağıdır.</p>',
                ],
                'image_url' => '/images/prototype/sheikh-portrait.png',
                'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                'cta_link' => '',
            ],
            'config' => [
                'image_position' => 'left',
                'background_color' => '#FFFFFF',
                'text_color' => '#2A2A28',
                'show_decorations' => true,
                'padding_y' => 'lg',
            ],
        ]);

        // ─── Scholar Cards ("شيوخه وسنده") ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'scholar_cards',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'His Scholars and Chain of Transmission',
                    'ar' => 'شيوخه وسنده',
                    'tr' => 'Hocaları ve İlim Silsilesi',
                ],
                'description' => [
                    'en' => '<p>Sheikh Awn received his knowledge from the most eminent scholars of his time, establishing an unbroken chain of transmission reaching back to the Prophet ﷺ.</p>',
                    'ar' => '<p>تلقى الشيخ عون علمه على يد كبار علماء عصره، مما أسس سلسلة إسناد متواصلة تمتد حتى النبي صلى الله عليه وسلم.</p>',
                    'tr' => '<p>Şeyh Avn, ilmini zamanının en büyük alimlerinden aldı ve Hz. Peygamber\'e kadar uzanan kesintisiz bir ilim silsilesi kurdu.</p>',
                ],
            ],
            'config' => [
                'background_color' => '#F7F4ED',
                'text_color' => '#4A6741',
                'full_width' => true,
            ],
        ]);

        // ─── Logo Grid ("أعماله ونشاطاته") ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'logo_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'His Works and Activities',
                    'ar' => 'أعماله ونشاطاته',
                    'tr' => 'Eserleri ve Faaliyetleri',
                ],
                'subtitle' => [
                    'en' => 'Organizations, initiatives, and institutions founded or supported by Sheikh Awn',
                    'ar' => 'المنظمات والمبادرات والمؤسسات التي أسسها أو دعمها الشيخ عون',
                    'tr' => 'Şeyh Avn tarafından kurulan veya desteklenen kuruluşlar, girişimler ve kurumlar',
                ],
                'logos' => [
                    ['heading' => ['ar' => 'نبع', 'en' => 'Naba'], 'image_url' => '/images/prototype/logo-naba.png', 'link' => ''],
                    ['heading' => ['ar' => 'البيارق', 'en' => 'Al-Bayariq'], 'image_url' => '/images/prototype/logo-bayariq.png', 'link' => ''],
                    ['heading' => ['ar' => 'تلقي', 'en' => 'Talaqqi'], 'image_url' => '/images/prototype/logo-talaqqi.png', 'link' => ''],
                    ['heading' => ['ar' => 'إسلاف', 'en' => 'Islaf'], 'image_url' => '/images/prototype/logo-islaf.png', 'link' => ''],
                ],
                'cta_text' => ['en' => 'Learn More', 'ar' => 'اعرف أكثر', 'tr' => 'Daha Fazla'],
                'cta_link' => '',
            ],
            'config' => [
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
                'grayscale' => false,
                'columns' => 4,
                'full_width' => true,
            ],
        ]);

        // ─── Newsletter CTA ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'newsletter_cta',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Stay Connected',
                    'ar' => 'ابق على تواصل',
                    'tr' => 'Bağlantıda Kalın',
                ],
                'subtitle' => [
                    'en' => 'Subscribe to receive the latest updates and scholarly content',
                    'ar' => 'اشترك لتلقي آخر التحديثات والمحتوى العلمي',
                    'tr' => 'En son güncellemeleri ve ilmi içerikleri almak için abone olun',
                ],
                'placeholder_text' => [
                    'en' => 'Enter your email',
                    'ar' => 'أدخل بريدك الإلكتروني',
                    'tr' => 'E-postanızı girin',
                ],
                'button_text' => [
                    'en' => 'Subscribe',
                    'ar' => 'اشترك',
                    'tr' => 'Abone Ol',
                ],
            ],
            'config' => [
                'background_color' => '#4A6741',
                'text_color' => '#ffffff',
                'full_width' => true,
            ],
        ]);

        $this->command->info("Prototype about page seeded with {$order} blocks.");
    }
}
