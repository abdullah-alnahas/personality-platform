<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds the prototype homepage with all block types matching the design mockup.
 * Run: php artisan db:seed --class=PrototypePageSeeder
 */
class PrototypePageSeeder extends Seeder
{
    public function run(): void
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
                    'description' => 'Welcome to the official website of Sheikh Awn',
                ],
                'status' => 'published',
                'is_homepage' => true,
            ]
        );

        // Remove existing blocks for idempotent seeding
        $page->blocks()->delete();

        $order = 0;

        // ─── Block 1: Hero Banner (split layout with portrait) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Sheikh Awn Mueen Al-Qaddoumi',
                    'ar' => 'عون معين القدّومي',
                    'tr' => 'Şeyh Avn Muin El-Kaddumi',
                ],
                'subtitle' => [
                    'en' => '<p>A distinguished scholar of Islamic sciences and jurisprudence. Founder and chairman of numerous charitable and institutional initiatives across the Islamic world.</p>',
                    'ar' => '<p>داعية إسلامي من الأردن والتشريعات الشرعية والعلوم الإسلامية. يقود أبحاثاً ومؤسسات وهيئات إسلامية على مستوى العالم الإسلامي. مؤسس ورئيس مجلس عدد من الأعمال الدعوية والمؤسسية في مجالات متعددة.</p>',
                    'tr' => '<p>Ürdünlü İslam alimi ve davetçi. İslam dünyasında çok sayıda hayır ve kurumsal girişimin kurucusu ve başkanı.</p>',
                ],
                'background_image_url' => '',
                'portrait_image_url' => '/images/prototype/sheikh-portrait.png',
                'cta_text' => [
                    'en' => 'Learn More',
                    'ar' => 'اعرف المزيد',
                    'tr' => 'Daha Fazla',
                ],
                'cta_link' => '/page/about',
                'overlay_opacity' => 0.5,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '500px',
                'text_color' => '#ffffff',
                'layout' => 'split',
                'show_decorations' => true,
                'decoration_color' => '#C9A94E',
                'background_color' => '#2B3D2F',
            ],
        ]);

        // ─── Block 2: Text with Image (Biography section - "شيوخه وسنده") ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'text_with_image',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'His Teachers and Chain of Authority',
                    'ar' => 'شيوخه وسنده',
                    'tr' => 'Hocaları ve İcazet Silsilesi',
                ],
                'body' => [
                    'en' => '<p>He studied the foundational Islamic sciences through a rich chain of teachers spanning some of the most prominent scholars of the Ummah. His scholarly lineage connects directly to the great imams of Islamic jurisprudence and hadith.</p>',
                    'ar' => '<p>تلقّى العلوم الشرعية الأساسية دراسةً ورواية على عدد من كبار علماء الأمة والأئمة والمحدثين، في كل فن ودراسة ورواية، وصولاً لأصحاب الكتب السبعة في الحديث النبوي وما زاد عنها، ومذاهب الفقه الإسلامي الأربعة.</p>',
                    'tr' => '<p>Temel İslami ilimleri, ümmetin en seçkin alimlerinden oluşan zengin bir icazet silsilesi aracılığıyla tahsil etmiştir.</p>',
                ],
                'image_url' => '/images/prototype/teachers.jpg',
                'image_alt' => [
                    'en' => 'Islamic scholars',
                    'ar' => 'علماء إسلاميون',
                    'tr' => 'İslam alimleri',
                ],
                'image_position' => 'right',
                'items' => [],
            ],
            'config' => [
                'background_color' => '#F5F0E8',
                'padding_y' => 'lg',
            ],
        ]);

        // ─── Block 3: Pillar Cards (3 columns - Jordan, Yemen, Hejaz) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'pillar_cards',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Scholarly Legacy',
                    'ar' => 'الإرث العلمي',
                    'tr' => 'İlmi Miras',
                ],
                'subtitle' => [
                    'en' => 'His scholarly connections across the Islamic world',
                    'ar' => 'صلاته العلمية عبر العالم الإسلامي',
                    'tr' => 'İslam dünyasındaki ilmi bağlantıları',
                ],
                'cards' => [
                    [
                        'heading' => [
                            'en' => 'Jordan',
                            'ar' => 'الأردن',
                            'tr' => 'Ürdün',
                        ],
                        'quote' => [
                            'en' => '',
                            'ar' => 'الشيخ نوح القضاة العلامة الكبير خطيب بلاط وعالم الشريعة والقضاء',
                            'tr' => '',
                        ],
                        'image_url' => '',
                        'link' => '',
                        'link_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'items' => [
                            ['text' => ['en' => 'Sheikh Nouh Al-Qudah', 'ar' => 'الشيخ نوح القضاة', 'tr' => 'Şeyh Nuh El-Kudât'], 'icon' => ''],
                            ['text' => ['en' => 'Dr. Ahmad Nawfal', 'ar' => 'د. أحمد نوفل', 'tr' => 'Dr. Ahmad Nevfel'], 'icon' => ''],
                            ['text' => ['en' => 'Sheikh Wasif Al-Bakri', 'ar' => 'الشيخ واصف البكري', 'tr' => 'Şeyh Vasıf El-Bekri'], 'icon' => ''],
                        ],
                    ],
                    [
                        'heading' => [
                            'en' => 'Yemen',
                            'ar' => 'اليمن',
                            'tr' => 'Yemen',
                        ],
                        'quote' => [
                            'en' => '',
                            'ar' => 'رحل إلى اليمن للتلقي على العلامة المحدث الكبير',
                            'tr' => '',
                        ],
                        'image_url' => '',
                        'link' => '',
                        'link_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'items' => [
                            ['text' => ['en' => 'Habib Umar bin Hafiz', 'ar' => 'الحبيب عمر بن حفيظ', 'tr' => 'Habib Ömer bin Hafız'], 'icon' => ''],
                            ['text' => ['en' => 'Habib Ali Al-Jifri', 'ar' => 'الحبيب علي الجفري', 'tr' => 'Habib Ali El-Cifri'], 'icon' => ''],
                        ],
                    ],
                    [
                        'heading' => [
                            'en' => 'Hejaz',
                            'ar' => 'الحجاز',
                            'tr' => 'Hicaz',
                        ],
                        'quote' => [
                            'en' => '',
                            'ar' => 'أخذ عن عدد من المشايخ والعلماء الكبار في الحجاز',
                            'tr' => '',
                        ],
                        'image_url' => '',
                        'link' => '',
                        'link_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'items' => [
                            ['text' => ['en' => 'Sheikh Muhammad Alawi Al-Maliki', 'ar' => 'الشيخ محمد علوي المالكي', 'tr' => 'Şeyh Muhammed Alevi El-Maliki'], 'icon' => ''],
                            ['text' => ['en' => 'Sheikh Habib Zayn', 'ar' => 'الشيخ حبيب زين', 'tr' => 'Şeyh Habib Zeyn'], 'icon' => ''],
                        ],
                    ],
                ],
            ],
            'config' => [
                'columns' => 3,
                'card_style' => 'rounded',
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'card_variant' => 'dark',
                'show_decorations' => false,
            ],
        ]);

        // ─── Block 4: Logo Grid ("أعماله ونشاطاته" - Works & Activities) ───
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
                    'en' => 'Projects and initiatives',
                    'ar' => 'مشاريع وأعمال',
                    'tr' => 'Projeler ve girişimler',
                ],
                'logos' => [
                    [
                        'heading' => ['en' => 'Talaqqi', 'ar' => 'تلقي', 'tr' => 'Telakki'],
                        'image_url' => '/images/prototype/logo-talaqqi.png',
                        'link' => '#',
                    ],
                    [
                        'heading' => ['en' => 'Al-Barash', 'ar' => 'البراش', 'tr' => 'El-Beraş'],
                        'image_url' => '/images/prototype/logo-barash.png',
                        'link' => '#',
                    ],
                    [
                        'heading' => ['en' => 'Foundation', 'ar' => 'المؤسسة', 'tr' => 'Vakıf'],
                        'image_url' => '/images/prototype/logo-foundation.png',
                        'link' => '#',
                    ],
                ],
                'cta_text' => [
                    'en' => 'View All',
                    'ar' => 'عرض الكل',
                    'tr' => 'Tümünü Gör',
                ],
                'cta_link' => '/page/works',
            ],
            'config' => [
                'background_color' => '#1E2A22',
                'text_color' => '#ffffff',
                'columns' => 4,
                'logo_max_height' => 60,
                'grayscale' => false,
            ],
        ]);

        // ─── Block 5: Spacer ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'spacer',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [],
            'config' => [
                'height' => 32,
                'background_color' => 'transparent',
            ],
        ]);

        $this->command->info("Prototype homepage seeded with {$order} blocks.");
    }
}
