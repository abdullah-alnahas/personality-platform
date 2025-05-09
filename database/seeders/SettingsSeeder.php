<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure table is empty before seeding crucial settings to avoid conflicts on re-seed
        // Or use updateOrCreate carefully if you want to preserve existing values not defined here.
        // For this initial setup, a truncate might be okay if these are the foundational settings.
        // DB::table('settings')->truncate(); // Use with caution

        $settings = [
            // General Group
            [
                "key" => "site_name",
                "value" => [
                    "en" => "Personality Platform",
                    "ar" => "منصة الشخصية",
                    "tr" => "Şahsiyet Platformu",
                ],
                "type" => "text", // translatable text
                "group" => "general",
            ],
            [
                "key" => "site_description",
                "value" => [
                    "en" => "A platform for inspiring personalities.",
                    "ar" => "منصة للشخصيات الملهمة.",
                    "tr" => "İlham veren şahsiyetler için bir platform.",
                ],
                "type" => "textarea", // translatable textarea
                "group" => "general",
            ],
            [
                "key" => "maintenance_mode",
                "value" => ["en" => "0"], // Non-translatable, simple value treated as string initially, cast to boolean in app
                "type" => "boolean", // switch
                "group" => "general",
            ],

            // Content Group
            [
                "key" => "about_page_content",
                "value" => [
                    "en" => "Default about page content.",
                    "ar" => "محتوى صفحة النبذة الافتراضي.",
                    "tr" => "Varsayılan hakkımızda sayfası içeriği.",
                ],
                "type" => "richtext", // or 'textarea' if no RTE yet
                "group" => "content",
            ],
            [
                "key" => "posts_per_page",
                "value" => ["en" => "12"], // Non-translatable simple value
                "type" => "number",
                "group" => "content",
            ],

            // Contact Group
            [
                "key" => "contact_email",
                "value" => ["en" => "contact@example.com"], // Non-translatable simple value
                "type" => "email",
                "group" => "contact",
            ],
            [
                "key" => "contact_phone",
                "value" => ["en" => "+1234567890"], // Non-translatable simple value
                "type" => "text",
                "group" => "contact",
            ],

            // SEO Defaults Group
            [
                "key" => "default_seo_title",
                "value" => [
                    "en" => "Personality Platform",
                    "ar" => "منصة الشخصية",
                    "tr" => "Şahsiyet Platformu",
                ],
                "type" => "text", // translatable text
                "group" => "seo",
            ],
            [
                "key" => "default_seo_description",
                "value" => [
                    "en" => "Discover inspiring content and personalities.",
                    "ar" => "اكتشف محتوى وشخصيات ملهمة.",
                    "tr" => "İlham verici içerik ve şahsiyetleri keşfedin.",
                ],
                "type" => "textarea", // translatable textarea
                "group" => "seo",
            ],
            [
                "key" => "footer_copyright_text",
                "value" => [
                    "en" =>
                        "© {year} Personality Platform. All rights reserved.",
                    "ar" => "© {year} منصة الشخصية. جميع الحقوق محفوظة.",
                    "tr" =>
                        "© {year} Şahsiyet Platformu. Tüm hakları saklıdır.",
                ],
                "type" => "text",
                "group" => "general",
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ["key" => $setting["key"]],
                [
                    "value" => $setting["value"], // Already an array for translatable, or simple array for non-translatable by convention
                    "type" => $setting["type"],
                    "group" => $setting["group"],
                ]
            );
        }
    }
}
