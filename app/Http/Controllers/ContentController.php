<?php

namespace App\Http\Controllers;

use App\Models\ContentCategory;
use App\Models\ContentItem;
use App\Models\Setting;
use App\Services\BlockDataResolver;
use App\Services\ResponsiveImageHelper;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;

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
                ->where("slug", $slug)
                ->with(["category:id,name,slug", "author:id,name", "media"]) // Eager load media
                ->firstOrFail();

            $itemData = [
                "id" => $item->id,
                "title" => $item->getTranslations("title"),
                "excerpt" => $item->getTranslations("excerpt"),
                "content" => $item->getTranslations("content"), // Assumes content is sanitized on save
                "publish_date_formatted" => $item->publish_date?->isoFormat(
                    "LL"
                ),
                "author_name" => $item->author?->name,
                "category_name" => $item->category?->getTranslations("name"),
                "category_slug" => $item->category?->slug,
                "meta_fields" => $item->getTranslations("meta_fields"),
                "image_details" => ResponsiveImageHelper::fromContentItem(
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
                ->with('page.blocks')
                ->firstOrFail();

            // If the category has a linked page-builder page, render that instead
            if ($category->page && $category->page->status === 'published') {
                $resolver = app(BlockDataResolver::class);
                $blocks = $category->page->blocks()
                    ->where('status', 'published')
                    ->orderBy('display_order')
                    ->get()
                    ->map(fn($block) => $resolver->resolve([
                        'id'            => $block->id,
                        'block_type'    => $block->block_type,
                        'content'       => $block->content,
                        'config'        => $block->config,
                        'display_order' => $block->display_order,
                        'status'        => $block->status,
                    ]))
                    ->all();

                return Inertia::render('PageDisplay', [
                    'page'   => [
                        'id'    => $category->page->id,
                        'title' => $category->page->getTranslations('title'),
                        'slug'  => $category->page->slug,
                        'layout' => $category->page->layout,
                        'meta_fields' => $category->page->meta_fields,
                    ],
                    'blocks' => $blocks,
                    'settings' => Cache::remember('site_settings_all', 3600, fn() =>
                        Setting::all()->keyBy('key')->map(fn($s) => ['value' => $s->value, 'type' => $s->type])
                    ),
                ]);
            }

            $itemsPaginator = ContentItem::published()
                ->where("content_category_id", $category->id)
                ->with(["media", "category:id,name,slug"]) // Eager load media + category for each item
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
                    "image_details" => ResponsiveImageHelper::fromContentItem(
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
                    "slug" => $category->slug,
                    "name" => $category->getTranslations("name"),
                    "description" => $category->getTranslations("description"),
                ],
                "items" => $itemsPaginator,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404);
        }
    }
}
