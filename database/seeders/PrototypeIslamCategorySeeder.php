<?php

namespace Database\Seeders;

use App\Models\ContentCategory;
use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds a rich page-builder page for the "الإسلام" category
 * matching the prototype design (hero, stats, talaqqui, books).
 *
 * Links it to the existing Islam category so /category/islam renders this page.
 *
 * Run: php artisan db:seed --class=PrototypeIslamCategorySeeder
 */
class PrototypeIslamCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Create/update the page-builder page for this initiative
        $page = Page::updateOrCreate(
            ['slug' => 'islam-initiative'],
            [
                'title' => [
                    'en' => 'Islam Initiative',
                    'ar' => 'مبادرة الإسلام',
                    'tr' => 'İslam Girişimi',
                ],
                'status' => 'published',
            ]
        );

        $page->blocks()->delete();
        $order = 0;

        // ─── Hero Banner (large centered heading) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Islam',
                    'ar' => 'الإسلام',
                    'tr' => 'İslam',
                ],
                'subtitle' => [
                    'en' => '<p>Building a generation rooted in the authentic foundations of Islam</p>',
                    'ar' => '<p>بناء جيل راسخ على أصول الإسلام الصحيحة</p>',
                    'tr' => '<p>İslam\'ın sahih temelleri üzerine kök salmış bir nesil inşa etmek</p>',
                ],
                'background_image_url' => '/images/prototype/kaaba-bg.jpg',
                'portrait_image_url' => '',
                'secondary_heading' => [
                    'en' => 'Required Knowledge',
                    'ar' => 'العلم الواجب',
                    'tr' => 'Gerekli İlim',
                ],
                'secondary_body' => [
                    'en' => 'A foundational course covering the essential matters that summarize the pillars of religion, faith, Islam, and ihsan that every Muslim is required to learn.',
                    'ar' => 'دورة العلم الواجب صُممت لتعريف المشتركين على أهم الأمور التي تلخص أركان الدين والإيمان والإسلام والإحسان، وتتضمن تعريفاً شاملاً بكافة الأمور والعلوم الواجب على كل مسلم أن يتعلمها ويتبعها.',
                    'tr' => 'Din, iman, İslam ve ihsanın rükünlerini özetleyen, her Müslümanın öğrenmesi gereken temel meseleleri kapsayan bir ders.',
                ],
                'secondary_cta_text' => [
                    'en' => 'Learn Now',
                    'ar' => 'تعلم الآن',
                    'tr' => 'Şimdi Öğren',
                ],
                'secondary_cta_link' => '/page/about',
                'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                'cta_link' => '',
                'overlay_opacity' => 0.45,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '600px',
                'text_color' => '#ffffff',
                'background_color' => '#2D4128',
                'layout' => 'with-card',
                'show_decorations' => true,
                'decoration_color' => 'rgba(181,210,107,0.2)',
            ],
        ]);

        // ─── Stats Counter ("محو الأمية الدينية في أرقام") ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'stats_counter',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Religious Literacy in Numbers',
                    'ar' => 'محو الأمية الدينية في أرقام',
                    'tr' => 'Dini Okuryazarlık Rakamlarla',
                ],
                'subtitle' => [
                    'en' => 'The impact of our Islamic education programs across the Arab world',
                    'ar' => 'أثر برامجنا التعليمية الإسلامية في العالم العربي',
                    'tr' => 'Arap dünyasında İslami eğitim programlarımızın etkisi',
                ],
                'stats' => [
                    [
                        'value' => '40,000',
                        'suffix' => ['en' => '', 'ar' => '+', 'tr' => '+'],
                        'label' => ['en' => 'Students of Knowledge', 'ar' => 'طالب علم', 'tr' => 'İlim Talebesi'],
                    ],
                    [
                        'value' => '10,000',
                        'suffix' => ['en' => '+', 'ar' => '+', 'tr' => '+'],
                        'label' => ['en' => 'Courses', 'ar' => 'دورة', 'tr' => 'Ders'],
                    ],
                    [
                        'value' => '140',
                        'suffix' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'label' => ['en' => 'Teachers', 'ar' => 'معلم', 'tr' => 'Öğretmen'],
                    ],
                ],
            ],
            'config' => [
                'background_color' => '#4A6741',
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'columns' => 3,
                'full_width' => true,
            ],
        ]);

        // ─── Text with Image (التأهيل العلمي والدعوي — qualification programme) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'text_with_image',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Scholarly and Da\'wah Qualification',
                    'ar' => 'التأهيل العلمي والدعوي',
                    'tr' => 'İlmî ve Davet Yetiştirme',
                ],
                'body' => [
                    'en' => '<p>A four-tier preacher-formation programme covering foundational dawah, capacity building through field placement, audience-aware preaching, and the formation of institutional dawah projects under direct supervision.</p>',
                    'ar' => '<p>برنامج تأهيل دعوي على أربعة مستويات: دورات تأصيلية للدعوة وأركانها وحمل الهم الدعوي، ثم برامج تأهيلية تستهدف بناء ذات الداعي ومهاراته، ثم التركيز على مراتب المدعوين ولغة الخطاب، ثم التشكيل والبناء للأعمال الدعوية المؤسسية والإشراف عليها.</p>',
                    'tr' => '<p>Davet temeli, kapasite inşası, hedef kitleye uygun hitap ve kurumsal davet inşası olmak üzere dört seviyeli kapsamlı bir davetçi yetiştirme programı.</p>',
                ],
                'image_url' => '/images/prototype/faith-bg.jpg',
                'image_alt' => ['en' => 'Qualification programme', 'ar' => 'التأهيل العلمي والدعوي', 'tr' => 'Eğitim'],
                'image_position' => 'right',
            ],
            'config' => [
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
                'padding_y' => 'lg',
                'full_width' => true,
            ],
        ]);

        // ─── Stats Counter (التأهيل metrics) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'stats_counter',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['en' => '', 'ar' => '', 'tr' => ''],
                'subtitle' => ['en' => '', 'ar' => '', 'tr' => ''],
                'stats' => [
                    [
                        'value' => '70,000',
                        'suffix' => ['en' => '+', 'ar' => '+', 'tr' => '+'],
                        'label' => ['en' => 'Students of Knowledge', 'ar' => 'طالب علم', 'tr' => 'İlim Talebesi'],
                    ],
                    [
                        'value' => '10,000',
                        'suffix' => ['en' => '+', 'ar' => '+', 'tr' => '+'],
                        'label' => ['en' => 'Courses', 'ar' => 'دورة', 'tr' => 'Ders'],
                    ],
                    [
                        'value' => '50',
                        'suffix' => ['en' => '%', 'ar' => '%', 'tr' => '%'],
                        'label' => ['en' => 'Scholars', 'ar' => 'علماء', 'tr' => 'Alimler'],
                    ],
                ],
            ],
            'config' => [
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'columns' => 3,
                'full_width' => true,
            ],
        ]);

        // ─── Text with Image (تلقي platform section) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'text_with_image',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'The Talaqqi Platform',
                    'ar' => 'منصة تلقي',
                    'tr' => 'Telakki Platformu',
                ],
                'body' => [
                    'en' => '<p>The Talaqqi platform is a digital initiative for authentic Islamic learning — connecting students directly with qualified scholars through a structured, isnad-based curriculum. It offers courses in Quran, Fiqh, Hadith, and Islamic spirituality.</p>',
                    'ar' => '<p>منصة تلقي هي مبادرة رقمية للتعلم الإسلامي الأصيل، تربط الطلاب مباشرة بالعلماء المؤهلين من خلال مناهج منظمة قائمة على الإسناد. تقدم دورات في القرآن والفقه والحديث والتزكية.</p>',
                    'tr' => '<p>Telakki platformu, öğrencileri yapılandırılmış ve isnad tabanlı bir müfredat aracılığıyla nitelikli alimlerle doğrudan buluşturan otantik İslami öğrenme için dijital bir girişimdir.</p>',
                ],
                'image_url' => '/images/prototype/logo-talaqqi.png',
                'image_alt' => ['en' => 'Talaqqi Platform', 'ar' => 'منصة تلقي', 'tr' => 'Telakki Platformu'],
                'image_position' => 'right',
                'items' => [
                    ['text' => ['en' => 'Live sessions with certified scholars', 'ar' => 'جلسات مباشرة مع علماء معتمدين']],
                    ['text' => ['en' => 'Certified isnad-based curriculum', 'ar' => 'منهج معتمد قائم على الإسناد']],
                    ['text' => ['en' => 'Available in Arabic, English, and Turkish', 'ar' => 'متاح بالعربية والإنجليزية والتركية']],
                ],
            ],
            'config' => [
                'background_color' => '#ffffff',
                'padding_y' => 'lg',
            ],
        ]);

        // ─── Books Grid ("مؤلفات") ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'books_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Publications',
                    'ar' => 'مؤلفات',
                    'tr' => 'Yayınlar',
                ],
                'subtitle' => [
                    'en' => 'Books and scholarly works by Sheikh Awn on Islamic sciences',
                    'ar' => 'كتب وأعمال علمية للشيخ عون في العلوم الإسلامية',
                    'tr' => 'Şeyh Avn\'ın İslami ilimler üzerine kitap ve ilmi eserleri',
                ],
                'max_items' => 8,
            ],
            'config' => [
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
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
                    'en' => 'Follow the Islam Initiative',
                    'ar' => 'تابع مبادرة الإسلام',
                    'tr' => 'İslam Girişimini Takip Edin',
                ],
                'subtitle' => [
                    'en' => 'Get updates on programs, events, and new content',
                    'ar' => 'احصل على تحديثات حول البرامج والفعاليات والمحتوى الجديد',
                    'tr' => 'Programlar, etkinlikler ve yeni içerikler hakkında güncellemeler alın',
                ],
                'placeholder_text' => ['en' => 'Your email', 'ar' => 'بريدك الإلكتروني', 'tr' => 'E-postanız'],
                'button_text' => ['en' => 'Subscribe', 'ar' => 'اشترك', 'tr' => 'Abone Ol'],
            ],
            'config' => [
                'background_color' => '#4A6741',
                'text_color' => '#ffffff',
                'full_width' => true,
            ],
        ]);

        // Link the Islam content category to this page
        ContentCategory::where('slug', 'islam')->update(['page_id' => $page->id]);

        $this->command->info("Islam initiative page seeded with {$order} blocks and linked to Islam category.");
    }
}
