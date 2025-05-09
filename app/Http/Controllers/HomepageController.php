<?php namespace App\Http\Controllers;

use App\Models\ContentItem;
use App\Models\Quote;
use App\Models\Setting;
// use App\Models\SocialAccount; // SocialAccount is not directly used in this controller for items
use App\Models\HomepageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class HomepageController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $settings = Cache::remember("site_settings_all", 3600, function () {
            return Setting::all()->keyBy("key");
        });

        $homepageSectionsData = Cache::remember(
            "homepage_sections_data",
            3600,
            function () {
                $sections = HomepageSection::published()
                    ->orderBy("display_order")
                    ->get();
                $processedSections = [];

                foreach ($sections as $section) {
                    // Explicitly get translations for model attributes to ensure they are arrays
                    $sectionData = [
                        "id" => $section->id,
                        "section_type" => $section->section_type,
                        "title" => $section->getTranslations("title"), // Explicitly get translations
                        "subtitle_or_quote" => $section->getTranslations(
                            "subtitle_or_quote"
                        ), // Explicitly get translations
                        "content_category_id" => $section->content_category_id,
                        "max_items" => $section->max_items,
                        "display_order" => $section->display_order,
                        "status" => $section->status,
                        "config" => $section->config, // Assumes config is already an array via $casts
                        "items" => [], // Initialize items array
                        "quote_data" => null, // Initialize quote_data
                    ];

                    switch ($section->section_type) {
                        case "thematic_carousel":
                            if ($section->content_category_id) {
                                $sectionData["items"] = ContentItem::published()
                                    ->where(
                                        "content_category_id",
                                        $section->content_category_id
                                    )
                                    ->with(["media", "category:id,name,slug"])
                                    ->latest("publish_date")
                                    ->take($sectionData["max_items"] ?: 6)
                                    ->get()
                                    ->map(
                                        fn($item) => [
                                            "id" => $item->id,
                                            "title" => $item->getTranslations(
                                                "title"
                                            ),
                                            "excerpt" => $item->getTranslations(
                                                "excerpt"
                                            ),
                                            "slug" => $item->slug,
                                            "category_slug" =>
                                                $item->category?->slug,
                                            "category_name" => $item->category?->getTranslations(
                                                "name"
                                            ),
                                            "image_url" => $item->getFirstMediaUrl(
                                                "featured_image",
                                                "thumbnail"
                                            ),
                                        ]
                                    )
                                    ->all();
                            }
                            break;
                        case "latest_news":
                            $sectionData["items"] = ContentItem::published()
                                ->with(["category:id,name,slug"])
                                ->latest("publish_date")
                                ->take($sectionData["max_items"] ?: 6)
                                ->get()
                                ->map(
                                    fn($item) => [
                                        "id" => $item->id,
                                        "title" => $item->getTranslations(
                                            "title"
                                        ),
                                        "slug" => $item->slug,
                                        "category_slug" =>
                                            $item->category?->slug,
                                        "category_name" => $item->category?->getTranslations(
                                            "name"
                                        ),
                                        "publish_date_formatted" => $item->publish_date?->isoFormat(
                                            "LL"
                                        ),
                                    ]
                                )
                                ->all();
                            break;
                        case "featured_quote":
                            $quote = Quote::published()
                                ->inRandomOrder()
                                ->first();
                            if ($quote) {
                                $sectionData["quote_data"] = [
                                    "text" => $quote->getTranslations("text"),
                                    "source" => $quote->getTranslations(
                                        "source"
                                    ),
                                ];
                            }
                            break;
                        // 'vision' and 'social_media_links' types don't need specific items fetched here,
                        // their own attributes (title, subtitle_or_quote, config) are sufficient.
                    }
                    $processedSections[] = $sectionData;
                }
                return $processedSections;
            }
        );

        $genericFeaturedItems = ContentItem::published()
            ->where("is_featured_home", true)
            ->with(["media", "category:id,name,slug"])
            ->latest("publish_date")
            ->take(3)
            ->get()
            ->map(
                fn($item) => [
                    "id" => $item->id,
                    "title" => $item->getTranslations("title"),
                    "excerpt" => $item->getTranslations("excerpt"),
                    "slug" => $item->slug,
                    "category_slug" => $item->category?->slug,
                    "category_name" => $item->category?->getTranslations(
                        "name"
                    ),
                    "image_url" => $item->getFirstMediaUrl(
                        "featured_image",
                        "thumbnail"
                    ),
                ]
            );

        return Inertia::render("Welcome", [
            "settings" => $settings,
            "homepageSections" => $homepageSectionsData,
            "genericFeaturedItems" => $genericFeaturedItems,
            "canLogin" => Route::has("login"),
            "canRegister" => Route::has("register"),
        ]);
    }
}
