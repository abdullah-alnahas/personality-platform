<?php

namespace Database\Seeders;

use App\Models\NavigationItem;
use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Seeds navigation items and site settings matching the prototype design.
 * Safe to re-run — clears and rebuilds all nav items.
 */
class PrototypeNavigationSeeder extends Seeder
{
    public function run(): void
    {
        // ── Site settings ─────────────────────────────────────────────
        Setting::where('key', 'site_name')->update([
            'value' => ['ar' => 'شعار', 'en' => 'Sheikh Awn', 'tr' => 'Sheikh Awn'],
        ]);

        Setting::where('key', 'site_description')->update([
            'value' => [
                'ar' => 'إحياء الدين كله في العالم كله إلى قيام الساعة',
                'en' => 'Reviving the complete religion throughout the world until the Day of Resurrection',
                'tr' => 'Kıyamete kadar dünyanın her yerinde dinin tamamını ihya etmek',
            ],
        ]);

        Setting::where('key', 'footer_copyright_text')->update([
            'value' => [
                'ar' => '© {year} شعار. جميع الحقوق محفوظة',
                'en' => '© {year} Sheikh Awn. All rights reserved.',
                'tr' => '© {year} Sheikh Awn. Tüm hakları saklıdır.',
            ],
        ]);

        // Only seed if no navigation items exist (idempotent)
        if (NavigationItem::count() > 0) {
            return;
        }

        // ── Header nav ────────────────────────────────────────────────
        $header = 'header';

        // الرئيسية
        NavigationItem::create([
            'menu_location' => $header,
            'label' => ['ar' => 'الرئيسية', 'en' => 'Home', 'tr' => 'Ana Sayfa'],
            'url' => '/',
            'target' => '_self',
            'order' => 0,
            'parent_id' => null,
            'status' => 'published',
        ]);

        // عن الشيخ عون
        NavigationItem::create([
            'menu_location' => $header,
            'label' => ['ar' => 'عن الشيخ عون', 'en' => 'About Sheikh Awn', 'tr' => 'Sheikh Awn Hakkında'],
            'url' => '/page/about',
            'target' => '_self',
            'order' => 1,
            'parent_id' => null,
            'status' => 'published',
        ]);

        // المبادرات (dropdown parent)
        $initiatives = NavigationItem::create([
            'menu_location' => $header,
            'label' => ['ar' => 'المبادرات', 'en' => 'Initiatives', 'tr' => 'Girişimler'],
            'url' => '#',
            'target' => '_self',
            'order' => 2,
            'parent_id' => null,
            'status' => 'published',
        ]);

        // Dropdown children
        $initiativeChildren = [
            ['ar' => 'مبادرة الإسلام',  'en' => 'Islam Initiative',  'tr' => 'İslam Girişimi',  'url' => '/page/islam-initiative', 'order' => 0],
            ['ar' => 'مبادرة الإيمان',  'en' => 'Iman Initiative',   'tr' => 'İman Girişimi',   'url' => '#iman',                  'order' => 1],
            ['ar' => 'مبادرة الإحسان',  'en' => 'Ihsan Initiative',  'tr' => 'İhsan Girişimi',  'url' => '#ihsan',                 'order' => 2],
            ['ar' => 'مبادرة الساعة',   'en' => 'Signs Initiative',  'tr' => 'Kıyamet Girişimi','url' => '#saa',                   'order' => 3],
        ];

        foreach ($initiativeChildren as $child) {
            NavigationItem::create([
                'menu_location' => $header,
                'label' => ['ar' => $child['ar'], 'en' => $child['en'], 'tr' => $child['tr']],
                'url' => $child['url'],
                'target' => '_self',
                'order' => $child['order'],
                'parent_id' => $initiatives->id,
                'status' => 'published',
            ]);
        }

        // ما الجديد؟
        NavigationItem::create([
            'menu_location' => $header,
            'label' => ['ar' => 'ما الجديد؟', 'en' => "What's New?", 'tr' => 'Ne Yeni?'],
            'url' => '/search',
            'target' => '_self',
            'order' => 3,
            'parent_id' => null,
            'status' => 'published',
        ]);

        // ── Footer col 1: عن المنصة ───────────────────────────────────
        NavigationItem::create([
            'menu_location' => 'footer_col1',
            'label' => ['ar' => 'عن الشيخ عون', 'en' => 'About Sheikh Awn', 'tr' => 'Sheikh Awn Hakkında'],
            'url' => '/page/about',
            'target' => '_self',
            'order' => 0,
            'parent_id' => null,
            'status' => 'published',
        ]);

        NavigationItem::create([
            'menu_location' => 'footer_col1',
            'label' => ['ar' => 'تابعنا', 'en' => 'Follow Us', 'tr' => 'Bizi Takip Et'],
            'url' => '#social',
            'target' => '_self',
            'order' => 1,
            'parent_id' => null,
            'status' => 'published',
        ]);

        // ── Footer col 2: المبادرات ───────────────────────────────────
        $footerInitiatives = [
            ['ar' => 'مبادرات الإسلام',  'en' => 'Islam',  'url' => '/page/islam-initiative', 'order' => 0],
            ['ar' => 'مبادرات الإيمان',  'en' => 'Iman',   'url' => '#iman',                  'order' => 1],
            ['ar' => 'مبادرات الإحسان',  'en' => 'Ihsan',  'url' => '#ihsan',                 'order' => 2],
            ['ar' => 'مبادرات الساعة',   'en' => 'Signs',  'url' => '#saa',                   'order' => 3],
        ];

        foreach ($footerInitiatives as $item) {
            NavigationItem::create([
                'menu_location' => 'footer_col2',
                'label' => ['ar' => $item['ar'], 'en' => $item['en'], 'tr' => $item['en']],
                'url' => $item['url'],
                'target' => '_self',
                'order' => $item['order'],
                'parent_id' => null,
                'status' => 'published',
            ]);
        }

        // ── Footer col 3: روابط ذات صلة ──────────────────────────────
        $related = [
            ['ar' => 'منصة تلقي', 'en' => 'Talaqqi Platform', 'url' => '#talaqqi', 'order' => 0],
            ['ar' => 'الإكسير',  'en' => 'Al-Ikseer',         'url' => '#ikseer',  'order' => 1],
            ['ar' => 'إسلاف',    'en' => 'Islaf',              'url' => '#islaf',   'order' => 2],
            ['ar' => 'دار معين', 'en' => 'Dar Muin',           'url' => '#darmuin', 'order' => 3],
        ];

        foreach ($related as $item) {
            NavigationItem::create([
                'menu_location' => 'footer_col3',
                'label' => ['ar' => $item['ar'], 'en' => $item['en'], 'tr' => $item['en']],
                'url' => $item['url'],
                'target' => '_self',
                'order' => $item['order'],
                'parent_id' => null,
                'status' => 'published',
            ]);
        }

        // ── Footer col 4: الدعم ───────────────────────────────────────
        $support = [
            ['ar' => 'سياسة الخصوصية', 'en' => 'Privacy Policy',   'url' => '/privacy',  'order' => 0],
            ['ar' => 'شروط الاستخدام', 'en' => 'Terms of Use',     'url' => '/terms',    'order' => 1],
            ['ar' => 'تواصل معنا',     'en' => 'Contact Us',       'url' => '/contact',  'order' => 2],
        ];

        foreach ($support as $item) {
            NavigationItem::create([
                'menu_location' => 'footer_col4',
                'label' => ['ar' => $item['ar'], 'en' => $item['en'], 'tr' => $item['en']],
                'url' => $item['url'],
                'target' => '_self',
                'order' => $item['order'],
                'parent_id' => null,
                'status' => 'published',
            ]);
        }
    }
}
