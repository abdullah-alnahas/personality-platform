<?php

namespace App\Observers;

use App\Models\PageBlock;
use Illuminate\Support\Facades\Cache;

class PageBlockObserver
{
    public function saved(PageBlock $block): void
    {
        $this->clearBlockCaches($block);
    }

    public function deleted(PageBlock $block): void
    {
        $this->clearBlockCaches($block);
    }

    protected function clearBlockCaches(PageBlock $block): void
    {
        $page = $block->page;
        if ($page) {
            Cache::forget("page_data_{$page->slug}");

            if ($page->is_homepage) {
                Cache::forget('homepage_data');
                Cache::forget('homepage_sections_data_v2');
            }
        }

        // Clear block-type-specific caches
        $content = $block->content ?? [];
        switch ($block->block_type) {
            case 'category_grid':
                $catId = $content['category_id'] ?? null;
                $max = $content['max_items'] ?? 6;
                if ($catId) {
                    Cache::forget("block_category_grid_{$catId}_{$max}");
                }
                break;
            case 'latest_news':
                $catId = $content['category_id'] ?? null;
                $max = $content['max_items'] ?? 6;
                Cache::forget("block_latest_news_{$catId}_{$max}");
                break;
            case 'social_media_feed':
                $max = $content['max_items'] ?? 6;
                Cache::forget("block_social_media_feed_{$max}");
                break;
        }
    }
}
