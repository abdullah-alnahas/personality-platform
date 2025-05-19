<?php

namespace App\Http\Controllers;

use App\Models\ContentCategory;
use App\Models\ContentItem;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ContentController extends Controller
{
    private function getResponsiveImageData(
        ContentItem $item,
        string $collectionName = "featured_image"
    ): ?array {
        $media = $item->getFirstMedia($collectionName);
        if (!$media) {
            return null;
        }

        $imageData = [
            "alt" => $item->getTranslation("title", app()->getLocale()), // Use current locale for alt
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
                    : $media->getUrl()), // Fallback to original if no jpg thumb
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
        // If no specific jpg sources but webp exists, consider adding original as jpg source for basic fallback
        if (
            empty($imageData["jpg_sources"]) &&
            !empty($imageData["webp_sources"])
        ) {
            $imageData["jpg_sources"][] = [
                "url" => $media->getUrl(),
                "width" => $media->getCustomProperty("width", 1200),
            ]; // Approximate width
        }

        return $imageData;
    }

    public function showItem(string $slug): Response
    {
        try {
            $item = ContentItem::published()
                ->where("slug", $slug)
                ->with(["category:id,name,slug", "author:id,name", "media"])
                ->firstOrFail();

            $itemData = [
                "id" => $item->id,
                "title" => $item->getTranslations("title"),
                "content" => $item->getTranslations("content"),
                "publish_date_formatted" => $item->publish_date?->isoFormat(
                    "LL"
                ),
                "author_name" => $item->author?->name,
                "category_name" => $item->category?->getTranslations("name"),
                "category_slug" => $item->category?->slug,
                "meta_fields" => $item->getTranslations("meta_fields"),
                // 'featured_image_url' => $item->getFirstMediaUrl('featured_image'), // Deprecate in favor of image_details
                "image_details" => $this->getResponsiveImageData($item),
            ];

            return Inertia::render("Content/ShowItem", [
                "item" => $itemData,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404);
        }
    }

    public function showCategory(string $slug): Response
    {
        try {
            $category = ContentCategory::published()
                ->where("slug", $slug)
                ->firstOrFail();

            $items = ContentItem::published()
                ->where("content_category_id", $category->id)
                ->with(["media"])
                ->latest("publish_date")
                ->paginate(12)
                ->withQueryString()
                ->through(
                    fn($item) => [
                        "id" => $item->id,
                        "title" => $item->getTranslations("title"),
                        "excerpt" => $item->getTranslations("excerpt"),
                        "slug" => $item->slug,
                        // 'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Deprecate
                        "image_details" => $this->getResponsiveImageData($item), // Use this for ContentCard
                    ]
                );

            return Inertia::render("Content/ShowCategory", [
                "category" => [
                    "name" => $category->getTranslations("name"),
                    "description" => $category->getTranslations("description"),
                ],
                "items" => $items,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404);
        }
    }
}
