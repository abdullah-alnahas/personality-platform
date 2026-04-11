<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\SocialAccount;
use App\Models\NavigationItem;
use App\Models\Language;
use App\Services\SWRCache;
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

        $availableLocales = SWRCache::remember(
            "available_locales_shared",
            300,
            function () {
                return Language::where("is_active", true)
                    ->orderBy("name")
                    ->get(["code", "name", "native_name", "is_rtl"])
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
                        "id"   => $request->user()->id,
                        "name" => $request->user()->name,
                        "email" => $request->user()->email,
                        "email_verified_at" => $request->user()->email_verified_at,
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
            "socialAccounts" => SWRCache::remember(
                "active_social_accounts_shared",
                300,
                function () {
                    return SocialAccount::active()
                        ->orderBy("display_order")
                        ->get(["id", "platform", "url", "account_name"]);
                }
            ),
            "navigationItems" => SWRCache::remember(
                "published_navigation_items_structured_shared",
                300,
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
            "settings" => SWRCache::remember(
                "site_settings_all_shared",
                300,
                function () {
                    // Share essential, non-sensitive settings if needed globally
                    // Be cautious about sharing too much data on every request
                    return \App\Models\Setting::whereIn("key", [
                        "site_name",
                        "site_description",
                        "footer_copyright_text",
                        "logo_url",
                        "logo_width",
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
