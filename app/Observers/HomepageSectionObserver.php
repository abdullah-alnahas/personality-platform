<?php

namespace App\Observers;

use App\Models\HomepageSection;
use Illuminate\Support\Facades\Cache;

class HomepageSectionObserver
{
    public function saved(HomepageSection $homepageSection): void
    {
        Cache::forget("homepage_sections_data");
    }

    public function deleted(HomepageSection $homepageSection): void
    {
        Cache::forget("homepage_sections_data");
    }
}
