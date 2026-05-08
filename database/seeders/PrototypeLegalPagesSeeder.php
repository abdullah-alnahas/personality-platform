<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds Privacy Policy and Terms of Use stub pages so the footer
 * support links resolve out of the box. Admin can edit the rich text
 * blocks afterwards.
 *
 * Run: php artisan db:seed --class=PrototypeLegalPagesSeeder
 */
class PrototypeLegalPagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'privacy',
                'title' => ['en' => 'Privacy Policy', 'ar' => 'سياسة الخصوصية', 'tr' => 'Gizlilik Politikası'],
                'body' => [
                    'en' => '<p>Replace this placeholder with your privacy policy. The admin can edit this rich-text block at any time.</p>',
                    'ar' => '<p>استبدل هذا النص النائب بسياسة الخصوصية الخاصة بك. يمكن للمسؤول تعديل هذا في أي وقت.</p>',
                    'tr' => '<p>Bu yer tutucuyu gizlilik politikanızla değiştirin. Yönetici bu içeriği istediği zaman düzenleyebilir.</p>',
                ],
            ],
            [
                'slug' => 'terms',
                'title' => ['en' => 'Terms of Use', 'ar' => 'شروط الاستخدام', 'tr' => 'Kullanım Şartları'],
                'body' => [
                    'en' => '<p>Replace this placeholder with your terms of use. The admin can edit this rich-text block at any time.</p>',
                    'ar' => '<p>استبدل هذا النص النائب بشروط الاستخدام الخاصة بك. يمكن للمسؤول تعديل هذا في أي وقت.</p>',
                    'tr' => '<p>Bu yer tutucuyu kullanım şartlarınızla değiştirin. Yönetici bu içeriği istediği zaman düzenleyebilir.</p>',
                ],
            ],
        ];

        foreach ($pages as $data) {
            $page = Page::updateOrCreate(
                ['slug' => $data['slug']],
                ['title' => $data['title'], 'status' => 'published']
            );

            $page->blocks()->delete();

            // Heading via hero (centered, dark green)
            PageBlock::create([
                'page_id' => $page->id,
                'block_type' => 'hero_banner',
                'display_order' => 0,
                'status' => 'published',
                'content' => [
                    'heading' => $data['title'],
                    'subtitle' => ['en' => '', 'ar' => '', 'tr' => ''],
                    'background_image_url' => '',
                    'portrait_image_url' => '',
                    'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                    'cta_link' => '',
                    'overlay_opacity' => 0.5,
                ],
                'config' => [
                    'full_width' => true,
                    'min_height' => '300px',
                    'text_color' => '#ffffff',
                    'background_color' => '#2B3D2F',
                    'layout' => 'centered',
                    'show_decorations' => false,
                ],
            ]);

            // Body
            PageBlock::create([
                'page_id' => $page->id,
                'block_type' => 'rich_text',
                'display_order' => 1,
                'status' => 'published',
                'content' => [
                    'body' => $data['body'],
                ],
                'config' => [
                    'max_width' => '800px',
                    'background_color' => '#ffffff',
                ],
            ]);

            $this->command->info("Legal page '{$data['slug']}' seeded.");
        }
    }
}
