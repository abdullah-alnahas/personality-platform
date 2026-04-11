<?php

namespace App\Observers;

use App\Models\HomepageSection;
use Illuminate\Support\Facades\Cache;

class HomepageSectionObserver
{
    public function saved(HomepageSection $homepageSection): void
    {
        $this->clearCaches();
    }

    public function deleted(HomepageSection $homepageSection): void
    {
        $this->clearCaches();
    }

    protected function clearCaches(): void
    {
        Cache::forget("homepage_sections_data");
        Cache::forget("homepage_sections_data_v2");
        Cache::forget("homepage_data");
    }
}
