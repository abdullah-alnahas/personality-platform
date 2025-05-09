<?php

namespace App\Observers;

use App\Models\ContentCategory;
use Illuminate\Support\Facades\Cache;

class ContentCategoryObserver
{
    public function saved(ContentCategory $contentCategory): void
    {
        Cache::forget("homepage_sections_data"); // Re-cache homepage sections
        // Also clear navigation if categories are linked in nav, or category listing caches
        Cache::forget("published_navigation_items_structured");
    }

    public function deleted(ContentCategory $contentCategory): void
    {
        Cache::forget("homepage_sections_data");
        Cache::forget("published_navigation_items_structured");
    }
}
