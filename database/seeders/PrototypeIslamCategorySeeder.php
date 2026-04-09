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
                'background_image_url' => '',
                'portrait_image_url' => '',
                'cta_text' => ['en' => 'Explore', 'ar' => 'استكشف', 'tr' => 'Keşfet'],
                'cta_link' => '',
                'overlay_opacity' => 0.6,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '500px',
                'text_color' => '#ffffff',
                'background_color' => '#2B3D2F',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(201,169,78,0.2)',
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
                        'value' => '+50,000',
                        'suffix' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'label' => ['en' => 'Students Trained', 'ar' => 'طالب متدرب', 'tr' => 'Eğitilen Öğrenci'],
                    ],
                    [
                        'value' => '120',
                        'suffix' => ['en' => '+', 'ar' => '+', 'tr' => '+'],
                        'label' => ['en' => 'Study Circles', 'ar' => 'حلقة علمية', 'tr' => 'İlim Halkası'],
                    ],
                    [
                        'value' => '15',
                        'suffix' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'label' => ['en' => 'Countries Reached', 'ar' => 'دولة مستفيدة', 'tr' => 'Ulaşılan Ülke'],
                    ],
                    [
                        'value' => '30',
                        'suffix' => ['en' => '+', 'ar' => '+', 'tr' => '+'],
                        'label' => ['en' => 'Years of Teaching', 'ar' => 'عام من التدريس', 'tr' => 'Yıllık Öğretim'],
                    ],
                ],
            ],
            'config' => [
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'accent_color' => '#C9A94E',
                'columns' => 4,
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
                'image_url' => '',
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
                'background_color' => '#1E2A22',
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
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'full_width' => true,
            ],
        ]);

        // Link the Islam content category to this page
        ContentCategory::where('slug', 'islam')->update(['page_id' => $page->id]);

        $this->command->info("Islam initiative page seeded with {$order} blocks and linked to Islam category.");
    }
}
