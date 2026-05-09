<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds the "About" page (/page/about) to match prototype image #2:
 *   1. Bio (cream bg, portrait + biography text + decorative shapes)
 *   2. Scholars (sage carousel with chevron arrows)
 *   3. Works & activities (navy logo grid)
 *
 * Footer is rendered globally by PublicLayout.
 */
class PrototypeAboutPageSeeder extends Seeder
{
    public function run(): void
    {
        $page = Page::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => [
                    'en' => 'About',
                    'ar' => 'نبذة',
                    'tr' => 'Hakkında',
                ],
                'meta_fields' => [
                    'description' => 'Learn about Sheikh Awn Al-Qaddoumi',
                ],
                'status' => 'published',
            ]
        );

        $page->blocks()->delete();
        $order = 0;

        // ─── 1. Bio: portrait (right in RTL) + biography text on cream bg ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'text_with_image',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Awn Mueen Al-Qaddoumi',
                    'ar' => 'عون معين القدّومي',
                    'tr' => 'Avn Muin El-Kaddumi',
                ],
                'body' => [
                    'en' => '<p>An Islamic scholar and preacher from Jordan, the General Supervisor of the Al-Ma\'arij Institute for Sharia Studies and the Al-Hawra\' Institute for Qualification and Building. He is a founder and partner in a number of institutional dawah works, with a wide presence in media, television, radio, and youth and religious activities.</p><p>He has participated in journeys and dawah conferences across the Islamic world, with several authored works in various Sharia and dawah fields. Born in Amman on Friday, 11 Ramadan 1402 AH (2 July 1982 CE).</p>',
                    'ar' => '<p>داعية إسلامي من الأردن، والمشرف العام على معهد المعارج للدراسات الشرعية، ومعهد الحوراء للتأهيل والبناء في الأردن، ومؤسس ومشارك لعدد من الأعمال الدعوية المؤسسية، له حضوره الواسع في الإعلام والبرامج التلفزيونية والإذاعية والفعاليات الشبابية والدينية.</p><p>وله مشاركات في رحلات ومؤتمرات دعوية على مستوى العالم الإسلامي، وله مؤلفات عدة في مجالات شرعية ودعوية متعددة. ولد في عمّان الجمعة ١١ رمضان ١٤٠٢ هـ الموافق ٢ تموز ١٩٨٢.</p>',
                    'tr' => '<p>Ürdünlü İslam alimi ve davetçi. Ürdün\'deki El-Maaric Şeriat Çalışmaları Enstitüsü ve El-Hevra Yetiştirme ve İnşa Enstitüsü\'nün Genel Müdürü. Birçok kurumsal davet çalışmasının kurucusu ve ortağıdır.</p><p>İslam dünyasının dört bir yanında davet seyahatlerine ve konferanslarına katılmıştır. Çeşitli şer\'i ve dini alanlarda eserleri vardır. 11 Ramazan 1402 (2 Temmuz 1982) Cuma günü Amman\'da doğmuştur.</p>',
                ],
                'image_url' => '/images/prototype/sheikh-portrait.png',
                'image_alt' => [
                    'en' => 'Sheikh Awn Al-Qaddoumi',
                    'ar' => 'الشيخ عون معين القدومي',
                    'tr' => 'Şeyh Avn El-Kaddumi',
                ],
                'image_position' => 'left',
            ],
            'config' => [
                'background_color' => '#F7F4ED',
                'text_color' => '#2A2A28',
                'show_decorations' => true,
                'decoration_color' => 'rgba(74, 103, 65, 0.18)',
                'padding_y' => 'xl',
                'full_width' => true,
            ],
        ]);

        // ─── 2. Scholars (sage carousel) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'scholar_cards',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'His Scholars and Chain of Transmission',
                    'ar' => 'شيوخه وسنده',
                    'tr' => 'Hocaları ve İlim Silsilesi',
                ],
                'description' => [
                    'en' => '<p>Sheikh Awn received his religious education and ijazah from a number of scholars of Ahl al-Sunnah wa al-Jama\'ah, in the methodology of seeking the unbroken chain of isnad reaching back to the Messenger of Allah ﷺ in knowledge, conduct, and dawah — across Jordan, Syria, Lebanon, Egypt, Iraq, Yemen, Libya, Saudi Arabia, the Emirates, Turkey, Palestine, Sudan, Morocco, Algeria, Kenya, Malaysia, Indonesia, and other countries.</p>',
                    'ar' => '<p>تلقى العلوم الشرعية الدينية دراسة وإجازة على عدد من علماء أهل السنة والجماعة فيما يعرف بعلوم الإسناد ضمن منهجية طلب السند المتصل المتسلسل إلى رسول الله ﷺ في العلم والسلوك والدعوة في كل من الأردن وسوريا ولبنان ومصر والعراق واليمن وليبيا والمملكة العربية السعودية والإمارات وتركيا وفلسطين والسودان والمغرب والجزائر وكينيا وماليزيا وإندونيسيا وفطاني وغيرها من الدول.</p>',
                    'tr' => '<p>Şeyh Avn şer\'i ilimleri Ürdün, Suriye, Lübnan, Mısır, Irak, Yemen, Libya, Suudi Arabistan, BAE, Türkiye, Filistin, Sudan, Fas, Cezayir, Kenya, Malezya, Endonezya, Patani ve daha birçok ülkede Ehl-i Sünnet ve\'l-Cemaat ulemasından kesintisiz isnad metodolojisiyle aldı.</p>',
                ],
            ],
            'config' => [
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'layout' => 'carousel',
                'padding_y' => 'xl',
                'full_width' => true,
            ],
        ]);

        // ─── 3. Works & Activities (navy logo grid) ───
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
                    'en' => 'Projects and works',
                    'ar' => 'مشاريع وأعمال',
                    'tr' => 'Projeler ve eserler',
                ],
                'logos' => [
                    [
                        'heading' => ['ar' => 'نبع', 'en' => 'Naba', 'tr' => 'Naba'],
                        'image_url' => '/images/prototype/logo-naba.png',
                        'link' => '',
                    ],
                    [
                        'heading' => ['ar' => 'البيارق', 'en' => 'Al-Bayariq', 'tr' => 'El-Bayariq'],
                        'image_url' => '/images/prototype/logo-bayariq.png',
                        'link' => '',
                    ],
                    [
                        'heading' => ['ar' => 'تلقي', 'en' => 'Talaqqi', 'tr' => 'Telakki'],
                        'image_url' => '/images/prototype/logo-talaqqi.png',
                        'link' => '',
                    ],
                    [
                        'heading' => ['ar' => 'إسلاف', 'en' => 'Islaf', 'tr' => 'İslaf'],
                        'image_url' => '/images/prototype/logo-islaf.png',
                        'link' => '',
                    ],
                    [
                        'heading' => ['ar' => 'دار معين', 'en' => 'Dar Mu\'in', 'tr' => 'Dar Muin'],
                        'image_url' => '/images/prototype/logo-darmuin.png',
                        'link' => '',
                    ],
                ],
                'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                'cta_link' => '',
            ],
            'config' => [
                'background_color' => '#0E1230',
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'grayscale' => true,
                'columns' => 5,
                'logo_max_height' => 80,
                'full_width' => true,
            ],
        ]);

        $this->command->info("Prototype About page seeded with {$order} blocks (bio → scholars carousel → activities logo grid).");
    }
}
