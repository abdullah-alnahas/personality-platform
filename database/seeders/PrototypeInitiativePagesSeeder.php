<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds page-builder pages for the remaining three initiatives:
 * Iman, Ihsan, and Signs of the Hour. Each page mirrors the Islam
 * initiative shape (hero + stats + rich text + newsletter) so the
 * admin has a complete starting point for the prototype.
 *
 * Run: php artisan db:seed --class=PrototypeInitiativePagesSeeder
 */
class PrototypeInitiativePagesSeeder extends Seeder
{
    public function run(): void
    {
        $initiatives = [
            [
                'slug' => 'iman-initiative',
                'title' => ['en' => 'Iman Initiative', 'ar' => 'مبادرة الإيمان', 'tr' => 'İman Girişimi'],
                'hero_heading' => ['en' => 'Iman', 'ar' => 'الإيمان', 'tr' => 'İman'],
                'hero_subtitle' => [
                    'en' => '<p>Cultivating sincere faith and the love of brotherhood</p>',
                    'ar' => '<p>غرس الإيمان الصادق ومحبة الأخوة</p>',
                    'tr' => '<p>Samimi imanı ve kardeşlik sevgisini yetiştirmek</p>',
                ],
                'pillar_heading' => ['en' => 'Pillars of Iman', 'ar' => 'أركان الإيمان', 'tr' => 'İmanın Esasları'],
            ],
            [
                'slug' => 'ihsan-initiative',
                'title' => ['en' => 'Ihsan Initiative', 'ar' => 'مبادرة الإحسان', 'tr' => 'İhsan Girişimi'],
                'hero_heading' => ['en' => 'Ihsan', 'ar' => 'الإحسان', 'tr' => 'İhsan'],
                'hero_subtitle' => [
                    'en' => '<p>Worshipping Allah as if you see Him</p>',
                    'ar' => '<p>أن تعبد الله كأنك تراه</p>',
                    'tr' => '<p>Allah\'a O\'nu görür gibi ibadet etmek</p>',
                ],
                'pillar_heading' => ['en' => 'Stations of Ihsan', 'ar' => 'مقامات الإحسان', 'tr' => 'İhsan Makamları'],
            ],
            [
                'slug' => 'signs-initiative',
                'title' => ['en' => 'Signs of the Hour', 'ar' => 'مبادرة الساعة', 'tr' => 'Kıyamet Girişimi'],
                'hero_heading' => ['en' => 'Signs of the Hour', 'ar' => 'علامات الساعة', 'tr' => 'Kıyamet Alametleri'],
                'hero_subtitle' => [
                    'en' => '<p>Preparing the heart and mind for the final hour</p>',
                    'ar' => '<p>تهيئة القلب والعقل لقيام الساعة</p>',
                    'tr' => '<p>Kalbi ve aklı kıyamete hazırlamak</p>',
                ],
                'pillar_heading' => ['en' => 'Major Signs', 'ar' => 'العلامات الكبرى', 'tr' => 'Büyük Alametler'],
            ],
        ];

        foreach ($initiatives as $data) {
            $page = Page::updateOrCreate(
                ['slug' => $data['slug']],
                ['title' => $data['title'], 'status' => 'published']
            );

            $page->blocks()->delete();
            $order = 0;

            // Hero
            PageBlock::create([
                'page_id' => $page->id,
                'block_type' => 'hero_banner',
                'display_order' => $order++,
                'status' => 'published',
                'content' => [
                    'heading' => $data['hero_heading'],
                    'subtitle' => $data['hero_subtitle'],
                    'background_image_url' => '',
                    'portrait_image_url' => '',
                    'cta_text' => ['en' => 'Learn More', 'ar' => 'تعرف أكثر', 'tr' => 'Daha Fazla Bilgi'],
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

            // Pillar cards (3 columns) — admin can edit content
            PageBlock::create([
                'page_id' => $page->id,
                'block_type' => 'pillar_cards',
                'display_order' => $order++,
                'status' => 'published',
                'content' => [
                    'heading' => $data['pillar_heading'],
                    'subtitle' => ['en' => '', 'ar' => '', 'tr' => ''],
                    'cards' => [
                        ['heading' => ['en' => 'Pillar 1', 'ar' => 'الركن الأول', 'tr' => 'Birinci Esas'],
                         'body' => ['en' => 'Edit this content from the admin.', 'ar' => 'حرّر هذا المحتوى من لوحة التحكم.', 'tr' => 'Bu içeriği yönetici panelinden düzenleyin.']],
                        ['heading' => ['en' => 'Pillar 2', 'ar' => 'الركن الثاني', 'tr' => 'İkinci Esas'],
                         'body' => ['en' => 'Edit this content from the admin.', 'ar' => 'حرّر هذا المحتوى من لوحة التحكم.', 'tr' => 'Bu içeriği yönetici panelinden düzenleyin.']],
                        ['heading' => ['en' => 'Pillar 3', 'ar' => 'الركن الثالث', 'tr' => 'Üçüncü Esas'],
                         'body' => ['en' => 'Edit this content from the admin.', 'ar' => 'حرّر هذا المحتوى من لوحة التحكم.', 'tr' => 'Bu içeriği yönetici panelinden düzenleyin.']],
                    ],
                ],
                'config' => [
                    'columns' => 3,
                    'card_style' => 'rounded',
                    'background_color' => '#F5F0E8',
                    'card_variant' => 'light',
                    'show_decorations' => false,
                ],
            ]);

            // Newsletter CTA
            PageBlock::create([
                'page_id' => $page->id,
                'block_type' => 'newsletter_cta',
                'display_order' => $order++,
                'status' => 'published',
                'content' => [
                    'heading' => ['en' => 'Stay Connected', 'ar' => 'ابقَ على تواصل', 'tr' => 'Bağlantıda Kalın'],
                    'subtitle' => ['en' => 'Get updates on this initiative.', 'ar' => 'احصل على تحديثات حول هذه المبادرة.', 'tr' => 'Bu girişim hakkında güncellemeler alın.'],
                    'placeholder_text' => ['en' => 'Your email', 'ar' => 'بريدك الإلكتروني', 'tr' => 'E-postanız'],
                    'button_text' => ['en' => 'Subscribe', 'ar' => 'اشترك', 'tr' => 'Abone Ol'],
                ],
                'config' => [
                    'background_color' => '#2B3D2F',
                    'text_color' => '#ffffff',
                    'full_width' => true,
                ],
            ]);

            $this->command->info("Initiative page '{$data['slug']}' seeded.");
        }
    }
}
