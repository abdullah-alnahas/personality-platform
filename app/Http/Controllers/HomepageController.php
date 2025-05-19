<?php namespace App\Http\Controllers;

use App\Models\ContentItem;
use App\Models\Quote;
use App\Models\Setting;
use App\Models\HomepageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class HomepageController extends Controller
{
    // Re-use the helper method if it were in a Trait or BaseController
    // For now, copying it here for demonstration.
    private function getResponsiveImageData(
        ContentItem $item,
        string $collectionName = "featured_image"
    ): ?array {
        $media = $item->getFirstMedia($collectionName);
        if (!$media) {
            return null;
        }

        $imageData = [
            "alt" => $item->getTranslation("title", app()->getLocale()),
            "original_url" => $media->getUrl(),
            "webp_sources" => [],
            "jpg_sources" => [],
            "thumbnail_webp" => $media->hasGeneratedConversion("thumbnail")
                ? $media->getUrl("thumbnail")
                : null,
            "thumbnail_jpg" => $media->hasGeneratedConversion("thumbnail_jpg")
                ? $media->getUrl("thumbnail_jpg")
                : ($media->hasGeneratedConversion("thumbnail")
                    ? null
                    : $media->getUrl()),
        ];

        $responsiveSizes = [
            "sm" => [
                "width" => 320,
                "conversion_webp" => "responsive_sm",
                "conversion_jpg" => "responsive_sm_jpg",
            ],
            "md" => [
                "width" => 768,
                "conversion_webp" => "responsive_md",
                "conversion_jpg" => "responsive_md_jpg",
            ],
            "lg" => [
                "width" => 1200,
                "conversion_webp" => "responsive_lg",
                "conversion_jpg" => "responsive_lg_jpg",
            ],
        ];

        foreach ($responsiveSizes as $sizeInfo) {
            if ($media->hasGeneratedConversion($sizeInfo["conversion_webp"])) {
                $imageData["webp_sources"][] = [
                    "url" => $media->getUrl($sizeInfo["conversion_webp"]),
                    "width" => $sizeInfo["width"],
                ];
            }
            if ($media->hasGeneratedConversion($sizeInfo["conversion_jpg"])) {
                $imageData["jpg_sources"][] = [
                    "url" => $media->getUrl($sizeInfo["conversion_jpg"]),
                    "width" => $sizeInfo["width"],
                ];
            }
        }
        if (
            empty($imageData["jpg_sources"]) &&
            !empty($imageData["webp_sources"])
        ) {
            $imageData["jpg_sources"][] = [
                "url" => $media->getUrl(),
                "width" => $media->getCustomProperty("width", 1200),
            ];
        }

        return $imageData;
    }

    public function __invoke(Request $request): Response
    {
        $settings = Cache::remember("site_settings_all", 3600, function () {
            return Setting::all()->keyBy("key");
        });

        $homepageSectionsData = Cache::remember(
            "homepage_sections_data_v2", // Changed cache key due to data structure change
            3600,
            function () {
                $sections = HomepageSection::published()
                    ->orderBy("display_order")
                    ->get();
                $processedSections = [];

                foreach ($sections as $section) {
                    $sectionData = [
                        "id" => $section->id,
                        "section_type" => $section->section_type,
                        "title" => $section->getTranslations("title"),
                        "subtitle_or_quote" => $section->getTranslations(
                            "subtitle_or_quote"
                        ),
                        "content_category_id" => $section->content_category_id,
                        "max_items" => $section->max_items,
                        "display_order" => $section->display_order,
                        "status" => $section->status,
                        "config" => $section->config,
                        "items" => [],
                        "quote_data" => null,
                    ];

                    if (
                        $section->section_type === "thematic_carousel" &&
                        $section->content_category_id
                    ) {
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
                                    "title" => $item->getTranslations("title"),
                                    "excerpt" => $item->getTranslations(
                                        "excerpt"
                                    ),
                                    "slug" => $item->slug,
                                    "category_slug" => $item->category?->slug,
                                    "category_name" => $item->category?->getTranslations(
                                        "name"
                                    ),
                                    // 'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Deprecate
                                    "image_details" => $this->getResponsiveImageData(
                                        $item
                                    ), // ADDED
                                ]
                            )
                            ->all();
                    } elseif ($section->section_type === "latest_news") {
                        $sectionData["items"] = ContentItem::published()
                            ->with(["category:id,name,slug", "media"]) // Ensure media is loaded for latest_news too
                            ->latest("publish_date")
                            ->take($sectionData["max_items"] ?: 6)
                            ->get()
                            ->map(
                                fn($item) => [
                                    "id" => $item->id,
                                    "title" => $item->getTranslations("title"),
                                    "excerpt" => $item->getTranslations(
                                        "excerpt"
                                    ), // Added excerpt for cards
                                    "slug" => $item->slug,
                                    "category_slug" => $item->category?->slug,
                                    "category_name" => $item->category?->getTranslations(
                                        "name"
                                    ),
                                    "publish_date_formatted" => $item->publish_date?->isoFormat(
                                        "LL"
                                    ),
                                    "image_details" => $this->getResponsiveImageData(
                                        $item
                                    ), // ADDED for latest news cards
                                ]
                            )
                            ->all();
                    } elseif ($section->section_type === "featured_quote") {
                        $quote = Quote::published()->inRandomOrder()->first();
                        if ($quote) {
                            $sectionData["quote_data"] = [
                                "text" => $quote->getTranslations("text"),
                                "source" => $quote->getTranslations("source"),
                            ];
                        }
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
                    // 'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Deprecate
                    "image_details" => $this->getResponsiveImageData($item), // ADDED
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
