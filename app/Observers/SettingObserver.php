<?php

namespace App\Observers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingObserver
{
    private function clearSettingCaches(Setting $setting): void
    {
        Cache::forget("site_settings_all"); // Used in HomepageController
        // Specific keys used in AboutPageController
        if (in_array($setting->key, ["about_page_content", "site_name"])) {
            Cache::forget("setting_" . $setting->key);
        }
        // Add any other specific setting cache keys here if they are introduced later
    }

    public function saved(Setting $setting): void
    {
        $this->clearSettingCaches($setting);
    }

    public function deleted(Setting $setting): void
    {
        // Deleting a setting might also require clearing caches
        $this->clearSettingCaches($setting);
    }
}
