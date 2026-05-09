<?php

namespace Database\Seeders;

use App\Models\ContentCategory;
use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Seeds the Islam initiative page (/category/islam → /page/islam-initiative)
 * to match prototype image #3:
 *   1. Hero with Kaaba bg + heading + secondary "العلم الواجب" card + CTA
 *   2. Stats counter (محو الأمية الدينية في أرقام) — sage green, 3 stats
 *   3. Stats counter with bg image (التأهيل العلمي والدعوي) — body + 3 stats
 *   4. Platform CTA (المنصة العلمية / تلقي) — cream bg + logo + CTA
 *   5. Books carousel (مؤلفات) — navy bg with chevron arrows
 */
class PrototypeIslamCategorySeeder extends Seeder
{
    public function run(): void
    {
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

        // ─── 1. Hero: Kaaba bg + heading + subtitle + secondary "العلم الواجب" card ───
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
                    'en' => '<p>The Methodology of Ahl al-Sunnah with the Connected Chain of Transmission</p>',
                    'ar' => '<p>منهجية أهل السنة بالسند المتصل</p>',
                    'tr' => '<p>Muttasıl isnâd ile Ehl-i Sünnet metodolojisi</p>',
                ],
                'background_image_url' => '/images/prototype/kaaba-bg.jpg',
                'portrait_image_url' => '',
                'secondary_heading' => [
                    'en' => 'The Required Knowledge',
                    'ar' => 'العلم الواجب',
                    'tr' => 'Vacip İlim',
                ],
                'secondary_body' => [
                    'en' => '<p>The Required Knowledge course is designed to introduce participants to the most important matters that summarise the pillars of religion, faith, Islam and ihsan, and contains a comprehensive introduction to all the matters and sciences that every Muslim is required to learn and follow.</p>',
                    'ar' => '<p>دورة العلم الواجب صُممت لتعريف المشتركين على أهم الأمور التي تلخص أركان الدين والإيمان والإسلام والإحسان، حيث تتضمن الدورة تعريفاً شاملاً بكافة الأمور والعلوم الواجب على كل مسلم أن يتعلمها ويتبعها.</p>',
                    'tr' => '<p>Vacip İlim dersi, din, iman, İslam ve ihsanın rükünlerini özetleyen, her Müslümanın öğrenmesi ve takip etmesi gereken meselelerin ve ilimlerin kapsamlı bir tanıtımını sunar.</p>',
                ],
                'secondary_cta_text' => [
                    'en' => 'Learn Now',
                    'ar' => 'تعلم الآن',
                    'tr' => 'Şimdi Öğren',
                ],
                'secondary_cta_link' => '/contact',
                'cta_text' => ['en' => '', 'ar' => '', 'tr' => ''],
                'cta_link' => '',
                'overlay_opacity' => 0.45,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '620px',
                'text_color' => '#ffffff',
                'background_color' => '#4A6741',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(181, 210, 107, 0.18)',
            ],
        ]);

        // ─── 2. Stats Counter: محو الأمية الدينية في أرقام (sage green, 3 stats) ───
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
                'subtitle' => ['en' => '', 'ar' => '', 'tr' => ''],
                'stats' => [
                    [
                        'value' => '40',
                        'suffix' => ['en' => 'k', 'ar' => ' ألف', 'tr' => ' bin'],
                        'label' => ['en' => 'Students of Knowledge', 'ar' => 'طالب علم', 'tr' => 'İlim Talebesi'],
                    ],
                    [
                        'value' => '10',
                        'suffix' => ['en' => 'k', 'ar' => ' ألف', 'tr' => ' bin'],
                        'label' => ['en' => 'Courses', 'ar' => 'دورة', 'tr' => 'Ders'],
                    ],
                    [
                        'value' => '140',
                        'suffix' => ['en' => '', 'ar' => '', 'tr' => ''],
                        'label' => ['en' => 'Teachers', 'ar' => 'معلم', 'tr' => 'Öğretmen'],
                    ],
                ],
            ],
            'config' => [
                'background_color' => '#4A6741',
                'text_color' => '#ffffff',
                'accent_color' => '#C9F050',
                'columns' => 3,
                'padding_y' => 'lg',
                'full_width' => true,
            ],
        ]);

        // ─── 3. Stats Counter with body + bg image: التأهيل العلمي والدعوي ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'stats_counter',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'Scholarly and Da\'wah Qualification',
                    'ar' => 'التأهيل العلمي و الدعوي',
                    'tr' => 'İlmî ve Davet Yetiştirme',
                ],
                'subtitle' => ['en' => '', 'ar' => '', 'tr' => ''],
                'body' => [
                    'en' => '<p>A four-tier preacher-formation programme: foundational dawah courses covering the pillars of dawah and bearing its concern, then qualification programmes targeting the formation of the daʿī and his skills and acquiring practical experience through field placement at one of the dawah facilities, then a focus on the categories of recipients of dawah and the language of address and specialisation in dawah work, then composition and construction of institutional dawah projects under direct supervision.</p>',
                    'ar' => '<p>برنامج تأهيل دعوي، من خلال أربعة مستويات تتضمن دورات تأصيلية للدعوة وأركانها وحمل الهم الدعوي، ثم برامج تأهيلية تستهدف بناء ذات الداعي ومهاراته واكتساب الخبرة الدعوية من خلال الالتحاق بأحد مرافق الدعوة وإنجاز المهمات والمتطلبات، ثم التركيز على مراتب المدعوين ولغة الخطاب والتخصصية في العمل الدعوي، ثم التشكيل والبناء للأعمال الدعوية المؤسسية والإشراف عليها.</p>',
                    'tr' => '<p>Dört seviyede kapsamlı davetçi yetiştirme programı: davetin temellerini ve rükünlerini anlatan tesisi dersler; davetçinin kişiliğini ve yeteneklerini inşa eden, sahada deneyim kazandıran yetiştirme programları; muhatapların kategorileri ve hitap dili odaklı uzmanlaşma; ve son aşamada kurumsal davet çalışmalarının inşası ve denetimi.</p>',
                ],
                'background_image_url' => '/images/prototype/faith-bg.jpg',
                'stats' => [
                    [
                        'value' => '70',
                        'suffix' => ['en' => 'k', 'ar' => ' ألف', 'tr' => ' bin'],
                        'label' => ['en' => 'Students of Knowledge', 'ar' => 'طالب علم', 'tr' => 'İlim Talebesi'],
                    ],
                    [
                        'value' => '10',
                        'suffix' => ['en' => 'k', 'ar' => ' ألف', 'tr' => ' bin'],
                        'label' => ['en' => 'Courses', 'ar' => 'دورة', 'tr' => 'Ders'],
                    ],
                    [
                        'value' => '50',
                        'suffix' => ['en' => '%', 'ar' => '%', 'tr' => '%'],
                        'label' => ['en' => 'Scholars', 'ar' => 'علماء', 'tr' => 'Alimler'],
                    ],
                ],
            ],
            'config' => [
                'background_color' => '#1E2A22',
                'text_color' => '#ffffff',
                'accent_color' => '#C9F050',
                'columns' => 3,
                'padding_y' => 'xl',
                'overlay_opacity' => 0.65,
                'full_width' => true,
            ],
        ]);

        // ─── 4. Platform CTA: المنصة العلمية / تلقي (cream bg + logo + CTA) ───
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'platform_cta',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => [
                    'en' => 'The Scholarly Platform',
                    'ar' => 'المنصة العلمية',
                    'tr' => 'İlmî Platform',
                ],
                'brand_name' => [
                    'en' => 'Talaqqi',
                    'ar' => 'تلقي',
                    'tr' => 'Telakki',
                ],
                'body' => [
                    'en' => '<p>Talaqqi is a specialised educational platform for the presentation of Sharia sciences and tools, through an elite of Ahl al-Sunnah scholars who teach, according to age-appropriate methods, in an interactive and accessible style befitting our era. Talaqqi merges direct scholar-student contact and live classroom delivery with the convenience of MOOCs and open distance learning.</p>',
                    'ar' => '<p>تلقي هي منصة تعليمية متخصصة في تقديم العلوم الشرعية وآلاتها وذلك من خلال نخبة من علماء أهل السنة يقومون بالتدريس بأساليبهم المنتقدة المتميزة بأسلوب سهل وتفاعلي يناسب العصر. عالجت "تلقي" وظيفة التفاعل المباشر بين المحاضر والطالب عن طريق تقديم المحتوى العلمي فيما يعرف بمسمى المووكس "MOOCs" أو المسافات التعليمية المفتوحة.</p>',
                    'tr' => '<p>Telakki, Ehl-i Sünnet ulemasının seçkin bir grubunun, çağa uygun, kolay ve etkileşimli bir üslupla şer\'i ilimleri ve araçlarını sunduğu özel bir eğitim platformudur. MOOCs benzeri açık eğitim modeliyle hocalarla doğrudan etkileşim sağlar.</p>',
                ],
                'icon_url' => '/images/prototype/logo-talaqqi.png',
                'cta_text' => [
                    'en' => 'Learn Now',
                    'ar' => 'تعلم الآن',
                    'tr' => 'Şimdi Öğren',
                ],
                'cta_link' => 'https://talaqqi.com',
                'pattern_image_url' => '/images/prototype/logo-talaqqi-pattern.png',
            ],
            'config' => [
                'background_color' => '#F7F4ED',
                'text_color' => '#2A2A28',
                'accent_color' => '#4A6741',
                'padding_y' => 'xl',
                'pattern_position' => 'left',
                'pattern_opacity' => 0.18,
                'full_width' => true,
            ],
        ]);

        // ─── 5. Books carousel: مؤلفات (navy bg with chevron arrows) ───
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
                'subtitle' => ['en' => '', 'ar' => '', 'tr' => ''],
                'max_items' => 8,
            ],
            'config' => [
                'background_color' => '#0E1230',
                'text_color' => '#ffffff',
                'accent_color' => '#7FB3FF',
                'columns' => 4,
                'layout' => 'carousel',
                'padding_y' => 'xl',
                'full_width' => true,
            ],
        ]);

        ContentCategory::where('slug', 'islam')->update(['page_id' => $page->id]);

        $this->command->info("Prototype Islam page seeded with {$order} blocks (hero → stats → stats+body → platform_cta → books carousel).");
    }
}
