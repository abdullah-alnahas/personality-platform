<?php

namespace App\Observers;

use App\Models\Page;
use Illuminate\Support\Facades\Cache;

class PageObserver
{
    public function saved(Page $page): void
    {
        $this->clearPageCaches($page);
    }

    public function deleted(Page $page): void
    {
        $this->clearPageCaches($page);
    }

    protected function clearPageCaches(Page $page): void
    {
        Cache::forget("page_data_{$page->slug}");

        if ($page->wasChanged('is_homepage') || $page->is_homepage || $page->wasRecentlyCreated) {
            Cache::forget('homepage_data');
            Cache::forget('homepage_sections_data_v2');
        }

        if ($page->slug === 'about') {
            Cache::forget('about_page_builder');
            Cache::forget("about_page_blocks_{$page->id}");
        }
    }
}
