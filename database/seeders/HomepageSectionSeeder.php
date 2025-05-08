<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HomepageSection;
use App\Models\ContentCategory; // To link thematic sections to categories

class HomepageSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one category exists for thematic sections
        $islamCategory = ContentCategory::firstOrCreate(
            ['slug' => 'islam'],
            ['name' => ['en' => 'Islamic Studies', 'ar' => 'دراسات إسلامية', 'tr' => 'İslami Çalışmalar'], 'status' => 'published']
        );
        $faithCategory = ContentCategory::firstOrCreate(
            ['slug' => 'faith-principles'],
            ['name' => ['en' => 'Principles of Faith', 'ar' => 'أصول الإيمان', 'tr' => 'İnanç Esasları'], 'status' => 'published']
        );


        HomepageSection::updateOrCreate(
            ['section_type' => 'vision', 'display_order' => 0],
            [
                'title' => ['en' => 'Our Vision', 'ar' => 'رؤيتنا', 'tr' => 'Vizyonumuz'],
                'subtitle_or_quote' => [
                    'en' => 'Reviving the entire religion in the entire world until the Day of Judgment. Seeking knowledge is an obligation upon every Muslim.',
                    'ar' => 'إحياء الدين كله في العالم كله إلى قيام الساعة. «طلب العلم فريضة على كل مسلم»',
                    'tr' => 'Kıyamet gününe kadar tüm dünyada dinin tamamını ihya etmek. İlim talep etmek her Müslümana farzdır.'
                ],
                'status' => 'published',
                'config' => ['button_text' => ['en' => 'Learn More', 'ar' => 'اعرف المزيد', 'tr' => 'Daha Fazla Bilgi'], 'button_link' => '/about'] // Example config
            ]
        );

        HomepageSection::updateOrCreate(
            ['section_type' => 'thematic_carousel', 'title' => json_encode(['en' => 'Islam', 'ar' => 'الإسلام', 'tr' => 'İslam'])],
            [
                'display_order' => 10,
                'subtitle_or_quote' => [
                    'en' => '"To testify that there is no god but Allah and Muhammad is His Messenger, to establish prayer, to give zakat, to fast Ramadan, and to perform Hajj to the House if you are able." (Hadith)',
                    'ar' => '«بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لا إِلَهَ إِلا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ»',
                    'tr' => '"İslam beş temel üzerine kurulmuştur: Allah\'tan başka ilah olmadığına ve Muhammed\'in O\'nun elçisi olduğuna şehadet etmek, namazı kılmak, zekatı vermek, Ramazan orucunu tutmak ve gücü yetenin Kâbe\'yi haccetmesi."'
                ],
                'content_category_id' => $islamCategory->id, // Link to a category
                'max_items' => 6,
                'status' => 'published',
            ]
        );

        HomepageSection::updateOrCreate(
            ['section_type' => 'thematic_carousel', 'title' => json_encode(['en' => 'Iman (Faith)', 'ar' => 'الإيمان', 'tr' => 'İman'])],
            [
                'display_order' => 20,
                'subtitle_or_quote' => [
                    'en' => '"Faith is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine decree, its good and its evil." (Hadith)',
                    'ar' => '«أَنْ تُؤْمِنَ بِاللَّهِ وَمَلائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ»',
                    'tr' => '"İman; Allah\'a, meleklerine, kitaplarına, peygamberlerine, ahiret gününe ve kadere, hayrına ve şerrine inanmaktır."'
                ],
                'content_category_id' => $faithCategory->id, // Link to another category
                'max_items' => 6,
                'status' => 'published',
            ]
        );

        HomepageSection::updateOrCreate(
            ['section_type' => 'latest_news'],
            [
                'title' => ['en' => 'Latest Updates', 'ar' => 'آخر الأخبار', 'tr' => 'Son Güncellemeler'],
                'display_order' => 30,
                'max_items' => 6, // How many news items to show
                'status' => 'published',
            ]
        );

        HomepageSection::updateOrCreate(
            ['section_type' => 'featured_quote'],
            [
                'title' => ['en' => 'Quote of the Day', 'ar' => 'اقتباس اليوم', 'tr' => 'Günün Sözü'],
                'display_order' => 40,
                'status' => 'published',
            ]
        );

        HomepageSection::updateOrCreate(
            ['section_type' => 'social_media_links'],
            [
                'title' => ['en' => 'Connect With Us', 'ar' => 'تواصل معنا', 'tr' => 'Bizimle Bağlantı Kurun'],
                'display_order' => 50,
                'status' => 'published',
            ]
        );
    }
}
