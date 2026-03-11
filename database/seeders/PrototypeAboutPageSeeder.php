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
                'decoration_color' => 'rgba(201, 169, 78, 0.15)',
                'background_color' => '#2B3D2F',
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
                'background_color' => '#1E2A22',
                'ornamental_frame' => true,
                'padding_y' => 'xl',
                'layout' => 'card',
                'accent_color' => '#C9A94E',
            ],
        ]);

        // ─── Rich Text (biography body) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'rich_text',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'body' => [
                    'en' => '<h2>Biography</h2><p>Sheikh Awn Mueen Al-Qaddoumi is a distinguished Islamic scholar from Jordan, known for his deep knowledge of Islamic jurisprudence, hadith sciences, and Quranic studies.</p><p>He studied under numerous renowned scholars across the Islamic world, from Jordan to Yemen to the Hejaz, building an extensive chain of scholarly transmission (<em>isnad</em>) that connects him to the great imams of Islamic tradition.</p><p>He has founded and led several charitable and educational organizations, dedicating his life to the preservation and transmission of Islamic knowledge.</p>',
                    'ar' => '<h2>السيرة الذاتية</h2><p>الشيخ عون معين القدومي عالم إسلامي بارز من الأردن، يُعرف بعلمه العميق في الفقه الإسلامي وعلوم الحديث والدراسات القرآنية.</p><p>تلقى العلم على يد عدد كبير من العلماء المشهورين في أنحاء العالم الإسلامي، من الأردن إلى اليمن إلى الحجاز، مما أكسبه سلسلة إسناد واسعة تصله بأئمة التراث الإسلامي العظام.</p><p>أسس وقاد العديد من المؤسسات الخيرية والتعليمية، مكرسًا حياته لحفظ العلم الشرعي ونقله.</p>',
                    'tr' => '<h2>Biyografi</h2><p>Şeyh Avn Muin El-Kaddumi, İslam hukuku, hadis ilimleri ve Kur\'an çalışmalarındaki derin bilgisiyle tanınan Ürdünlü seçkin bir İslam alimidir.</p><p>İslam dünyasının dört bir yanında, Ürdün\'den Yemen\'e, Hicaz\'a kadar birçok tanınmış alimden ders almış, İslam geleneğinin büyük imamlarına uzanan geniş bir ilmi silsile oluşturmuştur.</p>',
                ],
            ],
            'config' => [
                'max_width' => '800px',
                'background_color' => '#ffffff',
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
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'full_width' => true,
            ],
        ]);

        $this->command->info("Prototype about page seeded with {$order} blocks.");
    }
}
