<?php

namespace App\Observers;

use App\Models\Quote;
use Illuminate\Support\Facades\Cache;

class QuoteObserver
{
    public function saved(Quote $quote): void
    {
        $this->clearCaches($quote);
    }

    public function deleted(Quote $quote): void
    {
        $this->clearCaches($quote);
    }

    protected function clearCaches(Quote $quote): void
    {
        Cache::forget("homepage_sections_data");
        Cache::forget("homepage_sections_data_v2");

        // Clear block-specific featured_quote caches
        Cache::forget("block_featured_quote_{$quote->id}");
        // Also clear the random quote cache
        Cache::forget("block_featured_quote_random");
    }
}
