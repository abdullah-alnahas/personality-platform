<?php
// Edit file: app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\SocialAccount;
use App\Models\NavigationItem;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Fetch active social accounts (cached)
        $socialAccounts = Cache::remember('active_social_accounts', 3600, function () {
            return SocialAccount::where('status', 'active')
                ->orderBy('display_order')
                ->get(['id', 'platform', 'url', 'account_name']);
        });

        // --- Fetch and structure navigation items hierarchically ---
        // Use a different cache key for the structured data
        $structuredNavigationItems = Cache::remember('published_navigation_items_structured', 3600, function () {
            // Get distinct menu locations that have published items
            $locations = NavigationItem::published()->distinct()->pluck('menu_location');
            $structuredNav = [];

            foreach ($locations as $location) {
                // Fetch root items for the location, eager loading their published children recursively (if needed, or just one level)
                $structuredNav[$location] = NavigationItem::published()
                    ->where('menu_location', $location)
                    ->whereNull('parent_id') // Get only top-level items
                    ->with([
                        'children' => function ($query) { // Eager load published children
                            $query->published()->orderBy('order');
                            // If deeper nesting is needed, add ->with('children...') here too
                        }
                    ])
                    ->orderBy('order')
                    ->get(['id', 'menu_location', 'label', 'url', 'target', 'parent_id']) // Select necessary fields
                    ->toArray(); // Convert to array for frontend JSON serialization
            }
            return $structuredNav;
        });
        // --- End Navigation Items Fetching ---


        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'socialAccounts' => $socialAccounts,
            // --- Share Structured Navigation Items ---
            'navigationItems' => $structuredNavigationItems, // Use the new structured data
            // 'locale' => app()->getLocale(), // Share locale if needed by getTranslatedField
        ]);
    }
}
