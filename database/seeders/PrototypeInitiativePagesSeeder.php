<?php

namespace Database\Seeders;

use App\Models\ContentCategory;
use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Database\Seeder;

/**
 * Page-builder pages for Iman, Ihsan, and Signs of the Hour initiatives.
 *
 * Each page uses the same block vocabulary as the homepage so admins can
 * edit them entirely from the panel: hero → featured_quote → pillar_cards
 * → category_grid → contact_form. Content mirrors the relevant homepage
 * sections so the operator sees a fully-realised starting point.
 */
class PrototypeInitiativePagesSeeder extends Seeder
{
    public function run(): void
    {
        $imanCat = ContentCategory::where('slug', 'iman')->first();
        $ihsanCat = ContentCategory::where('slug', 'ihsan')->first();
        $signsCat = ContentCategory::where('slug', 'signs-of-the-hour')->first();

        $this->seedIman($imanCat?->id);
        $this->seedIhsan($ihsanCat?->id);
        $this->seedSigns($signsCat?->id);
    }

    private function seedIman(?int $categoryId): void
    {
        $page = Page::updateOrCreate(
            ['slug' => 'iman-initiative'],
            [
                'title' => ['ar' => 'مبادرة الإيمان', 'en' => 'Iman Initiative', 'tr' => 'İman Girişimi'],
                'status' => 'published',
            ]
        );
        $page->blocks()->delete();
        $order = 0;

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'الإيمان', 'en' => 'Faith', 'tr' => 'İman'],
                'subtitle' => [
                    'ar' => '<p>غرس الإيمان الصادق في النفوس وتزكيتها بمحبة الإخوة في الله</p>',
                    'en' => '<p>Cultivating sincere faith and the love of brotherhood in Allah</p>',
                    'tr' => '<p>Samimi imanı ve Allah için kardeşlik sevgisini yetiştirmek</p>',
                ],
                'background_image_url' => '/images/prototype/faith-bg.jpg',
                'cta_text' => ['ar' => 'تعرف على البرامج', 'en' => 'Explore Programs', 'tr' => 'Programları Keşfet'],
                'cta_link' => '/category/iman',
                'overlay_opacity' => 0.6,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '500px',
                'text_color' => '#ffffff',
                'background_color' => '#4A6741',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(181,210,107,0.25)',
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'featured_quote',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'مدخل الإيمان', 'en' => 'Gateway to Faith', 'tr' => 'İmana Giriş'],
                'custom_text' => [
                    'ar' => 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
                    'en' => 'None of you truly believes until he loves for his brother what he loves for himself',
                    'tr' => 'Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz',
                ],
                'custom_source' => [
                    'ar' => 'حديث نبوي شريف - صحيح البخاري',
                    'en' => 'Prophetic Hadith - Sahih al-Bukhari',
                    'tr' => 'Hadis-i Şerif - Sahih-i Buhari',
                ],
                'background_image_url' => '/images/prototype/faith-bg.jpg',
            ],
            'config' => [
                'style' => 'dark',
                'background_color' => '#4A6741',
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'padding_y' => 'lg',
                'overlay_opacity' => 0.55,
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'pillar_cards',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'أركان الإيمان الستة', 'en' => 'The Six Pillars of Iman', 'tr' => 'İmanın Altı Esası'],
                'subtitle' => [
                    'ar' => 'الإيمان يقوم على ستة أركان جامعة، تنير القلب وتحرّك الجوارح',
                    'en' => 'Faith stands on six all-encompassing pillars that illuminate the heart and move the limbs',
                    'tr' => 'İman, kalbi aydınlatan ve uzuvları harekete geçiren altı temel üzerine kuruludur',
                ],
                'cards' => [
                    [
                        'heading' => ['ar' => 'الإيمان بالله', 'en' => 'Belief in Allah', 'tr' => 'Allah\'a İman'],
                        'body' => ['ar' => 'توحيده في ربوبيته وألوهيته وأسمائه وصفاته', 'en' => 'Affirming His oneness in lordship, worship, names, and attributes', 'tr' => 'Rububiyetinde, uluhiyetinde, isim ve sıfatlarında birliğini ikrar etmek'],
                    ],
                    [
                        'heading' => ['ar' => 'الإيمان بالملائكة', 'en' => 'Belief in the Angels', 'tr' => 'Meleklere İman'],
                        'body' => ['ar' => 'خلق نوراني، عباد مكرمون لا يعصون الله ما أمرهم', 'en' => 'Honoured servants of light who never disobey their Lord', 'tr' => 'Allah\'a hiç isyan etmeyen, nurdan yaratılmış değerli kullar'],
                    ],
                    [
                        'heading' => ['ar' => 'الإيمان بالكتب', 'en' => 'Belief in the Scriptures', 'tr' => 'Kitaplara İman'],
                        'body' => ['ar' => 'كل كتاب أنزله الله على رسله، وخاتمها القرآن الكريم', 'en' => 'Every book Allah sent to His messengers, sealed by the noble Qur\'an', 'tr' => 'Allah\'ın peygamberlerine indirdiği bütün kitaplar, son olarak Kur\'an-ı Kerim'],
                    ],
                    [
                        'heading' => ['ar' => 'الإيمان بالرسل', 'en' => 'Belief in the Messengers', 'tr' => 'Peygamberlere İman'],
                        'body' => ['ar' => 'بعثهم الله بالهدى ودين الحق، وخاتمهم محمد ﷺ', 'en' => 'Sent by Allah with guidance and truth, sealed by Muhammad ﷺ', 'tr' => 'Allah\'ın hidayet ve hak din ile gönderdiği elçiler, sonuncusu Hz. Muhammed ﷺ'],
                    ],
                    [
                        'heading' => ['ar' => 'الإيمان باليوم الآخر', 'en' => 'Belief in the Last Day', 'tr' => 'Ahirete İman'],
                        'body' => ['ar' => 'البعث والحساب والجزاء والجنة والنار', 'en' => 'Resurrection, reckoning, recompense, paradise, and the fire', 'tr' => 'Diriliş, hesap, ceza, cennet ve cehennem'],
                    ],
                    [
                        'heading' => ['ar' => 'الإيمان بالقدر', 'en' => 'Belief in Divine Decree', 'tr' => 'Kadere İman'],
                        'body' => ['ar' => 'خيره وشره من الله، علم وكتابة ومشيئة وخلق', 'en' => 'Its good and bad from Allah — knowledge, writing, will, and creation', 'tr' => 'Hayrı ve şerri Allah\'tandır — ilim, yazı, irade ve yaratma'],
                    ],
                ],
            ],
            'config' => [
                'columns' => 3,
                'card_style' => 'rounded',
                'background_color' => '#F7F4ED',
                'card_variant' => 'light',
                'show_decorations' => true,
                'decoration_color' => 'rgba(74,103,65,0.18)',
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'مشاريع الإيمان', 'en' => 'Iman Programs', 'tr' => 'İman Programları'],
                'description' => [
                    'ar' => 'برامج ومبادرات لتقوية الإيمان وتزكية النفوس',
                    'en' => 'Programs and initiatives for strengthening faith and purifying souls',
                    'tr' => 'İmanı güçlendirme ve nefisleri arındırma programları ve girişimleri',
                ],
                'category_id' => $categoryId,
                'max_items' => 8,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#4A6741',
                'text_color' => '#ffffff',
            ],
        ]);

        $this->appendContactForm($page, $order, '#4A6741');
    }

    private function seedIhsan(?int $categoryId): void
    {
        $page = Page::updateOrCreate(
            ['slug' => 'ihsan-initiative'],
            [
                'title' => ['ar' => 'مبادرة الإحسان', 'en' => 'Ihsan Initiative', 'tr' => 'İhsan Girişimi'],
                'status' => 'published',
            ]
        );
        $page->blocks()->delete();
        $order = 0;

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'الإحسان', 'en' => 'Ihsan', 'tr' => 'İhsan'],
                'subtitle' => [
                    'ar' => '<p>أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك</p>',
                    'en' => '<p>To worship Allah as though you see Him; for though you do not see Him, He surely sees you</p>',
                    'tr' => '<p>Allah\'a O\'nu görüyormuşçasına ibadet etmek; sen O\'nu görmesen de O seni görüyor</p>',
                ],
                'background_image_url' => '/images/prototype/ihsan-mosque-bg.jpg',
                'cta_text' => ['ar' => 'تعرف على المقامات', 'en' => 'Explore the Stations', 'tr' => 'Makamları Keşfet'],
                'cta_link' => '/category/ihsan',
                'overlay_opacity' => 0.65,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '500px',
                'text_color' => '#ffffff',
                'background_color' => '#2D4128',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(181,210,107,0.22)',
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'quran_verse',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'section_heading' => ['ar' => 'الإحسان', 'en' => 'Ihsan', 'tr' => 'İhsan'],
                'verse_text' => [
                    'ar' => 'هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِهِ وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ وَإِن كَانُوا مِن قَبْلُ لَفِي ضَلَالٍ مُّبِينٍ',
                    'en' => 'It is He who has sent among the unlettered a Messenger from themselves, reciting His verses to them and purifying them and teaching them the Book and wisdom',
                    'tr' => 'Ümmîlere içlerinden, kendilerine âyetlerini okuyan, onları temizleyen ve kitabı ve hikmeti öğreten bir peygamber gönderen O\'dur',
                ],
                'surah_name' => ['ar' => 'سورة الجمعة', 'en' => 'Surah Al-Jumu\'ah', 'tr' => 'Cuma Suresi'],
                'verse_reference' => '62:2',
                'secondary_text' => ['ar' => '', 'en' => '', 'tr' => ''],
                'secondary_source' => ['ar' => '', 'en' => '', 'tr' => ''],
                'background_image_url' => '/images/prototype/ihsan-mosque-bg.jpg',
                'cta_text' => ['ar' => '', 'en' => '', 'tr' => ''],
                'cta_link' => '',
                'bottom_items' => [
                    ['heading' => ['ar' => 'مسابقة الذكر', 'en' => 'Dhikr Competition', 'tr' => 'Zikir Yarışması'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['ar' => 'قافلة في القرآن', 'en' => 'Quran Caravan', 'tr' => 'Kur\'an Kafilesi'], 'image_url' => '', 'link' => ''],
                    ['heading' => ['ar' => 'الأوراد', 'en' => 'Daily Adhkar', 'tr' => 'Zikirler'], 'image_url' => '', 'link' => ''],
                ],
            ],
            'config' => [
                'text_color' => '#ffffff',
                'background_color' => '#2D4128',
                'ornamental_frame' => true,
                'padding_y' => 'xl',
                'layout' => 'card',
                'accent_color' => '#B5D26B',
                'overlay_opacity' => 0.65,
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'pillar_cards',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'مقامات الإحسان', 'en' => 'Stations of Ihsan', 'tr' => 'İhsan Makamları'],
                'subtitle' => [
                    'ar' => 'مراتب يرتقيها العبد بقلبه قبل جوارحه حتى يبلغ مقام المراقبة',
                    'en' => 'Levels the servant ascends with the heart before the limbs, reaching the station of mindfulness',
                    'tr' => 'Kulun uzuvlarından önce kalbiyle yükseldiği, murakabe makamına erişen mertebeler',
                ],
                'cards' => [
                    [
                        'heading' => ['ar' => 'التوبة', 'en' => 'Repentance', 'tr' => 'Tövbe'],
                        'body' => ['ar' => 'الرجوع إلى الله من كل ذنب، صادقًا نادمًا عازمًا', 'en' => 'Returning to Allah from every sin — truthful, regretful, resolute', 'tr' => 'Her günahtan Allah\'a dönüş — samimi, pişman ve kararlı'],
                    ],
                    [
                        'heading' => ['ar' => 'المراقبة', 'en' => 'Mindful Watchfulness', 'tr' => 'Murakabe'],
                        'body' => ['ar' => 'دوام علم القلب باطلاع الرب على الظاهر والباطن', 'en' => 'The heart\'s constant awareness that the Lord witnesses the seen and unseen', 'tr' => 'Kalbin, Rabbin zahir ve batına muttali olduğunu sürekli bilmesi'],
                    ],
                    [
                        'heading' => ['ar' => 'المحاسبة', 'en' => 'Self-Reckoning', 'tr' => 'Muhasebe'],
                        'body' => ['ar' => 'محاسبة النفس قبل أن تحاسب يوم القيامة', 'en' => 'Holding the self to account before the day of accounting', 'tr' => 'Hesap gününden önce nefsi muhasebe etmek'],
                    ],
                    [
                        'heading' => ['ar' => 'المجاهدة', 'en' => 'Spiritual Struggle', 'tr' => 'Mücahede'],
                        'body' => ['ar' => 'مجاهدة النفس والهوى والشيطان لإصلاح القلب', 'en' => 'Struggling against self, desire, and devil to mend the heart', 'tr' => 'Kalbin ıslahı için nefis, heva ve şeytanla mücadele'],
                    ],
                    [
                        'heading' => ['ar' => 'المحبة', 'en' => 'Love of Allah', 'tr' => 'Allah Sevgisi'],
                        'body' => ['ar' => 'محبة الله ورسوله فوق كل محبوب، ثمرتها العمل الصالح', 'en' => 'Loving Allah and His Messenger above all, fruited by righteous deeds', 'tr' => 'Allah ve Resulünü her şeyden çok sevmek; meyvesi salih amel'],
                    ],
                    [
                        'heading' => ['ar' => 'الإخلاص', 'en' => 'Sincerity', 'tr' => 'İhlas'],
                        'body' => ['ar' => 'تصفية العمل من شوائب الرياء والسمعة لله وحده', 'en' => 'Purifying every deed from showing-off, for Allah alone', 'tr' => 'Her ameli riya ve gösterişten arındırmak, sadece Allah için'],
                    ],
                ],
            ],
            'config' => [
                'columns' => 3,
                'card_style' => 'rounded',
                'background_color' => '#F7F4ED',
                'card_variant' => 'light',
                'show_decorations' => true,
                'decoration_color' => 'rgba(74,103,65,0.18)',
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'مشاريع الإحسان', 'en' => 'Ihsan Programs', 'tr' => 'İhsan Programları'],
                'description' => [
                    'ar' => 'برامج ومبادرات في مجال الإحسان والتزكية',
                    'en' => 'Programs and initiatives in Ihsan and spiritual purification',
                    'tr' => 'İhsan ve manevi arınma alanında programlar ve girişimler',
                ],
                'category_id' => $categoryId,
                'max_items' => 8,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#F7F4ED',
            ],
        ]);

        $this->appendContactForm($page, $order, '#2D4128');
    }

    private function seedSigns(?int $categoryId): void
    {
        $page = Page::updateOrCreate(
            ['slug' => 'signs-initiative'],
            [
                'title' => ['ar' => 'علامات الساعة', 'en' => 'Signs of the Hour', 'tr' => 'Kıyamet Alametleri'],
                'status' => 'published',
            ]
        );
        $page->blocks()->delete();
        $order = 0;

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'hero_banner',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'علامات الساعة', 'en' => 'Signs of the Hour', 'tr' => 'Kıyamet Alametleri'],
                'subtitle' => [
                    'ar' => '<p>فقه التحولات والفتن في ضوء الكتاب والسنة</p>',
                    'en' => '<p>Jurisprudence of transitions and trials in light of the Qur\'an and Sunnah</p>',
                    'tr' => '<p>Kur\'an ve Sünnet ışığında dönüşümler ve fitneler fıkhı</p>',
                ],
                'background_image_url' => '/images/prototype/mosque-bg.jpg',
                'cta_text' => ['ar' => 'تعرف على البرامج', 'en' => 'Explore Programs', 'tr' => 'Programları Keşfet'],
                'cta_link' => '/category/signs-of-the-hour',
                'overlay_opacity' => 0.7,
            ],
            'config' => [
                'full_width' => true,
                'min_height' => '500px',
                'text_color' => '#ffffff',
                'background_color' => '#2D4128',
                'layout' => 'centered',
                'show_decorations' => true,
                'decoration_color' => 'rgba(181,210,107,0.2)',
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'featured_quote',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'نداء النبي ﷺ', 'en' => 'The Prophet\'s Call ﷺ', 'tr' => 'Hz. Peygamber\'in Çağrısı ﷺ'],
                'custom_text' => [
                    'ar' => 'بادروا بالأعمال فتنًا كقطع الليل المظلم، يصبح الرجل مؤمنًا ويمسي كافرًا، ويمسي مؤمنًا ويصبح كافرًا، يبيع دينه بعرضٍ من الدنيا',
                    'en' => 'Hasten to do good deeds before trials come like patches of dark night — a man wakes up a believer and goes to sleep a disbeliever, selling his religion for a worldly bargain',
                    'tr' => 'Karanlık gece parçaları gibi fitneler gelmeden önce salih amellere koşun; kişi mümin olarak sabahlar, kâfir olarak akşamlar — dinini dünya menfaatine satar',
                ],
                'custom_source' => [
                    'ar' => 'حديث نبوي شريف - صحيح مسلم',
                    'en' => 'Prophetic Hadith - Sahih Muslim',
                    'tr' => 'Hadis-i Şerif - Sahih-i Müslim',
                ],
                'background_image_url' => '/images/prototype/mosque-bg.jpg',
            ],
            'config' => [
                'style' => 'dark',
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'padding_y' => 'lg',
                'overlay_opacity' => 0.7,
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'pillar_cards',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'العلامات الكبرى والصغرى', 'en' => 'Major and Minor Signs', 'tr' => 'Büyük ve Küçük Alametler'],
                'subtitle' => [
                    'ar' => 'علامات أنبأ بها النبي ﷺ، منها ما مضى ومنها ما هو واقع ومنها ما ينتظر',
                    'en' => 'Signs foretold by the Prophet ﷺ — some past, some unfolding, some yet to come',
                    'tr' => 'Hz. Peygamber\'in ﷺ haber verdiği alametler — bir kısmı geçmiş, bir kısmı vuku bulmakta, bir kısmı beklenmekte',
                ],
                'cards' => [
                    [
                        'heading' => ['ar' => 'العلامات الصغرى', 'en' => 'The Minor Signs', 'tr' => 'Küçük Alametler'],
                        'body' => ['ar' => 'علامات تسبق الساعة بزمن طويل، أكثرها وقع وبعضها مستمر', 'en' => 'Signs preceding the Hour by a long span — most have occurred, some are ongoing', 'tr' => 'Kıyametten uzun süre önce gelen alametler — çoğu vuku bulmuş, bir kısmı sürmekte'],
                    ],
                    [
                        'heading' => ['ar' => 'العلامات الكبرى', 'en' => 'The Major Signs', 'tr' => 'Büyük Alametler'],
                        'body' => ['ar' => 'عشر علامات كبرى تتتابع، وإذا ظهرت فلا توبة بعدها', 'en' => 'Ten major signs in succession; once they appear, no repentance afterward', 'tr' => 'Birbirini takip eden on büyük alamet; zuhur ettiğinde sonrasında tövbe kabul olmaz'],
                    ],
                    [
                        'heading' => ['ar' => 'فقه الفتن', 'en' => 'Jurisprudence of Trials', 'tr' => 'Fitneler Fıkhı'],
                        'body' => ['ar' => 'كيف نتعامل مع الفتن وقد توالت كقطع الليل', 'en' => 'How to navigate trials when they pile up like patches of night', 'tr' => 'Gece parçaları gibi üst üste gelen fitnelerle nasıl başa çıkılır'],
                    ],
                    [
                        'heading' => ['ar' => 'المسيح الدجال', 'en' => 'The False Messiah', 'tr' => 'Mesih-i Deccal'],
                        'body' => ['ar' => 'فتنة الدجال أعظم فتن الدنيا، حذر منها كل نبي قومه', 'en' => 'The Dajjal\'s trial is the greatest in this world; every prophet warned his people of him', 'tr' => 'Deccal fitnesi dünyanın en büyük fitnesidir; her peygamber kavmini ondan uyarmıştır'],
                    ],
                    [
                        'heading' => ['ar' => 'نزول عيسى ﷺ', 'en' => 'The Descent of Isa ﷺ', 'tr' => 'Hz. İsa\'nın ﷺ İnişi'],
                        'body' => ['ar' => 'نزول عيسى عليه السلام حكمًا عدلًا في آخر الزمان', 'en' => 'The descent of Jesus, peace be upon him, as a just judge at the end of time', 'tr' => 'Hz. İsa\'nın ahir zamanda adil bir hâkim olarak inişi'],
                    ],
                    [
                        'heading' => ['ar' => 'يأجوج ومأجوج', 'en' => 'Gog and Magog', 'tr' => 'Yecüc ve Mecüc'],
                        'body' => ['ar' => 'خروجهم من ورائهم سدًا، ينسلون من كل حدب', 'en' => 'Their emergence from beyond the barrier, swarming from every height', 'tr' => 'Setin ardından çıkışları, her tepeden akın etmeleri'],
                    ],
                ],
            ],
            'config' => [
                'columns' => 3,
                'card_style' => 'rounded',
                'background_color' => '#F7F4ED',
                'card_variant' => 'light',
                'show_decorations' => true,
                'decoration_color' => 'rgba(74,103,65,0.18)',
            ],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'category_grid',
            'display_order' => $order++,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'برامج علامات الساعة', 'en' => 'Signs of the Hour Programs', 'tr' => 'Kıyamet Alametleri Programları'],
                'description' => [
                    'ar' => 'فقه التحولات والفتن وعلامات الساعة الكبرى والصغرى',
                    'en' => 'Jurisprudence of trials and the major and minor signs of the Hour',
                    'tr' => 'Fitneler fıkhı ve büyük ve küçük kıyamet alametleri',
                ],
                'category_id' => $categoryId,
                'max_items' => 8,
            ],
            'config' => [
                'columns' => 4,
                'background_color' => '#2D4128',
                'text_color' => '#ffffff',
            ],
        ]);

        $this->appendContactForm($page, $order, '#2D4128');
    }

    private function appendContactForm(Page $page, int $order, string $bg): void
    {
        PageBlock::create([
            'page_id' => $page->id,
            'block_type' => 'contact_form',
            'display_order' => $order,
            'status' => 'published',
            'content' => [
                'heading' => ['ar' => 'نسعد بتواصلكم', 'en' => 'We are delighted to hear from you', 'tr' => 'Sizden haber almaktan memnuniyet duyarız'],
                'subtitle' => [
                    'ar' => 'أرسل لنا رسالتك وسنرد عليك في أقرب وقت',
                    'en' => 'Send us your message and we will reply soon',
                    'tr' => 'Bize mesajınızı gönderin, en kısa sürede yanıtlayalım',
                ],
                'name_label' => ['ar' => 'الاسم', 'en' => 'Name', 'tr' => 'Ad'],
                'email_label' => ['ar' => 'البريد الإلكتروني', 'en' => 'Email', 'tr' => 'E-posta'],
                'message_label' => ['ar' => 'الرسالة', 'en' => 'Message', 'tr' => 'Mesaj'],
                'submit_text' => ['ar' => 'إرسال', 'en' => 'Send', 'tr' => 'Gönder'],
                'background_image_url' => '/images/prototype/mountain-bg.jpg',
            ],
            'config' => [
                'background_color' => $bg,
                'text_color' => '#ffffff',
                'accent_color' => '#B5D26B',
                'padding_y' => 'xl',
                'overlay_opacity' => 0.55,
                'full_width' => true,
            ],
        ]);
    }
}
