<?php
// Create/Edit file: app/Http/Controllers/ContentController.php

namespace App\Http\Controllers;

use App\Models\ContentCategory;
use App\Models\ContentItem;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ContentController extends Controller
{
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
                ->where('slug', $slug)
                ->with(['category:id,name,slug', 'author:id,name', 'media']) // Eager load relations
                ->firstOrFail(); // Throws ModelNotFoundException if not found

            // Prepare data for the view
            $itemData = [
                 'id' => $item->id,
                 'title' => $item->getTranslations('title'),
                 'content' => $item->getTranslations('content'),
                 'publish_date_formatted' => $item->publish_date?->isoFormat('LL'),
                 'author_name' => $item->author?->name,
                 'category_name' => $item->category?->getTranslations('name'),
                 'category_slug' => $item->category?->slug,
                 'meta_fields' => $item->getTranslations('meta_fields'),
                 'featured_image_url' => $item->getFirstMediaUrl('featured_image'),
                 // TODO: Add breadcrumbs or other relevant data
            ];

            return Inertia::render('Content/ShowItem', [ // Reference the frontend view
                'item' => $itemData,
                // TODO: Pass SEO data (from meta_fields or generated)
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
                ->where('slug', $slug)
                ->firstOrFail(); // Find the category by slug

             $items = ContentItem::published()
                ->where('content_category_id', $category->id)
                ->with(['media']) // Eager load media
                ->latest('publish_date')
                ->paginate(12) // Paginate items
                ->withQueryString()
                ->through(fn ($item) => [ // Map to include necessary data
                     'id' => $item->id,
                     'title' => $item->getTranslations('title'),
                     'excerpt' => $item->getTranslations('excerpt'),
                     'slug' => $item->slug,
                     'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Use thumbnail
                ]);

             return Inertia::render('Content/ShowCategory', [ // Reference the frontend view
                'category' => [ // Pass category details
                    'name' => $category->getTranslations('name'),
                    'description' => $category->getTranslations('description'),
                     // TODO: Pass meta/SEO fields
                ],
                'items' => $items, // Pass paginated items
             ]);

         } catch (ModelNotFoundException $e) {
             abort(404);
         }
    }
}