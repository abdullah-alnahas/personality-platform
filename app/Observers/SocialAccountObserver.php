<?php

namespace App\Observers;

use App\Models\SocialAccount;
use Illuminate\Support\Facades\Cache;

class SocialAccountObserver
{
    public function saved(SocialAccount $socialAccount): void
    {
        Cache::forget("active_social_accounts");
    }

    public function deleted(SocialAccount $socialAccount): void
    {
        Cache::forget("active_social_accounts");
    }
}
