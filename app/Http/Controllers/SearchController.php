<?php

namespace App\Http\Controllers;

use App\Models\ContentItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke(Request $request): Response
    {
        $query = $request->input('q', ''); // Get search query from 'q' parameter
        $locale = app()->getLocale(); // Get current application locale

        $items = collect(); // Initialize an empty collection for results

        if (!empty($query)) {
            $items = ContentItem::published() // Scope to published items
                ->where(function ($eloquentQuery) use ($query, $locale) {
                    // Search in title (current locale)
                    $eloquentQuery->where("title->{$locale}", 'LIKE', "%{$query}%")
                        // Search in excerpt (current locale)
                        ->orWhere("excerpt->{$locale}", 'LIKE', "%{$query}%")
                        // Search in content (current locale) - might be slow on large text fields without full-text search
                        ->orWhere("content->{$locale}", 'LIKE', "%{$query}%");

                    // Optional: Search in other locales if needed, but can complicate relevance
                    // foreach (config('translatable.locales') as $otherLocale) {
                    //     if ($otherLocale !== $locale) {
                    //         $eloquentQuery->orWhere("title->{$otherLocale}", 'LIKE', "%{$query}%");
                    //         $eloquentQuery->orWhere("excerpt->{$otherLocale}", 'LIKE', "%{$query}%");
                    //         $eloquentQuery->orWhere("content->{$otherLocale}", 'LIKE', "%{$query}%");
                    //     }
                    // }
                })
                ->with(['category:id,name,slug', 'media']) // Eager load category and media
                ->latest('publish_date') // Order by most recent
                ->paginate(12) // Paginate results (e.g., 12 per page)
                ->withQueryString(); // Append query string to pagination links

            // Transform items for frontend display
            $items->through(fn($item) => [
                'id' => $item->id,
                'title' => $item->getTranslations('title'),
                'excerpt' => $item->getTranslations('excerpt'), // Send full excerpt for display
                'slug' => $item->slug,
                'category_name' => $item->category?->getTranslations('name'),
                'category_slug' => $item->category?->slug,
                'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Use thumbnail
                'publish_date_formatted' => $item->publish_date?->isoFormat('LL'),
            ]);
        }


        return Inertia::render('Search/Index', [
            'query' => $query,
            'items' => $items, // Will be an empty Paginator instance if query is empty
        ]);
    }
}
