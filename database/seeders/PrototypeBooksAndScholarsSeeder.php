<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Scholar;
use Illuminate\Database\Seeder;

/**
 * Seeds sample books and scholars matching the prototype design.
 * Books match the "مؤلفات" section; scholars match the "شيوخه وسنده" section.
 */
class PrototypeBooksAndScholarsSeeder extends Seeder
{
    public function run(): void
    {
        // ── Books ─────────────────────────────────────────────────────
        $books = [
            [
                'title'    => ['ar' => 'الأسماء النبوية', 'en' => 'The Prophetic Names', 'tr' => 'Nebevi İsimler'],
                'subtitle' => ['ar' => 'شرح وبيان', 'en' => '', 'tr' => ''],
                'category' => 'الأسماء النبوية',
                'cover_image_url' => '/images/prototype/book-asma.jpg',
                'display_order' => 1,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title'    => ['ar' => 'صوت البيانٍ', 'en' => 'Voice of Clarity', 'tr' => 'Beyan Sesi'],
                'subtitle' => ['ar' => '', 'en' => '', 'tr' => ''],
                'category' => 'صوت البيان',
                'cover_image_url' => '/images/prototype/book-bayan.jpg',
                'display_order' => 2,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title'    => ['ar' => 'الحج', 'en' => 'Hajj', 'tr' => 'Hac'],
                'subtitle' => ['ar' => 'دليل الحاج والمعتمر', 'en' => '', 'tr' => ''],
                'category' => 'الحج',
                'cover_image_url' => '/images/prototype/book-hajj.jpg',
                'display_order' => 3,
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'title'    => ['ar' => 'الأسس النبوية', 'en' => 'Prophetic Foundations', 'tr' => 'Nebevi Esaslar'],
                'subtitle' => ['ar' => '', 'en' => '', 'tr' => ''],
                'category' => 'الأسس النبوية',
                'cover_image_url' => '/images/prototype/book-ossos.jpg',
                'display_order' => 4,
                'is_featured' => false,
                'status' => 'published',
            ],
        ];

        foreach ($books as $book) {
            Book::firstOrCreate(
                ['title->ar' => $book['title']['ar']],
                $book
            );
        }

        // ── Scholars — الأردن ─────────────────────────────────────────
        $jordan = [
            'الشيخ نوح القضاة المفتي العام في الأردن سابقًا',
            'سعيد فودة',
            'يوسف المنوع',
            'عمر صبر ابن',
            'شكاذة الطيطري',
            'يونس حمدان',
            'علي أبو الغيص',
            'خالد الهيسي',
            'أمين الكيلاني',
            'إبراهيم الغالوجي',
        ];

        foreach ($jordan as $i => $name) {
            Scholar::firstOrCreate(
                ['name->ar' => $name, 'group_key' => 'jordan'],
                [
                    'name'          => ['ar' => $name, 'en' => $name, 'tr' => $name],
                    'group_name'    => ['ar' => 'الأردن', 'en' => 'Jordan', 'tr' => 'Ürdün'],
                    'group_key'     => 'jordan',
                    'display_order' => $i,
                    'status'        => 'published',
                ]
            );
        }

        // ── Scholars — اليمن ─────────────────────────────────────────
        $yemen = [
            'الحبيب عمر بن حفيظ',
            'الحبيب سالم الشاطري',
            'الحبيب أبو بكر المشهور',
            'الحبيب زين بن سميط',
            'الحبيب عمر بن محمد الحداد السقاف (أدم)',
            'الحبيب محمد بن علي الجنيد',
            'الحبيب علي المشهور بن سالم بن حفيظ',
            'الحبيب عبد الله بن محمد بن علوي بن شهاب',
            'الحبيب جعفر بن أحمد بن موسى الجيشي',
            'الحبيب علي بن محمد بن هادي السقاف',
            'الشيخ مرعي',
        ];

        foreach ($yemen as $i => $name) {
            Scholar::firstOrCreate(
                ['name->ar' => $name, 'group_key' => 'yemen'],
                [
                    'name'          => ['ar' => $name, 'en' => $name, 'tr' => $name],
                    'group_name'    => ['ar' => 'اليمن', 'en' => 'Yemen', 'tr' => 'Yemen'],
                    'group_key'     => 'yemen',
                    'display_order' => $i,
                    'status'        => 'published',
                ]
            );
        }

        // ── Scholars — الحجاز ────────────────────────────────────────
        $hejaz = [
            'نبيل الغمري',
            'مالك المري السنوسي',
            'خالد مرغوب',
            'عبد الرحيم العلمي',
            'طارق سرذار',
            'عمر بن حامد الجلالي',
            'الحبيب شهاب الدين',
        ];

        foreach ($hejaz as $i => $name) {
            Scholar::firstOrCreate(
                ['name->ar' => $name, 'group_key' => 'hejaz'],
                [
                    'name'          => ['ar' => $name, 'en' => $name, 'tr' => $name],
                    'group_name'    => ['ar' => 'الحجاز', 'en' => 'Hejaz', 'tr' => 'Hicaz'],
                    'group_key'     => 'hejaz',
                    'display_order' => $i,
                    'status'        => 'published',
                ]
            );
        }
    }
}
