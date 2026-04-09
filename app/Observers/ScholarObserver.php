<?php

namespace App\Observers;

use App\Models\Scholar;
use Illuminate\Support\Facades\Cache;

class ScholarObserver
{
    public function saved(Scholar $scholar): void
    {
        Cache::forget('block_scholar_cards');
    }

    public function deleted(Scholar $scholar): void
    {
        Cache::forget('block_scholar_cards');
    }
}
