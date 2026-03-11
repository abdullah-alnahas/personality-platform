<?php

namespace App\Services;

use App\Models\ContentItem;
use App\Models\Page;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SearchRepository
{
    /**
     * Search ContentItem (title, excerpt, body/content) and Page (title)
     * using LIKE queries on JSON-stored translatable columns.
     *
     * Paginates at SQL level per model, then merges results.
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        $term = '%' . $query . '%';
        $currentPage = (int) request()->get('page', 1);

        // Count totals at SQL level (no loading into memory)
        $contentTotal = ContentItem::published()
            ->where(function ($q) use ($term): void {
                $q->where('title', 'LIKE', $term)
                  ->orWhere('excerpt', 'LIKE', $term)
                  ->orWhere('content', 'LIKE', $term);
            })
            ->count();

        $pageTotal = Page::published()
            ->where('title', 'LIKE', $term)
            ->count();

        $total = $contentTotal + $pageTotal;

        // Fetch only the current page of results
        $contentItems = ContentItem::published()
            ->where(function ($q) use ($term): void {
                $q->where('title', 'LIKE', $term)
                  ->orWhere('excerpt', 'LIKE', $term)
                  ->orWhere('content', 'LIKE', $term);
            })
            ->latest('updated_at')
            ->take($perPage)
            ->offset(($currentPage - 1) * $perPage)
            ->get()
            ->map(fn (ContentItem $item): array => [
                'type' => 'content_item',
                'item' => $item,
            ]);

        // Fill remaining slots with pages if content items didn't fill the page
        $remaining = $perPage - $contentItems->count();
        $pageOffset = max(0, ($currentPage - 1) * $perPage - $contentTotal);

        $pages = $remaining > 0
            ? Page::published()
                ->where('title', 'LIKE', $term)
                ->latest('updated_at')
                ->take($remaining)
                ->offset($pageOffset)
                ->get()
                ->map(fn (Page $page): array => [
                    'type' => 'page',
                    'item' => $page,
                ])
            : collect();

        /** @var Collection $merged */
        $merged = $contentItems->merge($pages);

        return new LengthAwarePaginator(
            $merged,
            $total,
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );
    }
}
