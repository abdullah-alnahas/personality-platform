<?php

namespace App\Http\Controllers;

use App\Models\ContentItem;
use App\Services\ResponsiveImageHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = $request->input("q", "");
        $rawLocale = app()->getLocale();

        // Whitelist locale against configured locales to prevent column-name injection.
        $allowedLocales = config('translatable.locales', ['ar', 'en', 'tr']);
        $locale = in_array($rawLocale, $allowedLocales, true) ? $rawLocale : 'ar';

        $itemsCollection = collect();

        if (!empty($query)) {
            // Escape LIKE wildcards to prevent denial-of-service via expensive scan patterns.
            $safeTerm = '%' . str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $query) . '%';

            $paginator = ContentItem::published()
                ->where(function ($eloquentQuery) use ($safeTerm, $locale) {
                    $eloquentQuery
                        ->where("title->{$locale}", "LIKE", $safeTerm)
                        ->orWhere("excerpt->{$locale}", "LIKE", $safeTerm)
                        ->orWhere("content->{$locale}", "LIKE", $safeTerm);
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
                    "image_details" => ResponsiveImageHelper::fromContentItem($item),
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
