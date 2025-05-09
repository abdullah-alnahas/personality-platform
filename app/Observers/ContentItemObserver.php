<?php

namespace App\Observers;

use App\Models\ContentItem;
use Illuminate\Support\Facades\Cache;

class ContentItemObserver
{
    public function saved(ContentItem $contentItem): void
    {
        Cache::forget("homepage_sections_data"); // Re-cache homepage sections
        // If you have category-specific caches, clear those too based on $contentItem->content_category_id
    }

    public function deleted(ContentItem $contentItem): void
    {
        Cache::forget("homepage_sections_data");
    }
}
