<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\SocialAccount;
use App\Models\NavigationItem;
use App\Models\Language;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = "app";

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $currentLocaleCode = App::getLocale();

        $availableLocales = Cache::remember(
            "available_locales_shared",
            3600,
            function () {
                return Language::where("is_active", true)
                    ->orderBy("name")
                    ->get(["code", "name", "native_name", "is_rtl"]) // Ensure is_rtl is selected
                    ->toArray();
            }
        );

        // Ensure current_locale_is_rtl is derived correctly
        $currentSelectedLocale = collect($availableLocales)->firstWhere(
            "code",
            $currentLocaleCode
        );
        $currentLocaleIsRTL = $currentSelectedLocale["is_rtl"] ?? false;

        // Example: Fetching site_name from settings for dynamic app name
        // $siteNameSetting = Cache::remember('setting_site_name_shared', 3600, function () {
        //     return \App\Models\Setting::where('key', 'site_name')->first();
        // });
        // $dynamicSiteName = $siteNameSetting ? $siteNameSetting->getTranslation('value', $currentLocaleCode) : config('app.name', 'Laravel');

        return array_merge(parent::share($request), [
            "auth" => [
                "user" => $request->user()
                    ? [
                        "id" => $request->user()->id,
                        "name" => $request->user()->name,
                        "email" => $request->user()->email,
                        // 'roles' => $request->user()->getRoleNames(),
                        // 'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    ]
                    : null,
            ],
            "ziggy" => fn() => [
                ...(new Ziggy())->toArray(),
                "location" => $request->url(),
                "query" => $request->query(),
            ],
            "flash" => [
                "success" => fn() => $request->session()->get("success"),
                "error" => fn() => $request->session()->get("error"),
            ],
            // Renaming to match what app.jsx expects, or update app.jsx
            "current_locale" => $currentLocaleCode,
            "available_locales" => $availableLocales,
            // This is now derived in app.jsx from current_locale and available_locales
            // "current_locale_is_rtl" => $currentLocaleIsRTL, // Can be removed if app.jsx handles it

            // Other shared data...
            "socialAccounts" => Cache::remember(
                "active_social_accounts_shared",
                3600,
                function () {
                    return SocialAccount::where("status", "active")
                        ->orderBy("display_order")
                        ->get(["id", "platform", "url", "account_name"]);
                }
            ),
            "navigationItems" => Cache::remember(
                "published_navigation_items_structured_shared",
                3600,
                function () {
                    // ... (same logic as before)
                    $locations = NavigationItem::published()
                        ->distinct()
                        ->pluck("menu_location");
                    $structuredNav = [];
                    foreach ($locations as $location) {
                        $structuredNav[$location] = NavigationItem::published()
                            ->where("menu_location", $location)
                            ->whereNull("parent_id")
                            ->with([
                                "children" => fn($query) => $query
                                    ->published()
                                    ->orderBy("order"),
                            ])
                            ->orderBy("order")
                            ->get([
                                "id",
                                "menu_location",
                                "label",
                                "url",
                                "target",
                                "parent_id",
                            ])
                            ->toArray();
                    }
                    return $structuredNav;
                }
            ),
            "settings" => Cache::remember(
                "site_settings_all_shared",
                3600,
                function () {
                    // Share essential, non-sensitive settings if needed globally
                    // Be cautious about sharing too much data on every request
                    return \App\Models\Setting::whereIn("key", [
                        "site_name",
                        "site_description",
                        "footer_copyright_text",
                    ])
                        ->get()
                        ->keyBy("key")
                        ->map(function ($setting) {
                            return [
                                "value" => $setting->value,
                                "type" => $setting->type,
                            ]; // Only value and type
                        });
                }
            ),
        ]);
    }
}
