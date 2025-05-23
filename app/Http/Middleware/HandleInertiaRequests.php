<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\SocialAccount;
use App\Models\NavigationItem;
use App\Models\Language; // <-- Import Language model
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\App; // <-- Import App facade

class HandleInertiaRequests extends Middleware
{
    protected $rootView = "app";

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $socialAccounts = Cache::remember(
            "active_social_accounts",
            3600,
            function () {
                return SocialAccount::where("status", "active")
                    ->orderBy("display_order")
                    ->get(["id", "platform", "url", "account_name"]);
            }
        );

        $structuredNavigationItems = Cache::remember(
            "published_navigation_items_structured",
            3600,
            function () {
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
        );

        // Fetch active languages for the language switcher
        $availableLocales = Cache::remember(
            "available_locales",
            3600,
            function () {
                return Language::where("is_active", true)
                    ->orderBy("name") // Or 'code' or a specific order column if you add one
                    ->get(["code", "name", "native_name", "is_rtl"])
                    ->toArray();
            }
        );

        // Prepare a simple list of language codes for config('translatable.locales') if needed dynamically
        // This is more for backend. For frontend switcher, $availableLocales is better.
        // Cache this separately if other backend services need just the codes.
        Cache::rememberForever("translatable_locales_config", function () {
            return Language::where("is_active", true)->pluck("code")->toArray();
        });

        return array_merge(parent::share($request), [
            "auth" => [
                "user" => $request->user()
                    ? [
                        "id" => $request->user()->id,
                        "name" => $request->user()->name,
                        "email" => $request->user()->email,
                        // Add roles/permissions if needed directly on user object for frontend checks
                        // 'roles' => $request->user()->getRoleNames(),
                        // 'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    ]
                    : null,
            ],
            "ziggy" => fn() => [
                ...(new Ziggy())->toArray(),
                "location" => $request->url(),
                "query" => $request->query(), // Share query parameters
            ],
            "flash" => [
                "success" => fn() => $request->session()->get("success"),
                "error" => fn() => $request->session()->get("error"),
            ],
            "socialAccounts" => $socialAccounts,
            "navigationItems" => $structuredNavigationItems,
            "available_locales" => $availableLocales, // <-- Share dynamic active languages
            "current_locale" => App::getLocale(), // <-- Share current application locale
            // 'current_rtl_status' => $availableLocales[App::getLocale()]['is_rtl'] ?? false, // Example if needed
        ]);
    }
}
