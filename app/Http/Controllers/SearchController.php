<?php

namespace App\Http\Controllers;

use App\Models\ContentItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    // Copying helper method here as well. Consider a Trait or BaseController method for DRY.
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
        $query = $request->input("q", "");
        $locale = app()->getLocale();
        $itemsCollection = collect(); // Use Laravel Collection for Paginator

        if (!empty($query)) {
            $paginator = ContentItem::published()
                ->where(function ($eloquentQuery) use ($query, $locale) {
                    $eloquentQuery
                        ->where("title->{$locale}", "LIKE", "%{$query}%")
                        ->orWhere("excerpt->{$locale}", "LIKE", "%{$query}%")
                        ->orWhere("content->{$locale}", "LIKE", "%{$query}%");
                })
                ->with(["category:id,name,slug", "media"])
                ->latest("publish_date")
                ->paginate(12)
                ->withQueryString();

            // Transform items for frontend display
            $paginator->through(
                fn($item) => [
                    "id" => $item->id,
                    "title" => $item->getTranslations("title"),
                    "excerpt" => $item->getTranslations("excerpt"),
                    "slug" => $item->slug,
                    "category_name" => $item->category?->getTranslations(
                        "name"
                    ),
                    "category_slug" => $item->category?->slug,
                    // 'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Deprecate
                    "image_details" => $this->getResponsiveImageData($item), // ADDED
                    "publish_date_formatted" => $item->publish_date?->isoFormat(
                        "LL"
                    ),
                ]
            );
            $itemsCollection = $paginator;
        } else {
            // Create an empty paginator if query is empty
            $itemsCollection = new \Illuminate\Pagination\LengthAwarePaginator(
                collect(),
                0,
                12,
                1,
                ["path" => $request->url(), "query" => $request->query()]
            );
        }

        return Inertia::render("Search/Index", [
            "query" => $query,
            "items" => $itemsCollection,
        ]);
    }
}
