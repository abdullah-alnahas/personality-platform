<?php

namespace App\Services;

use App\Models\Book;
use App\Models\ContentCategory;
use App\Models\ContentItem;
use App\Models\Quote;
use App\Models\Scholar;
use App\Models\SocialAccount;
use Illuminate\Support\Facades\Cache;

class BlockDataResolver
{
    public function resolve(array $block): array
    {
        $type = $block['block_type'];
        $content = $block['content'] ?? [];

        return match ($type) {
            'category_grid'    => $this->resolveCategoryGrid($block, $content),
            'latest_news'      => $this->resolveLatestNews($block, $content),
            'featured_quote'   => $this->resolveFeaturedQuote($block, $content),
            'social_media_feed' => $this->resolveSocialMediaFeed($block, $content),
            'books_grid'       => $this->resolveBooksGrid($block, $content),
            'scholar_cards'    => $this->resolveScholarCards($block, $content),
            default => $block,
        };
    }

    protected function resolveCategoryGrid(array $block, array $content): array
    {
        $categoryId = $content['category_id'] ?? null;
        $maxItems = min((int) ($content['max_items'] ?? 6), 50);

        if (!$categoryId) {
            $block['resolved_data'] = ['category' => null, 'items' => []];
            return $block;
        }

        $cacheKey = "block_category_grid_{$categoryId}_{$maxItems}";
        $block['resolved_data'] = Cache::remember($cacheKey, 3600, function () use ($categoryId, $maxItems) {
            $category = ContentCategory::where('id', $categoryId)
                ->where('status', 'published')
                ->first();

            if (!$category) {
                return ['category' => null, 'items' => []];
            }

            $items = ContentItem::published()
                ->where('content_category_id', $categoryId)
                ->with(['media', 'category:id,name,slug'])
                ->latest('publish_date')
                ->take($maxItems)
                ->get()
                ->map(fn(ContentItem $item) => $this->transformContentItem($item))
                ->all();

            return [
                'category' => [
                    'id' => $category->id,
                    'name' => $category->getTranslations('name'),
                    'slug' => $category->slug,
                    'description' => $category->getTranslations('description'),
                    'icon' => $category->icon,
                    'image' => $category->image,
                ],
                'items' => $items,
            ];
        });

        return $block;
    }

    protected function resolveLatestNews(array $block, array $content): array
    {
        $categoryId = $content['category_id'] ?? null;
        $maxItems = min((int) ($content['max_items'] ?? 6), 50);

        $cacheKey = "block_latest_news_{$categoryId}_{$maxItems}";
        $block['resolved_data'] = Cache::remember($cacheKey, 3600, function () use ($categoryId, $maxItems) {
            $query = ContentItem::published()
                ->with(['media', 'category:id,name,slug']);

            if ($categoryId) {
                $query->where('content_category_id', $categoryId);
            }

            return $query->latest('publish_date')
                ->take($maxItems)
                ->get()
                ->map(fn(ContentItem $item) => $this->transformContentItem($item))
                ->all();
        });

        return $block;
    }

    protected function resolveFeaturedQuote(array $block, array $content): array
    {
        $quoteId = $content['quote_id'] ?? null;

        if ($quoteId) {
            $cacheKey = "block_featured_quote_{$quoteId}";
            $block['resolved_data'] = Cache::remember($cacheKey, 3600, function () use ($quoteId) {
                $quote = Quote::where('id', $quoteId)->where('status', 'published')->first();
                if ($quote) {
                    return [
                        'text' => $quote->getTranslations('text'),
                        'source' => $quote->getTranslations('source'),
                    ];
                }
                return null;
            });
        } else {
            // Random quote: short TTL so it rotates
            $block['resolved_data'] = Cache::remember('block_featured_quote_random', 300, function () {
                $quote = Quote::published()->inRandomOrder()->first();
                if ($quote) {
                    return [
                        'text' => $quote->getTranslations('text'),
                        'source' => $quote->getTranslations('source'),
                    ];
                }
                return null;
            });
        }

        return $block;
    }

    protected function resolveSocialMediaFeed(array $block, array $content): array
    {
        $maxItems = min((int) ($content['max_items'] ?? 6), 50);

        $block['resolved_data'] = Cache::remember("block_social_media_feed_{$maxItems}", 3600, function () use ($maxItems) {
            return SocialAccount::active()
                ->orderBy('display_order')
                ->take($maxItems)
                ->get(['id', 'platform', 'url', 'account_name'])
                ->toArray();
        });

        return $block;
    }

    protected function resolveBooksGrid(array $block, array $content): array
    {
        $maxItems = min((int) ($content['max_items'] ?? 8), 50);
        $cacheKey = "block_books_grid_{$maxItems}";

        $block['resolved_data'] = Cache::remember($cacheKey, 3600, function () use ($maxItems) {
            return Book::published()
                ->orderBy('display_order')
                ->orderBy('id')
                ->take($maxItems)
                ->get()
                ->map(fn(Book $book) => [
                    'id'              => $book->id,
                    'title'           => $book->getTranslations('title'),
                    'subtitle'        => $book->getTranslations('subtitle'),
                    'description'     => $book->getTranslations('description'),
                    'cover_image_url' => $book->cover_image_url,
                    'buy_link'        => $book->buy_link,
                    'category'        => $book->category,
                    'is_featured'     => $book->is_featured,
                ])
                ->all();
        });

        return $block;
    }

    protected function resolveScholarCards(array $block, array $content): array
    {
        $block['resolved_data'] = Cache::remember('block_scholar_cards', 3600, function () {
            $scholars = Scholar::published()
                ->orderBy('group_key')
                ->orderBy('display_order')
                ->get()
                ->map(fn(Scholar $s) => [
                    'id'         => $s->id,
                    'name'       => $s->getTranslations('name'),
                    'group_name' => $s->getTranslations('group_name'),
                    'group_key'  => $s->group_key,
                    'bio'        => $s->getTranslations('bio'),
                    'photo_url'  => $s->photo_url,
                ])
                ->all();

            // Group by group_key, preserving translatable group_name
            $groups = [];
            foreach ($scholars as $scholar) {
                $key = $scholar['group_key'];
                if (!isset($groups[$key])) {
                    $groups[$key] = [
                        'group_key'  => $key,
                        'group_name' => $scholar['group_name'],
                        'scholars'   => [],
                    ];
                }
                $groups[$key]['scholars'][] = $scholar;
            }

            return array_values($groups);
        });

        return $block;
    }

    protected function transformContentItem(ContentItem $item): array
    {
        return [
            'id' => $item->id,
            'title' => $item->getTranslations('title'),
            'excerpt' => $item->getTranslations('excerpt'),
            'slug' => $item->slug,
            'category_slug' => $item->category?->slug,
            'category_name' => $item->category?->getTranslations('name'),
            'publish_date_formatted' => $item->publish_date?->isoFormat('LL'),
            'publish_date' => $item->publish_date?->toDateString(),
            'image_details' => ResponsiveImageHelper::fromContentItem($item),
        ];
    }

}
