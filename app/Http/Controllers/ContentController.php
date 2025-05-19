<?php

namespace App\Http\Controllers;

use App\Models\ContentCategory;
use App\Models\ContentItem;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\App; // For app()->getLocale()

class ContentController extends Controller
{
    /**
     * Helper function to prepare responsive image data for the frontend.
     *
     * @param ContentItem $item The content item model.
     * @param string $collectionName The name of the media collection.
     * @return array|null An array of image details or null if no media.
     */
    private function getResponsiveImageData(
        ContentItem $item,
        string $collectionName = "featured_image"
    ): ?array {
        $media = $item->getFirstMedia($collectionName);
        if (!$media) {
            return null;
        }

        // Prioritize dedicated alt text, fallback to item title for the current locale
        $currentLocale = App::getLocale();
        $altText = $item->getTranslation(
            "featured_image_alt_text",
            $currentLocale,
            false
        ); // Don't use fallback here initially

        if (empty($altText) || $altText === $item->featured_image_alt_text) {
            // Check if it's the raw JSON or empty
            $altText = $item->getTranslation("title", $currentLocale); // Fallback to title
        }

        $imageData = [
            "alt" => $altText,
            "original_url" => $media->getFullUrl(), // Use getFullUrl() for original
            "webp_sources" => [],
            "jpg_sources" => [],
            "thumbnail_webp" => $media->hasGeneratedConversion("thumbnail")
                ? $media->getUrl("thumbnail")
                : null,
            "thumbnail_jpg" => $media->hasGeneratedConversion("thumbnail_jpg")
                ? $media->getUrl("thumbnail_jpg")
                : null,
        ];

        // Fallback for thumbnail_jpg if thumbnail_webp exists but thumbnail_jpg doesn't (e.g. original was webp)
        if ($imageData["thumbnail_webp"] && !$imageData["thumbnail_jpg"]) {
            // If original is not webp, this might point to original if it's a jpg/png
            if (!in_array($media->mime_type, ["image/webp"])) {
                $imageData["thumbnail_jpg"] = $media->hasGeneratedConversion(
                    "thumbnail_jpg"
                )
                    ? $media->getUrl("thumbnail_jpg")
                    : $media->getFullUrl();
            }
        } elseif (
            !$imageData["thumbnail_webp"] &&
            !$imageData["thumbnail_jpg"]
        ) {
            // If no conversions at all, use original
            $imageData["thumbnail_jpg"] = $media->getFullUrl();
        }

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

        // If no specific jpg sources but webp exists, add original as a basic jpg source for <picture> fallback
        // This is a basic fallback, ideally, you'd have actual JPG conversions.
        if (
            empty($imageData["jpg_sources"]) &&
            !empty($imageData["webp_sources"]) &&
            !in_array($media->mime_type, ["image/webp"])
        ) {
            $imageData["jpg_sources"][] = [
                "url" => $media->getFullUrl(),
                "width" => $media->getCustomProperty("width", 1200),
            ]; // Approximate width
        }
        // If no sources at all, provide the original URL as a single jpg_source (if it's not webp)
        if (
            empty($imageData["webp_sources"]) &&
            empty($imageData["jpg_sources"]) &&
            !in_array($media->mime_type, ["image/webp"])
        ) {
            $imageData["jpg_sources"][] = [
                "url" => $media->getFullUrl(),
                "width" => $media->getCustomProperty("width", 1200),
            ];
        }

        return $imageData;
    }

    /**
     * Display a single content item.
     *
     * @param string $slug
     * @return Response
     */
    public function showItem(string $slug): Response
    {
        try {
            $item = ContentItem::published()
                ->where("slug", $slug)
                ->with(["category:id,name,slug", "author:id,name", "media"]) // Eager load media
                ->firstOrFail();

            $itemData = [
                "id" => $item->id,
                "title" => $item->getTranslations("title"),
                "content" => $item->getTranslations("content"), // Assumes content is sanitized on save
                "publish_date_formatted" => $item->publish_date?->isoFormat(
                    "LL"
                ),
                "author_name" => $item->author?->name,
                "category_name" => $item->category?->getTranslations("name"),
                "category_slug" => $item->category?->slug,
                "meta_fields" => $item->getTranslations("meta_fields"),
                "image_details" => $this->getResponsiveImageData(
                    $item,
                    "featured_image"
                ),
            ];

            return Inertia::render("Content/ShowItem", [
                "item" => $itemData,
                // SEO data can be enhanced here using meta_fields or item properties
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404);
        }
    }

    /**
     * Display a list of content items for a specific category.
     *
     * @param string $slug
     * @return Response
     */
    public function showCategory(string $slug): Response
    {
        try {
            $category = ContentCategory::published()
                ->where("slug", $slug)
                ->firstOrFail();

            $itemsPaginator = ContentItem::published()
                ->where("content_category_id", $category->id)
                ->with(["media"]) // Eager load media for each item
                ->latest("publish_date")
                ->paginate(12)
                ->withQueryString();

            // Transform items for the frontend, including responsive image data
            $itemsPaginator->through(
                fn($item) => [
                    "id" => $item->id,
                    "title" => $item->getTranslations("title"),
                    "excerpt" => $item->getTranslations("excerpt"),
                    "slug" => $item->slug,
                    "category_name" => $item->category?->getTranslations(
                        "name"
                    ), // For consistency, though already have category
                    "category_slug" => $item->category?->slug,
                    "image_details" => $this->getResponsiveImageData(
                        $item,
                        "featured_image"
                    ),
                    "publish_date_formatted" => $item->publish_date?->isoFormat(
                        "LL"
                    ),
                ]
            );

            return Inertia::render("Content/ShowCategory", [
                "category" => [
                    "name" => $category->getTranslations("name"),
                    "description" => $category->getTranslations("description"),
                    // SEO data for category page
                ],
                "items" => $itemsPaginator,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404);
        }
    }
}
