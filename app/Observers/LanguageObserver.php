<?php

namespace App\Observers;

use App\Models\Language;
use Illuminate\Support\Facades\Cache;

class LanguageObserver
{
    public function saved(Language $language): void
    {
        $this->clearCaches();
    }

    public function deleted(Language $language): void
    {
        $this->clearCaches();
    }

    protected function clearCaches(): void
    {
        Cache::forget('available_locales_shared');
        Cache::forget('active_language_codes_for_middleware');
    }
}
