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
                    ]
                    : null,
            ],
            "ziggy" => fn() => [
                ...(new Ziggy())->toArray(),
                "location" => $request->url(),
            ],
            "flash" => [
                "success" => fn() => $request->session()->get("success"),
                "error" => fn() => $request->session()->get("error"),
            ],
            "honeypotField" => config('security.honeypot.field', '_confirm_email'),
            "mediaUploadMax" => [
                "kb" => (int) config('media.image.max_kb', 10240),
                "label" => config('media.max_label', '10 MB'),
                "mimes" => config('media.image.allowed_mimes', ['jpeg', 'png', 'jpg', 'gif', 'webp']),
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
                    // Single query: fetch all published nav items with children eager-loaded
                    $allItems = NavigationItem::published()
                        ->whereNull("parent_id")
                        ->with([
                            "children" => fn($query) => $query
                                ->published()
                                ->orderBy("order"),
                        ])
                        ->orderBy("order")
                        ->get(["id", "menu_location", "label", "url", "target", "parent_id"]);

                    // Group in-memory by menu_location (avoids N+1 per location)
                    return $allItems->groupBy("menu_location")
                        ->map(fn($items) => $items->toArray())
                        ->toArray();
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
                        "footer_col1_title",
                        "footer_col2_title",
                        "footer_col3_title",
                        "footer_col4_title",
                        "newsletter_heading",
                        "newsletter_description",
                        "header_cta_text",
                        "header_cta_url",
                        "logo_url",
                        "logo_width",
                        "theme_primary_color",
                        "theme_primary_dark",
                        "theme_secondary_color",
                        "theme_background_color",
                        "theme_paper_color",
                        "theme_text_color",
                        "theme_text_secondary_color",
                        "theme_primary_color_dark",
                        "theme_primary_dark_dark",
                        "theme_secondary_color_dark",
                        "theme_background_color_dark",
                        "theme_paper_color_dark",
                        "theme_text_color_dark",
                        "theme_text_secondary_color_dark",
                        "theme_mode_default",
                        "theme_heading_font",
                        "theme_body_font",
                        "theme_border_radius",
                        "theme_decorations_enabled",
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
