<?php namespace App\Observers;

use App\Models\NavigationItem;
use Illuminate\Support\Facades\Cache;

class NavigationItemObserver
{
    public function saved(NavigationItem $navigationItem): void
    {
        Cache::forget("published_navigation_items_structured");
    }

    public function deleted(NavigationItem $navigationItem): void
    {
        Cache::forget("published_navigation_items_structured");
    }
}
