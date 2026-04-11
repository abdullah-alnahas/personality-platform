<?php

namespace App\Observers;

use App\Models\ContentCategory;
use App\Services\SWRCache;
use Illuminate\Support\Facades\Cache;

class ContentCategoryObserver
{
    public function saved(ContentCategory $contentCategory): void
    {
        $this->clearCaches($contentCategory);
    }

    public function deleted(ContentCategory $contentCategory): void
    {
        $this->clearCaches($contentCategory);
    }

    protected function clearCaches(ContentCategory $contentCategory): void
    {
        SWRCache::forget("published_navigation_items_structured_shared");

        // Clear block caches that show this category's content
        $categoryId = $contentCategory->id;
        foreach ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 24, 25, 30, 50] as $maxItems) {
            Cache::forget("block_category_grid_{$categoryId}_{$maxItems}");
            Cache::forget("block_latest_news_{$categoryId}_{$maxItems}");
        }
    }
}
