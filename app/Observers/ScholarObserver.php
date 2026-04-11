<?php

namespace App\Observers;

use App\Http\Middleware\CacheFullPage;
use App\Models\Scholar;
use Illuminate\Support\Facades\Cache;

class ScholarObserver
{
    public function saved(Scholar $scholar): void
    {
        $this->clearCaches();
    }

    public function deleted(Scholar $scholar): void
    {
        $this->clearCaches();
    }

    protected function clearCaches(): void
    {
        CacheFullPage::flush();
        Cache::forget('homepage_data');
        Cache::forget('block_scholar_cards');
    }
}
