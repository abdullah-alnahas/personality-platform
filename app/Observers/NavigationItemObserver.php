<?php namespace App\Observers;

use App\Http\Middleware\CacheFullPage;
use App\Models\NavigationItem;
use App\Services\SWRCache;

class NavigationItemObserver
{
    public function saved(NavigationItem $navigationItem): void
    {
        CacheFullPage::flush();
        SWRCache::forget("published_navigation_items_structured_shared");
    }

    public function deleted(NavigationItem $navigationItem): void
    {
        CacheFullPage::flush();
        SWRCache::forget("published_navigation_items_structured_shared");
    }
}
