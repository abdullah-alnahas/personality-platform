<?php

namespace App\Console\Commands;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PublishScheduledContent extends Command
{
    protected $signature = 'content:publish-scheduled';

    protected $description = 'Publish pages and page blocks that have reached their scheduled publish time';

    public function handle(): int
    {
        $now = now();

        $pages = Page::where('status', 'draft')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', $now)
            ->get();

        $pageCount = $pages->count();

        foreach ($pages as $page) {
            $page->update([
                'status' => 'published',
                'scheduled_at' => null,
            ]);

            Cache::forget("page_data_{$page->slug}");
        }

        $blocks = PageBlock::where('status', 'draft')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', $now)
            ->get();

        $blockCount = $blocks->count();

        foreach ($blocks as $block) {
            $block->update([
                'status' => 'published',
                'scheduled_at' => null,
            ]);

            if ($block->page) {
                Cache::forget("page_data_{$block->page->slug}");
            }
        }

        Cache::forget('homepage_data');
        Cache::forget('homepage_sections_data_v2');
        Cache::forget('about_page_builder');
        Cache::forget('site_settings_all_shared');
        Cache::forget('published_navigation_items_structured_shared');
        Cache::forget('active_social_accounts_shared');

        $totalCount = $pageCount + $blockCount;

        if ($totalCount > 0) {
            $message = "Published {$pageCount} page(s) and {$blockCount} block(s) via scheduled publishing.";
            Log::info($message);
            $this->info($message);
        } else {
            $this->info('No scheduled content to publish.');
        }

        return Command::SUCCESS;
    }
}
