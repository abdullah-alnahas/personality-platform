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
            // Branding Group
            [
                "key" => "logo_url",
                "value" => ["en" => ""],
                "type" => "text",
                "group" => "branding",
            ],
            [
                "key" => "logo_width",
                "value" => ["en" => "120"],
                "type" => "number",
                "group" => "branding",
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

            // Header CTA pill button (e.g. "اتصل بنا")
            [
                "key" => "header_cta_text",
                "value" => [
                    "en" => "Contact Us",
                    "ar" => "اتصل بنا",
                    "tr" => "Bize Ulaşın",
                ],
                "type" => "text",
                "group" => "header",
            ],
            [
                "key" => "header_cta_url",
                "value" => ["en" => "/contact"],
                "type" => "text",
                "group" => "header",
            ],

            // Footer column titles (rendered as section labels above the nav links)
            [
                "key" => "footer_col1_title",
                "value" => [
                    "en" => "About the Platform",
                    "ar" => "عن المنصة",
                    "tr" => "Platform Hakkında",
                ],
                "type" => "text",
                "group" => "footer",
            ],
            [
                "key" => "footer_col2_title",
                "value" => [
                    "en" => "Initiatives",
                    "ar" => "المبادرات",
                    "tr" => "Girişimler",
                ],
                "type" => "text",
                "group" => "footer",
            ],
            [
                "key" => "footer_col3_title",
                "value" => [
                    "en" => "Related Links",
                    "ar" => "روابط ذات صلة",
                    "tr" => "İlgili Bağlantılar",
                ],
                "type" => "text",
                "group" => "footer",
            ],
            [
                "key" => "footer_col4_title",
                "value" => [
                    "en" => "Support",
                    "ar" => "الدعم",
                    "tr" => "Destek",
                ],
                "type" => "text",
                "group" => "footer",
            ],

            // Newsletter / Subscribe Block Group
            [
                "key" => "newsletter_heading",
                "value" => [
                    "en" => "Subscribe",
                    "ar" => "اشترك في النشرة",
                    "tr" => "Abone Ol",
                ],
                "type" => "text",
                "group" => "footer",
            ],
            [
                "key" => "newsletter_description",
                "value" => [
                    "en" => "Get the latest updates delivered to your inbox.",
                    "ar" => "احصل على آخر المستجدات في بريدك.",
                    "tr" => "En son güncellemeleri gelen kutunuza alın.",
                ],
                "type" => "textarea",
                "group" => "footer",
            ],

            // Theme / Site Design Group
            [
                "key" => "theme_primary_color",
                "value" => ["en" => "#2B3D2F"],
                "type" => "color",
                "group" => "theme",
            ],
            [
                "key" => "theme_primary_dark",
                "value" => ["en" => "#1E2A22"],
                "type" => "color",
                "group" => "theme",
            ],
            [
                "key" => "theme_secondary_color",
                "value" => ["en" => "#C9A94E"],
                "type" => "color",
                "group" => "theme",
            ],
            [
                "key" => "theme_background_color",
                "value" => ["en" => "#F5F0E8"],
                "type" => "color",
                "group" => "theme",
            ],
            [
                "key" => "theme_text_color",
                "value" => ["en" => "#2C2C2C"],
                "type" => "color",
                "group" => "theme",
            ],
            [
                "key" => "theme_heading_font",
                "value" => ["en" => "'Amiri', 'Georgia', serif"],
                "type" => "text",
                "group" => "theme",
            ],
            [
                "key" => "theme_body_font",
                "value" => ["en" => "'Cairo', 'Tajawal', 'Roboto', sans-serif"],
                "type" => "text",
                "group" => "theme",
            ],
            [
                "key" => "theme_border_radius",
                "value" => ["en" => "8"],
                "type" => "number",
                "group" => "theme",
            ],
            [
                "key" => "theme_decorations_enabled",
                "value" => ["en" => "1"],
                "type" => "boolean",
                "group" => "theme",
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
