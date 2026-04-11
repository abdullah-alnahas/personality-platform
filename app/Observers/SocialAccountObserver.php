<?php

namespace App\Observers;

use App\Models\SocialAccount;
use App\Services\SWRCache;
use Illuminate\Support\Facades\Cache;

class SocialAccountObserver
{
    public function saved(SocialAccount $socialAccount): void
    {
        $this->clearCaches();
    }

    public function deleted(SocialAccount $socialAccount): void
    {
        $this->clearCaches();
    }

    protected function clearCaches(): void
    {
        Cache::forget("active_social_accounts");
        SWRCache::forget("active_social_accounts_shared");

        foreach ($this->getMaxItemsVariants() as $maxItems) {
            Cache::forget("block_social_media_feed_{$maxItems}");
        }
    }

    private function getMaxItemsVariants(): array
    {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 24, 25, 30, 50];
    }
}
