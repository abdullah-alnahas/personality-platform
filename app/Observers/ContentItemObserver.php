<?php

namespace App\Observers;

use App\Models\ContentItem;
use Illuminate\Support\Facades\Cache;

class ContentItemObserver
{
    public function saved(ContentItem $contentItem): void
    {
        $this->clearCaches($contentItem);
    }

    public function deleted(ContentItem $contentItem): void
    {
        $this->clearCaches($contentItem);
    }

    protected function clearCaches(ContentItem $contentItem): void
    {

        $categoryId = $contentItem->content_category_id;
        if ($categoryId) {
            foreach ($this->getMaxItemsVariants() as $maxItems) {
                Cache::forget("block_category_grid_{$categoryId}_{$maxItems}");
                Cache::forget("block_latest_news_{$categoryId}_{$maxItems}");
            }
        }

        // Also clear latest_news without category filter (null categoryId)
        foreach ($this->getMaxItemsVariants() as $maxItems) {
            Cache::forget("block_latest_news__{$maxItems}");
        }
    }

    private function getMaxItemsVariants(): array
    {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 24, 25, 30, 50];
    }
}
